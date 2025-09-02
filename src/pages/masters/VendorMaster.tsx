"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/config/apiConfig";

interface Vendor {
  id: string;
  vendorName: string;
  vendorLocation: string;
  vendorGst: string;
  email: string;
  spoc: string;
}

export function VendorMaster() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [form, setForm] = useState<Omit<Vendor, "id"> & { id?: string }>({
    vendorName: "",
    vendorLocation: "",
    vendorGst: "",
    email: "",
    spoc: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.vendors);
      const sorted = res.data.sort((a: Vendor, b: Vendor) =>
        a.vendorName.localeCompare(b.vendorName)
      );
      setVendors(sorted);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.vendorName.trim()) {
      alert("Vendor Name is required");
      return;
    }
    try {
      const payload = {
        vendorName: form.vendorName,
        vendorLocation: form.vendorLocation,
        vendorGst: form.vendorGst,
        email: form.email,
        spoc: form.spoc,
      };
      if (form.id) {
        await api.put(API_ENDPOINTS.vendorById(form.id), payload);
      } else {
        await api.post(API_ENDPOINTS.vendors, payload);
      }
      await fetchVendors();
      setForm({ vendorName: "", vendorLocation: "", vendorGst: "", email: "", spoc: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save vendor", err);
      alert("Failed to save vendor");
    }
  };

  const handleEdit = (id: string) => {
    const vendor = vendors.find((v) => v.id === id);
    if (vendor) {
      const { id: vendorId, ...rest } = vendor;
      setForm({ ...rest, id: vendorId });
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await api.delete(API_ENDPOINTS.vendorById(id));
      fetchVendors();
    } catch (err) {
      console.error("Failed to delete vendor", err);
      alert("Failed to delete vendor");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Vendor Master</h1>

      <Button onClick={() => setShowForm(true)}>+ Add New Vendor</Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "Edit Vendor" : "Add New Vendor"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="vendorName"
              placeholder="Vendor Name"
              value={form.vendorName}
              onChange={handleChange}
              required
            />
            <Input
              name="vendorLocation"
              placeholder="Vendor Location"
              value={form.vendorLocation}
              onChange={handleChange}
            />
            <Input
              name="vendorGst"
              placeholder="Vendor GST"
              value={form.vendorGst}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              name="spoc"
              placeholder="SPOC"
              value={form.spoc}
              onChange={handleChange}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Vendors List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SPOC</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.vendorName}</TableCell>
                  <TableCell>{v.vendorLocation}</TableCell>
                  <TableCell>{v.vendorGst}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell>{v.spoc}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(v.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(v.id)}>
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
