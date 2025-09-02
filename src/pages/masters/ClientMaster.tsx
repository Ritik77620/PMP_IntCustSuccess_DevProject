import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/config/apiConfig";

// types
interface Unit {
  unitName: string;
}

interface Location {
  locationName: string;
  spoc: string; // SPOC per location
  units: Unit[];
}

interface Client {
  _id?: string;
  clientName: string;
  gst: string;
  email: string;
  locations: Location[];
}

export function ClientMaster() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<Client>({
    clientName: "",
    gst: "",
    email: "",
    locations: [{ locationName: "", spoc: "", units: [{ unitName: "" }] }],
  });
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.clients);
      setClients(res.data || []);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (index: number, field: "locationName" | "spoc", value: string) => {
    const updated = [...form.locations];
    updated[index][field] = value;
    setForm({ ...form, locations: updated });
  };

  const handleUnitChange = (locIndex: number, unitIndex: number, value: string) => {
    const updated = [...form.locations];
    updated[locIndex].units[unitIndex].unitName = value;
    setForm({ ...form, locations: updated });
  };

  const addLocation = () => {
    setForm({
      ...form,
      locations: [...form.locations, { locationName: "", spoc: "", units: [{ unitName: "" }] }],
    });
  };

  const addUnit = (locIndex: number) => {
    const updated = [...form.locations];
    updated[locIndex].units.push({ unitName: "" });
    setForm({ ...form, locations: updated });
  };

  const handleSave = async () => {
    // Validation: Client Name & Email required
    if (!form.clientName.trim() || !form.email.trim()) {
      alert("Client Name and Email are required");
      return;
    }

    // Capitalize first letter helper
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const payload: Client = {
      ...form,
      clientName: capitalize(form.clientName.trim()),
      locations: form.locations
        .filter(loc => loc.locationName.trim() !== "")
        .map(loc => ({
          locationName: capitalize(loc.locationName.trim()),
          spoc: capitalize(loc.spoc.trim()),
          units: loc.units
            .filter(u => u.unitName.trim() !== "")
            .map(u => ({ unitName: capitalize(u.unitName.trim()) })),
        })),
    };

    try {
      if (form._id) {
        await api.put(API_ENDPOINTS.clientById(form._id), payload);
      } else {
        await api.post(API_ENDPOINTS.clients, payload);
      }
      fetchClients();
      setForm({
        clientName: "",
        gst: "",
        email: "",
        locations: [{ locationName: "", spoc: "", units: [{ unitName: "" }] }],
      });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save client", err);
      alert("Failed to save client");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(API_ENDPOINTS.clientById(deleteId));
      fetchClients();
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete client", err);
      alert("Failed to delete client");
    }
  };

  const handleEdit = (id: string) => {
    const client = clients.find(c => c._id === id);
    if (client) {
      setForm(client);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Client Master</h1>
      <Button onClick={() => setShowForm(true)}>+ Add New Client</Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form._id ? "Edit Client" : "Add New Client"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="clientName" placeholder="Client Name" value={form.clientName} onChange={handleChange} required />
            <Input name="gst" placeholder="GST" value={form.gst} onChange={handleChange} />
            <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} />

            <h3 className="font-semibold">Locations & Units</h3>
            {form.locations.map((loc, locIndex) => (
              <div key={locIndex} className="border p-2 rounded-md mb-2">
                <Input
                  placeholder="Location Name"
                  value={loc.locationName}
                  onChange={e => handleLocationChange(locIndex, "locationName", e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="SPOC"
                  value={loc.spoc}
                  onChange={e => handleLocationChange(locIndex, "spoc", e.target.value)}
                  className="mb-2"
                />
                {loc.units.map((unit, unitIndex) => (
                  <Input
                    key={unitIndex}
                    placeholder="Unit Name"
                    value={unit.unitName}
                    onChange={e => handleUnitChange(locIndex, unitIndex, e.target.value)}
                    className="mb-1"
                  />
                ))}
                <Button size="sm" onClick={() => addUnit(locIndex)}>+ Add Unit</Button>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={addLocation}>+ Add Location</Button>

            <div className="flex space-x-2 mt-4">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Clients List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>SPOCs</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients
                .slice()
                .sort((a, b) => a.clientName.localeCompare(b.clientName))
                .map(c => {
                  const locs = c.locations || [];
                  const locationNames = locs.map(l => l.locationName).join(", ");
                  const spocs = locs.map(l => l.spoc).join(", ");
                  const unitNames = locs
                    .map(l => l.units?.map(u => u.unitName).join(", "))
                    .filter(u => u)
                    .join("; ");
                  return (
                    <TableRow key={c._id}>
                      <TableCell>{c.clientName}</TableCell>
                      <TableCell>{c.gst}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{locationNames}</TableCell>
                      <TableCell>{spocs}</TableCell>
                      <TableCell>{unitNames}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" onClick={() => handleEdit(c._id!)}>Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" onClick={() => setDeleteId(c._id!)}>
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the client record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
