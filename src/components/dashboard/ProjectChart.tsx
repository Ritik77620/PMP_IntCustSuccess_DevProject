import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api"; // your axios or fetch wrapper

type Status = "active" | "planning" | "completed" | "on_hold";

interface Project {
  status: Status;
  // other fields...
}

export function ProjectChart() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading chart...</p>;
  }

  // Compute counts per status
  const counts = {
    completed: 0,
    active: 0,
    planning: 0,
    on_hold: 0,
  };

  projects.forEach((p) => {
    if (p.status === "completed") counts.completed++;
    else if (p.status === "active") counts.active++;
    else if (p.status === "planning") counts.planning++;
    else if (p.status === "on_hold") counts.on_hold++;
  });

  // Build pie chart data
  const data = [
    { name: "Completed", value: counts.completed, color: "hsl(var(--accent))" },
    { name: "In Progress", value: counts.active, color: "hsl(var(--primary))" },
    { name: "Planning", value: counts.planning, color: "hsl(var(--warning))" },
    { name: "On Hold", value: counts.on_hold, color: "hsl(var(--muted))" },
  ];

  return (
    <Card className="transition-smooth hover:shadow-glow">
      <CardHeader>
        <CardTitle>Project Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
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
  );
}
