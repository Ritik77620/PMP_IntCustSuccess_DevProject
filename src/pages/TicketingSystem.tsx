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

  useEffect(() => {
    loadTickets();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

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

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <input
            type="text"
            name="ticketNumber"
            value={form.ticketNumber}
            readOnly
            className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            placeholder="Ticket Number (generated on save)"
          />

          {[
            { name: "clientName", placeholder: "Client Name" },
            { name: "location", placeholder: "Location" },
            {
              name: "category",
              placeholder: "Category",
              type: "select",
              options: [
                "Issue",
                "Understanding",
                "Requirement",
                "Client's Scope",
                "Development",
              ],
            },
            { name: "raisedBy", placeholder: "Raised By" },
            { name: "assignedTo", placeholder: "Assigned To" },
            { name: "description", placeholder: "Description" },
            {
              name: "status",
              placeholder: "Status",
              type: "select",
              options: ["Open", "Closed", "Hold"],
            },
            {
              name: "priority",
              placeholder: "Priority",
              type: "select",
              options: ["Low", "Medium", "High"],
            },
            { name: "resolution", placeholder: "Resolution" },
            { name: "dateClosed", placeholder: "Date Closed", type: "date" },
            { name: "timeClosed", placeholder: "Time Closed", type: "time" },
          ].map((field) =>
            field.type === "select" ? (
              <select
                key={field.name}
                name={field.name}
                value={form[field.name as keyof Ticket] as string}
                onChange={handleChange}
                className="input-field border-blue-300"
              >
                {field.options!.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={field.name}
                type={field.type || "text"}
                name={field.name}
                value={form[field.name as keyof Ticket] as string}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="input-field border-blue-300"
              />
            )
          )}

          <input
            type="text"
            name="dateRaised"
            value={form.dateRaised || new Date().toISOString().split("T")[0]}
            readOnly
            className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            placeholder="Date Raised"
          />
          <input
            type="text"
            name="timeRaised"
            value={form.timeRaised || new Date().toTimeString().slice(0, 5)}
            readOnly
            className="input-field border-blue-300 bg-gray-100 cursor-not-allowed"
            placeholder="Time Raised"
          />
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
                  <td className="p-2">{ticket.status}</td>
                  <td className="p-2">{ticket.priority}</td>
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
