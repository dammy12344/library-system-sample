import React, { useState } from 'react';
import { useBorrows } from '../hooks/useBorrows';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Plus, Calendar, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { BorrowForm } from './BorrowForm';
import { format } from 'date-fns';

export function BorrowsPage() {
  const { borrows, loading, returnBook } = useBorrows();
  const { books } = useBooks();
  const { profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue' | 'returned'>('all');

  const filteredBorrows = borrows.filter(borrow => {
    if (filter === 'all') return true;
    return borrow.status === filter;
  });

  const userBorrows = profile?.role === 'user' 
    ? filteredBorrows.filter(borrow => borrow.user_id === profile.id)
    : filteredBorrows;

  const handleReturn = async (borrowId: string, bookId: string) => {
    if (window.confirm('Mark this book as returned?')) {
      await returnBook(borrowId, bookId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.role === 'admin' ? 'All Borrows' : 'My Borrows'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {profile?.role === 'admin' 
              ? 'Manage all borrowing activities'
              : 'View your borrowing history and active loans'
            }
          </p>
        </div>
        {profile?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Borrow
          </button>
        )}
      </div>

      {showForm && (
        <BorrowForm onClose={() => setShowForm(false)} />
      )}

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All', count: borrows.length },
            { key: 'active', label: 'Active', count: borrows.filter(b => b.status === 'active').length },
            { key: 'overdue', label: 'Overdue', count: borrows.filter(b => b.status === 'overdue').length },
            { key: 'returned', label: 'Returned', count: borrows.filter(b => b.status === 'returned').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-900">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Borrows List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {userBorrows.map((borrow) => (
            <li key={borrow.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {borrow.book?.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {borrow.book?.author}
                    </p>
                    {profile?.role === 'admin' && (
                      <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {borrow.profile?.full_name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">
                        Borrowed: {format(new Date(borrow.borrow_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-sm ${
                        borrow.status === 'overdue' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        Due: {format(new Date(borrow.due_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    {borrow.return_date && (
                      <div className="mt-1 text-gray-500">
                        Returned: {format(new Date(borrow.return_date), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        borrow.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : borrow.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {borrow.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {borrow.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {borrow.status.charAt(0).toUpperCase() + borrow.status.slice(1)}
                    </span>

                    {(borrow.status === 'active' || borrow.status === 'overdue') && (
                      <button
                        onClick={() => handleReturn(borrow.id, borrow.book_id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Return
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {userBorrows.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No borrows found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'No borrowing activity yet.' : `No ${filter} borrows.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}