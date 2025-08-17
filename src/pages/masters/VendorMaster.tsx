import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Vendor {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorLocation: string;
  vendorGst: string;
  email: string;
  spoc: string;
}

export function VendorMaster() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [form, setForm] = useState<Vendor>({
    id: '',
    vendorId: '',
    vendorName: '',
    vendorLocation: '',
    vendorGst: '',
    email: '',
    spoc: '',
  });

  const [showForm, setShowForm] = useState(false); // Control form visibility

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vendors');
    if (stored) setVendors(JSON.parse(stored));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.vendorId || !form.vendorName) return;

    if (form.id) {
      setVendors(vendors.map(v => (v.id === form.id ? form : v)));
    } else {
      setVendors([...vendors, { ...form, id: Date.now().toString() }]);
    }

    setForm({ id: '', vendorId: '', vendorName: '', vendorLocation: '', vendorGst: '', email: '', spoc: '' });
    setShowForm(false); // Hide form after saving
  };

  const handleEdit = (id: string) => {
    const vendor = vendors.find(v => v.id === id);
    if (vendor) {
      setForm(vendor);
      setShowForm(true); // Show form when editing
    }
  };

  const handleDelete = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Vendor Master</h1>

      {/* Button to open the Add New Vendor form */}
      <Button onClick={() => setShowForm(true)}>+ Add New Vendor</Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit Vendor' : 'Add New Vendor'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="vendorId" placeholder="Vendor ID" value={form.vendorId} onChange={handleChange} />
            <Input name="vendorName" placeholder="Vendor Name" value={form.vendorName} onChange={handleChange} />
            <Input name="vendorLocation" placeholder="Vendor Location" value={form.vendorLocation} onChange={handleChange} />
            <Input name="vendorGst" placeholder="Vendor GST" value={form.vendorGst} onChange={handleChange} />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <Input name="spoc" placeholder="SPOC" value={form.spoc} onChange={handleChange} />
            <div className="flex space-x-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendors List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID</TableHead>
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
                  <TableCell>{v.vendorId}</TableCell>
                  <TableCell>{v.vendorName}</TableCell>
                  <TableCell>{v.vendorLocation}</TableCell>
                  <TableCell>{v.vendorGst}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell>{v.spoc}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(v.id)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(v.id)}>Delete</Button>
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
