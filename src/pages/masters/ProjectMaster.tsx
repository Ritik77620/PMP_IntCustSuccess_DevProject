import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Project {
  id: string;
  projectName: string;
  projectCode: string;
  projectDescription: string;
}

export function ProjectMaster() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({
    id: '',
    projectName: '',
    projectCode: '',
    projectDescription: '',
  });

  const [showForm, setShowForm] = useState(false); // Control form visibility

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('projects');
    if (stored) setProjects(JSON.parse(stored));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.projectName) return;

    if (form.id) {
      setProjects(projects.map(p => (p.id === form.id ? form : p)));
    } else {
      setProjects([...projects, { ...form, id: Date.now().toString() }]);
    }

    setForm({ id: '', projectName: '', projectCode: '', projectDescription: '' });
    setShowForm(false); // Hide form after saving
  };

  const handleEdit = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setForm(project);
      setShowForm(true); // Show form when editing
    }
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Project Master</h1>

      {/* Button to open the Add New Project form */}
      <Button onClick={() => setShowForm(true)}>+ Add New Project</Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit Project' : 'Add New Project'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="projectName" placeholder="Project Name" value={form.projectName} onChange={handleChange} />
            <Input name="projectCode" placeholder="Project Code" value={form.projectCode} onChange={handleChange} />
            <Input name="projectDescription" placeholder="Project Description" value={form.projectDescription} onChange={handleChange} />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.projectName}</TableCell>
                  <TableCell>{p.projectCode}</TableCell>
                  <TableCell>{p.projectDescription}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(p.id)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
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
