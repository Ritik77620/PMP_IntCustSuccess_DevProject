import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Clock,
  BarChart3,
  User,
  Settings,
  Database,
  LogOut,
  ChevronRight,
  Menu,
  ListChecks,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
    badge: '',
  },
  /*{
    title: 'Weekly Tracker',
    href: '/timesheet',
    icon: Clock,
    badge: '',
  },*/
  {
    title: 'Ticket Tracker',
    href: '/reports',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Task Tracker',
    href: '/tasks',
    icon: ListChecks,
    badge: null,
  },
  {
    title: 'Masters',
    href: '/masters',
    icon: Database,
    badge: null,
  },
];

const userItems = [
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => setCollapsed(!collapsed);

  return (
    <div
      className={cn(
        'h-screen gradient-primary flex flex-col shadow-elegant transition-width duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <div className="p-2 flex justify-end border-b border-sidebar-border">
        <Button variant="ghost" onClick={handleToggle} className="p-1">
          <Menu className="h-5 w-5 text-sidebar-foreground" />
        </Button>
      </div>

      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
        <div className="h-10 w-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
          <span
            className={cn(
              'text-sidebar-primary-foreground font-bold transition-all duration-300',
              collapsed ? 'hidden' : 'inline'
            )}
          >
            PMP
          </span>
        </div>
        {!collapsed && (
          <div>
            <h2 className="text-sidebar-foreground font-semibold text-lg"></h2>
            <p className="text-sidebar-foreground/70 text-xs font-bold">
              Project Management System
            </p>
          </div>
        )}
      </div>

      {/* Navigation (scrollable) */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth group',
                'hover:bg-sidebar-accent hover:shadow-glow',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                  : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="font-medium">{item.title}</span>}
                {!collapsed && item.badge && (
                  <Badge
                    variant={isActive ? 'secondary' : 'outline'}
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
                {!collapsed && (
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {userItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth',
                  'hover:bg-sidebar-accent',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-2 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      )}

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-sidebar-primary rounded-full flex items-center justify-center">
              <span className="text-sidebar-primary-foreground text-sm font-medium">
                {user?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-sidebar-foreground/70 text-xs truncate">
                {user?.designation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
