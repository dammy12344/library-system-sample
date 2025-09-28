export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  available_copies: number;
  total_copies: number;
  created_at: string;
}

export interface Borrow {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'returned' | 'overdue';
  created_at: string;
  book?: Book;
  profile?: Profile;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}