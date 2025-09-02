import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "@/config/apiConfig";

interface Project {
    code: string;
    name: string;
    clientName: string;
}

interface Milestone {
    _id?: string;
    name: string;
    planStartDate: string;
    planCloseDate: string;
    actualStartDate: string;
    actualCloseDate: string;
    responsibility: string;
    remark: string;
    status?: string;
}

export default function ProjectDetails() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project>({ code: "", name: "", clientName: "" });
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [milestone, setMilestone] = useState<Milestone>({
        name: "",
        planStartDate: "",
        planCloseDate: "",
        actualStartDate: "",
        actualCloseDate: "",
        responsibility: "",
        remark: "",
        status: "Open",
    });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.projectById(projectId!));
                setProject(res.data);
            } catch (err) {
                console.error("Failed to fetch project:", err);
            }
        };

        const fetchMilestones = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.projectMilestones(projectId!));
                setMilestones(res.data || []);
            } catch (err) {
                console.error("Failed to fetch milestones:", err);
            }
        };

        fetchProject();
        fetchMilestones();
    }, [projectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setMilestone({ ...milestone, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await axios.put(
                    API_ENDPOINTS.projectMilestoneById(projectId!, editingId),
                    milestone
                );
                setMilestones(
                    milestones.map((m) => (m._id === editingId ? { ...milestone, _id: editingId } : m))
                );
                setEditingId(null);
                alert("Milestone updated successfully!");
            } else {
                const res = await axios.post(
                    API_ENDPOINTS.projectMilestones(projectId!),
                    milestone
                );
                setMilestones([...milestones, res.data]);
                alert("Milestone saved successfully!");
            }

            setMilestone({
                name: "",
                planStartDate: "",
                planCloseDate: "",
                actualStartDate: "",
                actualCloseDate: "",
                responsibility: "",
                remark: "",
                status: "Open",
            });
            setShowForm(false);
        } catch (err) {
            console.error("Failed to save milestone:", err);
        }
    };

    const handleEdit = (m: Milestone) => {
        setMilestone(m);
        setEditingId(m._id || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        if (!window.confirm("Are you sure you want to delete this milestone?")) return;

        try {
            await axios.delete(API_ENDPOINTS.projectMilestoneById(projectId!, id));
            setMilestones(milestones.filter((m) => m._id !== id));
            alert("Milestone deleted successfully!");
        } catch (err) {
            console.error("Failed to delete milestone:", err);
        }
    };

    return (
        <div className="p-6">
            {/* Project Header */}
            <div className="mb-6 p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Project Details</h2>
                <div className="flex justify-between text-gray-700">
                    <span>
                        <span className="font-semibold text-gray-900">Project Code:</span> {project.projectCode}
                    </span>
                    <span>
                        <span className="font-semibold text-gray-900">Project Name:</span> {project.name}
                    </span>
                    <span>
                        <span className="font-semibold text-gray-900">Client Name:</span> {project.client}
                    </span>
                </div>
            </div>

            {/* Toggle Milestone Form */}
            <button
                onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
                    setMilestone({
                        name: "",
                        planStartDate: "",
                        planCloseDate: "",
                        actualStartDate: "",
                        actualCloseDate: "",
                        responsibility: "",
                        remark: "",
                        status: "Open",
                    });
                }}
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                {showForm ? "Hide Form" : "Add Milestone"}
            </button>

            {/* Milestone Form */}
            {showForm && (
                <form className="grid grid-cols-2 gap-4 mb-6 border p-4 rounded bg-gray-50">
                    <div>
                        <label className="block">Milestone</label>
                        <input
                            type="text"
                            name="name"
                            value={milestone.name}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div>
                        <label className="block">Responsibility</label>
                        <input
                            type="text"
                            name="responsibility"
                            value={milestone.responsibility}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div>
                        <label className="block">Plan Start Date</label>
                        <input
                            type="date"
                            name="planStartDate"
                            value={milestone.planStartDate}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div>
                        <label className="block">Plan Closed Date</label>
                        <input
                            type="date"
                            name="planCloseDate"
                            value={milestone.planCloseDate}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div>
                        <label className="block">Actual Start Date</label>
                        <input
                            type="date"
                            name="actualStartDate"
                            value={milestone.actualStartDate}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>
                    <div>
                        <label className="block">Actual Closed Date</label>
                        <input
                            type="date"
                            name="actualCloseDate"
                            value={milestone.actualCloseDate}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>

                    {/* Status Field */}
                    <div>
                        <label className="block">Status</label>
                        <select
                            name="status"
                            value={milestone.status || "Open"}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    {/* Remark Field */}
                    <div>
                        <label className="block">Remark</label>
                        <input
                            type="text"
                            name="remark"
                            value={milestone.remark}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>

                    <div className="col-span-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {editingId ? "Update Milestone" : "Save Milestone"}
                        </button>
                    </div>
                </form>
            )}

            {/* Milestones Table */}
            <h2 className="text-xl font-bold mb-4">Milestones</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border text-left shadow-lg">
                    <thead>
                        <tr className="bg-blue-600 text-white uppercase text-sm">
                            <th className="border px-3 py-2">Milestone</th>
                            <th className="border px-3 py-2">Plan Start Date</th>
                            <th className="border px-3 py-2">Plan Closed Date</th>
                            <th className="border px-3 py-2">Actual Start Date</th>
                            <th className="border px-3 py-2">Actual Closed Date</th>
                            <th className="border px-3 py-2">Responsibility</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">Remark</th>
                            <th className="border px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {milestones.map((m, idx) => (
                            <tr
                                key={m._id || idx}
                                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-100 transition-colors`}
                            >
                                <td className="border px-3 py-2">{m.name}</td>
                                <td className="border px-3 py-2">{formatDate(m.planStartDate)}</td>
                                <td className="border px-3 py-2">{formatDate(m.planCloseDate)}</td>
                                <td className="border px-3 py-2">{formatDate(m.actualStartDate)}</td>
                                <td className="border px-3 py-2">{formatDate(m.actualCloseDate)}</td>
                                <td className="border px-3 py-2">{m.responsibility}</td>
                                <td className="border px-3 py-2">{m.status}</td>
                                <td className="border px-3 py-2">{m.remark}</td>
                                <td className="border px-3 py-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(m)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(m._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
