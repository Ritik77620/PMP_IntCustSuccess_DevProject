import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export default function TaskManager() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({ name: '', weight: '' });
  const [editingTask, setEditingTask] = useState<any | null>(null);

  const addTask = () => {
    if (!newTask.name || !newTask.weight) return;
    const task = {
      id: Date.now(),
      name: newTask.name,
      weight: parseFloat(newTask.weight),
      status: 'Not Started',
      actualStart: '',
      actualEnd: '',
      bottleneck: '',
      remark: '',
    };
    setTasks([...tasks, task]);
    setNewTask({ name: '', weight: '' });
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const saveEdit = () => {
    setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)));
    setEditingTask(null);
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    let totalWeight = 0;
    let achievedWeight = 0;

    tasks.forEach((t) => {
      totalWeight += t.weight;
      if (t.status === 'Completed') achievedWeight += t.weight;
      if (t.status === 'In Progress') achievedWeight += t.weight * 0.5;
    });

    return totalWeight > 0 ? Math.round((achievedWeight / totalWeight) * 100) : 0;
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Task name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Weight (%)"
            value={newTask.weight}
            onChange={(e) => setNewTask({ ...newTask, weight: e.target.value })}
          />
          <Button onClick={addTask}>+ Add</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium">{task.name}</p>
              <p className="text-sm text-gray-500">Weight: {task.weight}%</p>
              <p className="text-sm">Status: {task.status}</p>
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setEditingTask(task)}>Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  {editingTask && editingTask.id === task.id && (
                    <div className="space-y-3">
                      <Input
                        type="date"
                        value={editingTask.actualStart}
                        onChange={(e) => setEditingTask({ ...editingTask, actualStart: e.target.value })}
                        placeholder="Actual Start Date"
                      />
                      <Input
                        type="date"
                        value={editingTask.actualEnd}
                        onChange={(e) => setEditingTask({ ...editingTask, actualEnd: e.target.value })}
                        placeholder="Actual End Date"
                      />

                      <Select
                        value={editingTask.status}
                        onValueChange={(value) => setEditingTask({ ...editingTask, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Bottleneck"
                        value={editingTask.bottleneck}
                        onChange={(e) => setEditingTask({ ...editingTask, bottleneck: e.target.value })}
                      />
                      <Input
                        placeholder="Remark"
                        value={editingTask.remark}
                        onChange={(e) => setEditingTask({ ...editingTask, remark: e.target.value })}
                      />

                      <Button onClick={saveEdit}>Save</Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="w-full" />
          <p className="text-sm mt-2">{calculateProgress()}% completed</p>
        </CardContent>
      </Card>
    </div>
  );
}
