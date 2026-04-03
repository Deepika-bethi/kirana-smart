import React, { useState } from 'react';
import { useStore, Product } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Mic, Camera, X, Grid, List } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Grains', 'Pulses', 'Dairy', 'Snacks', 'Essentials', 'Household', 'Condiments', 'Beverages', 'Fruits', 'Vegetables'];

const InventoryView = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: 'Grains', expiryDate: '', barcode: '' });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: '', price: '', quantity: '', category: 'Grains', expiryDate: '', barcode: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, {
        name: form.name, price: +form.price, quantity: +form.quantity,
        category: form.category, expiryDate: form.expiryDate || undefined, barcode: form.barcode || undefined,
      });
      toast.success('Product updated! ✅');
    } else {
      addProduct({
        name: form.name, price: +form.price, quantity: +form.quantity,
        category: form.category, expiryDate: form.expiryDate || undefined, barcode: form.barcode || undefined,
      });
      toast.success('Product added! 🎉');
    }
    resetForm();
  };

  const startEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price), quantity: String(p.quantity), category: p.category, expiryDate: p.expiryDate || '', barcode: p.barcode || '' });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted');
  };

  const stockColor = (qty: number) => {
    if (qty <= 5) return 'pastel-peach-bg';
    if (qty <= 20) return 'pastel-yellow-bg';
    return 'pastel-mint-bg';
  };

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products... (खोजें)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-foreground"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')} className="px-3 py-2.5 rounded-xl border border-border hover:bg-muted transition-all">
            {viewMode === 'card' ? <List className="w-4 h-4 text-foreground" /> : <Grid className="w-4 h-4 text-foreground" />}
          </button>
          <button onClick={() => toast.info('🎤 Voice input simulation – say the item name!')} className="px-3 py-2.5 rounded-xl border border-border hover:bg-muted transition-all">
            <Mic className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={() => toast.info('📷 Barcode scanner simulation activated!')} className="px-3 py-2.5 rounded-xl border border-border hover:bg-muted transition-all">
            <Camera className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground text-lg">{editingId ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={resetForm} className="p-2 rounded-lg hover:bg-muted"><X className="w-4 h-4 text-foreground" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Product Name" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:border-primary text-foreground" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} required type="number" min="0" placeholder="Price (₹)" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:border-primary text-foreground" />
                  <input value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required type="number" min="0" placeholder="Quantity" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:border-primary text-foreground" />
                </div>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:border-primary text-foreground">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} type="date" placeholder="Expiry Date" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:border-primary text-foreground" />
                <input value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} placeholder="Barcode (optional)" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:border-primary text-foreground" />
                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-all">
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid/Table */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card-hover p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`px-2.5 py-1 rounded-lg text-xs font-display font-semibold ${stockColor(p.quantity)} text-foreground`}>
                  {p.quantity} in stock
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-muted transition-all"><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-all"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                </div>
              </div>
              <h4 className="font-display font-bold text-foreground">{p.name}</h4>
              {p.nameHi && <p className="text-xs text-muted-foreground">{p.nameHi}</p>}
              <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
              <p className="text-xl font-display font-bold text-foreground mt-2">₹{p.price}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{p.salesCount} sold</span>
                {p.barcode && <span className="font-mono">{p.barcode.slice(0, 8)}…</span>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-display font-semibold text-foreground">Name</th>
                  <th className="text-left p-3 font-display font-semibold text-foreground">Category</th>
                  <th className="text-right p-3 font-display font-semibold text-foreground">Price</th>
                  <th className="text-right p-3 font-display font-semibold text-foreground">Qty</th>
                  <th className="text-right p-3 font-display font-semibold text-foreground">Sold</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-foreground font-medium">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.category}</td>
                    <td className="p-3 text-right text-foreground font-semibold">₹{p.price}</td>
                    <td className="p-3 text-right"><span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${stockColor(p.quantity)} text-foreground`}>{p.quantity}</span></td>
                    <td className="p-3 text-right text-muted-foreground">{p.salesCount}</td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-muted"><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xl z-30"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default InventoryView;
