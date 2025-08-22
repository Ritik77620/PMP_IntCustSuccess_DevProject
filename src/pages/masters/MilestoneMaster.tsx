"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Milestone {
  id: string;
  name: string;
  sequence: number;
}

interface SubMilestone {
  id: string;
  name: string;
  milestoneId: string;
  sequence: number;
}

export default function MilestoneMaster() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [subMilestones, setSubMilestones] = useState<SubMilestone[]>([]);

  const [mileForm, setMileForm] = useState<Milestone>({ id: "", name: "", sequence: 0 });
  const [subForm, setSubForm] = useState<SubMilestone>({ id: "", name: "", milestoneId: "", sequence: 0 });

  const [showMileForm, setShowMileForm] = useState(false);
  const [showSubForm, setShowSubForm] = useState(false);

  // Fetch all milestones
  const fetchMilestones = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/milestones");
      if (!res.ok) throw new Error("Failed to fetch milestones");
      const data = await res.json();
      setMilestones(data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  // Fetch all sub-milestones
  const fetchSubMilestones = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/submilestones");
      if (!res.ok) throw new Error("Failed to fetch sub-milestones");
      const data = await res.json();
      setSubMilestones(data);
    } catch (error) {
      console.error("Error fetching sub-milestones:", error);
    }
  };

  useEffect(() => {
    fetchMilestones();
    fetchSubMilestones();
  }, []);

  // Handle input changes for milestone form
  const handleMileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMileForm(prev => ({
      ...prev,
      [name]: name === "sequence" ? Number(value) : value,
    }));
  };

  // Handle input changes for sub-milestone form
  const handleSubChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSubForm(prev => ({
      ...prev,
      [name]: name === "sequence" ? Number(value) : value,
    }));
  };

  // Save or update milestone
  const handleMileSave = async () => {
    if (!mileForm.name) {
      alert("Milestone Name is required");
      return;
    }

    try {
      const method = mileForm.id ? "PUT" : "POST";
      const url = mileForm.id
        ? `http://localhost:5001/api/milestones/${mileForm.id}`
        : "http://localhost:5001/api/milestones";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: mileForm.name, sequence: mileForm.sequence }),
      });
      if (!res.ok) throw new Error("Failed to save milestone");

      setMileForm({ id: "", name: "", sequence: 0 });
      setShowMileForm(false);
      fetchMilestones();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Save or update sub-milestone
  const handleSubSave = async () => {
    if (!subForm.name || !subForm.milestoneId) {
      alert("Sub-Milestone name and parent Milestone are required");
      return;
    }

    try {
      const method = subForm.id ? "PUT" : "POST";
      const url = subForm.id
        ? `http://localhost:5001/api/submilestones/${subForm.id}`
        : "http://localhost:5001/api/submilestones";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: subForm.name,
          milestoneId: subForm.milestoneId,
          sequence: subForm.sequence,
        }),
      });
      if (!res.ok) throw new Error("Failed to save sub-milestone");

      setSubForm({ id: "", name: "", milestoneId: "", sequence: 0 });
      setShowSubForm(false);
      fetchSubMilestones();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Delete milestone
  const handleMileDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/milestones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchMilestones();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Delete sub-milestone
  const handleSubDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-milestone?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/submilestones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchSubMilestones();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Edit milestone
  const handleMileEdit = (id: string) => {
    const milestone = milestones.find(m => m.id === id);
    if (milestone) {
      setMileForm(milestone);
      setShowMileForm(true);
    }
  };

  // Edit sub-milestone
  const handleSubEdit = (id: string) => {
    const submilestone = subMilestones.find(s => s.id === id);
    if (submilestone) {
      setSubForm(submilestone);
      setShowSubForm(true);
    }
  };

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-bold">Milestone & Sub-Milestone Master</h1>

      {/* Milestones Section */}
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowMileForm(true)} className="mb-4">
            + Add New Milestone
          </Button>

          {showMileForm && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{mileForm.id ? "Edit Milestone" : "Add New Milestone"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  name="name"
                  placeholder="Milestone Name"
                  value={mileForm.name}
                  onChange={handleMileChange}
                />
                <Input
                  name="sequence"
                  type="number"
                  placeholder="Sequence"
                  value={mileForm.sequence}
                  onChange={handleMileChange}
                />
                <div className="flex gap-2">
                  <Button onClick={handleMileSave}>Save</Button>
                  <Button variant="secondary" onClick={() => setShowMileForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sequence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map(m => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.sequence}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleMileEdit(m.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleMileDelete(m.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sub-Milestones Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sub-Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowSubForm(true)} className="mb-4">
            + Add New Sub-Milestone
          </Button>

          {showSubForm && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{subForm.id ? "Edit Sub-Milestone" : "Add Sub-Milestone"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  name="name"
                  placeholder="Sub-Milestone Name"
                  value={subForm.name}
                  onChange={handleSubChange}
                />
                <select
                  name="milestoneId"
                  className="border rounded p-2 w-full"
                  value={subForm.milestoneId}
                  onChange={handleSubChange}
                >
                  <option value="">Select Milestone</option>
                  {milestones.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <Input
                  name="sequence"
                  type="number"
                  placeholder="Sequence"
                  value={subForm.sequence}
                  onChange={handleSubChange}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSubSave}>Save</Button>
                  <Button variant="secondary" onClick={() => setShowSubForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sub-Milestone</TableHead>
                <TableHead>Parent Milestone</TableHead>
                <TableHead>Sequence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subMilestones.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{milestones.find(m => m.id === s.milestoneId)?.name || "—"}</TableCell>
                  <TableCell>{s.sequence}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleSubEdit(s.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleSubDelete(s.id)}>
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
