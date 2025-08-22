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
    badge: '12',
  },
  {
    title: 'Weekly Tracker',
    href: '/timesheet',
    icon: Clock,
    badge: '3',
  },
  {
    title: 'Reports & Analytics',
    href: '/reports',
    icon: BarChart3,
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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 h-screen gradient-primary flex flex-col shadow-elegant">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold">PP</span>
          </div>
          <div>
            <h2 className="text-sidebar-foreground font-semibold text-lg">PMP</h2>
            <p className="text-sidebar-foreground/70 text-xs">Project Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth group',
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
                <span className="font-medium">{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
                <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
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
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <span className="text-sidebar-primary-foreground text-sm font-medium">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
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
    </div>
  );
}
