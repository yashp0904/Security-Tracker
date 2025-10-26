import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { storageService } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Project, SeverityLevel } from '@/types';
import { Play, FileUp, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const mockVulnerabilities = [
  {
    type: 'SQL Injection',
    file: '/api/users.js',
    severity: 'critical' as SeverityLevel,
    description: 'Unsanitized user input directly used in SQL query',
    suggestedFix: 'Use parameterized queries or ORM to prevent SQL injection',
  },
  {
    type: 'XSS Vulnerability',
    file: '/components/Comment.tsx',
    severity: 'high' as SeverityLevel,
    description: 'User input rendered without sanitization',
    suggestedFix: 'Use DOMPurify or escape HTML entities before rendering',
  },
  {
    type: 'Insecure Dependency',
    file: 'package.json',
    severity: 'medium' as SeverityLevel,
    description: 'Outdated version of express with known vulnerabilities',
    suggestedFix: 'Update express to latest version (^4.18.0)',
  },
  {
    type: 'Weak Password Policy',
    file: '/auth/register.js',
    severity: 'medium' as SeverityLevel,
    description: 'Password validation allows weak passwords',
    suggestedFix: 'Implement stronger password requirements (min 12 chars, special chars)',
  },
  {
    type: 'Missing Rate Limiting',
    file: '/api/login.js',
    severity: 'high' as SeverityLevel,
    description: 'No rate limiting on authentication endpoint',
    suggestedFix: 'Implement rate limiting using express-rate-limit',
  },
];

const Scan = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [scanType, setScanType] = useState<'static' | 'dependency' | 'dynamic'>('static');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const allProjects = storageService.getProjects();
    setProjects(allProjects);
  }, []);

  const handleScan = async () => {
    if (!selectedProject) {
      toast({
        title: 'Please select a project',
        variant: 'destructive',
      });
      return;
    }

    setIsScanning(true);
    setScanComplete(false);

    // Simulate scan process
    setTimeout(() => {
      const project = projects.find(p => p.id === selectedProject);
      if (!project) return;

      // Create scan record
      const scan = storageService.createScan({
        projectId: selectedProject,
        testerId: user!.id,
        scanType,
        status: 'running',
        vulnerabilities: [],
        riskScore: 0,
      });

      // Create mock vulnerabilities
      const vulnIds: string[] = [];
      mockVulnerabilities.forEach((vuln) => {
        const created = storageService.createVulnerability({
          projectId: selectedProject,
          type: vuln.type,
          file: vuln.file,
          severity: vuln.severity,
          description: vuln.description,
          suggestedFix: vuln.suggestedFix,
          status: 'open',
          discoveredBy: user!.id,
        });
        vulnIds.push(created.id);
      });

      // Update scan with results
      const riskScore = mockVulnerabilities.reduce((score, v) => {
        const severityScores = { critical: 10, high: 7, medium: 4, low: 2 };
        return score + severityScores[v.severity];
      }, 0);

      storageService.updateScan(scan.id, {
        status: 'completed',
        vulnerabilities: vulnIds,
        riskScore,
        completedAt: new Date().toISOString(),
      });

      storageService.updateProject(selectedProject, {
        lastScanned: new Date().toISOString(),
      });

      setIsScanning(false);
      setScanComplete(true);
      
      toast({
        title: 'Scan completed',
        description: `Found ${mockVulnerabilities.length} vulnerabilities`,
      });
    }, 3000);
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

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Scan</h1>
          <p className="text-muted-foreground">
            Run security tests on your projects
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle>Configure Scan</CardTitle>
              <CardDescription>
                Select project and scan type to begin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scanType">Scan Type</Label>
                <Select value={scanType} onValueChange={(v: any) => setScanType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static Code Analysis</SelectItem>
                    <SelectItem value="dependency">Dependency Scanning</SelectItem>
                    <SelectItem value="dynamic">Dynamic Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={handleScan}
                disabled={isScanning || !selectedProject}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Scan
                  </>
                )}
              </Button>

              {isScanning && (
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Analyzing codebase...
                  </p>
                </div>
              )}

              {scanComplete && (
                <div className="flex items-center gap-2 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">Scan completed successfully</span>
                </div>
              )}
            </CardContent>
          </Card>

          {scanComplete && (
            <Card className="gradient-card border-0">
              <CardHeader>
                <CardTitle>Scan Results</CardTitle>
                <CardDescription>
                  Summary of detected vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-critical/10 border border-critical/20 rounded-lg">
                      <p className="text-2xl font-bold">
                        {mockVulnerabilities.filter(v => v.severity === 'critical').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Critical</p>
                    </div>
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-2xl font-bold">
                        {mockVulnerabilities.filter(v => v.severity === 'high').length}
                      </p>
                      <p className="text-sm text-muted-foreground">High</p>
                    </div>
                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <p className="text-2xl font-bold">
                        {mockVulnerabilities.filter(v => v.severity === 'medium').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Medium</p>
                    </div>
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-2xl font-bold">
                        {mockVulnerabilities.filter(v => v.severity === 'low').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Low</p>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => window.location.href = '/reports'}>
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {scanComplete && (
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle>Detected Vulnerabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVulnerabilities.map((vuln, index) => (
                  <div
                    key={index}
                    className="p-4 bg-card/50 border border-border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
                        <div>
                          <h4 className="font-semibold">{vuln.type}</h4>
                          <p className="text-sm text-muted-foreground">{vuln.file}</p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(vuln.severity)}>
                        {vuln.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm">{vuln.description}</p>
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-primary">
                      <p className="text-sm font-medium mb-1">Suggested Fix:</p>
                      <p className="text-sm text-muted-foreground">{vuln.suggestedFix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Scan;
