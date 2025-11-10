import React from 'react';
import { useBooks } from '../hooks/useBooks';
import { useBorrows } from '../hooks/useBorrows';
import { useAuth } from '../hooks/useAuth';
import { 
  Book, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format, isToday, isThisWeek } from 'date-fns';

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
  const todayBorrows = borrows.filter(borrow => isToday(new Date(borrow.borrow_date)));
  const weekBorrows = borrows.filter(borrow => isThisWeek(new Date(borrow.borrow_date)));

  const stats = [
    {
      name: 'Total Books',
      value: totalBooks,
      icon: Book,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Available Books',
      value: availableBooks,
      icon: BookOpen,
      color: 'bg-emerald-500',
      change: `${Math.round((availableBooks / (totalBooks || 1)) * 100)}%`,
      changeType: 'neutral'
    },
    {
      name: 'Active Borrows',
      value: activeBorrows.length,
      icon: Users,
      color: 'bg-amber-500',
      change: profile?.role === 'admin' ? `${weekBorrows.length} this week` : `${userBorrows.filter(b => b.status === 'active').length} yours`,
      changeType: 'neutral'
    },
    {
      name: 'Overdue Books',
      value: overdueBorrows.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: overdueBorrows.length > 0 ? 'Needs attention' : 'All good',
      changeType: overdueBorrows.length > 0 ? 'negative' : 'positive'
    },
  ];

  const recentActivity = borrows
    .slice(0, 5)
    .map(borrow => ({
      id: borrow.id,
      type: borrow.return_date ? 'returned' : 'borrowed',
      book: borrow.book?.title || 'Unknown Book',
      user: borrow.profile?.full_name || 'Unknown User',
      date: borrow.return_date || borrow.borrow_date,
      status: borrow.status
    }));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {profile?.role === 'admin' 
                ? 'Here\'s what\'s happening in your library today'
                : 'Ready to discover your next great read?'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Book className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{todayBorrows.length}</div>
            <div className="text-blue-100 text-sm">Borrows Today</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{weekBorrows.length}</div>
            <div className="text-blue-100 text-sm">This Week</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{Math.round((availableBooks / (totalBooks || 1)) * 100)}%</div>
            <div className="text-blue-100 text-sm">Available</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{profile?.role === 'admin' ? borrows.length : userBorrows.length}</div>
            <div className="text-blue-100 text-sm">Total Borrows</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.name}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`inline-flex items-center text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-emerald-600' :
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.changeType === 'positive' && <TrendingUp className="w-4 h-4 mr-1" />}
                        {stat.changeType === 'negative' && <AlertTriangle className="w-4 h-4 mr-1" />}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                Recent Activity
              </h3>
              <span className="text-sm text-gray-500">Last 5 activities</span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.length > 0 ? recentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'returned' ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'returned' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.book}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.type === 'returned' ? 'Returned' : 'Borrowed'} by {activity.user}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {format(new Date(activity.date), 'MMM dd')}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="px-6 py-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Activity will appear here once books are borrowed or returned.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* My Borrows (for users) or Popular Books (for admins) */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              {profile?.role === 'user' ? (
                <>
                  <User className="w-5 h-5 mr-2 text-gray-400" />
                  My Active Borrows
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
                  Popular Books
                </>
              )}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {profile?.role === 'user' ? (
              userBorrows.filter(b => b.status === 'active' || b.status === 'overdue').length > 0 ? (
                userBorrows.filter(b => b.status === 'active' || b.status === 'overdue').slice(0, 5).map((borrow) => (
                  <div key={borrow.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {borrow.book?.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {format(new Date(borrow.due_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        borrow.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {borrow.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No active borrows</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Visit the Books page to borrow your first book!
                  </p>
                </div>
              )
            ) : (
              books.length > 0 ? (
                books.slice(0, 5).map((book) => {
                  const borrowCount = borrows.filter(b => b.book_id === book.id).length;
                  return (
                    <div key={book.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {book.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            by {book.author}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {borrowCount} borrows
                          </div>
                          <div className="text-xs text-gray-500">
                            {book.available_copies}/{book.total_copies} available
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center">
                  <Book className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No books available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add some books to get started!
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}