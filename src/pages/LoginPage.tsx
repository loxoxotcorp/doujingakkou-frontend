import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('john@recruitflow.com');
  const [password, setPassword] = useState('password');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-recruitflow-beige p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg border-recruitflow-beigeDark bg-white">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/lovable-uploads/f7a05abd-b7dd-4d50-bb7c-ccc8e83ab3cb.png"
                alt="RecruitFlow"
                className="h-16"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-recruitflow-brownDark">
              Welcome back
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <div className="text-right text-sm">
                  <Button
                    type="button"
                    variant="link"
                    className="text-recruitflow-brownLight hover:text-recruitflow-brown px-0"
                    onClick={() => alert('Password reset not implemented yet')}
                  >
                    Forgot password?
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-recruitflow-brown hover:bg-recruitflow-brownDark"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </CardFooter>
          </form>
          <div className="p-4 text-center text-sm text-gray-500">
            <p>Demo credentials are prefilled for testing purposes.</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;