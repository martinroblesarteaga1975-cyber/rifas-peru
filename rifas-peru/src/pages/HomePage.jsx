import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Ticket, Trophy, Users, TrendingUp, Share2, QrCode, X, Download, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import RaffleCard from '../components/RaffleCard';
import { useRaffles } from '../contexts/RaffleContext';

const HomePage = () => {
  const {
    raffles,
    getStats
  } = useRaffles();
  const stats = getStats();
  
  // Estados para los modales
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  // URLs (actualizarás después)
  const appUrl = 'https://tu-app-hostinger.com';
  const apkUrl = 'https://tu-app-hostinger.com/app.apk';
  
  const statsData = [{
    icon: Ticket,
    label: 'Rifas Activas',
    value: stats.activeRaffles,
    color: '#00AEEF'
  }, {
    icon: Users,
    label: 'Tickets Vendidos',
    value: stats.totalTicketsSold,
    color: '#FFD700'
  }, {
    icon: TrendingUp,
    label: 'Ingresos Totales',
    value: `S/ ${stats.totalRevenue.toFixed(2)}`,
    color: '#00AEEF'
  }, {
    icon: Trophy,
    label: 'Premios Entregados',
    value: '12',
    color: '#FFD700'
  }];
  
  // Función para generar el código QR
  const generateQRCode = () => {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`;
    setQrCodeUrl(qrApiUrl);
    setShowShareModal(true);
  };
  
  // Función para compartir en WhatsApp
  const shareToWhatsApp = () => {
    const message = `🎉 ¡Únete a RifaPeru y gana premios increíbles! 🎁\n\n📱 Descarga nuestra app y participa en rifas emocionantes:\n${appUrl}\n\n🔥 ¡No te lo pierdas! 🔥`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  // Función para compartir con QR
  const shareWithQR = () => {
    generateQRCode();
  };
  
  // Función para descargar el QR
  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'RifaPeru-QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Función para descargar la app
  const handleDownload = () => {
    window.open(apkUrl, '_blank');
    setShowDownloadModal(true);
  };
  
  const features = [
    'Rifas seguras y confiables',
    'Pagos integrados',
    'Notificaciones de ganadores',
    'Historial de participaciones',
    'Soporte 24/7'
  ];
  
  return <>
      <Helmet>
        <title>RifaPeru - Sistema de Rifas Online</title>
        <meta name="description" content="Participa en rifas online y gana increíbles premios. Sistema seguro y confiable de rifas en Perú." />
      </Helmet>

      <div className="min-h-screen bg-[#0D1B2A]">
        <Navbar />

        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF]/20 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-gradient">Gana Premios</span>
                <br />
                <span className="text-white">Increíbles</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Participa en nuestras rifas online y ten la oportunidad de ganar los mejores premios.
                ¡Seguro, rápido y confiable!
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <motion.div whileHover={{
                scale: 1.05
              }} className="glass-effect px-8 py-4 rounded-full border-2 border-[#00AEEF]">
                  <span className="text-2xl font-bold text-[#FFD700]">100%</span>
                  <span className="text-white ml-2">Seguro</span>
                </motion.div>
                <motion.div whileHover={{
                scale: 1.05
              }} className="glass-effect px-8 py-4 rounded-full border-2 border-[#FFD700]">
                  <span className="text-2xl font-bold text-[#00AEEF]">24/7</span>
                  <span className="text-white ml-2">Disponible</span>
                </motion.div>
              </div>
              
              {/* Botones principales */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareToWhatsApp}
                  className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#128C7E] transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Compartir en WhatsApp
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareWithQR}
                  className="bg-[#00AEEF] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0080B8] transition-all"
                >
                  <QrCode className="w-5 h-5" />
                  Compartir con QR
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0D1B2A] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-[#FFA500] hover:to-[#FF8C00] transition-all"
                >
                  <Download className="w-5 h-5" />
                  Descargar App
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-transparent to-[#0D1B2A]/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }} className="glass-effect p-6 rounded-xl text-center">
                  <stat.icon className="w-12 h-12 mx-auto mb-4" style={{
                color: stat.color
                  }} />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>)}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Rifas Activas</h2>
              <p className="text-gray-400">Elige tu rifa favorita y participa ahora</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {raffles.filter(r => r.status === 'active').map((raffle, index) => <motion.div key={raffle.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }}>
                  <RaffleCard raffle={raffle} />
                </motion.div>)}
            </div>
          </div>
        </section>
        
        {/* Modal para compartir con QR */}
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0D1B2A] p-8 rounded-xl max-w-md w-full border border-[#00AEEF]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Compartir con QR</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-300 mb-4">
                  Escanea este código QR para descargar RifaPeru
                </p>
                
                {qrCodeUrl && (
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                )}
                
                <p className="text-sm text-gray-400 mb-6">
                  {appUrl}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 bg-[#00AEEF] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#0080B8] transition-all"
                >
                  <Download className="w-4 h-4" />
                  Descargar QR
                </button>
                
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal de instrucciones de descarga */}
        {showDownloadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0D1B2A] p-8 rounded-xl max-w-md w-full border border-[#00AEEF]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">¿Cómo instalar?</h3>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-gray-300 space-y-4">
                <p>La descarga ha comenzado. Sigue estos pasos:</p>
                
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="bg-[#00AEEF] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
                    <span>Ve a la configuración de tu Android y activa "Fuentes desconocidas"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-[#00AEEF] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                    <span>Abre el archivo APK descargado desde tus notificaciones</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-[#00AEEF] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                    <span>Sigue las instrucciones de instalación</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-[#00AEEF] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">4</span>
                    <span>¡Listo! Disfruta de RifaPeru</span>
                  </li>
                </ol>
                
                <div className="mt-6 p-4 bg-[#00AEEF]/20 rounded-lg border border-[#00AEEF]/30">
                  <p className="text-sm">
                    <strong>Nota:</strong> Si la descarga no comenzó automáticamente, 
                    <button 
                      onClick={() => window.open(apkUrl, '_blank')}
                      className="text-[#00AEEF] underline ml-1"
                    >
                      haz clic aquí
                    </button>
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowDownloadModal(false)}
                className="w-full bg-[#00AEEF] text-white px-4 py-2 rounded-lg hover:bg-[#0080B8] transition-all mt-6"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>;
};

export default HomePage;