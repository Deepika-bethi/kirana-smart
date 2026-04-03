import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const TransactionsView = () => {
  const { transactions } = useStore();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = transactions.filter(t =>
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.date.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer or date..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm outline-none focus:border-primary text-foreground"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No transactions found</p>
        ) : filtered.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div>
                <p className="font-display font-bold text-foreground">{t.customerName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{new Date(t.date).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display font-bold text-foreground">₹{t.totalAmount.toFixed(2)}</p>
                {expandedId === t.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            <AnimatePresence>
              {expandedId === t.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 border-t border-border">
                    <div className="space-y-2 mt-3">
                      {t.items.map((item, j) => (
                        <div key={j} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.productName} × {item.quantity}</span>
                          <span className="text-foreground font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-border/50 space-y-1 text-sm">
                      <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>₹{t.tax.toFixed(2)}</span></div>
                      <div className="flex justify-between font-display font-bold text-foreground"><span>Total</span><span>₹{t.totalAmount.toFixed(2)}</span></div>
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
