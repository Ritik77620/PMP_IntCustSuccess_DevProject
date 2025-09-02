import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Task {
  _id?: string;
  raisedDate?: string;
  assignedTo: string;
  type: string;
  client: string;
  issue: string;
  produceStep: string;
  sampleData: string;
  acceptanceCriteria: string;
  status: string;
  expectedClosureDate: string;
  actualClosureDate: string;
  testingStatus: string;
  testingDoneBy: string;
}

const API_URL = "http://localhost:7001/api/tasks";

export default function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<Task>({
    assignedTo: "",
    type: "",
    client: "",
    issue: "",
    produceStep: "",
    sampleData: "",
    acceptanceCriteria: "",
    status: "",
    expectedClosureDate: "",
    actualClosureDate: "",
    testingStatus: "",
    testingDoneBy: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch tasks from DB
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.client || !form.issue) return;
    try {
      if (form._id) {
        await axios.put(`${API_URL}/${form._id}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({
        assignedTo: "",
        type: "",
        client: "",
        issue: "",
        produceStep: "",
        sampleData: "",
        acceptanceCriteria: "",
        status: "",
        expectedClosureDate: "",
        actualClosureDate: "",
        testingStatus: "",
        testingDoneBy: "",
      });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task: Task) => {
    setForm(task);
    setShowForm(true);
  };

  const handleDelete = async (_id?: string) => {
    if (!_id) return;
    try {
      await axios.delete(`${API_URL}/${_id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : d.toISOString().split("T")[0];
  };

  // Stats
  const totalTasks = tasks.length;
  const openTasks = tasks.filter((t) => t.status === "Open").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const closedTasks = tasks.filter((t) => t.status === "Closed").length;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Issue & Requirement Tracker</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-yellow-700">Open</p>
            <p className="text-2xl font-bold text-yellow-700">{openTasks}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-blue-700">In Progress</p>
            <p className="text-2xl font-bold text-blue-700">{inProgressTasks}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-green-700">Closed</p>
            <p className="text-2xl font-bold text-green-700">{closedTasks}</p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => setShowForm(true)}>+ Add New Entry</Button>

      {showForm && (
        <Card className="p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Add / Edit Task</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assigned To */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Assigned To</label>
              <Input
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <option value="">Select Type</option>
                <option value="Issue">Issue</option>
                <option value="Requirement">Requirement</option>
              </select>
            </div>

            {/* Client */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Client</label>
              <Input
                name="client"
                value={form.client}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Issue / Requirement */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Issue / Requirement</label>
              <Input
                name="issue"
                value={form.issue}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Produce Step */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Produce Step</label>
              <Input
                name="produceStep"
                value={form.produceStep}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Sample Data */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Sample Data</label>
              <Input
                name="sampleData"
                value={form.sampleData}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Acceptance Criteria */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-2 text-sm font-medium text-gray-700">Acceptance Criteria</label>
              <Input
                name="acceptanceCriteria"
                value={form.acceptanceCriteria}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Expected Closure Date */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Expected Closure Date</label>
              <input
                type="date"
                name="expectedClosureDate"
                value={form.expectedClosureDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Actual Closure Date */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Actual Closure Date</label>
              <input
                type="date"
                name="actualClosureDate"
                value={form.actualClosureDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Testing Status */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Testing Status</label>
              <Input
                name="testingStatus"
                value={form.testingStatus}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Testing Done By */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Testing Done By</label>
              <Input
                name="testingDoneBy"
                value={form.testingDoneBy}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Task Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RAISED DATE</TableHead>
              <TableHead>ASSIGNED TO</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>CLIENT</TableHead>
              <TableHead>ISSUE/REQUIREMENT</TableHead>
              <TableHead>PRODUCE STEP</TableHead>
              <TableHead>SAMPLE DATA</TableHead>
              <TableHead>ACCEPTANCE CRITERIA</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>EXPECTED CLOSURE DATE</TableHead>
              <TableHead>ACTUAL CLOSURE DATE</TableHead>
              <TableHead>TESTING STATUS</TableHead>
              <TableHead>TESTING DONE BY</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{formatDate(task.raisedDate)}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.client}</TableCell>
                <TableCell>{task.issue}</TableCell>
                <TableCell>{task.produceStep}</TableCell>
                <TableCell>{task.sampleData}</TableCell>
                <TableCell>{task.acceptanceCriteria}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{formatDate(task.expectedClosureDate)}</TableCell>
                <TableCell>{formatDate(task.actualClosureDate)}</TableCell>
                <TableCell>{task.testingStatus}</TableCell>
                <TableCell>{task.testingDoneBy}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
