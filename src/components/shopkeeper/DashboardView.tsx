import React from 'react';
import { useStore, AIInsight } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
import { Package, TrendingUp, AlertTriangle, IndianRupee, Brain, Flame, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DashboardView = () => {
  const { products, transactions, getAIInsights } = useStore();
  const insights = getAIInsights();

  const totalProducts = products.length;
  const lowStock = products.filter(p => p.quantity <= 5).length;
  const totalRevenue = transactions.reduce((s, t) => s + t.totalAmount, 0);
  const totalSales = transactions.length;

  const stats = [
    { label: 'Total Revenue', labelHi: 'कुल राजस्व', value: `₹${totalRevenue.toFixed(0)}`, icon: <IndianRupee className="w-5 h-5" />, bg: 'pastel-mint-bg' },
    { label: 'Products', labelHi: 'उत्पाद', value: totalProducts, icon: <Package className="w-5 h-5" />, bg: 'pastel-sky-bg' },
    { label: 'Total Sales', labelHi: 'कुल बिक्री', value: totalSales, icon: <TrendingUp className="w-5 h-5" />, bg: 'pastel-lavender-bg' },
    { label: 'Low Stock', labelHi: 'कम स्टॉक', value: lowStock, icon: <AlertTriangle className="w-5 h-5" />, bg: 'pastel-peach-bg' },
  ];

  // Chart data
  const salesData = [
    { name: 'Mon', sales: 1200 }, { name: 'Tue', sales: 1800 }, { name: 'Wed', sales: 1400 },
    { name: 'Thu', sales: 2200 }, { name: 'Fri', sales: 1900 }, { name: 'Sat', sales: 2800 }, { name: 'Sun', sales: 2100 },
  ];

  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5).map(p => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name,
    sales: p.salesCount,
  }));

  const insightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'high_demand': return <Flame className="w-4 h-4 text-foreground" />;
      case 'low_demand': return <ArrowDown className="w-4 h-4 text-foreground" />;
      case 'restock': return <AlertTriangle className="w-4 h-4 text-foreground" />;
      case 'expiring': return <AlertTriangle className="w-4 h-4 text-foreground" />;
    }
  };

  const insightBg = (severity: AIInsight['severity']) => {
    switch (severity) {
      case 'info': return 'pastel-sky-bg';
      case 'warning': return 'pastel-yellow-bg';
      case 'critical': return 'pastel-peach-bg';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground/70">{stat.labelHi}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground mb-4">📈 Sales Trend (Weekly)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(280 60% 70%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(280 60% 70%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(240 10% 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(240 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="sales" stroke="hsl(280 60% 70%)" fill="url(#salesGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="font-display font-bold text-foreground mb-4">🏆 Top Products</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(240 10% 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(240 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="sales" fill="hsl(160 45% 70%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">🧠 AI Insights</h3>
        </div>
        {insights.length === 0 ? (
          <p className="text-muted-foreground text-sm">All good! No insights right now.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {insights.map((insight, i) => (
              <div key={i} className={`p-3 rounded-xl ${insightBg(insight.severity)} flex items-start gap-3`}>
                {insightIcon(insight.type)}
                <p className="text-sm text-foreground">{insight.message}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardView;
