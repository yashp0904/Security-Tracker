import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Activity, FileText } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center glow-effect">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            SecurePortal
          </h1>
          
          <p className="text-xl text-white/80 mb-12">
            Enterprise-grade security testing platform for modern development teams
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/signup')}
            >
              Create Account
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Testing</h3>
              <p className="text-white/70">
                Run comprehensive security scans on your applications
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Insights</h3>
              <p className="text-white/70">
                Track vulnerabilities and monitor security trends
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Detailed Reports</h3>
              <p className="text-white/70">
                Generate comprehensive security reports instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
