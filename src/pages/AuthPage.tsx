import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ShoppingBag, Store, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const { login, signup, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleGoogleSuccess = (response: any) => {
    loginWithGoogle(response.credential, role);
    toast.success(t('auth.welcomeBack'));
    navigate('/');
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        toast.success(t('auth.welcomeBack'));
        navigate('/');
      } else {
        toast.error(t('auth.invalidCreds'));
      }
    } else {
      const success = await signup(name, email, password, role);
      if (success) {
        toast.success(t('auth.accountCreated'));
        navigate('/');
      } else {
        toast.error(t('auth.emailExists'));
      }
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-center mb-4">
          <LanguageSwitcher />
        </div>

        {/* Logo */}
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full pastel-lavender-bg mb-4">
            <Store className="w-5 h-5 text-foreground" />
            <span className="font-display font-bold text-sm text-foreground">SMART INVENTORY X</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t('auth.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('auth.subtitle')}</p>
        </motion.div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('auth.login')}
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${!isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('auth.signup')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div key="name" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input type="text" placeholder={t('auth.fullName')} value={name} onChange={e => setName(e.target.value)} required={!isLogin} className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-body" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input type="email" placeholder={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-body" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input type="password" placeholder={t('auth.password')} value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-body" />
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div key="role" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="text-sm font-display font-semibold text-foreground mb-2">{t('auth.iAmA')}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setRole('shopkeeper')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'shopkeeper' ? 'border-primary pastel-lavender-bg' : 'border-border hover:border-primary/50'}`}>
                      <Store className="w-6 h-6 text-foreground" />
                      <span className="text-sm font-display font-semibold text-foreground">{t('auth.shopkeeper')}</span>
                    </button>
                    <button type="button" onClick={() => setRole('customer')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'customer' ? 'border-primary pastel-sky-bg' : 'border-border hover:border-primary/50'}`}>
                      <ShoppingBag className="w-6 h-6 text-foreground" />
                      <span className="text-sm font-display font-semibold text-foreground">{t('auth.customer')}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg">
              {isLogin ? t('auth.login') : t('auth.createAccount')}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="h-[1px] flex-1 bg-border" />
              <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">{t('auth.or')}</span>
              <div className="h-[1px] flex-1 bg-border" />
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                use_fedcm_for_prompt={false}
                theme="outline"
                shape="pill"
                width="100%"
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">{t('auth.quickDemo')}</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={async () => { await signup('Demo Shopkeeper', 'shop@demo.com', 'demo123', 'shopkeeper'); toast.success(t('auth.welcomeBack')); navigate('/'); }} className="py-2 px-3 rounded-lg pastel-mint-bg text-xs font-display font-semibold text-foreground hover:opacity-80 transition-all">
                {t('auth.tryShopkeeper')}
              </button>
              <button onClick={async () => { await signup('Demo Customer', 'customer@demo.com', 'demo123', 'customer'); toast.success(t('auth.welcomeBack')); navigate('/'); }} className="py-2 px-3 rounded-lg pastel-pink-bg text-xs font-display font-semibold text-foreground hover:opacity-80 transition-all">
                {t('auth.tryCustomer')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
