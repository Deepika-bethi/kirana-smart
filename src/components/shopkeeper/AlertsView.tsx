import React from 'react';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Flame, ArrowDown, Clock } from 'lucide-react';

const AlertsView = () => {
  const { getAIInsights } = useStore();
  const insights = getAIInsights();

  const critical = insights.filter(i => i.severity === 'critical');
  const warnings = insights.filter(i => i.severity === 'warning');
  const info = insights.filter(i => i.severity === 'info');

  const iconFor = (type: string) => {
    switch (type) {
      case 'high_demand': return <Flame className="w-5 h-5" />;
      case 'low_demand': return <ArrowDown className="w-5 h-5" />;
      case 'restock': return <AlertTriangle className="w-5 h-5" />;
      case 'expiring': return <Clock className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const Section = ({ title, items, bg }: { title: string; items: typeof insights; bg: string }) => (
    items.length > 0 ? (
      <div className="space-y-2">
        <h3 className="font-display font-bold text-foreground text-sm">{title} ({items.length})</h3>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl ${bg} flex items-start gap-3`}
          >
            <div className="mt-0.5 text-foreground">{iconFor(item.type)}</div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.productName}</p>
              <p className="text-sm text-foreground/80">{item.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    ) : null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-foreground">Notifications & Alerts</h2>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-display font-bold text-foreground">All Clear!</p>
          <p className="text-sm text-muted-foreground">No alerts right now. सब ठीक है!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Section title="🚨 Critical Alerts" items={critical} bg="pastel-peach-bg" />
          <Section title="⚠️ Warnings" items={warnings} bg="pastel-yellow-bg" />
          <Section title="ℹ️ Insights" items={info} bg="pastel-sky-bg" />
        </div>
      )}
    </div>
  );
};

export default AlertsView;
