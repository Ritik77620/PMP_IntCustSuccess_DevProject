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

type Status = "Running" | "Completed" | "Delayed";

interface Milestone {
  _id: string;
  name: string;
  sequence: number;
}

interface Project {
  _id: string;
  projectCode: string;
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

interface Client {
  id: string;
  clientName: string;
  clientLocation: string;
  gst: string;
  email: string;
  spoc: string;
}

interface MasterProject {
  _id: string;
  projectName: string;
  projectCode: string;
  description: string;
}

const statusColors = {
  Running: "secondary",
  Completed: "default",
  Delayed: "destructive",
} as const;

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [masterProjects, setMasterProjects] = useState<MasterProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Project, "_id">>({
    projectCode: "",
    name: "",
    client: "",
    milestone: "",
    planStart: "",
    planClose: "",
    actualStart: "",
    actualClose: "",
    status: "Running",
    bottleneck: "",
    remark: "",
    progress: 0,
  });

  useEffect(() => {
    if (formData.milestone) {
      const newProgress = calculateProgress(formData.milestone);
      if (formData.progress !== newProgress) {
        setFormData((prev) => ({ ...prev, progress: newProgress }));
      }
    }
  }, [formData.milestone, milestones]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("http://localhost:7001/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("http://localhost:7001/api/clients");
      setClients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMilestones = async () => {
    try {
      const res = await api.get("http://localhost:7001/api/milestones");
      setMilestones(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMasterProjects = async () => {
    try {
      const res = await api.get("http://localhost:7001/api/masterprojects");
      setMasterProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchMilestones();
    fetchMasterProjects();
  }, []);

  const calculateProgress = (selectedMilestoneId: string) => {
    if (!milestones.length) return 0;
    const sorted = [...milestones].sort((a, b) => a.sequence - b.sequence);
    const idx = sorted.findIndex((m) => m._id === selectedMilestoneId);
    if (idx === -1) return 0;
    const sumSelected = sorted.slice(0, idx + 1).reduce((acc, m) => acc + m.sequence, 0);
    const totalSequence = sorted.reduce((acc, m) => acc + m.sequence, 0);
    return totalSequence > 0 ? Math.round((sumSelected / totalSequence) * 100) : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "milestone") {
      const progress = calculateProgress(value);
      setFormData((s) => ({ ...s, milestone: value, progress }));
    } else if (name === "progress") {
      // optional manual input of progress
      const num = Number(value);
      setFormData((s) => ({ ...s, progress: isNaN(num) ? 0 : Math.min(100, Math.max(0, num)) }));
    } else if (name === "status") {
      setFormData((s) => ({ ...s, status: value as Status }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      projectCode: "",
      name: "",
      client: "",
      milestone: "",
      planStart: "",
      planClose: "",
      actualStart: "",
      actualClose: "",
      status: "Running",
      bottleneck: "",
      remark: "",
      progress: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.projectCode ||
        !formData.name ||
        !formData.client ||
        !formData.milestone ||
        !formData.planStart ||
        !formData.planClose
      ) {
        alert("Please fill in required fields: Project Code, Project, Client, Milestone, Plan Start, Plan Close.");
        return;
      }
      if (projects.some((p) => p.projectCode === formData.projectCode && p._id !== editingId)) {
        alert("Project Code must be unique");
        return;
      }
      if (editingId) {
        await api.put(`http://localhost:7001/api/projects/${editingId}`, formData);
      } else {
        await api.post("http://localhost:7001/api/projects", formData);
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
    const clientName = clients.find((c) => c.clientName === project.client)?.clientName || project.client;
    const milestoneName = milestones.find((m) => m._id === project.milestone)?.name || project.milestone;
    alert(
      [
        `Project Code: ${project.projectCode}`,
        `Project: ${project.name}`,
        `Client: ${clientName}`,
        `Milestone: ${milestoneName}`,
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
    const toDateInput = (iso?: string) => (iso ? new Date(iso).toISOString().split("T")[0] : "");
    const progress = calculateProgress(project.milestone); // 🔹 recalc here
    setFormData({
      projectCode: project.projectCode,
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
      progress, // 🔹 use recalculated value instead of DB value
    });
    setEditingId(project._id);
    setOpen(true);
  };


  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`http://localhost:7001/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  const stats = {
    total: projects.length,
    Running: projects.filter((p) => p.status === "Running").length,
    Completed: projects.filter((p) => p.status === "Completed").length,
    Delayed: projects.filter((p) => p.status === "Delayed").length,
  };

  const fmtDateCell = (value: unknown) => {
    const v = value as string | undefined;
    if (!v) return <span>-</span>;
    const d = new Date(v);
    return isNaN(d.getTime()) ? <span>-</span> : <span>{d.toLocaleDateString()}</span>;
  };

  const columns: ColumnDef<Project>[] = [
    { accessorKey: "projectCode", header: "Project Code" },
    { accessorKey: "name", header: "Project" },
    { accessorKey: "client", header: "Client", cell: ({ row }) => row.getValue("client") },
    {
      accessorKey: "milestone",
      header: "Milestone",
      cell: ({ row }) => milestones.find((m) => m._id === row.getValue("milestone"))?.name || row.getValue("milestone"),
    },
    { accessorKey: "planStart", header: "Plan Start Date", cell: ({ row }) => fmtDateCell(row.getValue("planStart")) },
    { accessorKey: "planClose", header: "Plan End Date", cell: ({ row }) => fmtDateCell(row.getValue("planClose")) },
    { accessorKey: "actualStart", header: "Actual Start Date", cell: ({ row }) => fmtDateCell(row.getValue("actualStart")) },
    { accessorKey: "actualClose", header: "Actual End Date", cell: ({ row }) => fmtDateCell(row.getValue("actualClose")) },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        return <Badge variant={statusColors[status]}>{status}</Badge>;
      },
    },
    { accessorKey: "bottleneck", header: "Bottleneck" },
    { accessorKey: "remark", header: "Remark" },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => (
        <div className="space-y-1">
          <span>{row.getValue("progress")}%</span>
          <Progress value={Number(row.getValue("progress"))} className="w-24" />
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
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

      {/* Colorful Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["total", "Running", "Completed", "Delayed"].map((key) => {
          let bgColor = "";
          let progressColor = "";
          switch (key) {
            case "total":
              bgColor = "bg-blue-100 text-blue-800";
              progressColor = "bg-blue-600";
              break;
            case "Running":
              bgColor = "bg-yellow-100 text-yellow-800";
              progressColor = "bg-yellow-600";
              break;
            case "Completed":
              bgColor = "bg-green-100 text-green-800";
              progressColor = "bg-green-600";
              break;
            case "Delayed":
              bgColor = "bg-red-100 text-red-800";
              progressColor = "bg-red-600";
              break;
            default:
              bgColor = "bg-gray-100 text-gray-800";
              progressColor = "bg-gray-600";
          }
          const value = stats[key as keyof typeof stats] || 0;
          const total = stats.total || 1;
          const percentage = Math.min(100, Math.round((value / total) * 100));
          return (
            <Card key={key} className={`${bgColor} shadow-md`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold">{value}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${percentage}%` }}></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>{loading ? <p>Loading...</p> : <DataTable columns={columns} data={projects} />}</CardContent>
      </Card>

      {/* Dialog for Create/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Project" : "Create Project"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Project Code Input */}
            <div className="flex flex-col">
              <Label htmlFor="projectCode" className="mb-2 font-semibold text-sm">Project Code</Label>
              <Input
                id="projectCode"
                type="text"
                name="projectCode"
                value={formData.projectCode}
                onChange={handleChange}
                readOnly={!!editingId}
                className="w-full"
              />
            </div>

            {/* Project Name Dropdown */}
            <div className="flex flex-col">
              <Label htmlFor="projectName" className="mb-2 font-semibold text-sm">Project</Label>
              <select
                id="projectName"
                name="projectName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!!editingId}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-full"
              >
                <option value="">Select Project</option>
                {masterProjects.map((p) => (
                  <option key={p._id} value={p.projectName}>{p.projectName}</option>
                ))}
              </select>
            </div>

            {/* Client Dropdown */}
            <div className="flex flex-col">
              <Label htmlFor="client" className="mb-2 font-semibold text-sm">Client</Label>
              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                disabled={!!editingId}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-full"
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.clientName}>{c.clientName}</option>
                ))}
              </select>
            </div>

            {/* Milestone Dropdown */}
            <div className="flex flex-col">
              <Label htmlFor="milestone" className="mb-2 font-semibold text-sm">Milestone</Label>
              <select
                id="milestone"
                name="milestone"
                value={formData.milestone}
                onChange={handleChange}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-full"
              >
                <option value="">Select Milestone</option>
                {milestones.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Plan Start Date */}
            <div className="flex flex-col">
              <Label htmlFor="planStart" className="mb-2 font-semibold text-sm">Plan Start Date</Label>
              <Input
                id="planStart"
                type="date"
                name="planStart"
                value={formData.planStart}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Plan Close Date */}
            <div className="flex flex-col">
              <Label htmlFor="planClose" className="mb-2 font-semibold text-sm">Plan End Date</Label>
              <Input
                id="planClose"
                type="date"
                name="planClose"
                value={formData.planClose}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Edit-only Fields */}
            {editingId && (
              <>
                <div className="flex flex-col">
                  <Label htmlFor="actualStart" className="mb-2 font-semibold text-sm">Actual Start Date</Label>
                  <Input
                    id="actualStart"
                    type="date"
                    name="actualStart"
                    value={formData.actualStart}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="actualClose" className="mb-2 font-semibold text-sm">Actual End Date</Label>
                  <Input
                    id="actualClose"
                    type="date"
                    name="actualClose"
                    value={formData.actualClose}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="status" className="mb-2 font-semibold text-sm">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-full"
                  >
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>

                {/* Display Progress Bar here instead of input */}
                <div className="flex flex-col">
                  <Label htmlFor="progress" className="mb-2 font-semibold text-sm">Progress</Label>
                  <Progress value={formData.progress} className="w-full" />
                  <span className="text-right text-sm mt-1">{formData.progress}%</span>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="bottleneck" className="mb-2 font-semibold text-sm">Bottleneck</Label>
                  <Input
                    id="bottleneck"
                    name="bottleneck"
                    value={formData.bottleneck}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="remark" className="mb-2 font-semibold text-sm">Remark</Label>
                  <Input
                    id="remark"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>{editingId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
