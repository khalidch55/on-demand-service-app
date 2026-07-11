export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  durationMinutes: number;
  isActive: boolean;
  category?: ServiceCategory;
}

export interface Booking {
  id: number;
  status: string;
  dateTime: string;
  notes?: string;
  providerWorkDone?: boolean;
  customerWorkDone?: boolean;
  amount?: number | string;
  paymentStatus?: string;
  paidAt?: string;
  mockTransactionId?: string;
  service?: Service;
  provider?: User;
  customer?: User;
}

export interface MockPaymentInput {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, role?: 'customer' | 'provider') => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
