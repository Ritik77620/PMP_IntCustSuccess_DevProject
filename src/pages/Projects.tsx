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
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "active" | "planning" | "completed" | "on_hold";

interface Project {
  _id: string;
  name: string;
  client: string;
  milestone: string;
  planStart: string;
  planClose: string;
  actualStart?: string;
  actualClose?: string;
  status: Status;
  bottleneck?: string;
  remark?: string;
  progress: number;
}

interface DropdownItem {
  _id: string;
  name: string;
}

interface Client {
  id: string;
  clientName: string;
}

const statusColors = {
  active: "default",
  planning: "secondary",
  completed: "outline",
  on_hold: "destructive",
} as const;

// Colors for stats cards
const statsColors: Record<string, string> = {
  total: "bg-gray-200 text-gray-800",
  active: "bg-green-200 text-green-800",
  planning: "bg-yellow-200 text-yellow-800",
  completed: "bg-blue-200 text-blue-800",
};

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [masterProjects, setMasterProjects] = useState<DropdownItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [milestones, setMilestones] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Project, "_id">>({
    name: "",
    client: "",
    milestone: "",
    planStart: "",
    planClose: "",
    actualStart: "",
    actualClose: "",
    status: "active",
    bottleneck: "",
    remark: "",
    progress: 0,
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

  const fetchClients = async () => {
    try {
      const res = await api.get("/api/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Clients fetch error:", err);
    }
  };

  const fetchMilestones = async () => {
    try {
      const res = await api.get("/api/milestones");
      setMilestones(res.data);
    } catch (err) {
      console.error("Milestones fetch error:", err);
    }
  };

  const fetchMasterProjects = async () => {
    try {
      const res = await api.get("/api/masterprojects");
      setMasterProjects(res.data);
    } catch (err) {
      console.error("Master Projects fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchMilestones();
    fetchMasterProjects();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "progress") {
      const num = Number(value);
      setFormData((s) => ({
        ...s,
        progress: isNaN(num) ? 0 : Math.min(100, Math.max(0, num)),
      }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      client: "",
      milestone: "",
      planStart: "",
      planClose: "",
      actualStart: "",
      actualClose: "",
      status: "active",
      bottleneck: "",
      remark: "",
      progress: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.client || !formData.milestone || !formData.planStart || !formData.planClose) {
        alert("Please fill required fields.");
        return;
      }
      if (editingId) {
        await api.put(`/api/projects/${editingId}`, formData);
      } else {
        await api.post("/api/projects", formData);
      }
      resetForm();
      setEditingId(null);
      setOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  const handleView = (project: Project) => {
    const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString() : "-");
    alert(
      [
        `Project:${masterProjects.find(p => p._id === project.name)?.name || project.name}`,
        `Client: ${clients.find(c => c.id === project.client)?.clientName || project.client}`,
        `Milestone: ${project.milestone}`,
        `Plan Start: ${fmt(project.planStart)}`,
        `Plan Close: ${fmt(project.planClose)}`,
        `Actual Start: ${fmt(project.actualStart)}`,
        `Actual Close: ${fmt(project.actualClose)}`,
        `Status: ${project.status}`,
        `Bottleneck: ${project.bottleneck || "-"}`,
        `Remark: ${project.remark || "-"}`,
        `Progress: ${project.progress}%`,
      ].join("\n")
    );
  };

  const handleEdit = (project: Project) => {
    const toDateInput = (iso?: string) => iso ? new Date(iso).toISOString().split("T")[0] : "";
    setFormData({
      name: project.name,
      client: project.client,
      milestone: project.milestone,
      planStart: toDateInput(project.planStart),
      planClose: toDateInput(project.planClose),
      actualStart: toDateInput(project.actualStart),
      actualClose: toDateInput(project.actualClose),
      status: project.status,
      bottleneck: project.bottleneck || "",
      remark: project.remark || "",
      progress: project.progress,
    });
    setEditingId(project._id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
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
    planning: projects.filter(p => p.status === "planning").length,
    completed: projects.filter(p => p.status === "completed").length,
  };

  const fmtDateCell = (value: unknown) => {
    const v = value as string | undefined;
    if (!v) return <span>-</span>;
    const d = new Date(v);
    return isNaN(d.getTime()) ? <span>-</span> : <span>{d.toLocaleDateString()}</span>;
  };

  const columns: ColumnDef<Project>[] = [
    { accessorKey: "name", header: "Project" },
    { accessorKey: "client", header: "Client", cell: ({ row }) => clients.find(c => c.id === row.getValue("client"))?.clientName || row.getValue("client") },
    { accessorKey: "milestone", header: "Milestone" },
    { accessorKey: "planStart", header: "Plan Start", cell: ({ row }) => fmtDateCell(row.getValue("planStart")) },
    { accessorKey: "planClose", header: "Plan Close", cell: ({ row }) => fmtDateCell(row.getValue("planClose")) },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={statusColors[row.getValue("status") as Status]}>{row.getValue("status")}</Badge> },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const value = row.getValue("progress") as number;
        return (
          <div className="relative w-24">
            <Progress value={value} className="w-full" />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {value}%
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row.original)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your projects</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingId(null); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key} className={`${statsColors[key] || "bg-gray-200 text-gray-800"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{key.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>All Projects</CardTitle></CardHeader>
        <CardContent>{loading ? <p>Loading...</p> : <DataTable columns={columns} data={projects} />}</CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Project" : "Create Project"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Form Fields (unchanged) */}
            ...
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>{editingId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
