import { useState, useEffect } from 'react';
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

interface TimeEntry {
  _id: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  taskName?: string;
  date: string;
  hours: number;
  notes?: string;
  dayType: string;
  rateType: string;
  approvalStatus: string;
}

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
}

const statusColors = {
  approved: 'default',
  pending: 'secondary',
  rejected: 'destructive',
} as const;

export function WeeklyTracker() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
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

  const fetchTimeEntries = async () => {
    const res = await fetch('http://localhost:5000/api/time-entries');
    const data = await res.json();
    setTimeEntries(data);
  };

  // Mock Projects and Tasks (replace with backend API if available)
  useEffect(() => {
    setProjects([
      { id: '1', name: 'Project A' },
      { id: '2', name: 'Project B' },
    ]);
    setTasks([
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2' },
    ]);
    fetchTimeEntries();
  }, []);

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const approvedHours = timeEntries
    .filter(entry => entry.approvalStatus === 'approved')
    .reduce((sum, entry) => sum + entry.hours, 0);
  const pendingHours = timeEntries
    .filter(entry => entry.approvalStatus === 'pending')
    .reduce((sum, entry) => sum + entry.hours, 0);

  const handleAddEntry = async () => {
    if (!newEntry.projectId || !newEntry.hours || !selectedDate) return;

    const project = projects.find(p => p.id === newEntry.projectId)?.name || '';
    const task = tasks.find(t => t.id === newEntry.taskId)?.title || '';

    const payload = {
      ...newEntry,
      date: selectedDate,
      projectName: project,
      taskName: task,
      hours: parseFloat(newEntry.hours),
    };

    await fetch('http://localhost:5000/api/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setIsAddDialogOpen(false);
    setNewEntry({ projectId: '', taskId: '', hours: '', notes: '', dayType: 'Regular', rateType: 'Standard' });
    fetchTimeEntries();
  };

  const columns: ColumnDef<TimeEntry>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => new Date(row.getValue('date')).toLocaleDateString(),
    },
    { accessorKey: 'projectName', header: 'Project' },
    { accessorKey: 'taskName', header: 'Task' },
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
    { accessorKey: 'dayType', header: 'Day Type' },
    { accessorKey: 'rateType', header: 'Rate Type' },
    {
      accessorKey: 'approvalStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('approvalStatus') as keyof typeof statusColors;
        const Icon = status === 'approved' ? CheckCircle : status === 'rejected' ? XCircle : Clock;
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <Badge variant={statusColors[status] || 'secondary'}>{status}</Badge>
          </div>
        );
      },
    },
    { accessorKey: 'notes', header: 'Notes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Weekly Tracker</h1>
          <p className="text-muted-foreground">Track your time and submit timesheets</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-glow">
              <Plus className="mr-2 h-4 w-4" /> Add Time Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Time Entry</DialogTitle>
              <DialogDescription>Record your work hours for a project/task.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Date Picker */}
              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn(!selectedDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              {/* Project */}
              <div className="grid gap-2">
                <Label>Project</Label>
                <Select value={newEntry.projectId} onValueChange={(value) => setNewEntry(prev => ({ ...prev, projectId: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Task */}
              <div className="grid gap-2">
                <Label>Task (Optional)</Label>
                <Select value={newEntry.taskId} onValueChange={(value) => setNewEntry(prev => ({ ...prev, taskId: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select task" /></SelectTrigger>
                  <SelectContent>
                    {tasks.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Hours */}
              <div className="grid gap-2">
                <Label>Hours</Label>
                <Input type="number" step="0.5" min="0" max="24" value={newEntry.hours} onChange={(e) => setNewEntry(prev => ({ ...prev, hours: e.target.value }))} placeholder="Enter hours worked" />
              </div>
              {/* Notes */}
              <div className="grid gap-2">
                <Label>Notes</Label>
                <Textarea rows={3} value={newEntry.notes} onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))} placeholder="Describe the work done..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEntry}>Add Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p>Total Hours</p><p>{totalHours}h</p></CardContent></Card>
        <Card><CardContent className="p-4"><p>Approved Hours</p><p>{approvedHours}h</p></CardContent></Card>
        <Card><CardContent className="p-4"><p>Pending Hours</p><p>{pendingHours}h</p></CardContent></Card>
      </div>

      {/* Data Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Time Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={timeEntries} searchKey="projectName" searchPlaceholder="Search time entries..." />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
