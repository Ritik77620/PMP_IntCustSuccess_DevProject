import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  name: string;
  userId: string;
  passCode: string;
  role: 'Write' | 'View';
  email: string;
}

export function UserMaster() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<User>({
    id: '',
    name: '',
    userId: '',
    passCode: '',
    role: 'View',
    email: '',
  });

  const [showForm, setShowForm] = useState(false); // Control form visibility

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('users');
    if (stored) setUsers(JSON.parse(stored));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: 'Write' | 'View') => {
    setForm({ ...form, role: value });
  };

  const handleSave = () => {
    if (!form.name || !form.userId) return;

    if (form.id) {
      setUsers(users.map(u => (u.id === form.id ? form : u)));
    } else {
      setUsers([...users, { ...form, id: Date.now().toString() }]);
    }

    setForm({ id: '', name: '', userId: '', passCode: '', role: 'View', email: '' });
    setShowForm(false); // Hide form after saving
  };

  const handleEdit = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setForm(user);
      setShowForm(true); // Show form when editing
    }
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">User Master</h1>

      {/* Button to open the Add New User form */}
      <Button onClick={() => setShowForm(true)}>+ Add New User</Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit User' : 'Add New User'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <Input name="userId" placeholder="User ID" value={form.userId} onChange={handleChange} />
            <Input name="passCode" placeholder="PassCode" value={form.passCode} onChange={handleChange} />
            <Select value={form.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Write">Write</SelectItem>
                <SelectItem value="View">View</SelectItem>
              </SelectContent>
            </Select>
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>PassCode</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.userId}</TableCell>
                  <TableCell>{u.passCode}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(u.id)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>Delete</Button>
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
