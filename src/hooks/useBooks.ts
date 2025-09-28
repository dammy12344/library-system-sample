import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Book } from '../types';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: Omit<Book, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([book])
        .select()
        .single();

      if (error) throw error;
      setBooks(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding book:', error);
      return { data: null, error };
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setBooks(prev => prev.map(book => book.id === id ? data : book));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating book:', error);
      return { data: null, error };
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBooks(prev => prev.filter(book => book.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting book:', error);
      return { error };
    }
  };

  return {
    books,
    loading,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
  };
}