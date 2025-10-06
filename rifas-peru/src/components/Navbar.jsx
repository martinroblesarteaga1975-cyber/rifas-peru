import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
const Navbar = () => {
  const {
    user,
    isAdmin,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} className="glass-effect sticky top-0 z-50 border-b border-[#00AEEF]/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Ticket className="w-8 h-8 text-[#00AEEF]" />
            <span className="text-2xl font-bold text-gradient">Rifas Online</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? <>
                <span className="text-sm text-gray-300 hidden sm:block">
                  Hola, {user.name || user.email}
                </span>
                {isAdmin ? <Button onClick={() => navigate('/admin/dashboard')} className="bg-[#FFD700] hover:bg-[#FFA500] text-[#0D1B2A]">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin
                  </Button> : <Button onClick={() => navigate('/dashboard')} className="bg-[#00AEEF] hover:bg-[#0077B6]">
                    <User className="w-4 h-4 mr-2" />
                    Mi Cuenta
                  </Button>}
                <Button onClick={handleLogout} variant="outline" className="border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </> : <>
                <Button onClick={() => navigate('/login')} variant="outline" className="border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white">
                  Iniciar Sesión
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-[#00AEEF] hover:bg-[#0077B6]">
                  Registrarse
                </Button>
              </>}
          </div>
        </div>
      </div>
    </motion.nav>;
};
export default Navbar;