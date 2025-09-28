import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Borrow } from '../types';
import { addDays, isAfter } from 'date-fns';

export function useBorrows() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const { data, error } = await supabase
        .from('borrows')
        .select(`
          *,
          book:books(*),
          profile:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Update status based on due dates
      const updatedBorrows = (data || []).map(borrow => ({
        ...borrow,
        status: borrow.return_date 
          ? 'returned' 
          : isAfter(new Date(), new Date(borrow.due_date))
            ? 'overdue'
            : 'active'
      }));
      
      setBorrows(updatedBorrows);
    } catch (error) {
      console.error('Error fetching borrows:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBorrow = async (bookId: string, userId: string) => {
    try {
      const borrowDate = new Date();
      const dueDate = addDays(borrowDate, 14); // 2 weeks loan period

      const { data, error } = await supabase
        .from('borrows')
        .insert([{
          book_id: bookId,
          user_id: userId,
          borrow_date: borrowDate.toISOString(),
          due_date: dueDate.toISOString(),
          status: 'active'
        }])
        .select(`
          *,
          book:books(*),
          profile:profiles(*)
        `)
        .single();

      if (error) throw error;

      // Update book available copies
      await supabase
        .from('books')
        .update({ 
          available_copies: supabase.raw('available_copies - 1')
        })
        .eq('id', bookId);

      setBorrows(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding borrow:', error);
      return { data: null, error };
    }
  };

  const returnBook = async (borrowId: string, bookId: string) => {
    try {
      const returnDate = new Date();

      const { data, error } = await supabase
        .from('borrows')
        .update({ 
          return_date: returnDate.toISOString(),
          status: 'returned'
        })
        .eq('id', borrowId)
        .select(`
          *,
          book:books(*),
          profile:profiles(*)
        `)
        .single();

      if (error) throw error;

      // Update book available copies
      await supabase
        .from('books')
        .update({ 
          available_copies: supabase.raw('available_copies + 1')
        })
        .eq('id', bookId);

      setBorrows(prev => prev.map(borrow => 
        borrow.id === borrowId ? { ...data, status: 'returned' } : borrow
      ));
      
      return { data, error: null };
    } catch (error) {
      console.error('Error returning book:', error);
      return { data: null, error };
    }
  };

  return {
    borrows,
    loading,
    fetchBorrows,
    addBorrow,
    returnBook,
  };
}