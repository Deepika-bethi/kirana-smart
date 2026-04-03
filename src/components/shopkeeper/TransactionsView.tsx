import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const TransactionsView = () => {
  const { transactions } = useStore();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = transactions.filter(tx =>
    tx.customerName.toLowerCase().includes(search.toLowerCase()) || tx.date.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('txn.searchByCustomer')} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm outline-none focus:border-primary text-foreground" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t('txn.noTransactions')}</p>
        ) : filtered.map((tx, i) => (
          <motion.div key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)} className="w-full p-4 flex items-center justify-between text-left">
              <div>
                <p className="font-display font-bold text-foreground">{tx.customerName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display font-bold text-foreground">₹{tx.totalAmount.toFixed(2)}</p>
                {expandedId === tx.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            <AnimatePresence>
              {expandedId === tx.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 pt-0 border-t border-border">
                    <div className="space-y-2 mt-3">
                      {tx.items.map((item, j) => (
                        <div key={j} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.productName} × {item.quantity}</span>
                          <span className="text-foreground font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-border/50 space-y-1 text-sm">
                      <div className="flex justify-between text-muted-foreground"><span>{t('txn.tax')}</span><span>₹{tx.tax.toFixed(2)}</span></div>
                      <div className="flex justify-between font-display font-bold text-foreground"><span>{t('bill.total')}</span><span>₹{tx.totalAmount.toFixed(2)}</span></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsView;
