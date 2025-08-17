import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  gradient?: boolean;
}

export function StatsCard({ title, value, change, icon: Icon, gradient = false }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`transition-smooth hover:shadow-glow ${gradient ? 'gradient-card' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {change && (
                <Badge 
                  variant={
                    change.type === 'increase' 
                      ? 'default' 
                      : change.type === 'decrease' 
                        ? 'destructive' 
                        : 'secondary'
                  }
                  className="text-xs"
                >
                  {change.value}
                </Badge>
              )}
            </div>
            <div className={`p-3 rounded-lg ${gradient ? 'bg-primary/10' : 'gradient-primary'}`}>
              <Icon className={`h-6 w-6 ${gradient ? 'text-primary' : 'text-primary-foreground'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}