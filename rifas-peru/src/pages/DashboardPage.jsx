import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Ticket, Trophy, Calendar, Edit2, Save, X, ArrowRight, Phone, Mail, MapPin, CreditCard, UserPlus, MessageCircle, Copy, CheckCircle, Share2, QrCode } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useRaffles } from '../contexts/RaffleContext';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const { getUserTickets, raffles } = useRaffles();
  const navigate = useNavigate();
  const userTickets = getUserTickets(user?.email);
  
  // Estados para el perfil y vendedor
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sellerCode, setSellerCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Estado para el perfil
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dni: user?.dni || '',
    address: user?.address || ''
  });
  
  // URLs
  const appUrl = 'https://tu-app-hostinger.com';

  // Generar código de vendedor único
  const generateSellerCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSellerCode(code);
    setShowSellerModal(true);
  };
  
  // Función para compartir como vendedor
  const shareAsSeller = () => {
    const message = `🎟️ ¡Hola! Soy vendedor de RifaPeru 🎟️\n\n🏆 Participa en nuestras rifas y gana premios increíbles\n💰 ¡Oportunidad única de ganar!\n\n📱 Descarga la app aquí:\n${appUrl}\n\n🎯 Usa mi código: ${sellerCode}\n\n¡Te espero para que ganes! 🎊`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  // Función para compartir en estados de WhatsApp
  const shareToWhatsAppStatus = () => {
    const message = `🎟️ VENDEDOR RIFAPERU 🎟️\n\n🏆 ¡Rifas activas con premios increíbles!\n💰 Participa y gana desde S/1\n\n📱 Descarga la app:\n${appUrl}\n\n🎯 Código: ${sellerCode}\n\n¡Comparte y gana! 🎊`;
    navigator.clipboard.writeText(message);
    alert('¡Mensaje copiado! Ahora pégalo en tus estados de WhatsApp');
  };
  
  // Función para copiar código de vendedor
  const copySellerCode = () => {
    navigator.clipboard.writeText(sellerCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // Función para navegar a la página de rifas
  const handleViewRaffles = () => {
    navigate('/');
  };

  // Manejar cambios en el formulario
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Guardar perfil
  const handleSaveProfile = () => {
    // Validaciones básicas
    if (!profileData.fullName.trim()) {
      alert('Por favor, ingresa tu nombre completo');
      return;
    }
    if (!profileData.email.trim()) {
      alert('Por favor, ingresa tu email');
      return;
    }
    if (!profileData.phone.trim()) {
      alert('Por favor, ingresa tu teléfono');
      return;
    }
    if (!profileData.dni.trim()) {
      alert('Por favor, ingresa tu DNI');
      return;
    }

    // Actualizar usuario (esto dependerá de tu implementación en AuthContext)
    updateUser({
      ...user,
      name: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      dni: profileData.dni,
      address: profileData.address
    });

    setIsEditingProfile(false);
    alert('¡Perfil actualizado correctamente!');
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setProfileData({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dni: user?.dni || '',
      address: user?.address || ''
    });
    setIsEditingProfile(false);
  };
  
  const sellerBenefits = [
    'Gana comisión por cada venta',
    'Código de vendedor único',
    'Seguimiento de tus ventas',
    'Premios por metas alcanzadas',
    'Soporte exclusivo'
  ];

  return (
    <>
      <Helmet>
        <title>Mi Cuenta - RifaPeru</title>
        <meta name="description" content="Gestiona tu cuenta y revisa tus tickets de rifas" />
      </Helmet>

      <div className="min-h-screen bg-[#0D1B2A]">
        <Navbar />

        <div className="container mx-auto px-4 py-6 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Botón para ir a rifas activas - RESPONSIVE */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <div className="bg-gradient-to-r from-[#00AEEF] to-[#0080B8] p-4 sm:p-6 rounded-xl border border-[#00AEEF]/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">¿Listo para ganar?</h2>
                    <p className="text-blue-100 text-sm sm:text-base">Descubre nuestras rifas activas y participa ahora</p>
                  </div>
                  <button
                    onClick={handleViewRaffles}
                    className="bg-white text-[#00AEEF] px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all transform hover:scale-105 text-sm sm:text-base"
                  >
                    <span>Ver Rifas</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Sección de Vendedor - RESPONSIVE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect p-4 sm:p-6 lg:p-8 rounded-xl mb-6 sm:mb-8 border-2 border-[#FFD700]/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                    <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-[#0D1B2A]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Zona de Vendedor</h2>
                    <p className="text-gray-400 text-sm sm:text-base">Gana dinero vendiendo rifas</p>
                  </div>
                </div>
                <button
                  onClick={generateSellerCode}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0D1B2A] px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-[#FFA500] hover:to-[#FF8C00] transition-all text-sm sm:text-base"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generar Código</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Beneficios de ser vendedor:</h3>
                  <ul className="space-y-2">
                    {sellerBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                        <CheckCircle className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3">¿Cómo funciona?</h3>
                  <ol className="space-y-2 text-gray-300 text-sm sm:text-base">
                    <li className="flex gap-2">
                      <span className="bg-[#00AEEF] text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</span>
                      <span>Genera tu código único</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-[#00AEEF] text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</span>
                      <span>Comparte con tus contactos</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-[#00AEEF] text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</span>
                      <span>Gana comisión por cada venta</span>
                    </li>
                  </ol>
                </div>
              </div>
            </motion.div>

            {/* Perfil de Usuario - RESPONSIVE */}
            <div className="glass-effect p-4 sm:p-6 lg:p-8 rounded-xl mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      {profileData.fullName || 'Usuario'}
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">{profileData.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="bg-[#00AEEF]/20 text-[#00AEEF] px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#00AEEF]/30 transition-all text-sm sm:text-base"
                >
                  {isEditingProfile ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {isEditingProfile ? 'Cancelar' : 'Editar Perfil'}
                </button>
              </div>

              {/* Formulario de perfil - RESPONSIVE */}
              {isEditingProfile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 sm:p-6 bg-[#0D1B2A]/50 rounded-lg border border-[#00AEEF]/30"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Información Personal</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-[#0D1B2A]/50 border border-[#00AEEF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] text-sm sm:text-base"
                        placeholder="Ingresa tu nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-3 py-2 sm:pl-10 sm:pr-4 sm:py-2 bg-[#0D1B2A]/50 border border-[#00AEEF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] text-sm sm:text-base"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-3 py-2 sm:pl-10 sm:pr-4 sm:py-2 bg-[#0D1B2A]/50 border border-[#00AEEF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] text-sm sm:text-base"
                          placeholder="+51 999 999 999"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        DNI *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="dni"
                          value={profileData.dni}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-3 py-2 sm:pl-10 sm:pr-4 sm:py-2 bg-[#0D1B2A]/50 border border-[#00AEEF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] text-sm sm:text-base"
                          placeholder="12345678"
                          maxLength="8"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dirección
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-3 py-2 sm:pl-10 sm:pr-4 sm:py-2 bg-[#0D1B2A]/50 border border-[#00AEEF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF] text-sm sm:text-base"
                          placeholder="Av. Principal 123, Lima, Perú"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-[#00AEEF] text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#0080B8] transition-all text-sm sm:text-base"
                    >
                      <Save className="w-4 h-4" />
                      Guardar Cambios
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-700 transition-all text-sm sm:text-base"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Tarjetas de estadísticas - RESPONSIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                <div className="bg-[#0D1B2A]/50 p-4 sm:p-6 rounded-lg border border-[#00AEEF]/30">
                  <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-[#00AEEF] mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-white">{userTickets.length}</div>
                  <div className="text-gray-400 text-sm sm:text-base">Tickets Comprados</div>
                </div>
                <div className="bg-[#0D1B2A]/50 p-4 sm:p-6 rounded-lg border border-[#FFD700]/30">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD700] mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-white">0</div>
                  <div className="text-gray-400 text-sm sm:text-base">Premios Ganados</div>
                </div>
                <div className="bg-[#0D1B2A]/50 p-4 sm:p-6 rounded-lg border border-[#00AEEF]/30">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-[#00AEEF] mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {new Set(userTickets.map(t => t.raffleId)).size}
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">Rifas Participando</div>
                </div>
              </div>
            </div>

            {/* Sección de Tickets - RESPONSIVE */}
            <div className="glass-effect p-4 sm:p-6 lg:p-8 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Mis Tickets</h2>

              {userTickets.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Ticket className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">Aún no has comprado tickets</p>
                  <p className="text-gray-500 text-sm sm:text-base mb-4">¡Participa en nuestras rifas y gana premios increíbles!</p>
                  <button
                    onClick={handleViewRaffles}
                    className="bg-[#00AEEF] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-[#0080B8] transition-all text-sm sm:text-base"
                  >
                    Ver Rifas Disponibles
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {userTickets.map((ticket) => {
                    const raffle = raffles.find(r => r.id === ticket.raffleId);
                    return (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0D1B2A]/50 p-4 sm:p-6 rounded-lg border border-[#00AEEF]/30"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                              <span className="text-white font-bold text-sm sm:text-base">{ticket.number}</span>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-sm sm:text-base">{ticket.raffleTitle}</h3>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                Comprado: {new Date(ticket.purchaseDate).toLocaleDateString('es-PE')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[#FFD700] font-bold text-sm sm:text-base">Número {ticket.number}</div>
                            <div className="text-gray-400 text-xs sm:text-sm">
                              Sorteo: {raffle ? new Date(raffle.drawDate).toLocaleDateString('es-PE') : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal de vendedor - RESPONSIVE */}
      {showSellerModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSellerModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0D1B2A] p-6 sm:p-8 rounded-xl max-w-md w-full border border-[#FFD700]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">¡Tu Código de Vendedor!</h3>
              <button
                onClick={() => setShowSellerModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4 sm:p-6 rounded-lg mb-4">
                <p className="text-[#0D1B2A] font-bold text-base sm:text-lg mb-2">Tu código único:</p>
                <div className="bg-white rounded-lg p-3 sm:p-4 flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-[#0D1B2A]">{sellerCode}</span>
                  <button
                    onClick={copySellerCode}
                    className="bg-[#00AEEF] text-white p-2 rounded hover:bg-[#0080B8] transition-all"
                  >
                    {copiedCode ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm sm:text-base mb-4">
                Comparte este código con tus clientes para ganar comisiones
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={shareAsSeller}
                  className="w-full bg-[#25D366] text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Compartir en WhatsApp
                </button>
                
                <button
                  onClick={shareToWhatsAppStatus}
                  className="w-full bg-[#00AEEF] text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#0080B8] transition-all text-sm sm:text-base"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  Copiar para Estados WhatsApp
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Beneficios de ser vendedor:</h4>
              <ul className="space-y-2">
                {sellerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFD700] flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DashboardPage;
