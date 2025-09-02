export const API_BASE = "http://localhost:7001/api";

export const API_ENDPOINTS = {
  // Master Projects
  masterProjects: `${API_BASE}/masterprojects`,
  masterProjectById: (id: string) => `${API_BASE}/masterprojects/${id}`,

  // Projects
  projects: `${API_BASE}/projects`,
  projectById: (id: string) => `${API_BASE}/projects/${id}`,

  // Tickets
  tickets: `${API_BASE}/tickets`,
  ticketById: (id: string) => `${API_BASE}/tickets/${id}`,

  // Tasks
  tasks: `${API_BASE}/tasks`,
  taskById: (id: string) => `${API_BASE}/tasks/${id}`,

  // Time Entries
  timeEntries: `${API_BASE}/time-entries`,
  timeEntryById: (id: string) => `${API_BASE}/time-entries/${id}`,

  // Clients
  clients: `${API_BASE}/clients`,
  clientById: (id: string) => `${API_BASE}/clients/${id}`,

  // Project Milestones (nested under project)
  projectMilestones: (projectId: string) =>
    `${API_BASE}/projects/${projectId}/projectMilestones`,
  projectMilestoneById: (projectId: string, milestoneId: string) =>
    `${API_BASE}/projects/${projectId}/projectMilestones/${milestoneId}`,

  // Milestones (Master level)
  milestones: `${API_BASE}/milestones`,
  milestoneById: (id: string) => `${API_BASE}/milestones/${id}`,

  // Vendors
  vendors: `${API_BASE}/vendors`,
  vendorById: (id: string) => `${API_BASE}/vendors/${id}`,

  // Users (Master)
  users: `${API_BASE}/users`,
  userById: (id: string) => `${API_BASE}/users/${id}`,
};
