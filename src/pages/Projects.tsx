import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Calendar } from "lucide-react";
import api from "@/lib/api";
import {
  Dialog, 
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [open, setOpen] = useState(false); // Dialog open/close
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
      await api.post("/api/projects", formData);
      setFormData({
        name: "",
        client: "",
        siteName: "",
        projectManager: "",
        status: "active",
        progress: 0,
        endDate: "",
      });
      setOpen(false); // close dialog
      fetchProjects(); // refresh table
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project");
    }
  };

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    planning: projects.filter((p) => p.status === "planning").length,
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
          <div className="flex items-center justify-between text-sm">
            <span>{row.getValue("progress")}%</span>
          </div>
          <Progress value={row.getValue("progress")} className="w-16" />
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: "Due Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDate"));
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{date.toLocaleDateString()}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header + New Project Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your projects</p>
        </div>

        {/* Dialog for creating project */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Project Name</Label>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label>Client</Label>
                <Input name="client" value={formData.client} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label>Site Name</Label>
                <Input name="siteName" value={formData.siteName} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label>Manager</Label>
                <Input name="projectManager" value={formData.projectManager} onChange={handleChange} />
              </div>
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
              <Button type="button" onClick={handleSubmit}>
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="transition-smooth hover:shadow-glow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-glow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-accent">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-glow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planning</p>
                <p className="text-2xl font-bold text-warning">{stats.planning}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-glow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-primary">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading projects...</p>
            ) : (
              <DataTable columns={columns} data={projects} searchKey="name" searchPlaceholder="Search projects..." />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
