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
import { Users, FolderKanban, Clock, TrendingUp, AlertTriangle, Calendar, ArrowRight } from "lucide-react";
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

  // Fetch data
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);
    } catch (e) {
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
    } finally {
      setLoadingTimeEntries(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTickets();
    fetchTasks();
    fetchTimeEntries();
  }, []);

  // Project Stats
  const projectStats = {
    Running: projects.filter(p => p.status === "Running").length,
    Completed: projects.filter(p => p.status === "Completed").length,
    Delayed: projects.filter(p => p.status === "Delayed").length,
    total: projects.length,
  };

  // Ticket Stats
  const ticketStats = {
    Open: tickets.filter(t => t.status === "Open").length,
    Closed: tickets.filter(t => t.status === "Closed").length,
    Hold: tickets.filter(t => t.status === "Hold").length,
    total: tickets.length,
  };

  // Pie Chart Data
  const projectPieData = [
    { name: "Running", value: projectStats.Running, color: "hsl(var(--warning))" },
    { name: "Completed", value: projectStats.Completed, color: "hsl(var(--success))" },
    { name: "Delayed", value: projectStats.Delayed, color: "hsl(var(--destructive))" },
  ];

  const ticketPieData = [
    { name: "Open", value: ticketStats.Open, color: "hsl(var(--warning))" },
    { name: "Closed", value: ticketStats.Closed, color: "hsl(var(--success))" },
    { name: "On Hold", value: ticketStats.Hold, color: "hsl(var(--muted))" },
  ];

  // My tasks
  const myTasks = tasks.filter(t => t.assigneeId === "2");
  const pendingTimesheets = timeEntries.filter(t => t.approvalStatus === "pending").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Project and Ticket Tracker Overview</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Project Stats */}
        <StatsCard title="Total Projects" value={loadingProjects ? "..." : projectStats.total} icon={FolderKanban} gradient />
        <StatsCard title="Running Projects" value={loadingProjects ? "..." : projectStats.Running} icon={TrendingUp} change={{ value: "+5%", type: "increase" }} />
        <StatsCard title="Completed Projects" value={loadingProjects ? "..." : projectStats.Completed} icon={FolderKanban} change={{ value: "+2%", type: "increase" }} />
        <StatsCard title="Delayed Projects" value={loadingProjects ? "..." : projectStats.Delayed} icon={AlertTriangle} change={{ value: "-1%", type: "decrease" }} />

        {/* Ticket Stats */}
        <StatsCard title="Total Tickets" value={loadingTickets ? "..." : ticketStats.total} icon={FolderKanban} gradient />
        <StatsCard title="Open Tickets" value={loadingTickets ? "..." : ticketStats.Open} icon={Clock} change={{ value: "0%", type: "neutral" }} />
        <StatsCard title="Closed Tickets" value={loadingTickets ? "..." : ticketStats.Closed} icon={TrendingUp} change={{ value: "+3%", type: "increase" }} />
        <StatsCard title="On Hold Tickets" value={loadingTickets ? "..." : ticketStats.Hold} icon={Users} change={{ value: "0%", type: "neutral" }} />
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Pie */}
        <Card>
          <CardHeader><CardTitle>Project Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectPieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {projectPieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ticket Pie */}
        <Card>
          <CardHeader><CardTitle>Ticket Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketPieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {ticketPieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
            <div className="space-y-4">
              {loadingTasks ? <p>Loading tasks...</p> : myTasks.slice(0, 4).map(task => (
                <div key={task.id} className="flex justify-between p-3 rounded-lg border bg-card/50">
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                    <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                  </div>
                  <div className="text-right">
                    <Badge variant={task.status === "completed" ? "default" : "secondary"} className="text-xs">{task.status}</Badge>
                    <Progress value={(task.loggedHours / task.estimatedHours) * 100} className="w-16 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <RecentActivity />
      </div>
    </div>
  );
}
