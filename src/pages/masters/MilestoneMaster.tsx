import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Milestone {
  _id?: string;
  name: string;
  sequence: string;
}

export function MilestoneMaster() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [form, setForm] = useState<Milestone>({ name: '', sequence: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch milestones
  const fetchMilestones = async () => {
    const res = await fetch('http://localhost:5000/api/milestones');
    const data = await res.json();
    setMilestones(data);
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name) return alert('Name is required');

    if (editId) {
      // Update milestone
      await fetch(`http://localhost:5000/api/milestones/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      // Create milestone
      await fetch('http://localhost:5000/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }

    setForm({ name: '', sequence: '' });
    setEditId(null);
    setShowForm(false);
    fetchMilestones();
  };

  const handleEdit = (milestone: Milestone) => {
    setForm({ name: milestone.name, sequence: milestone.sequence });
    setEditId(milestone._id!);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`http://localhost:5000/api/milestones/${id}`, { method: 'DELETE' });
    fetchMilestones();
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Milestone Master</h1>
      <Button onClick={() => setShowForm(true)}>+ Add New Milestone</Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editId ? 'Edit Milestone' : 'Add New Milestone'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <Input name="sequence" placeholder="Sequence" value={form.sequence} onChange={handleChange} />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => { setShowForm(false); setForm({ name: '', sequence: '' }); setEditId(null); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Milestones List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sequence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((m) => (
                <TableRow key={m._id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.sequence}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(m)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(m._id!)}>Delete</Button>
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
