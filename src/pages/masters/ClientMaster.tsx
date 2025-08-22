import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Client {
  id: string;
  clientName: string;
  clientLocation: string;
  gst: string;
  email: string;
  spoc: string;
}

export function ClientMaster() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<Client>({
    id: '',
    clientName: '',
    clientLocation: '',
    gst: '',
    email: '',
    spoc: '',
  });

  const [showForm, setShowForm] = useState(false); // Control form visibility

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('clients');
    if (stored) setClients(JSON.parse(stored));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.clientName) return;

    if (form.id) {
      setClients(clients.map(c => (c.id === form.id ? form : c)));
    } else {
      setClients([...clients, { ...form, id: Date.now().toString() }]);
    }

    setForm({ id: '', clientName: '', clientLocation: '', gst: '', email: '', spoc: '' });
    setShowForm(false); // Hide form after saving
  };

  const handleEdit = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      setForm(client);
      setShowForm(true); // Show form when editing
    }
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Client Master</h1>

      {/* Button to open the Add New Client form */}
      <Button onClick={() => setShowForm(true)}>+ Add New Client</Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit Client' : 'Add New Client'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="clientName" placeholder="Client Name" value={form.clientName} onChange={handleChange} />
            <Input name="clientLocation" placeholder="Client Location" value={form.clientLocation} onChange={handleChange} />
            <Input name="gst" placeholder="GST" value={form.gst} onChange={handleChange} />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <Input name="spoc" placeholder="SPOC" value={form.spoc} onChange={handleChange} />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clients List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SPOC</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.clientName}</TableCell>
                  <TableCell>{c.clientLocation}</TableCell>
                  <TableCell>{c.gst}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.spoc}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(c.id)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>Delete</Button>
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
