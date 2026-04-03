import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
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
  addProduct: (p: Omit<Product, 'id' | 'salesCount'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'date'>) => void;
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

const SAMPLE_PRODUCTS: Product[] = [];

const SAMPLE_TRANSACTIONS: Transaction[] = [];

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('six_products');
    return stored ? JSON.parse(stored) : SAMPLE_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('six_transactions');
    return stored ? JSON.parse(stored) : SAMPLE_TRANSACTIONS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => { localStorage.setItem('six_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('six_transactions', JSON.stringify(transactions)); }, [transactions]);

  const addProduct = (p: Omit<Product, 'id' | 'salesCount'>) => {
    setProducts(prev => [...prev, { ...p, id: crypto.randomUUID(), salesCount: 0 }]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addTransaction = (t: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = { ...t, id: crypto.randomUUID(), date: new Date().toISOString() };
    setTransactions(prev => [newTx, ...prev]);
    // Update stock and sales
    t.items.forEach(item => {
      setProducts(prev => prev.map(p =>
        p.id === item.productId
          ? { ...p, quantity: Math.max(0, p.quantity - item.quantity), salesCount: p.salesCount + item.quantity }
          : p
      ));
    });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) {
        return prev.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(c => c.product.id !== productId));
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(c => c.product.id === productId ? { ...c, quantity: qty } : c));
  };

  const clearCart = () => setCart([]);

  const resetAllData = () => {
    localStorage.clear();
    setProducts([]);
    setTransactions([]);
    setCart([]);
    window.location.href = '/auth'; // Redirect to auth page after reset
  };

  const getAIInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];
    const now = new Date();

    products.forEach(p => {
      if (p.salesCount > 50) {
        insights.push({ productId: p.id, productName: p.name, type: 'high_demand', message: `🔥 ${p.name} is a high demand item! (${p.salesCount} units sold)`, severity: 'info' });
      }
      if (p.salesCount < 15) {
        insights.push({ productId: p.id, productName: p.name, type: 'low_demand', message: `📉 ${p.name} has low sales. Consider offers.`, severity: 'warning' });
      }
      if (p.quantity <= 5) {
        insights.push({ productId: p.id, productName: p.name, type: 'restock', message: `⚠️ ${p.name} stock is low (${p.quantity} left). Restock recommended!`, severity: 'critical' });
      }
      if (p.expiryDate) {
        const expiry = new Date(p.expiryDate);
        const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7 && daysLeft > 0) {
          insights.push({ productId: p.id, productName: p.name, type: 'expiring', message: `🕐 ${p.name} expires in ${daysLeft} days!`, severity: 'critical' });
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
