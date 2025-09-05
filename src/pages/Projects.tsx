import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/config/apiConfig";
import api from "@/lib/api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Status = "Running" | "Completed" | "Delayed" | "On Hold";


interface Milestone {
  _id: string;
  name: string;
  sequence: number;
}

interface Project {
  _id: string;
  project: string;
  projectCode: string;
  name: string;
  client: string;
  clientLocation: string;   // ✅ new
  unit: string;             // ✅ new
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

interface Unit {
  _id: string;
  unitName: string;
}

interface Location {
  _id: string;
  locationName: string;
  spoc?: string;
  units: Unit[];
}

interface Client {
  _id: string;
  clientName: string;
  gst?: string;
  email: string;
  locations: Location[];
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
  const [clients, setClients] = useState<any[]>([]);
  const [clientLocations, setClientLocations] = useState<{ _id: string; name: string }[]>([]);
  const [units, setUnits] = useState<{ _id: string; name: string }[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [masterProjects, setMasterProjects] = useState<MasterProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Project, "_id">>({
    project: "",
    projectCode: "",
    name: "",
    client: "",
    clientLocation: "",   // ✅
    unit: "",             // ✅
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
    const fetchMasters = async () => {
      try {
        const [projectsRes, clientsRes, milestonesRes] = await Promise.all([
          fetch(API_ENDPOINTS.masterProjects),
          fetch(API_ENDPOINTS.clients),
          fetch(API_ENDPOINTS.milestones),
        ]);

        const [projectsData, clientsData, milestonesData] = await Promise.all([
          projectsRes.json(),
          clientsRes.json(),
          milestonesRes.json(),
        ]);

        setMasterProjects(projectsData);
        setClients(clientsData);
        setMilestones(milestonesData);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };

    fetchMasters();
  }, []);
  // Progress recalculation when milestone changes
  useEffect(() => {
    if (formData.milestone) {
      const newProgress = calculateProgress(formData.milestone);
      if (formData.progress !== newProgress) {
        setFormData((prev) => ({ ...prev, progress: newProgress }));
      }
    }
  }, [formData.milestone, milestones]);

  // Fetch Data
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.projects);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.clients);
      setClients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMilestones = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.milestones);
      setMilestones(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMasterProjects = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.masterProjects);
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

  const updateStatus = (planClose?: string, actualClose?: string): Status => {
    const today = new Date();
    const plan = planClose ? new Date(planClose) : null;
    const actual = actualClose ? new Date(actualClose) : null;

    if (plan && !actual && plan < today) return "Delayed";
    if (actual) return "Completed";
    return "Running";
  };

  const calculateProgress = (selectedMilestoneId: string) => {
    if (!milestones.length) return 0;
    const sorted = [...milestones].sort((a, b) => a.sequence - b.sequence);
    const idx = sorted.findIndex((m) => m._id === selectedMilestoneId);
    if (idx === -1) return 0;
    const sumSelected = sorted.slice(0, idx + 1).reduce((acc, m) => acc + m.sequence, 0);
    const totalSequence = sorted.reduce((acc, m) => acc + m.sequence, 0);
    return totalSequence > 0 ? Math.round((sumSelected / totalSequence) * 100) : 0;
  };


  const generateProjectCode = (clientName: string, projectType: string, serial?: number) => {
    if (!clientName || !projectType) return "";
    // Take first 3 letters of client and project type, uppercased
    const clientPart = clientName.substring(0, 3).toUpperCase();
    const typePart = projectType.substring(0, 3).toUpperCase();
    const serialPart = serial !== undefined ? serial.toString().padStart(3, "0") : "001";
    return `${clientPart}-${typePart}-${serialPart}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // Only auto-generate project code for new projects
      if (!editingId && (name === "client" || name === "name")) {
        updated.projectCode = generateProjectCode(
          name === "client" ? value : prev.client,
          name === "name" ? value : prev.name
        );
      }

      // Auto update status if planClose or actualClose changes
      if (name === "planClose" || name === "actualClose") {
        updated.status = updateStatus(updated.planClose, updated.actualClose);
      }

      // Handle milestone change
      if (name === "milestone") {
        updated.progress = calculateProgress(value);
      }

      // Ensure progress stays valid
      if (name === "progress") {
        const num = Number(value);
        updated.progress = isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
      }

      return updated;
    });
  };




  const calculateElapsedDays = (planClose?: string) => {
    if (!planClose) return "-";

    const today = new Date();
    const end = new Date(planClose);

    // Zero out the time to compare dates only
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    if (endUTC > todayUTC) return "-"; // future date

    const diffDays = Math.floor((todayUTC - endUTC) / (1000 * 60 * 60 * 24));
    return diffDays;
  };



  const resetForm = () => {
    setFormData({
      project: "",
      projectCode: "",
      name: "",
      client: "",
      clientLocation: "",   // ✅
      unit: "",             // ✅
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
      if (!formData.project || !formData.name || !formData.client || !formData.milestone || !formData.planStart || !formData.planClose) {
        alert("Please fill in required fields: Project, Project Type, Client, Milestone, Plan Start, Plan Close.");
        return;
      }

      // Auto-generate Project Code if not editing
      if (!editingId && !formData.projectCode) {
        const serial = projects.length + 1; // simple increment, you can enhance with backend count
        formData.projectCode = generateProjectCode(formData.client, formData.name, serial);
      }

      if (editingId) {
        await api.put(API_ENDPOINTS.projectById(editingId), formData);
      } else {
        await api.post(API_ENDPOINTS.projects, formData);
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
    const fmt = (d?: string) => (d ? new Date(d).toISOString().split("T")[0] : "-");
    const clientName = clients.find((c) => c.clientName === project.client)?.clientName || project.client;
    const milestoneName = milestones.find((m) => m._id === project.milestone)?.name || project.milestone;
    alert(
      [
        `Project Code: ${project.projectCode}`,
        `Project Type: ${project.name}`,
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
    const toDateInput = (iso?: string) =>
      iso ? new Date(iso).toISOString().split("T")[0] : "";

    const progress = calculateProgress(project.milestone);

    setFormData({
      project: project.project,
      projectCode: project.projectCode,
      name: project.name,
      client: project.client,
      clientLocation: project.clientLocation || "",   // ✅
      unit: project.unit || "",                       // ✅
      milestone: project.milestone,
      planStart: toDateInput(project.planStart),
      planClose: toDateInput(project.planClose),
      actualStart: toDateInput(project.actualStart),
      actualClose: toDateInput(project.actualClose),
      status: project.status,
      bottleneck: project.bottleneck || "",
      remark: project.remark || "",
      progress,
    });
    setEditingId(project._id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(API_ENDPOINTS.projectById(id));
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
    OnHold: projects.filter((p) => p.status === "On Hold").length,
  };

  const fmtDateCell = (value: unknown) => {
    const v = value as string | undefined;
    if (!v) return <span>-</span>;
    const d = new Date(v);
    if (isNaN(d.getTime())) return <span>-</span>;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return <span>{`${year}-${month}-${day}`}</span>;
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "projectCode", header: () => (
        <div className="">
          PROJECT CODE
        </div>
      )
    },
    {
      accessorKey: "project",
      header: "PROJECT",
      cell: ({ row, getValue }) => {
        const projectId = row.original._id;
        const projectTitle = getValue<string>();
        return (
          <Link
            to={`/projects/${projectId}`}
            className="text-black hover:text-blue-600 hover:underline"
          >
            {projectTitle}
          </Link>
        );
      },
    },
    {
      accessorKey: "name",
      header: "PROJECT TYPE",
    },
    { accessorKey: "client", header: "CLIENT" },
    { accessorKey: "clientLocation", header: "CLIENT LOCATION" },
    { accessorKey: "unit", header: "UNIT" },
    {
      accessorKey: "milestone",
      header: "MILESTONE",
      cell: ({ row }) => milestones.find((m) => m._id === row.getValue("milestone"))?.name || row.getValue("milestone"),
    },
    { accessorKey: "planStart", header: "PLAN START DATE", cell: ({ row }) => fmtDateCell(row.getValue("planStart")) },
    { accessorKey: "planClose", header: "PLAN END DATE", cell: ({ row }) => fmtDateCell(row.getValue("planClose")) },
    { accessorKey: "actualStart", header: "ACTUAL START DATE", cell: ({ row }) => fmtDateCell(row.getValue("actualStart")) },
    { accessorKey: "actualClose", header: "ACTUAL END DATE", cell: ({ row }) => fmtDateCell(row.getValue("actualClose")) },
    {
      accessorKey: "elapsedDays",
      header: "ELAPSED DAYS",
      cell: ({ row }) => {
        const planClose = row.getValue("planClose") as string | undefined;
        return <span>{calculateElapsedDays(planClose)}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        return <Badge variant={statusColors[status]}>{status}</Badge>;
      },
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
            {/* ❌ Removed Edit option */}
            <DropdownMenuItem
              onClick={() => handleDelete(row.original._id)}
              className="text-destructive"
            >
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {["total", "Running", "Completed", "Delayed", "OnHold"].map((key) => {
          let bgColor = "", progressColor = "";
          switch (key) {
            case "total": bgColor = "bg-blue-100 text-blue-800"; progressColor = "bg-blue-600"; break;
            case "Running": bgColor = "bg-yellow-100 text-yellow-800"; progressColor = "bg-yellow-600"; break;
            case "Completed": bgColor = "bg-green-100 text-green-800"; progressColor = "bg-green-600"; break;
            case "Delayed": bgColor = "bg-red-100 text-red-800"; progressColor = "bg-red-600"; break;
            case "OnHold":
              bgColor = "bg-purple-100 text-purple-800";
              progressColor = "bg-purple-600";
              break;
            default: bgColor = "bg-gray-100 text-gray-800"; progressColor = "bg-gray-600";
          }
          const value = stats[key as keyof typeof stats] || 0;
          const total = stats.total || 1;
          const percentage = Math.min(100, Math.round((value / total) * 100));
          return (
            <Card key={key} className={`${bgColor} shadow-md`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{key.toUpperCase()}</CardTitle>
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

      {/* Projects Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>PROJECTS</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Tabs defaultValue="all" className="w-full ">
              <TabsList className="grid grid-cols-6 gap-2 bg-blue-600 text-white">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="projectDelayed">Project Delayed</TabsTrigger>
                <TabsTrigger value="milestoneDelayed">Milestone Delayed</TabsTrigger>
                <TabsTrigger value="onHold">On Hold</TabsTrigger>
                <TabsTrigger value="running">Running</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <DataTable columns={columns} data={projects} />
              </TabsContent>

              <TabsContent value="projectDelayed">
                <DataTable columns={columns} data={projects.filter((p) => p.status === "Delayed")} />
              </TabsContent>

              <TabsContent value="milestoneDelayed">
                <DataTable
                  columns={columns}
                  data={projects.filter(
                    (p) =>
                      p.milestone &&
                      p.status !== "Completed" &&
                      new Date(p.planClose) < new Date()
                  )}
                />
              </TabsContent>

              <TabsContent value="onHold">
                <DataTable columns={columns} data={projects.filter((p) => p.status === "On Hold")} />
              </TabsContent>

              <TabsContent value="running">
                <DataTable columns={columns} data={projects.filter((p) => p.status === "Running")} />
              </TabsContent>

              <TabsContent value="completed">
                <DataTable columns={columns} data={projects.filter((p) => p.status === "Completed")} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Project" : "Create Project"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Project Code */}
            <div className="flex flex-col">
              <Label htmlFor="projectCode" className="mb-2 font-semibold text-sm">
                Project Code
              </Label>
              <Input
                id="projectCode"
                type="text"
                name="projectCode"
                value={formData.projectCode}
                readOnly
                className="w-full"
              />
            </div>

            {/* Project */}
            <div className="flex flex-col">
              <Label htmlFor="project" className="mb-2 font-semibold text-sm">
                Project
              </Label>
              <Input
                id="project"
                type="text"
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {/* Project Type */}
            <div className="flex flex-col">
              <Label htmlFor="projectName" className="mb-2 font-semibold text-sm">
                Project Type
              </Label>
              <select
                id="projectName"
                name="projectName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded px-3 py-2"
              >
                <option value="">Select Project Type</option>
                {masterProjects.map((mp) => (
                  <option key={mp._id} value={mp.projectName}>
                    {mp.projectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Client */}
            <div className="flex flex-col">
              <Label htmlFor="client" className="mb-2 font-semibold text-sm">
                Client
              </Label>
              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={(e) => {
                  const selectedClient = clients.find(
                    (c) => c.clientName === e.target.value
                  );
                  setFormData({
                    ...formData,
                    client: selectedClient?.clientName || "",
                    clientLocation: "",
                    unit: "",
                  });
                }}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c.clientName}>
                    {c.clientName}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <Label htmlFor="clientLocation" className="mb-2 font-semibold text-sm">
                Location
              </Label>
              <select
                id="clientLocation"
                name="clientLocation"
                value={formData.clientLocation}
                onChange={(e) =>
                  setFormData({ ...formData, clientLocation: e.target.value, unit: "" })
                }
                disabled={!formData.client}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Location</option>
                {clients
                  .find((c) => c.clientName === formData.client)
                  ?.locations.map((loc) => (
                    <option key={loc._id} value={loc.locationName}>
                      {loc.locationName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Unit */}
            <div className="flex flex-col">
              <Label htmlFor="unit" className="mb-2 font-semibold text-sm">
                Unit
              </Label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                disabled={!formData.clientLocation}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Unit</option>
                {clients
                  .find((c) => c.clientName === formData.client)
                  ?.locations.find((l) => l.locationName === formData.clientLocation)
                  ?.units.map((u) => (
                    <option key={u._id} value={u.unitName}>
                      {u.unitName}
                    </option>
                  ))}
              </select>

            </div>
            {/* Milestone */}
            {/* Milestone */}
            <div className="flex flex-col">
              <Label htmlFor="milestone" className="mb-2 font-semibold text-sm">
                Milestone
              </Label>
              <select
                id="milestone"
                name="milestone"
                value={formData.milestone}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Milestone</option>
                {milestones.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Plan Start */}
            <div className="flex flex-col">
              <Label htmlFor="planStart" className="mb-2 font-semibold text-sm">
                Plan Start
              </Label>
              <Input
                id="planStart"
                type="date"
                name="planStart"
                value={formData.planStart}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Plan Close */}
            <div className="flex flex-col">
              <Label htmlFor="planClose" className="mb-2 font-semibold text-sm">
                Plan Close
              </Label>
              <Input
                id="planClose"
                type="date"
                name="planClose"
                value={formData.planClose}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={!editingId && milestones.length === 0} // ❌ disable until milestones exist
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
