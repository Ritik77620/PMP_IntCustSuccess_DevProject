"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  location: string;
  dateRaised: string;
  timeRaised: string;
  category: string;
  raisedBy: string;
  assignedTo: string;
  description: string;
  totalDaysElapsed: string;
  status: string;
  priority: string;
  resolution: string;
  dateClosed: string;
  timeClosed: string;
}

interface Client {
  name: string;
  location: string;
}

export function TicketingSystem() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Ticket>({
    id: "",
    ticketNumber: "",
    clientName: "",
    location: "",
    dateRaised: "",
    timeRaised: "",
    category: "Issue",
    raisedBy: "",
    assignedTo: "",
    description: "",
    totalDaysElapsed: "",
    status: "Open",
    priority: "Medium",
    resolution: "",
    dateClosed: "",
    timeClosed: "",
  });

  const generateTicketNumber = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${dd}${mm}${yyyy}${hh}${min}`;
  };

  const calculateElapsedDays = (
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ) => {
    if (!startDate || !startTime || !endDate || !endTime) return "";
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return "0";
    return (diffMs / (1000 * 60 * 60 * 24)).toFixed(2);
  };

  const loadTickets = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  const loadClients = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/clients");
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(
        data.map((c: any) => ({ name: c.clientName, location: c.clientLocation }))
      );
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  useEffect(() => {
    loadTickets();
    loadClients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === "clientName") {
      const client = clients.find((c) => c.name === value);
      updatedForm.location = client ? client.location : "";
    }

    if (name === "dateClosed" || name === "timeClosed" || name === "status") {
      if (updatedForm.status === "Closed") {
        updatedForm.totalDaysElapsed = calculateElapsedDays(
          updatedForm.dateRaised,
          updatedForm.timeRaised,
          updatedForm.dateClosed,
          updatedForm.timeClosed
        );
      } else {
        updatedForm.totalDaysElapsed = "";
      }
    }

    setForm(updatedForm);
  };

  const handleSubmit = async () => {
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().slice(0, 5);
      const ticketNumber =
        editingIndex !== null ? form.ticketNumber : generateTicketNumber();

      const newTicket = {
        ...form,
        ticketNumber,
        dateRaised: form.dateRaised || today,
        timeRaised: form.timeRaised || currentTime,
        totalDaysElapsed:
          form.status === "Closed"
            ? calculateElapsedDays(
                form.dateRaised,
                form.timeRaised,
                form.dateClosed,
                form.timeClosed
              )
            : "",
      };

      const method = editingIndex !== null ? "PUT" : "POST";
      const url =
        editingIndex !== null
          ? `http://localhost:5001/api/tickets/${form.id}`
          : "http://localhost:5001/api/tickets";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      if (!res.ok) throw new Error("Failed to save ticket");

      await loadTickets();

      setForm({
        id: "",
        ticketNumber: "",
        clientName: "",
        location: "",
        dateRaised: "",
        timeRaised: "",
        category: "Issue",
        raisedBy: "",
        assignedTo: "",
        description: "",
        totalDaysElapsed: "",
        status: "Open",
        priority: "Medium",
        resolution: "",
        dateClosed: "",
        timeClosed: "",
      });
      setEditingIndex(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setForm(tickets[index]);
  };

  const handleDelete = async (index: number) => {
    try {
      const ticketToDelete = tickets[index];
      if (!confirm("Are you sure you want to delete this ticket?")) return;

      const res = await fetch(
        `http://localhost:5001/api/tickets/${ticketToDelete.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");

      await loadTickets();

      if (editingIndex === index) {
        setEditingIndex(null);
        setForm({
          id: "",
          ticketNumber: "",
          clientName: "",
          location: "",
          dateRaised: "",
          timeRaised: "",
          category: "Issue",
          raisedBy: "",
          assignedTo: "",
          description: "",
          totalDaysElapsed: "",
          status: "Open",
          priority: "Medium",
          resolution: "",
          dateClosed: "",
          timeClosed: "",
        });
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "tickets.xlsx");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed":
        return "bg-green-600";
      case "Open":
        return "bg-red-400";
      case "Hold":
        return "bg-yellow-400";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-400";
      case "Medium":
        return "bg-orange-400";
      case "Low":
        return "bg-yellow-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ticketing System</h1>
        <Button
          className="gradient-primary flex items-center gap-2"
          onClick={exportToExcel}
        >
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Add/Edit Ticket Form */}
      <Card className="border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-blue-600 font-bold">
            {editingIndex !== null ? "Edit Ticket" : "Add Ticket"}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ticket Number */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Ticket Number</label>
            <input
              type="text"
              name="ticketNumber"
              value={form.ticketNumber}
              readOnly
              className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
              placeholder="Ticket Number (generated on save)"
            />
          </div>

          {/* Client */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Client Name</label>
            <select
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              className="input-field border-blue-300"
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              readOnly
              placeholder="Location"
              className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-field border-blue-300"
            >
              {["Issue", "Understanding", "Requirement", "Client's Scope", "Development"].map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Raised By */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Raised By</label>
            <input
              type="text"
              name="raisedBy"
              value={form.raisedBy}
              onChange={handleChange}
              placeholder="Raised By"
              className="input-field border-blue-300"
            />
          </div>

          {/* Assigned To */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Assigned To</label>
            <input
              type="text"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="Assigned To"
              className="input-field border-blue-300"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="input-field border-blue-300"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`input-field border-blue-300 
                ${form.status === "Closed" ? "bg-green-600" : ""} 
                ${form.status === "Open" ? "bg-red-400" : ""} 
                ${form.status === "Hold" ? "bg-yellow-400" : ""}`}
            >
              {["Open", "Closed", "Hold"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={`input-field border-blue-300 
                ${form.priority === "High" ? "bg-red-400" : ""} 
                ${form.priority === "Medium" ? "bg-orange-400" : ""} 
                ${form.priority === "Low" ? "bg-yellow-400" : ""}`}
            >
              {["Low", "Medium", "High"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Resolution */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Resolution</label>
            <input
              type="text"
              name="resolution"
              value={form.resolution}
              onChange={handleChange}
              placeholder="Resolution"
              className="input-field border-blue-300"
            />
          </div>

          {/* Date Closed */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Date Closed</label>
            <input
              type="date"
              name="dateClosed"
              value={form.dateClosed}
              onChange={handleChange}
              className="input-field border-blue-300"
            />
          </div>

          {/* Time Closed */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Time Closed</label>
            <input
              type="time"
              name="timeClosed"
              value={form.timeClosed}
              onChange={handleChange}
              className="input-field border-blue-300"
            />
          </div>

          {/* Date Raised */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Date Raised</label>
            <input
              type="text"
              name="dateRaised"
              value={form.dateRaised || new Date().toISOString().split("T")[0]}
              readOnly
              className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Time Raised */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Time Raised</label>
            <input
              type="text"
              name="timeRaised"
              value={form.timeRaised || new Date().toTimeString().slice(0, 5)}
              readOnly
              className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Total Days Elapsed */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Total Days Elapsed</label>
            <input
              type="text"
              name="totalDaysElapsed"
              value={form.totalDaysElapsed}
              readOnly
              className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </CardContent>

        <CardContent>
          <Button onClick={handleSubmit} className="gradient-primary">
            {editingIndex !== null ? "Update Ticket" : "Add Ticket"}
          </Button>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="table-auto w-full border">
            <thead>
              <tr className="border-b">
                {[
                  "Ticket Number",
                  "Client Name",
                  "Location",
                  "Date Raised",
                  "Time Raised",
                  "Category",
                  "Raised By",
                  "Assigned To",
                  "Description",
                  "Total Days",
                  "Status",
                  "Priority",
                  "Resolution",
                  "Date Closed",
                  "Time Closed",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="p-2 text-left border">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  className={`${editingIndex === index ? "bg-yellow-100" : ""} border-b`}
                >
                  <td className="p-2">{ticket.ticketNumber}</td>
                  <td className="p-2">{ticket.clientName}</td>
                  <td className="p-2">{ticket.location}</td>
                  <td className="p-2">{ticket.dateRaised}</td>
                  <td className="p-2">{ticket.timeRaised}</td>
                  <td className="p-2">{ticket.category}</td>
                  <td className="p-2">{ticket.raisedBy}</td>
                  <td className="p-2">{ticket.assignedTo}</td>
                  <td className="p-2">{ticket.description}</td>
                  <td className="p-2">{ticket.totalDaysElapsed}</td>
                  <td className={`p-2 ${getStatusColor(ticket.status)}`}>{ticket.status}</td>
                  <td className={`p-2 ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</td>
                  <td className="p-2">{ticket.resolution}</td>
                  <td className="p-2">{ticket.dateClosed}</td>
                  <td className="p-2">{ticket.timeClosed}</td>
                  <td className="p-2 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
