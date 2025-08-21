import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Task {
  id: string;
  ticketNumber: string;
  clientName: string;
  location: string;
  dateRaised: string;
  timeRaised: string;
  category: string;
  raisedBy: string;
  assignedTo: string;
  description: string;
  totalDaysElapsed: string;
  status: string;
  priority: string;
  resolution: string;
  dateClosed: string;
  timeClosed: string;
}

export function TaskMaster() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<Task>({
    id: '',
    ticketNumber: '',
    clientName: '',
    location: '',
    dateRaised: '',
    timeRaised: '',
    category: '',
    raisedBy: '',
    assignedTo: '',
    description: '',
    totalDaysElapsed: '',
    status: '',
    priority: '',
    resolution: '',
    dateClosed: '',
    timeClosed: '',
  });

  const [showForm, setShowForm] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Helper to generate ticket number
  const generateTicketNumber = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${dd}${mm}${yyyy}${hh}${min}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.clientName || !form.description) return;

    if (form.id) {
      setTasks(tasks.map((t) => (t.id === form.id ? form : t)));
    } else {
      const now = new Date();
      const newTask: Task = {
        ...form,
        id: Date.now().toString(),
        ticketNumber: generateTicketNumber(),
        dateRaised: now.toLocaleDateString(),
        timeRaised: now.toLocaleTimeString(),
      };
      setTasks([...tasks, newTask]);
    }

    setForm({
      id: '',
      ticketNumber: '',
      clientName: '',
      location: '',
      dateRaised: '',
      timeRaised: '',
      category: '',
      raisedBy: '',
      assignedTo: '',
      description: '',
      totalDaysElapsed: '',
      status: '',
      priority: '',
      resolution: '',
      dateClosed: '',
      timeClosed: '',
    });
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setForm(task);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Task Master</h1>

      <Button onClick={() => setShowForm(true)}>+ Add New Ticket</Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit Task' : 'Add New Task'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="clientName" placeholder="Client Name" value={form.clientName} onChange={handleChange} />
            <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Category</option>
              <option value="Issue">Issue</option>
              <option value="Requirement">Requirement</option>
              <option value="Development">Development</option>
              <option value="Understanding">Understanding</option>
            </select>
            <Input name="raisedBy" placeholder="Raised By" value={form.raisedBy} onChange={handleChange} />
            <Input name="assignedTo" placeholder="Assigned To" value={form.assignedTo} onChange={handleChange} />
            <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Select Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
              <option value="On Hold">On Hold</option>
            </select>
            <select name="priority" value={form.priority} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <Input name="resolution" placeholder="Resolution" value={form.resolution} onChange={handleChange} />
            <Input name="dateClosed" placeholder="Date Closed" value={form.dateClosed} onChange={handleChange} />
            <Input name="timeClosed" placeholder="Time Closed" value={form.timeClosed} onChange={handleChange} />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket No</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Raised By</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Date Raised</TableHead>
                <TableHead>Time Raised</TableHead>
                <TableHead>Date Closed</TableHead>
                <TableHead>Time Closed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.ticketNumber}</TableCell>
                  <TableCell>{t.clientName}</TableCell>
                  <TableCell>{t.location}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.raisedBy}</TableCell>
                  <TableCell>{t.assignedTo}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.priority}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.resolution}</TableCell>
                  <TableCell>{t.dateRaised}</TableCell>
                  <TableCell>{t.timeRaised}</TableCell>
                  <TableCell>{t.dateClosed}</TableCell>
                  <TableCell>{t.timeClosed}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(t.id)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
