import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storageService } from '@/lib/storage';
import { AlertTriangle, CheckCircle, Shield, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalVulnerabilities: 0,
    criticalIssues: 0,
    resolvedIssues: 0,
  });

  const [severityData, setSeverityData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const projects = storageService.getProjects();
    const vulnerabilities = storageService.getVulnerabilities();

    const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
    const resolvedCount = vulnerabilities.filter(v => v.status === 'fixed').length;

    setStats({
      totalProjects: projects.length,
      totalVulnerabilities: vulnerabilities.length,
      criticalIssues: criticalCount,
      resolvedIssues: resolvedCount,
    });

    // Severity distribution
    const severityCounts = {
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
    };

    setSeverityData([
      { name: 'Critical', value: severityCounts.critical, color: 'hsl(var(--critical))' },
      { name: 'High', value: severityCounts.high, color: 'hsl(var(--destructive))' },
      { name: 'Medium', value: severityCounts.medium, color: 'hsl(var(--warning))' },
      { name: 'Low', value: severityCounts.low, color: 'hsl(var(--success))' },
    ]);

    // Mock trend data
    setTrendData([
      { month: 'Jan', vulnerabilities: 45 },
      { month: 'Feb', vulnerabilities: 52 },
      { month: 'Mar', vulnerabilities: 38 },
      { month: 'Apr', vulnerabilities: 65 },
      { month: 'May', vulnerabilities: 42 },
      { month: 'Jun', vulnerabilities: vulnerabilities.length },
    ]);
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Shield,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Vulnerabilities',
      value: stats.totalVulnerabilities,
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      title: 'Critical Issues',
      value: stats.criticalIssues,
      icon: TrendingUp,
      color: 'text-critical',
      bg: 'bg-critical/10',
    },
    {
      title: 'Resolved',
      value: stats.resolvedIssues,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of security testing activities and vulnerabilities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="gradient-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle>Vulnerability Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Bar dataKey="vulnerabilities" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle>Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
