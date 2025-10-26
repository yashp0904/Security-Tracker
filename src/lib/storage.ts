import { User, Project, Vulnerability, ScanResult } from '@/types';

const STORAGE_KEYS = {
  USERS: 'security_portal_users',
  CURRENT_USER: 'security_portal_current_user',
  PROJECTS: 'security_portal_projects',
  VULNERABILITIES: 'security_portal_vulnerabilities',
  SCANS: 'security_portal_scans',
};

// Initialize with demo data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const demoUsers: User[] = [
      {
        id: 'admin-1',
        email: 'admin@secportal.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'tester-1',
        email: 'tester@secportal.com',
        name: 'Security Tester',
        role: 'tester',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'dev-1',
        email: 'dev@secportal.com',
        name: 'Developer',
        role: 'developer',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.VULNERABILITIES)) {
    localStorage.setItem(STORAGE_KEYS.VULNERABILITIES, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SCANS)) {
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify([]));
  }
};

export const storageService = {
  // Auth
  login: (email: string, password: string): User | null => {
    initializeStorage();
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email);
    
    if (user && password === 'demo123') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  signup: (email: string, name: string, role: string): User => {
    initializeStorage();
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: role as any,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    initializeStorage();
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  // Projects
  getProjects: (): Project[] => {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  },

  createProject: (project: Omit<Project, 'id' | 'createdAt'>): Project => {
    const projects = storageService.getProjects();
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  },

  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const projects = storageService.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      return projects[index];
    }
    return null;
  },

  deleteProject: (id: string): boolean => {
    const projects = storageService.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    return true;
  },

  // Vulnerabilities
  getVulnerabilities: (): Vulnerability[] => {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VULNERABILITIES) || '[]');
  },

  createVulnerability: (vuln: Omit<Vulnerability, 'id' | 'discoveredAt'>): Vulnerability => {
    const vulnerabilities = storageService.getVulnerabilities();
    const newVuln: Vulnerability = {
      ...vuln,
      id: `vuln-${Date.now()}`,
      discoveredAt: new Date().toISOString(),
    };
    vulnerabilities.push(newVuln);
    localStorage.setItem(STORAGE_KEYS.VULNERABILITIES, JSON.stringify(vulnerabilities));
    return newVuln;
  },

  updateVulnerability: (id: string, updates: Partial<Vulnerability>): Vulnerability | null => {
    const vulnerabilities = storageService.getVulnerabilities();
    const index = vulnerabilities.findIndex(v => v.id === id);
    if (index !== -1) {
      vulnerabilities[index] = { ...vulnerabilities[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.VULNERABILITIES, JSON.stringify(vulnerabilities));
      return vulnerabilities[index];
    }
    return null;
  },

  // Scans
  getScans: (): ScanResult[] => {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCANS) || '[]');
  },

  createScan: (scan: Omit<ScanResult, 'id' | 'startedAt'>): ScanResult => {
    const scans = storageService.getScans();
    const newScan: ScanResult = {
      ...scan,
      id: `scan-${Date.now()}`,
      startedAt: new Date().toISOString(),
    };
    scans.push(newScan);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
    return newScan;
  },

  updateScan: (id: string, updates: Partial<ScanResult>): ScanResult | null => {
    const scans = storageService.getScans();
    const index = scans.findIndex(s => s.id === id);
    if (index !== -1) {
      scans[index] = { ...scans[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
      return scans[index];
    }
    return null;
  },

  // Users
  getUsers: (): User[] => {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
};
