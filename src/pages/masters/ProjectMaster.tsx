"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/config/apiConfig";

interface Project {
  _id?: string;
  projectName: string;
  description: string;
}

const normalizeProject = (p: any): Project => ({
  _id: p._id,
  projectName: p.projectName ?? p.name ?? p.project_name ?? "",
  description: p.description ?? p.projectDescription ?? "",
});

export function ProjectMaster() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({ projectName: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.masterProjects);
      const sortedProjects = res.data
        .map(normalizeProject)
        .sort((a: Project, b: Project) => a.projectName.localeCompare(b.projectName));
      setProjects(sortedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.projectName) return;

    try {
      let res;
      const payload = { projectName: form.projectName, description: form.description };
      if (form._id) {
        res = await api.put(API_ENDPOINTS.masterProjectById(form._id), payload);
      } else {
        res = await api.post(API_ENDPOINTS.masterProjects, payload);
      }

      const projectData = normalizeProject(res.data);

      setProjects((prev) => {
        const updatedProjects = form._id
          ? prev.map((p) => (p._id === projectData._id ? projectData : p))
          : [...prev, projectData];
        return updatedProjects.sort((a, b) => a.projectName.localeCompare(b.projectName));
      });

      setForm({ projectName: "", description: "" });
      setShowForm(false);
    } catch (err: any) {
      console.error("Error saving project:", err.response?.data || err.message || err);
      alert("Failed to save project: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p._id === id);
    if (project) {
      setForm(project);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(API_ENDPOINTS.masterProjectById(id));
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Project Master</h1>

      <Button onClick={() => setShowForm(true)}>+ Add New Project</Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form._id ? "Edit Project" : "Add New Project"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="projectName" placeholder="Project Name" value={form.projectName} onChange={handleChange} />
            <Input name="description" placeholder="Project Description" value={form.description} onChange={handleChange} />
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
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.projectName || "-"}</TableCell>
                  <TableCell>{p.description || "-"}</TableCell>
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
