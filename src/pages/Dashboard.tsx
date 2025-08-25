"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import {
  Users,
  FolderKanban,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingTimeEntries, setLoadingTimeEntries] = useState(true);

  // Fetch data asynchronously
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await api.get("/api/projects");
        setProjects(res.data);
      } catch (e) {
        console.error("Failed to fetch projects", e);
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchTickets = async () => {
      setLoadingTickets(true);
      try {
        const res = await api.get("/api/tickets");
        setTickets(res.data);
      } catch (e) {
        console.error("Failed to fetch tickets", e);
      } finally {
        setLoadingTickets(false);
      }
    };

    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await api.get("/api/tasks");
        setTasks(res.data);
      } catch (e) {
        console.error("Failed to fetch tasks", e);
      } finally {
        setLoadingTasks(false);
      }
    };

    const fetchTimeEntries = async () => {
      setLoadingTimeEntries(true);
      try {
        const res = await api.get("/api/timeentries");
        setTimeEntries(res.data);
      } catch (e) {
        console.error("Failed to fetch time entries", e);
      } finally {
        setLoadingTimeEntries(false);
      }
    };

    fetchProjects();
    fetchTickets();
    fetchTasks();
    fetchTimeEntries();
  }, []);

  // Compute project statistics
  const projectStats = {
    Running: projects.filter((p) => p.status === "Running").length,
    Completed: projects.filter((p) => p.status === "Completed").length,
    Delayed: projects.filter((p) => p.status === "Delayed").length,
    total: projects.length,
  };

  // Compute ticket statistics
  const ticketStats = {
    Open: tickets.filter((t) => t.status === "Open").length,
    Closed: tickets.filter((t) => t.status === "Closed").length,
    Hold: tickets.filter((t) => t.status === "Hold").length,
    total: tickets.length,
  };

  // Prepare data for the pie charts
  const projectPieData = [
  { name: "Running", value: projectStats.Running, color: "#FFB300" },      // amber/orange
  { name: "Completed", value: projectStats.Completed, color: "#4CAF50" },  // green
  { name: "Delayed", value: projectStats.Delayed, color: "#F44336" },      // red
];

  const ticketPieData = [
    { name: "Open", value: ticketStats.Open, color: "hsl(45, 100%, 51%)" },
    { name: "Closed", value: ticketStats.Closed, color: "hsl(120, 60%, 40%)" },
    { name: "On Hold", value: ticketStats.Hold, color: "hsl(0, 80%, 60%)" },
  ];

  // Filter current user's tasks and pending timesheets
  const myTasks = tasks.filter((t) => t.assigneeId === "2");
  const pendingTimesheets = timeEntries.filter((t) => t.approvalStatus === "pending").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Project and Ticket Tracker Overview</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Projects" value={loadingProjects ? "..." : projectStats.total} icon={FolderKanban} gradient />
        <StatsCard title="Running Projects" value={loadingProjects ? "..." : projectStats.Running} icon={TrendingUp} change={{ value: "+5%", type: "increase" }} />
        <StatsCard title="Completed Projects" value={loadingProjects ? "..." : projectStats.Completed} icon={FolderKanban} change={{ value: "+2%", type: "increase" }} />
        <StatsCard title="Delayed Projects" value={loadingProjects ? "..." : projectStats.Delayed} icon={AlertTriangle} change={{ value: "-1%", type: "decrease" }} />
        <StatsCard title="Total Tickets" value={loadingTickets ? "..." : ticketStats.total} icon={FolderKanban} gradient />
        <StatsCard title="Open Tickets" value={loadingTickets ? "..." : ticketStats.Open} icon={Clock} change={{ value: "0%", type: "neutral" }} />
        <StatsCard title="Closed Tickets" value={loadingTickets ? "..." : ticketStats.Closed} icon={TrendingUp} change={{ value: "+3%", type: "increase" }} />
        <StatsCard title="On Hold Tickets" value={loadingTickets ? "..." : ticketStats.Hold} icon={Users} change={{ value: "0%", type: "neutral" }} />
      </div>

      {/* Pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Pie Chart */}
        <Card className="transition-smooth hover:shadow-glow">
          <CardHeader><CardTitle>Project Status Distribution</CardTitle></CardHeader>
          <CardContent>
            {loadingProjects ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Loading chart...</p>
              </div>
            ) : projectStats.total === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No project data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectPieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Ticket Pie Chart */}
        <Card className="transition-smooth hover:shadow-glow">
          <CardHeader><CardTitle>Ticket Status Distribution</CardTitle></CardHeader>
          <CardContent>
            {loadingTickets ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Loading chart...</p>
              </div>
            ) : ticketStats.total === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No ticket data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ticketPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {ticketPieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />My Tasks</CardTitle>
            <Button variant="ghost" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            {loadingTasks ? (
              <p>Loading tasks...</p>
            ) : myTasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks assigned</p>
            ) : (
              <div className="space-y-4">
                {myTasks.slice(0, 4).map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-smooth"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                        <span className="text-xs text-muted-foreground">{task.loggedHours}h / {task.estimatedHours}h</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={task.status === "completed" ? "default" : "secondary"} className="text-xs">{task.status.replace("_", " ")}</Badge>
                      <Progress value={(task.loggedHours / task.estimatedHours) * 100} className="w-16 h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <RecentActivity />
      </div>
    </div>
  );
}
