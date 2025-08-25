import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Task {
  id: string;
  raisedDate: string;
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

export function TaskMaster() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<Task>({
    id: "",
    raisedDate: "",
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

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.client || !form.issue) return;

    if (form.id) {
      setTasks(tasks.map((t) => (t.id === form.id ? form : t)));
    } else {
      const newTask: Task = {
        ...form,
        id: Date.now().toString(),
        raisedDate: new Date().toLocaleDateString(),
      };
      setTasks([...tasks, newTask]);
    }

    setForm({
      id: "",
      raisedDate: "",
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
  };

  const handleEdit = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setForm(task);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Issue & Requirement Tracker</h1>

      <Button onClick={() => setShowForm(true)}>+ Add New Entry</Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "Edit Entry" : "Add New Entry"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="assignedTo"
              placeholder="Assigned To"
              value={form.assignedTo}
              onChange={handleChange}
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Type</option>
              <option value="Issue">Issue</option>
              <option value="Requirement">Requirement</option>
            </select>
            <Input
              name="client"
              placeholder="Client"
              value={form.client}
              onChange={handleChange}
            />
            <Input
              name="issue"
              placeholder="Issue / Requirement"
              value={form.issue}
              onChange={handleChange}
            />
            <Input
              name="produceStep"
              placeholder="Produce Step"
              value={form.produceStep}
              onChange={handleChange}
            />
            <Input
              name="sampleData"
              placeholder="Sample Data"
              value={form.sampleData}
              onChange={handleChange}
            />
            <Input
              name="acceptanceCriteria"
              placeholder="Acceptance Criteria"
              value={form.acceptanceCriteria}
              onChange={handleChange}
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <Input
              type="date"
              name="expectedClosureDate"
              value={form.expectedClosureDate}
              onChange={handleChange}
            />
            <Input
              type="date"
              name="actualClosureDate"
              value={form.actualClosureDate}
              onChange={handleChange}
            />
            <Input
              name="testingStatus"
              placeholder="Testing Status"
              value={form.testingStatus}
              onChange={handleChange}
            />
            <Input
              name="testingDoneBy"
              placeholder="Testing Done By"
              value={form.testingDoneBy}
              onChange={handleChange}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Entries List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr. No</TableHead>
                <TableHead>Raised Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Issue/Requirement</TableHead>
                <TableHead>Produce Step</TableHead>
                <TableHead>Sample Data</TableHead>
                <TableHead>Acceptance Criteria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected Closure</TableHead>
                <TableHead>Actual Closure</TableHead>
                <TableHead>Testing Status</TableHead>
                <TableHead>Testing Done By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((t, index) => (
                <TableRow key={t.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{t.raisedDate}</TableCell>
                  <TableCell>{t.assignedTo}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell>{t.client}</TableCell>
                  <TableCell>{t.issue}</TableCell>
                  <TableCell>{t.produceStep}</TableCell>
                  <TableCell>{t.sampleData}</TableCell>
                  <TableCell>{t.acceptanceCriteria}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.expectedClosureDate}</TableCell>
                  <TableCell>{t.actualClosureDate}</TableCell>
                  <TableCell>{t.testingStatus}</TableCell>
                  <TableCell>{t.testingDoneBy}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(t.id)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
