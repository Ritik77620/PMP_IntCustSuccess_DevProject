import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Calendar } from "lucide-react";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Project {
  _id: string;
  name: string;
  client: string;
  siteName: string;
  projectManager: string;
  status: "active" | "planning" | "completed" | "on_hold";
  progress: number;
  endDate: string;
}

const statusColors = {
  active: "default",
  planning: "secondary",
  completed: "outline",
  on_hold: "destructive",
} as const;

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    siteName: "",
    projectManager: "",
    status: "active",
    progress: 0,
    endDate: "",
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.put(`/api/projects/${editingId}`, formData);
      } else {
        await api.post("/api/projects", formData);
      }
      setFormData({ name:"", client:"", siteName:"", projectManager:"", status:"active", progress:0, endDate:"" });
      setEditingId(null);
      setOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  const handleView = (project: Project) => {
    alert(
      `Project Details:\nName: ${project.name}\nClient: ${project.client}\nSite: ${project.siteName}\nManager: ${project.projectManager}\nStatus: ${project.status}\nProgress: ${project.progress}%\nDue: ${new Date(project.endDate).toLocaleDateString()}`
    );
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      client: project.client,
      siteName: project.siteName,
      projectManager: project.projectManager,
      status: project.status,
      progress: project.progress,
      endDate: project.endDate.split("T")[0],
    });
    setEditingId(project._id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    completed: projects.filter(p => p.status === "completed").length,
    planning: projects.filter(p => p.status === "planning").length,
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Project Name",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-sm text-muted-foreground">{row.original.client}</p>
        </div>
      ),
    },
    { accessorKey: "siteName", header: "Site" },
    { accessorKey: "projectManager", header: "Manager" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        return <Badge variant={statusColors[status]}>{status.replace("_", " ")}</Badge>;
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => (
        <div className="space-y-1">
          <span>{row.getValue("progress")}%</span>
          <Progress value={row.getValue("progress")} className="w-16" />
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: "Due Date",
      cell: ({ row }) => <span>{new Date(row.getValue("endDate")).toLocaleDateString()}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row.original)}>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header + New Project Button */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your projects</p>
        </div>

        <Button onClick={() => { setOpen(true); setEditingId(null); }}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["total","active","planning","completed"].map((key) => (
          <Card key={key}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{key.replace("_"," ")}</p>
              <p className="text-2xl font-bold">{stats[key as keyof typeof stats]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader><CardTitle>All Projects</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : <DataTable columns={columns} data={projects} />}
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit Project */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Project" : "Create Project"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {["name","client","siteName","projectManager"].map((field) => (
              <div key={field} className="grid gap-2">
                <Label>{field[0].toUpperCase()+field.slice(1)}</Label>
                <Input name={field} value={formData[field as keyof typeof formData]} onChange={handleChange} />
              </div>
            ))}
            <div className="grid gap-2">
              <Label>Status</Label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="planning">Planning</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Progress</Label>
              <Input type="number" name="progress" value={formData.progress} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>{editingId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
