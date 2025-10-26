import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storageService } from '@/lib/storage';
import { Project, Vulnerability, SeverityLevel } from '@/types';
import { Download, Filter, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(storageService.getProjects());
    setVulnerabilities(storageService.getVulnerabilities());
  };

  const filteredVulnerabilities = vulnerabilities.filter((vuln) => {
    const projectMatch = selectedProject === 'all' || vuln.projectId === selectedProject;
    const severityMatch = selectedSeverity === 'all' || vuln.severity === selectedSeverity;
    return projectMatch && severityMatch;
  });

  const handleExport = () => {
    const data = filteredVulnerabilities.map(v => ({
      Project: projects.find(p => p.id === v.projectId)?.name || 'Unknown',
      Type: v.type,
      File: v.file,
      Severity: v.severity,
      Status: v.status,
      Description: v.description,
      'Suggested Fix': v.suggestedFix,
      'Discovered At': new Date(v.discoveredAt).toLocaleDateString(),
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({ title: 'Report exported successfully' });
  };

  const getSeverityColor = (severity: SeverityLevel) => {
    const colors = {
      critical: 'bg-critical text-white',
      high: 'bg-destructive text-white',
      medium: 'bg-warning text-white',
      low: 'bg-success text-white',
    };
    return colors[severity];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-destructive/20 text-destructive',
      'in-progress': 'bg-warning/20 text-warning',
      fixed: 'bg-success/20 text-success',
      ignored: 'bg-muted text-muted-foreground',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  const stats = {
    total: filteredVulnerabilities.length,
    critical: filteredVulnerabilities.filter(v => v.severity === 'critical').length,
    open: filteredVulnerabilities.filter(v => v.status === 'open').length,
    fixed: filteredVulnerabilities.filter(v => v.status === 'fixed').length,
  };

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Security Reports</h1>
            <p className="text-muted-foreground">
              View and export vulnerability reports
            </p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Issues</p>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-critical">{stats.critical}</div>
              <p className="text-sm text-muted-foreground">Critical</p>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-destructive">{stats.open}</div>
              <p className="text-sm text-muted-foreground">Open</p>
            </CardContent>
          </Card>
          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">{stats.fixed}</div>
              <p className="text-sm text-muted-foreground">Fixed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerabilities Table */}
        <Card className="gradient-card border-0">
          <CardHeader>
            <CardTitle>Vulnerabilities</CardTitle>
            <CardDescription>
              {filteredVulnerabilities.length} issues found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVulnerabilities.map((vuln) => {
                const project = projects.find(p => p.id === vuln.projectId);
                return (
                  <div
                    key={vuln.id}
                    className="p-4 bg-card/50 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{vuln.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {project?.name} • {vuln.file}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(vuln.status)}>
                          {vuln.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm">{vuln.description}</p>
                    
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-primary">
                      <p className="text-sm font-medium mb-1">Suggested Fix:</p>
                      <p className="text-sm text-muted-foreground">{vuln.suggestedFix}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(vuln.discoveredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {filteredVulnerabilities.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No vulnerabilities found with the selected filters
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
