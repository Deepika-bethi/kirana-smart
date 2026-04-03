import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

const CustomerCart = () => {
  const { user } = useAuth();
  const { cart, updateCartQty, removeFromCart, clearCart, addTransaction, products } = useStore();
  const { t } = useLanguage();
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const cartCategories = [...new Set(cart.map(c => c.product.category))];
  const recommendations = products.filter(p => cartCategories.includes(p.category) && !cart.find(c => c.product.id === p.id) && p.quantity > 0).slice(0, 3);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    addTransaction({ userId: user?.id || 'guest', customerName: user?.name || 'Customer', items: cart.map(c => ({ productId: c.product.id, productName: c.product.name, quantity: c.quantity, price: c.product.price })), totalAmount: total, tax: gst });
    setOrderId(newOrderId);
    setShowReceipt(true);
    toast.success(t('cart.orderPlaced'));
  };

  if (showReceipt) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 max-w-md mx-auto">
        <div className="glass-card p-6 text-center">
          <p className="text-4xl mb-2">✅</p>
          <h2 className="font-display text-xl font-bold text-foreground">{t('cart.orderConfirmed')}</h2>
          <p className="text-sm text-muted-foreground">{t('cart.orderId')}: {orderId}</p>
          <div className="my-6 flex justify-center">
            <div className="p-4 bg-card rounded-2xl border border-border">
              <QRCodeSVG value={`smartinventoryx://order/${orderId}`} size={140} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t('cart.showQR')}</p>
          <div className="mt-4 p-4 rounded-xl bg-muted/50 text-left space-y-1">
            {cart.map(c => (
              <div key={c.product.id} className="flex justify-between text-sm text-foreground">
                <span>{c.product.name} × {c.quantity}</span>
                <span>₹{(c.product.price * c.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex justify-between font-display font-bold text-foreground">
              <span>{t('bill.total')}</span><span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => { clearCart(); setShowReceipt(false); }} className="mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">
            {t('cart.done')}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
        <ShoppingBag className="w-5 h-5" /> {t('cart.myCart')}
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🛒</p>
          <p className="font-display font-bold text-foreground">{t('cart.empty')}</p>
          <p className="text-sm text-muted-foreground">{t('cart.addItemsToStart')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map(c => (
              <motion.div key={c.product.id} layout className="glass-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl pastel-sky-bg flex items-center justify-center text-lg flex-shrink-0">📦</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-sm text-foreground">{c.product.name}</h3>
                  <p className="text-xs text-muted-foreground">₹{c.product.price} {t('bill.each')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCartQty(c.product.id, c.quantity - 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"><Minus className="w-3 h-3 text-foreground" /></button>
                  <span className="w-6 text-center font-display font-bold text-sm text-foreground">{c.quantity}</span>
                  <button onClick={() => updateCartQty(c.product.id, c.quantity + 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"><Plus className="w-3 h-3 text-foreground" /></button>
                  <button onClick={() => removeFromCart(c.product.id)} className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center"><Trash2 className="w-3 h-3 text-destructive" /></button>
                </div>
              </motion.div>
            ))}
          </div>

          {recommendations.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-2">{t('cart.frequentlyBought')}</h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {recommendations.map(p => (
                  <div key={p.id} className="flex-shrink-0 glass-card p-3 w-32">
                    <p className="text-xs font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">₹{p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card p-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground"><span>{t('bill.subtotal')}</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>{t('bill.gst')}</span><span>₹{gst.toFixed(2)}</span></div>
            <div className="flex justify-between font-display font-bold text-foreground text-lg pt-2 border-t border-border"><span>{t('bill.total')}</span><span>₹{total.toFixed(2)}</span></div>
          </div>

          <button onClick={handleCheckout} className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-all shadow-lg">
            {t('cart.checkout')} · ₹{total.toFixed(2)}
          </button>
        </>
      )}
    </div>
  );
};

export default CustomerCart;
