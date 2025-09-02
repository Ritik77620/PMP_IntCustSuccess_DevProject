import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api"; // ✅ api already has baseURL

interface User {
  _id?: string;
  name: string;
  userId: string;
  passCode: string;
  role: "Write" | "View";
  email: string;
}

export default function UserMaster() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<User>({
    name: "",
    userId: "",
    passCode: "",
    role: "View",
    email: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("http://localhost:7001/api/users"); // ✅ use relative path
        setUsers(res.data);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.error || "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleChange = (value: "Write" | "View") =>
    setForm({ ...form, role: value });

  const resetForm = () => {
    setForm({
      name: "",
      userId: "",
      passCode: "",
      role: "View",
      email: "",
    });
    setShowForm(false);
  };

  // Save user
  const handleSave = async () => {
    if (!form.name || !form.userId || !form.passCode || !form.email) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      if (form._id) {
        const res = await api.put(`http://localhost:7001/api/users/${form._id}`, form); // ✅
        setUsers(users.map((u) => (u._id === form._id ? res.data : u)));
        toast({ title: "User updated successfully" });
      } else {
        const res = await api.post("http://localhost:7001/api/users/register", form); // ✅
        setUsers([...users, res.data]);
        toast({ title: "User created successfully" });
      }
      resetForm();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to save user",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Edit user
  const handleEdit = (id: string) => {
    const user = users.find((u) => u._id === id);
    if (user) {
      setForm(user);
      setShowForm(true);
    }
  };

  // Delete user
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`http://localhost:7001/api/users/${id}`); // ✅
      setUsers(users.filter((u) => u._id !== id));
      toast({ title: "User deleted successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">User Master</h1>

      <Button onClick={() => setShowForm(true)}>+ Add New User</Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{form._id ? "Edit User" : "Add New User"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              name="userId"
              placeholder="User ID"
              value={form.userId}
              onChange={handleChange}
            />
            <Input
              name="passCode"
              placeholder="PassCode"
              value={form.passCode}
              onChange={handleChange}
              type="password"
            />
            <Select value={form.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Write">Write</SelectItem>
                <SelectItem value="View">View</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              type="email"
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.userId}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" onClick={() => handleEdit(u._id!)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(u._id!)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
