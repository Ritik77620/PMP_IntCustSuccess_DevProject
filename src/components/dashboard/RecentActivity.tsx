import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const activities = [
  {
    id: 1,
    action: 'Task completed',
    description: 'API development for Arlyn project',
    user: 'Asha Verma',
    time: '2 hours ago',
    type: 'completed',
  },
  {
    id: 2,
    action: 'Timesheet submitted',
    description: 'Weekly timesheet for Aug 5-11',
    user: 'John Doe',
    time: '4 hours ago',
    type: 'submitted',
  },
  {
    id: 3,
    action: 'Project milestone',
    description: 'Phase 2 of TechFlow project reached',
    user: 'Ritik Raj',
    time: '1 day ago',
    type: 'milestone',
  },
  {
    id: 4,
    action: 'Task overdue',
    description: 'Database schema design deadline passed',
    user: 'System',
    time: '2 days ago',
    type: 'overdue',
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-accent" />;
    case 'overdue':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-primary" />;
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'completed':
      return 'default';
    case 'overdue':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export function RecentActivity() {
  return (
    <Card className="transition-smooth hover:shadow-glow">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="mt-1">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}