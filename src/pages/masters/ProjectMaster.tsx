import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Project {
  _id?: string;
  projectName: string;
  projectCode: string;
  description: string;
}

export function ProjectMaster() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({
    projectName: '',
    projectCode: '',
    description: '',
  });

  const [showForm, setShowForm] = useState(false);

  // Fetch projects from backend
  useEffect(() => {
    fetch('http://localhost:5001/api/masterprojects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Error fetching projects:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.projectName || !form.projectCode) return;

    if (form._id) {
      // Update project
      const res = await fetch(`http://localhost:5001/api/masterprojects/${form._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setProjects(projects.map((p) => (p._id === updated._id ? updated : p)));
    } else {
      // Create project
      const res = await fetch('http://localhost:5001/api/masterprojects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const newProject = await res.json();
      setProjects([...projects, newProject]);
    }

    setForm({ projectName: '', projectCode: '', description: '' });
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p._id === id);
    if (project) {
      setForm(project);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5001/api/masterprojects/${id}`, {
      method: 'DELETE',
    });
    setProjects(projects.filter((p) => p._id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Project Master</h1>

      <Button onClick={() => setShowForm(true)}>+ Add New Project</Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form._id ? 'Edit Project' : 'Add New Project'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              name="projectName" 
              placeholder="Project Name" 
              value={form.projectName} 
              onChange={handleChange} 
            />
            <Input 
              name="projectCode" 
              placeholder="Project Code" 
              value={form.projectCode} 
              onChange={handleChange} 
            />
            <Input 
              name="description" 
              placeholder="Project Description" 
              value={form.description} 
              onChange={handleChange} 
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                <TableRow key={p._id}>
                  <TableCell>{p.projectName}</TableCell>
                  <TableCell>{p.projectCode}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(p._id!)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id!)}>Delete</Button>
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
