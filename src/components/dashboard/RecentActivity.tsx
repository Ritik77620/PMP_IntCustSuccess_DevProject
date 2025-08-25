import { useEffect, useState } from "react";

interface Project {
  _id: string;
  name: string;
  status: string;   // e.g. "running" | "completed" | "delayed"
  progress: number;
  updatedAt: string;
}

export function RecentActivity() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        // Sort projects by last updated (latest first)
        const sorted = data.sort(
          (a: Project, b: Project) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setProjects(sorted);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // Function to display status with color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">Running</span>;
      case "completed":
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">Completed</span>;
      case "delayed":
        return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">Delayed</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
      <ul className="space-y-2">
        {projects.length > 0 ? (
          projects.map((project) => (
            <li
              key={project._id}
              className="flex justify-between items-center border-b pb-2 last:border-none"
            >
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-xs text-gray-400">
                  Updated: {new Date(project.updatedAt).toLocaleString()}
                </p>
              </div>
              {getStatusBadge(project.status)}
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent activities found</p>
        )}
      </ul>
    </div>
  );
}
