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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FolderKanban,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/api";

export function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingTimeEntries, setLoadingTimeEntries] = useState(true);

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

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchTimeEntries();
  }, []);

  // Compute project stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const planningProjects = projects.filter((p) => p.status === "planning").length;
  const onHoldProjects = projects.filter((p) => p.status === "on_hold").length;
  const overdueProjects = projects.filter(
    (p) => p.planClose && new Date(p.planClose) < new Date()
  ).length;

  // Filter tasks assigned to current user id '2' (example)
  const myTasks = tasks.filter((t) => t.assigneeId === "2");
  const pendingTimesheets = timeEntries.filter((t) => t.approvalStatus === "pending").length;

  // Mock or fetched upcoming milestones: ideally should come from API
  const upcomingMilestones = [
    { name: "API Testing Phase", project: "Arlyn", dueDate: "2025-08-20", status: "in_progress" },
    { name: "UI Implementation", project: "TechFlow Solutions", dueDate: "2025-08-25", status: "pending" },
    { name: "Database Migration", project: "DataViz Dashboard", dueDate: "2025-09-01", status: "planning" },
  ];

  // Prepare pie chart data dynamically
  const pieData = [
    { name: "Completed", value: completedProjects, color: "hsl(var(--accent))" },
    { name: "In Progress", value: activeProjects, color: "hsl(var(--primary))" },
    { name: "Planning", value: planningProjects, color: "hsl(var(--warning))" },
    { name: "On Hold", value: onHoldProjects, color: "hsl(var(--muted))" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={loadingProjects ? "3" : totalProjects}
          change={{ value: "+2 this month", type: "increase" }}
          icon={FolderKanban}
          gradient
        />
        <StatsCard
          title="Active Projects"
          value={loadingProjects ? "1" : activeProjects}
          change={{ value: "+1 this week", type: "increase" }}
          icon={TrendingUp}
        />
        <StatsCard
          title="Pending Timesheets"
          value={loadingTimeEntries ? "1" : pendingTimesheets}
          change={{ value: "Need review", type: "neutral" }}
          icon={Clock}
        />
        <StatsCard
          title="Overdue Projects"
          value={loadingProjects ? "1" : overdueProjects}
          change={{ value: "Action required", type: "decrease" }}
          icon={AlertTriangle}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Chart */}
        <div className="lg:col-span-1">
          <Card className="transition-smooth hover:shadow-glow">
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
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
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <Card className="transition-smooth hover:shadow-glow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Tasks
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingTasks ? (
                <p>Loading tasks...</p>
              ) : (
                myTasks.slice(0, 4).map((task) => (
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
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.loggedHours}h / {task.estimatedHours}h
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant={task.status === "completed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                      <Progress value={(task.loggedHours / task.estimatedHours) * 100} className="w-16 h-2" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card className="transition-smooth hover:shadow-glow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Milestones
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "API Testing Phase", project: "Arlyn", dueDate: "2025-08-20", status: "in_progress" },
                { name: "UI Implementation", project: "TechFlow Solutions", dueDate: "2025-08-25", status: "pending" },
                { name: "Database Migration", project: "DataViz Dashboard", dueDate: "2025-09-01", status: "planning" },
              ].map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-smooth"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{milestone.name}</p>
                    <p className="text-xs text-muted-foreground">{milestone.project}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs font-medium">{milestone.dueDate}</p>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "default"
                          : milestone.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {milestone.status.replace("_", " ")}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
