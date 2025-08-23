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
  name: string;          // Project
  client: string;        // Client
  milestone: string;     // Milestone
  planStart: string;     // Plan Start (ISO string)
  planClose: string;     // Plan Close (ISO string)
  actualStart?: string;   // Actual Start (ISO string) optional
  actualClose?: string;   // Actual Close (ISO string) optional
  status: Status;        // Status
  bottleneck?: string;    // Bottleneck optional
  remark?: string;        // Remark optional
  progress: number;       // Progress 0-100
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

  useEffect(() => {
    fetchProjects();
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
    } else if (name === "status") {
      setFormData((s) => ({ ...s, status: value as Status }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const resetForm = () =>
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

  const handleSubmit = async () => {
    try {
      if (
        !formData.name ||
        !formData.client ||
        !formData.milestone ||
        !formData.planStart ||
        !formData.planClose
      ) {
        alert(
          "Please fill in required fields: Project, Client, Milestone, Plan Start, Plan Close."
        );
        return;
      }

      // Sending formData as-is; actualStart, actualClose, bottleneck, remark can be empty strings
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
        `Project: ${project.name}`,
        `Client: ${project.client}`,
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
    const toDateInput = (iso?: string) =>
      iso ? new Date(iso).toISOString().split("T")[0] : "";

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
    active: projects.filter((p) => p.status === "active").length,
    planning: projects.filter((p) => p.status === "planning").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  const fmtDateCell = (value: unknown) => {
    const v = value as string | undefined;
    if (!v) return <span>-</span>;
    const d = new Date(v);
    return isNaN(d.getTime()) ? <span>-</span> : <span>{d.toLocaleDateString()}</span>;
  };

  const columns: ColumnDef<Project>[] = [
    { accessorKey: "name", header: "Project" },
    { accessorKey: "client", header: "Client" },
    { accessorKey: "milestone", header: "Milestone" },
    {
      accessorKey: "planStart",
      header: "Plan Start",
      cell: ({ row }) => fmtDateCell(row.getValue("planStart")),
    },
    {
      accessorKey: "planClose",
      header: "Plan Close",
      cell: ({ row }) => fmtDateCell(row.getValue("planClose")),
    },
    {
      accessorKey: "actualStart",
      header: "Actual Start",
      cell: ({ row }) => fmtDateCell(row.getValue("actualStart")),
    },
    {
      accessorKey: "actualClose",
      header: "Actual Close",
      cell: ({ row }) => fmtDateCell(row.getValue("actualClose")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Status;
        return <Badge variant={statusColors[status]}>{status.replace("_", " ")}</Badge>;
      },
    },
    { accessorKey: "bottleneck", header: "Bottleneck" },
    { accessorKey: "remark", header: "Remark" },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const val = Number(row.getValue("progress") ?? 0);
        return (
          <div className="space-y-1">
            <span>{val}%</span>
            <Progress value={val} className="w-24" />
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
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open row actions">
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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
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
        {[
          { key: "total", label: "Total" },
          { key: "active", label: "Active" },
          { key: "planning", label: "Planning" },
          { key: "completed", label: "Completed" },
        ].map(({ key, label }) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats[key as keyof typeof stats]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>{loading ? <p>Loading...</p> : <DataTable columns={columns} data={projects} />}</CardContent>
      </Card>

      {/* Project Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Project" : "Create Project"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Project, Client, Milestone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["name", "client", "milestone"].map((field) => (
                <div key={field} className="grid gap-2">
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input id={field} name={field} value={(formData as any)[field] ?? ""} onChange={handleChange} />
                </div>
              ))}
            </div>

            {/* Plan Start, Plan Close */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="planStart">Plan Start</Label>
                <Input id="planStart" type="date" name="planStart" value={formData.planStart} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="planClose">Plan Close</Label>
                <Input id="planClose" type="date" name="planClose" value={formData.planClose} onChange={handleChange} />
              </div>
            </div>

            {/* Actual Start, Actual Close (optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="actualStart">Actual Start</Label>
                <Input id="actualStart" type="date" name="actualStart" value={formData.actualStart} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="actualClose">Actual Close</Label>
                <Input id="actualClose" type="date" name="actualClose" value={formData.actualClose} onChange={handleChange} />
              </div>
            </div>

            {/* Status, Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="active">Active</option>
                  <option value="planning">Planning</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input id="progress" type="number" min={0} max={100} name="progress" value={formData.progress} onChange={handleChange} />
              </div>
            </div>

            {/* Bottleneck and Remark (optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bottleneck">Bottleneck</Label>
                <Input id="bottleneck" name="bottleneck" value={formData.bottleneck} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="remark">Remark</Label>
                <Input id="remark" name="remark" value={formData.remark} onChange={handleChange} />
              </div>
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
