import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit, Trash2 } from 'lucide-react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState } from 'react';

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

export function TicketingSystem() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
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

  // Utility: generate ticket number based on DDMMYYYYHHMM
  const generateTicketNumber = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${dd}${mm}${yyyy}${hh}${min}`;
  };

  // Utility: calculate days between start and end
  const calculateElapsedDays = (startDate: string, startTime: string, endDate: string, endTime: string) => {
    if (!startDate || !startTime || !endDate || !endTime) return "";
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return "0";
    return (diffMs / (1000 * 60 * 60 * 24)).toFixed(2); // days with 2 decimals
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    // Auto calculate elapsed days if closed date/time is updated
    if (name === "dateClosed" || name === "timeClosed" || name === "status") {
      if (updatedForm.status === "Closed") {
        updatedForm.totalDaysElapsed = calculateElapsedDays(
          updatedForm.dateRaised,
          updatedForm.timeRaised,
          updatedForm.dateClosed,
          updatedForm.timeClosed
        );
      }
    }
    setForm(updatedForm);
  };

  // Add or update ticket
  const handleSubmit = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    let newTicket: Ticket = {
      ...form,
      id: form.id || Date.now().toString(),
      ticketNumber: form.ticketNumber || generateTicketNumber(),
      dateRaised: form.dateRaised || today,
      timeRaised: form.timeRaised || currentTime,
    };

    if (newTicket.status === "Closed") {
      newTicket.totalDaysElapsed = calculateElapsedDays(
        newTicket.dateRaised,
        newTicket.timeRaised,
        newTicket.dateClosed,
        newTicket.timeClosed
      );
    }

    if (editingIndex !== null) {
      const updatedTickets = [...tickets];
      updatedTickets[editingIndex] = newTicket;
      setTickets(updatedTickets);
      setEditingIndex(null);
    } else {
      setTickets([...tickets, newTicket]);
    }

    // Reset form
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
  };

  // Edit ticket
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setForm(tickets[index]);
  };

  // Delete ticket
  const handleDelete = (index: number) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
    setTickets(updatedTickets);
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "tickets.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ticketing System</h1>
        <Button className="gradient-primary flex items-center gap-2" onClick={exportToExcel}>
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
          {[
            { name: "clientName", placeholder: "Client Name" },
            { name: "location", placeholder: "Location" },
            { name: "category", placeholder: "Category", type: "select", options: ["Issue", "Understanding", "Requirement", "Client's Scope", "Development"] },
            { name: "raisedBy", placeholder: "Raised By" },
            { name: "assignedTo", placeholder: "Assigned To" },
            { name: "description", placeholder: "Description" },
            { name: "status", placeholder: "Status", type: "select", options: ["Open", "Closed", "Hold"] },
            { name: "priority", placeholder: "Priority", type: "select", options: ["Low", "Medium", "High"] },
            { name: "resolution", placeholder: "Resolution" },
            { name: "dateClosed", placeholder: "Date Closed", type: "date" },
            { name: "timeClosed", placeholder: "Time Closed", type: "time" },
          ].map((field) =>
            field.type === "select" ? (
              <select
                key={field.name}
                name={field.name}
                value={form[field.name as keyof Ticket]}
                onChange={handleChange}
                className="input-field border-blue-300"
              >
                {field.options!.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                key={field.name}
                type={field.type || "text"}
                name={field.name}
                value={form[field.name as keyof Ticket]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="input-field border-blue-300"
              />
            )
          )}

          {/* Auto Date Raised (read-only) */}
          <input
            type="text"
            name="dateRaised"
            value={form.dateRaised || new Date().toISOString().split("T")[0]}
            readOnly
            className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            placeholder="Date Raised"
          />

          {/* Auto Time Raised (read-only) */}
          <input
            type="text"
            name="timeRaised"
            value={form.timeRaised || new Date().toTimeString().slice(0, 5)}
            readOnly
            className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            placeholder="Time Raised"
          />

          {/* Auto Total Days Elapsed (read-only) */}
          <input
            type="text"
            name="totalDaysElapsed"
            value={form.totalDaysElapsed}
            readOnly
            className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            placeholder="Total Days Elapsed"
          />
        </CardContent>
        <CardContent>
          <Button onClick={handleSubmit} className="gradient-primary">
            {editingIndex !== null ? "Update Ticket" : "Add Ticket"}
          </Button>
        </CardContent>
      </Card>

      {/* Ticket Table */}
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
                ].map((h) => (
                  <th key={h} className="p-2 text-left border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, index) => (
                <tr key={t.id} className={`${editingIndex === index ? "bg-yellow-100" : ""} border-b`}>
                  <td className="p-2">{t.ticketNumber}</td>
                  <td className="p-2">{t.clientName}</td>
                  <td className="p-2">{t.location}</td>
                  <td className="p-2">{t.dateRaised}</td>
                  <td className="p-2">{t.timeRaised}</td>
                  <td className="p-2">{t.category}</td>
                  <td className="p-2">{t.raisedBy}</td>
                  <td className="p-2">{t.assignedTo}</td>
                  <td className="p-2">{t.description}</td>
                  <td className="p-2">{t.totalDaysElapsed}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">{t.priority}</td>
                  <td className="p-2">{t.resolution}</td>
                  <td className="p-2">{t.dateClosed}</td>
                  <td className="p-2">{t.timeClosed}</td>
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
