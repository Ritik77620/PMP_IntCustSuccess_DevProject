"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Milestone {
  id: string;
  name: string;
  weightage: number;
}

export default function MilestoneMaster() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [mileForm, setMileForm] = useState<Milestone>({ id: "", name: "", weightage: 0 });
  const [showMileForm, setShowMileForm] = useState(false);

  // Fetch milestones from backend API
  const fetchMilestones = async () => {
    try {
      const res = await fetch("http://localhost:7001/api/milestones");
      if (!res.ok) throw new Error("Failed to fetch milestones");
      const data = await res.json();
      setMilestones(data);
    } catch (err) {
      console.error("Failed to fetch milestones", err);
    }
  };

  // Save milestone (Create or Update)
  const handleMileSave = async () => {
    if (!mileForm.name) return;

    try {
      const method = mileForm.id ? "PUT" : "POST";
      const url = mileForm.id
        ? `http://localhost:7001/api/milestones/${mileForm.id}`
        : "http://localhost:7001/api/milestones";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: mileForm.name, weightage: Number(mileForm.weightage) }),
      });

      if (!res.ok) throw new Error("Failed to save milestone");

      setMileForm({ id: "", name: "", weightage: 0 });
      setShowMileForm(false);
      fetchMilestones();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete milestone
  const handleMileDelete = async (id: string) => {
    if (!confirm("Delete this milestone?")) return;
    try {
      const res = await fetch(`http://localhost:7001/api/milestones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchMilestones();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Edit milestone
  const handleMileEdit = (id: string) => {
    const m = milestones.find((x) => x.id === id);
    if (m) {
      setMileForm(m);
      setShowMileForm(true);
    }
  };

  // On mount, fetch data
  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleMileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMileForm({ ...mileForm, [e.target.name]: e.target.name === "weightage" ? Number(e.target.value) : e.target.value });
  };

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-bold">Milestone Master</h1>

      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="mb-4" onClick={() => setShowMileForm(true)}>
            + Add New Milestone
          </Button>

          {showMileForm && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{mileForm.id ? "Edit Milestone" : "Add New Milestone"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input name="name" placeholder="Milestone Name" value={mileForm.name} onChange={handleMileChange} />
                <Input
                  name="weightage"
                  type="number"
                  placeholder="Weightage"
                  value={mileForm.weightage}
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
                <TableHead>Weightage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.weightage}</TableCell>
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
    </div>
  );
}
