import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
  id: string;
  taskId: string;
  taskName: string;
  taskDescription: string;
  assignedTo: string;
  dueDate: string;
  status: string;
}

export function TaskMaster() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<Task>({
    id: '',
    taskId: '',
    taskName: '',
    taskDescription: '',
    assignedTo: '',
    dueDate: '',
    status: 'Pending',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setForm({ ...form, status: value });
  };

  const handleSave = () => {
    if (!form.taskId || !form.taskName) return;

    if (form.id) {
      setTasks(tasks.map((t) => (t.id === form.id ? form : t)));
    } else {
      setTasks([...tasks, { ...form, id: Date.now().toString() }]);
    }

    setForm({
      id: '',
      taskId: '',
      taskName: '',
      taskDescription: '',
      assignedTo: '',
      dueDate: '',
      status: 'Pending',
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

      {/* Button to open Add Task Form */}
      <Button onClick={() => setShowForm(true)}>+ Add New Task</Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit Task' : 'Add New Task'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="taskId" placeholder="Task ID" value={form.taskId} onChange={handleChange} />
            <Input name="taskName" placeholder="Task Name" value={form.taskName} onChange={handleChange} />
            <Input name="taskDescription" placeholder="Task Description" value={form.taskDescription} onChange={handleChange} />
            <Input name="assignedTo" placeholder="Assigned To" value={form.assignedTo} onChange={handleChange} />
            <Input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            <Select value={form.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.taskId}</TableCell>
                  <TableCell>{t.taskName}</TableCell>
                  <TableCell>{t.taskDescription}</TableCell>
                  <TableCell>{t.assignedTo}</TableCell>
                  <TableCell>{t.dueDate}</TableCell>
                  <TableCell>{t.status}</TableCell>
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
