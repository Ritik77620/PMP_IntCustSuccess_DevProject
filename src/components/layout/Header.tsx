import { Search, Bell, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useState } from 'react';

export function Header() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-20 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PPTPL</span>
          </div>
          <h1 className="font-semibold text-lg hidden sm:block">
            Power Profit Technologies Pvt Ltd
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, tasks, employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-smooth focus:shadow-glow"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="transition-smooth hover:shadow-glow"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          
          {/* Notifications 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative transition-smooth">
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 space-y-2">
                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                  <p className="text-sm font-medium">Timesheet pending approval</p>
                  <p className="text-xs text-muted-foreground">3 timesheets need your review</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                  <p className="text-sm font-medium">Project deadline approaching</p>
                  <p className="text-xs text-muted-foreground">Arlyn project due in 5 days</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                  <p className="text-sm font-medium">New task assigned</p>
                  <p className="text-xs text-muted-foreground">API development task assigned to you</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>*/}
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="gradient-primary text-primary-foreground">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {user?.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
