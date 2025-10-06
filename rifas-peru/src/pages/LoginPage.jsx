
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Ticket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from '../components/ui/use-toast';
import { Toaster } from '../components/ui/toaster';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    
    if (result.success) {
      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente',
      });
      setTimeout(() => {
        navigate(result.isAdmin ? '/admin/dashboard' : '/dashboard');
      }, 500);
    } else {
      toast({
        title: 'Error',
        description: result.message || 'Credenciales incorrectas',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - RifaPeru</title>
        <meta name="description" content="Inicia sesión en RifaPeru para participar en rifas online" />
      </Helmet>

      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Ticket className="w-10 h-10 text-[#00AEEF]" />
              <span className="text-3xl font-bold text-gradient">RifaPeru</span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
            <p className="text-gray-400">Accede a tu cuenta para participar</p>
          </div>

          <div className="glass-effect p-8 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#0D1B2A]/50 border-[#00AEEF]/30 text-white"
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
                    className="pl-10 bg-[#0D1B2A]/50 border-[#00AEEF]/30 text-white"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00AEEF] hover:bg-[#0077B6] text-white text-lg py-6"
              >
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-[#00AEEF] hover:text-[#FFD700] font-semibold">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                Usuarios de prueba:<br />
                Admin: admin@rifa.com / admin123<br />
                Usuario: user@test.com / user123
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </>
  );
};

export default LoginPage;
  