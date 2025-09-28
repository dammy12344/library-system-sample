import React from 'react';
import { useBooks } from '../hooks/useBooks';
import { useBorrows } from '../hooks/useBorrows';
import { useAuth } from '../hooks/useAuth';
import { Book, Users, BookOpen, AlertTriangle } from 'lucide-react';

export function Dashboard() {
  const { books } = useBooks();
  const { borrows } = useBorrows();
  const { profile } = useAuth();

  const totalBooks = books.length;
  const availableBooks = books.reduce((sum, book) => sum + book.available_copies, 0);
  const borrowedBooks = books.reduce((sum, book) => sum + (book.total_copies - book.available_copies), 0);
  
  const activeBorrows = borrows.filter(borrow => borrow.status === 'active');
  const overdueBorrows = borrows.filter(borrow => borrow.status === 'overdue');
  const userBorrows = borrows.filter(borrow => borrow.user_id === profile?.id);

  const stats = [
    {
      name: 'Total Books',
      value: totalBooks,
      icon: Book,
      color: 'bg-blue-500',
    },
    {
      name: 'Available Books',
      value: availableBooks,
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      name: 'Borrowed Books',
      value: borrowedBooks,
      icon: Users,
      color: 'bg-yellow-500',
    },
    {
      name: 'Overdue Books',
      value: overdueBorrows.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {profile?.full_name}! Here's an overview of your library system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${stat.color} rounded-md flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Borrows
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Latest borrowing activity in the system
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {borrows.slice(0, 5).map((borrow) => (
                <li key={borrow.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {borrow.book?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        by {borrow.profile?.full_name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          borrow.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : borrow.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {borrow.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
              {borrows.length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No borrows yet
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* My Borrows (for regular users) */}
        {profile?.role === 'user' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                My Borrows
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Books you currently have borrowed
              </p>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {userBorrows.filter(b => b.status === 'active' || b.status === 'overdue').map((borrow) => (
                  <li key={borrow.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {borrow.book?.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(borrow.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          borrow.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {borrow.status}
                      </span>
                    </div>
                  </li>
                ))}
                {userBorrows.filter(b => b.status === 'active' || b.status === 'overdue').length === 0 && (
                  <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                    You have no active borrows
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Top Books (for admins) */}
        {profile?.role === 'admin' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Popular Books
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Most frequently borrowed books
              </p>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {books.slice(0, 5).map((book) => {
                  const borrowCount = borrows.filter(b => b.book_id === book.id).length;
                  return (
                    <li key={book.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {book.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            by {book.author}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {borrowCount} borrows
                        </div>
                      </div>
                    </li>
                  );
                })}
                {books.length === 0 && (
                  <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                    No books available
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}