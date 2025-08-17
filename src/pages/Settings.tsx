import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useThemeStore } from '@/store/themeStore';

export function Settings() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your preferences</p>
      </div>

      {/* Appearance */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch 
              id="dark-mode" 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <Switch id="sms-notifications" />
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="two-factor-auth">Enable Two-Factor Authentication</Label>
            <Switch id="two-factor-auth" />
          </div>
          <Button variant="outline">Invite New User</Button>
        </CardContent>
      </Card>

      {/* Project Defaults */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Project Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="default-view">Default Project View</Label>
            <select id="default-view" className="border rounded p-1">
              <option value="kanban">Kanban</option>
              <option value="list">List</option>
              <option value="calendar">Calendar</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="session-timeout">Session Timeout (mins)</Label>
            <input id="session-timeout" type="number" className="border rounded p-1 w-20" defaultValue={30} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
