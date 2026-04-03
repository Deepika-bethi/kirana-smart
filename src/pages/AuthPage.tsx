import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { ShoppingBag, Store, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = login(email, password);
      if (success) {
        toast.success('Welcome back! 🎉');
        navigate('/');
      } else {
        toast.error('Invalid credentials');
      }
    } else {
      const success = signup(name, email, password, role);
      if (success) {
        toast.success('Account created! 🚀');
        navigate('/');
      } else {
        toast.error('Email already exists');
      }
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full pastel-lavender-bg mb-4">
            <Store className="w-5 h-5 text-foreground" />
            <span className="font-display font-bold text-sm text-foreground">SMART INVENTORY X</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            AI Powered Retail
          </h1>
          <p className="text-muted-foreground mt-1">For India's Smart Shopkeepers</p>
        </motion.div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${!isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required={!isLogin}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-body"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-body"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-body"
              />
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="role"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-display font-semibold text-foreground mb-2">I am a:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('shopkeeper')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'shopkeeper' ? 'border-primary pastel-lavender-bg' : 'border-border hover:border-primary/50'}`}
                    >
                      <Store className="w-6 h-6 text-foreground" />
                      <span className="text-sm font-display font-semibold text-foreground">Shopkeeper</span>
                      <span className="text-xs text-muted-foreground">दुकानदार</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'customer' ? 'border-primary pastel-sky-bg' : 'border-border hover:border-primary/50'}`}
                    >
                      <ShoppingBag className="w-6 h-6 text-foreground" />
                      <span className="text-sm font-display font-semibold text-foreground">Customer</span>
                      <span className="text-xs text-muted-foreground">ग्राहक</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
            >
              {isLogin ? 'Login' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  signup('Demo Shopkeeper', 'shop@demo.com', 'demo123', 'shopkeeper');
                  toast.success('Logged in as Shopkeeper! 🏪');
                  navigate('/');
                }}
                className="py-2 px-3 rounded-lg pastel-mint-bg text-xs font-display font-semibold text-foreground hover:opacity-80 transition-all"
              >
                🏪 Try Shopkeeper
              </button>
              <button
                onClick={() => {
                  signup('Demo Customer', 'customer@demo.com', 'demo123', 'customer');
                  toast.success('Logged in as Customer! 🛍️');
                  navigate('/');
                }}
                className="py-2 px-3 rounded-lg pastel-pink-bg text-xs font-display font-semibold text-foreground hover:opacity-80 transition-all"
              >
                🛍️ Try Customer
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
