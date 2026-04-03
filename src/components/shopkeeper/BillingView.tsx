import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, Printer, Send, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface BillItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

const BillingView = () => {
  const { products, addTransaction } = useStore();
  const { t } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [search, setSearch] = useState('');
  const [showBill, setShowBill] = useState(false);

  const subtotal = billItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const addToBill = (p: typeof products[0]) => {
    setBillItems(prev => {
      const existing = prev.find(i => i.productId === p.id);
      if (existing) return prev.map(i => i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: p.id, productName: p.name, price: p.price, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setBillItems(prev => prev.map(i => {
      if (i.productId === productId) { const newQty = i.quantity + delta; return newQty > 0 ? { ...i, quantity: newQty } : i; }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const removeBillItem = (productId: string) => setBillItems(prev => prev.filter(i => i.productId !== productId));

  const generateBill = () => {
    if (!customerName.trim() || billItems.length === 0) { toast.error(t('bill.addNameItems')); return; }
    addTransaction({ userId: 'walk-in', customerName, items: billItems.map(i => ({ productId: i.productId, productName: i.productName, quantity: i.quantity, price: i.price })), totalAmount: total, tax: gst });
    setShowBill(true);
    toast.success(t('bill.generated'));
  };

  const resetBill = () => { setBillItems([]); setCustomerName(''); setShowBill(false); setSearch(''); };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && p.quantity > 0);

  if (showBill) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
        <div className="glass-card p-6">
          <div className="text-center mb-4 pb-4 border-b border-border border-dashed">
            <h2 className="font-display font-bold text-xl text-foreground">Smart Inventory X</h2>
            <p className="text-xs text-muted-foreground">{t('bill.taxInvoice')}</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date().toLocaleString('en-IN')}</p>
          </div>
          <p className="text-sm text-foreground mb-3">{t('bill.customerName')}: <strong>{customerName}</strong></p>
          <div className="border-t border-b border-border border-dashed py-3 space-y-2">
            {billItems.map(item => (
              <div key={item.productId} className="flex justify-between text-sm text-foreground">
                <span>{item.productName} × {item.quantity}</span>
                <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground"><span>{t('bill.subtotal')}</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>{t('bill.gst')}</span><span>₹{gst.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-display font-bold text-foreground pt-2 border-t border-border"><span>{t('bill.total')}</span><span>₹{total.toFixed(2)}</span></div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">{t('bill.thankYou')}</p>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => window.print()} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" /> {t('bill.print')}
          </button>
          <button onClick={() => toast.info(t('bill.whatsappSim'))} className="flex-1 py-3 rounded-xl pastel-mint-bg font-display font-bold text-sm flex items-center justify-center gap-2 text-foreground">
            <Send className="w-4 h-4" /> {t('bill.whatsapp')}
          </button>
        </div>
        <button onClick={resetBill} className="w-full mt-3 py-3 rounded-xl border border-border font-display font-semibold text-sm text-foreground hover:bg-muted transition-all">
          {t('bill.newBill')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('bill.searchProduct')} className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm outline-none focus:border-primary text-foreground" />
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {filteredProducts.map(p => (
            <button key={p.id} onClick={() => addToBill(p)} className="w-full glass-card-hover p-3 flex items-center justify-between text-left">
              <div>
                <p className="font-display font-semibold text-sm text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.quantity} {t('bill.left')}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-foreground">₹{p.price}</p>
                <Plus className="w-4 h-4 text-primary ml-auto" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 space-y-4">
        <h3 className="font-display font-bold text-foreground flex items-center gap-2">
          <IndianRupee className="w-5 h-5" /> {t('bill.currentBill')}
        </h3>
        <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder={t('bill.customerName')} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:border-primary text-foreground" />
        {billItems.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">{t('bill.addItems')}</p>
        ) : (
          <div className="space-y-2">
            {billItems.map(item => (
              <div key={item.productId} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">₹{item.price} {t('bill.each')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.productId, -1)} className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center"><Minus className="w-3 h-3 text-foreground" /></button>
                  <span className="w-8 text-center font-display font-bold text-sm text-foreground">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center"><Plus className="w-3 h-3 text-foreground" /></button>
                  <button onClick={() => removeBillItem(item.productId)} className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center"><Trash2 className="w-3 h-3 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        {billItems.length > 0 && (
          <div className="pt-3 border-t border-border space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground"><span>{t('bill.subtotal')}</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>{t('bill.gst')}</span><span>₹{gst.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-display font-bold text-foreground"><span>{t('bill.total')}</span><span>₹{total.toFixed(2)}</span></div>
            <button onClick={generateBill} className="w-full mt-3 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-all">
              {t('bill.generateBill')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingView;
