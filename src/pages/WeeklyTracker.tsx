import { useState } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockTimeEntries, mockProjects, mockTasks } from '@/data/mockData';

interface TimeEntry {
  id: string;
  projectName: string;
  taskName: string;
  date: string;
  hours: number;
  notes: string;
  dayType: string;
  rateType: string;
  approvalStatus: string;
}

const statusColors = {
  approved: 'default',
  pending: 'secondary',
  rejected: 'destructive',
} as const;

const columns: ColumnDef<TimeEntry>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: 'projectName',
    header: 'Project',
  },
  {
    accessorKey: 'taskName',
    header: 'Task',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.getValue('taskName') || 'General Work'}
      </div>
    ),
  },
  {
    accessorKey: 'hours',
    header: 'Hours',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span>{row.getValue('hours')}h</span>
      </div>
    ),
  },
  {
    accessorKey: 'dayType',
    header: 'Day Type',
  },
  {
    accessorKey: 'rateType',
    header: 'Rate Type',
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('approvalStatus') as keyof typeof statusColors;
      const Icon = status === 'approved' ? CheckCircle : status === 'rejected' ? XCircle : Clock;
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant={statusColors[status] || 'secondary'}>
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.getValue('notes')}
      </div>
    ),
  },
];

export function WeeklyTracker() {
  const [timeEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const [newEntry, setNewEntry] = useState({
    projectId: '',
    taskId: '',
    hours: '',
    notes: '',
    dayType: 'Regular',
    rateType: 'Standard',
  });

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const approvedHours = timeEntries
    .filter(entry => entry.approvalStatus === 'approved')
    .reduce((sum, entry) => sum + entry.hours, 0);
  const pendingHours = timeEntries
    .filter(entry => entry.approvalStatus === 'pending')
    .reduce((sum, entry) => sum + entry.hours, 0);

  const handleAddEntry = () => {
    // Add time entry logic here
    console.log('Adding time entry:', newEntry);
    setIsAddDialogOpen(false);
    setNewEntry({
      projectId: '',
      taskId: '',
      hours: '',
      notes: '',
      dayType: 'Regular',
      rateType: 'Standard',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Weekly Tracker</h1>
          <p className="text-muted-foreground">Track your time and submit timesheets</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              Add Time Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Time Entry</DialogTitle>
              <DialogDescription>
                Record your work hours for a specific project and task.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Select value={newEntry.projectId} onValueChange={(value) => setNewEntry(prev => ({ ...prev, projectId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task">Task (Optional)</Label>
                <Select value={newEntry.taskId} onValueChange={(value) => setNewEntry(prev => ({ ...prev, taskId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={newEntry.hours}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, hours: e.target.value }))}
                  placeholder="Enter hours worked"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe the work done..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddEntry}>Add Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="transition-smooth hover:shadow-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Hours</p>
                <p className="text-2xl font-bold text-accent">{approvedHours}h</p>
              </div>
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Hours</p>
                <p className="text-2xl font-bold text-warning">{pendingHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Time Entries</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Submit Week
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={timeEntries}
              searchKey="projectName"
              searchPlaceholder="Search time entries..."
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}