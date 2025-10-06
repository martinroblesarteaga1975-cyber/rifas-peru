
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Shield, Ticket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from '../components/ui/use-toast';
import { Toaster } from '../components/ui/toaster';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    
    if (result.success && result.isAdmin) {
      toast({
        title: '¡Bienvenido Administrador!',
        description: 'Acceso concedido al panel de administración',
      });
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } else {
      toast({
        title: 'Acceso Denegado',
        description: 'Credenciales de administrador incorrectas',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - RifaPeru</title>
        <meta name="description" content="Panel de administración de RifaPeru" />
      </Helmet>

      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Ticket className="w-10 h-10 text-[#FFD700]" />
              <span className="text-3xl font-bold gradient-gold">RifaPeru Admin</span>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-[#FFD700]" />
              <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
            </div>
            <p className="text-gray-400">Acceso exclusivo para administradores</p>
          </div>

          <div className="glass-effect p-8 rounded-xl border-2 border-[#FFD700]/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email de Administrador</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@rifa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#0D1B2A]/50 border-[#FFD700]/30 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[#0D1B2A]/50 border-[#FFD700]/30 text-white"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FFD700] hover:bg-[#FFA500] text-[#0D1B2A] text-lg py-6 font-bold"
              >
                <Shield className="w-5 h-5 mr-2" />
                Acceder al Panel
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                Credenciales de prueba:<br />
                admin@rifa.com / admin123
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </>
  );
};

export default AdminLoginPage;
  