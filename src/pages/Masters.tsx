import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database, Users, Building, FolderKanban, Briefcase, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Masters() {
  const navigate = useNavigate();

  const masterItems = [
    {
      title: 'Project Master',
      description: 'Manage projects with details and linked milestones',
      icon: FolderKanban,
      route: '/masters/project',
    },
    {
      title: 'Milestone Master',
      description: 'Define project phases, deliverables, and timelines',
      icon: Layers,
      route: '/masters/milestone',
    },
    {
      title: 'Client Master',
      description: 'Manage client information and contacts',
      icon: Building,
      route: '/masters/client',
    },
    {
      title: 'Vendor Master',
      description: 'Manage vendors, locations, and GST details',
      icon: Briefcase,
      route: '/masters/vendor',
    },
    {
      title: 'User Master',
      description: 'Manage user roles, access, and credentials',
      icon: Users,
      route: '/masters/user',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Masters</h1>
          <p className="text-muted-foreground">
            Manage master data and configurations
          </p>
        </div>
      </div>

      {/* Master Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterItems.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-glow transition-smooth"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{item.description}</p>
              <Button
                className="w-full"
                onClick={() => navigate(item.route)}
              >
                Manage {item.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
