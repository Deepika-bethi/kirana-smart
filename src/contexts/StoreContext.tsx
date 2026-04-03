import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

export interface Product {
  _id?: string;
  id: string;
  name: string;
  nameHi?: string;
  price: number;
  quantity: number;
  category: string;
  expiryDate?: string;
  barcode?: string;
  image?: string;
  salesCount: number;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  _id?: string;
  id: string;
  userId: string;
  customerName: string;
  items: TransactionItem[];
  totalAmount: number;
  tax: number;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  products: Product[];
  transactions: Transaction[];
  cart: CartItem[];
  addProduct: (p: Omit<Product, 'id' | 'salesCount'>) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  resetAllData: () => void;
  getAIInsights: () => AIInsight[];
  isOffline: boolean;
  setIsOffline: (v: boolean) => void;
}

export interface AIInsight {
  productId: string;
  productName: string;
  type: 'high_demand' | 'low_demand' | 'restock' | 'expiring';
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const addProduct = async (p: Omit<Product, 'id' | 'salesCount'>) => {
    try {
      const response = await api.post('/products', p);
      setProducts(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await api.put(`/products/${id}`, updates);
      setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? response.data : p));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'date'>) => {
    try {
      const response = await api.post('/transactions', t);
      setTransactions(prev => [response.data, ...prev]);
      // Refetch products to update stock/sales counts
      fetchProducts();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => (c.product._id === product._id || c.product.id === product.id));
      if (existing) {
        return prev.map(c => (c.product._id === product._id || c.product.id === product.id) ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(c => c.product._id !== productId && c.product.id !== productId));
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(c => (c.product._id === productId || c.product.id === productId) ? { ...c, quantity: qty } : c));
  };

  const clearCart = () => setCart([]);

  const resetAllData = () => {
    localStorage.clear();
    setProducts([]);
    setTransactions([]);
    setCart([]);
    window.location.href = '/auth';
  };

  const getAIInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];
    const now = new Date();

    products.forEach(p => {
      if (p.salesCount > 50) {
        insights.push({ productId: p._id || p.id, productName: p.name, type: 'high_demand', message: `🔥 ${p.name} is a high demand item! (${p.salesCount} units sold)`, severity: 'info' });
      }
      if (p.salesCount < 15) {
        insights.push({ productId: p._id || p.id, productName: p.name, type: 'low_demand', message: `📉 ${p.name} has low sales. Consider offers.`, severity: 'warning' });
      }
      if (p.quantity <= 5) {
        insights.push({ productId: p._id || p.id, productName: p.name, type: 'restock', message: `⚠️ ${p.name} stock is low (${p.quantity} left). Restock recommended!`, severity: 'critical' });
      }
      if (p.expiryDate) {
        const expiry = new Date(p.expiryDate);
        const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7 && daysLeft > 0) {
          insights.push({ productId: p._id || p.id, productName: p.name, type: 'expiring', message: `🕐 ${p.name} expires in ${daysLeft} days!`, severity: 'critical' });
        }
      }
    });

    return insights;
  };

  return (
    <StoreContext.Provider value={{ products, transactions, cart, addProduct, updateProduct, deleteProduct, addTransaction, addToCart, removeFromCart, updateCartQty, clearCart, resetAllData, getAIInsights, isOffline, setIsOffline }}>
      {children}
    </StoreContext.Provider>
  );
};
