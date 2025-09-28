import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';
import { useBorrows } from '../hooks/useBorrows';
import { Book, Plus, CreditCard as Edit2, Trash2, BookOpen } from 'lucide-react';
import { BookForm } from './BookForm';

export function BooksPage() {
  const { books, loading, deleteBook } = useBooks();
  const { profile } = useAuth();
  const { addBorrow } = useBorrows();
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id);
    }
  };

  const handleBorrow = async (bookId: string) => {
    if (profile) {
      await addBorrow(bookId, profile.id);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBook(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your library's book collection
          </p>
        </div>
        {profile?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </button>
        )}
      </div>

      {showForm && (
        <BookForm
          book={editingBook}
          onClose={closeForm}
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div key={book.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Book className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {book.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">by {book.author}</p>
                  <p className="mt-1 text-xs text-gray-400">ISBN: {book.isbn}</p>
                </div>
                {profile?.role === 'admin' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {book.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.available_copies > 0 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.available_copies} / {book.total_copies} available
                  </span>
                </div>
                
                {book.available_copies > 0 && profile?.role === 'user' && (
                  <button
                    onClick={() => handleBorrow(book.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Borrow
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <Book className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No books</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new book to the library.
          </p>
        </div>
      )}
    </div>
  );
}