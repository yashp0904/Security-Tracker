import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storageService } from '@/lib/storage';
import { User, Project } from '@/types';
import { Users, FolderKanban, Shield, TrendingUp } from 'lucide-react';

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    setUsers(storageService.getUsers());
    setProjects(storageService.getProjects());
    setScans(storageService.getScans());
  }, []);

  const stats = {
    totalUsers: users.length,
    totalProjects: projects.length,
    totalScans: scans.length,
    activeTesters: users.filter(u => u.role === 'tester').length,
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-primary text-primary-foreground',
      tester: 'bg-secondary text-secondary-foreground',
      developer: 'bg-accent text-accent-foreground',
    };
    return colors[role as keyof typeof colors];
  };

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Projects</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalProjects}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalScans}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Testers</p>
                  <p className="text-3xl font-bold mt-2">{stats.activeTesters}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="gradient-card border-0">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-card/50 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="gradient-card border-0">
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scans.slice(0, 5).map((scan) => {
                const project = projects.find(p => p.id === scan.projectId);
                const tester = users.find(u => u.id === scan.testerId);
                
                return (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 bg-card/50 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{project?.name || 'Unknown Project'}</p>
                      <p className="text-sm text-muted-foreground">
                        by {tester?.name} • {new Date(scan.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={scan.status === 'completed' ? 'default' : 'secondary'}>
                        {scan.status}
                      </Badge>
                      {scan.status === 'completed' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Risk Score: {scan.riskScore}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {scans.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No scans performed yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;
