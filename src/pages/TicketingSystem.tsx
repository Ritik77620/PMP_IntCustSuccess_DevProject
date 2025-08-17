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
  dateOfIssueRaised: string;
  timeOfIssueReported: string;
  categories: string;
  raisedBy: string;
  assignedTo: string;
  description: string;
  totalDateElapsed: number;
  status: string;
  priority: string;
  resolution: string;
  dateOfIssueClosed: string;
  timeOfIssueClosed: string;
}

export function TicketingSystem() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Ticket>({
    id: "",
    ticketNumber: "",
    clientName: "",
    location: "",
    dateOfIssueRaised: "",
    timeOfIssueReported: "",
    categories: "Issue",
    raisedBy: "",
    assignedTo: "",
    description: "",
    totalDateElapsed: 0,
    status: "Open",
    priority: "Medium",
    resolution: "",
    dateOfIssueClosed: "",
    timeOfIssueClosed: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update ticket
  const handleSubmit = () => {
    if (editingIndex !== null) {
      const updatedTickets = [...tickets];
      updatedTickets[editingIndex] = form;
      setTickets(updatedTickets);
      setEditingIndex(null);
    } else {
      setTickets([...tickets, { ...form, id: Date.now().toString() }]);
    }
    setForm({
      id: "",
      ticketNumber: "",
      clientName: "",
      location: "",
      dateOfIssueRaised: "",
      timeOfIssueReported: "",
      categories: "Issue",
      raisedBy: "",
      assignedTo: "",
      description: "",
      totalDateElapsed: 0,
      status: "Open",
      priority: "Medium",
      resolution: "",
      dateOfIssueClosed: "",
      timeOfIssueClosed: "",
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

      {/* Add/Edit Ticket Form - Highlighted */}
      <Card className="border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-blue-600 font-bold">{editingIndex !== null ? "Edit Ticket" : "Add Ticket"}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "ticketNumber", placeholder: "Ticket Number" },
            { name: "clientName", placeholder: "Client Name" },
            { name: "location", placeholder: "Location" },
            { name: "dateOfIssueRaised", placeholder: "Date of Issue Raised", type: "date" },
            { name: "timeOfIssueReported", placeholder: "Time of Issue Reported", type: "time" },
            { name: "categories", placeholder: "Categories", type: "select", options: ["Issue","Understanding","Requirement","Client's Scope","Development"] },
            { name: "raisedBy", placeholder: "Raised By" },
            { name: "assignedTo", placeholder: "Assigned To" },
            { name: "description", placeholder: "Description" },
            { name: "totalDateElapsed", placeholder: "Total Date Elapsed", type: "number" },
            { name: "status", placeholder: "Status", type: "select", options: ["Open","Closed","Hold"] },
            { name: "priority", placeholder: "Priority", type: "select", options: ["Low","Medium","High"] },
            { name: "resolution", placeholder: "Resolution" },
            { name: "dateOfIssueClosed", placeholder: "Date of Issue Closed", type: "date" },
            { name: "timeOfIssueClosed", placeholder: "Time of Issue Closed", type: "time" }
          ].map((field) => (
            field.type === "select" ? (
              <select
                key={field.name}
                name={field.name}
                value={form[field.name as keyof Ticket]}
                onChange={handleChange}
                className="input-field border-blue-300"
              >
                {field.options!.map(opt => <option key={opt}>{opt}</option>)}
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
          ))}
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
                {["Ticket Number","Client Name","Location","Date Raised","Time Reported","Categories","Raised By","Assigned To","Description","Total Days","Status","Priority","Resolution","Date Closed","Time Closed","Actions"].map(h => (
                  <th key={h} className="p-2 text-left border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, index) => (
                <tr key={t.id} className={`${editingIndex === index ? "bg-yellow-100" : ""} border-b`}>
                  <td className="p-2">{t.ticketNumber}</td>
                  <td className="p-2">{t.clientName}</td>
                  <td className="p-2">{t.location}</td>
                  <td className="p-2">{t.dateOfIssueRaised}</td>
                  <td className="p-2">{t.timeOfIssueReported}</td>
                  <td className="p-2">{t.categories}</td>
                  <td className="p-2">{t.raisedBy}</td>
                  <td className="p-2">{t.assignedTo}</td>
                  <td className="p-2">{t.description}</td>
                  <td className="p-2">{t.totalDateElapsed}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">{t.priority}</td>
                  <td className="p-2">{t.resolution}</td>
                  <td className="p-2">{t.dateOfIssueClosed}</td>
                  <td className="p-2">{t.timeOfIssueClosed}</td>
                  <td className="p-2 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(index)}><Edit size={16}/></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}><Trash2 size={16}/></Button>
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
