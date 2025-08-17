import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Milestone {
  id: string;
  milestoneId: string;
  name: string;
  sequence: string;
}

export function MilestoneMaster() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [form, setForm] = useState<Milestone>({
    id: '',
    milestoneId: '',
    name: '',
    sequence: '',
  });

  const [showForm, setShowForm] = useState(false); // Control form visibility

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('milestones');
    if (stored) setMilestones(JSON.parse(stored));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('milestones', JSON.stringify(milestones));
  }, [milestones]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.milestoneId || !form.name) return;

    if (form.id) {
      setMilestones(milestones.map(m => (m.id === form.id ? form : m)));
    } else {
      setMilestones([...milestones, { ...form, id: Date.now().toString() }]);
    }

    setForm({ id: '', milestoneId: '', name: '', sequence: '' });
    setShowForm(false); // Hide form after saving
  };

  const handleEdit = (id: string) => {
    const milestone = milestones.find(m => m.id === id);
    if (milestone) {
      setForm(milestone);
      setShowForm(true); // Show form when editing
    }
  };

  const handleDelete = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Milestone Master</h1>

      {/* Button to open the Add New Milestone form */}
      <Button onClick={() => setShowForm(true)}>+ Add New Milestone</Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit Milestone' : 'Add New Milestone'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="milestoneId" placeholder="Milestone ID" value={form.milestoneId} onChange={handleChange} />
            <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <Input name="sequence" placeholder="Sequence" value={form.sequence} onChange={handleChange} />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestones Table */}
      <Card>
        <CardHeader>
          <CardTitle>Milestones List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sequence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.milestoneId}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.sequence}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(m.id)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(m.id)}>Delete</Button>
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
