
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Ticket, Trophy, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useRaffles } from '../contexts/RaffleContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { Toaster } from '../components/ui/toaster';

const RaffleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { raffles, purchaseTicket } = useRaffles();
  const { user } = useAuth();
  const raffle = raffles.find(r => r.id === id);
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  if (!raffle) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Rifa no encontrada</h2>
          <Button onClick={() => navigate('/')} className="bg-[#00AEEF] hover:bg-[#0077B6]">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para comprar tickets',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (selectedNumbers.length === 0) {
      toast({
        title: 'Selecciona números',
        description: 'Debes seleccionar al menos un número',
        variant: 'destructive',
      });
      return;
    }

    const result = purchaseTicket(raffle.id, selectedNumbers, user.email);

    if (result.success) {
      toast({
        title: '¡Compra exitosa!',
        description: `Has comprado ${selectedNumbers.length} ticket(s) por S/ ${(selectedNumbers.length * raffle.ticketPrice).toFixed(2)}`,
      });
      setSelectedNumbers([]);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      toast({
        title: 'Error en la compra',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const totalPrice = selectedNumbers.length * raffle.ticketPrice;

  return (
    <>
      <Helmet>
        <title>{raffle.title} - RifaPeru</title>
        <meta name="description" content={`Participa en ${raffle.title} y gana increíbles premios`} />
      </Helmet>

      <div className="min-h-screen bg-[#0D1B2A]">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl overflow-hidden mb-8"
            >
              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div>
                  <img
                    src={raffle.image}
                    alt={raffle.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-4">{raffle.title}</h1>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-[#FFD700] text-[#0D1B2A] px-6 py-3 rounded-full font-bold text-2xl">
                        S/ {raffle.ticketPrice.toFixed(2)}
                      </div>
                      <div className="text-gray-400">por ticket</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-[#FFD700]" />
                      Premios
                    </h3>
                    {raffle.prizes.map((prize, idx) => (
                      <div key={prize.id} className="flex items-center gap-3 bg-[#0D1B2A]/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                          <span className="text-[#0D1B2A] font-bold">{idx + 1}°</span>
                        </div>
                        <span className="text-white font-medium">{prize.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0D1B2A]/50 p-4 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Tickets Vendidos</div>
                      <div className="text-2xl font-bold text-[#00AEEF]">
                        {raffle.soldTickets}/{raffle.totalTickets}
                      </div>
                    </div>
                    <div className="bg-[#0D1B2A]/50 p-4 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Fecha del Sorteo</div>
                      <div className="text-lg font-bold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(raffle.drawDate).toLocaleDateString('es-PE')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="glass-effect p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Selecciona tus números</h2>
              
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-8">
                {Array.from({ length: raffle.totalTickets }, (_, i) => i + 1).map((num) => {
                  const isAvailable = raffle.availableNumbers.includes(num);
                  const isSelected = selectedNumbers.includes(num);

                  return (
                    <motion.button
                      key={num}
                      whileHover={isAvailable ? { scale: 1.1 } : {}}
                      whileTap={isAvailable ? { scale: 0.95 } : {}}
                      onClick={() => isAvailable && toggleNumber(num)}
                      disabled={!isAvailable}
                      className={`
                        aspect-square rounded-lg font-bold text-lg transition-all
                        ${isSelected
                          ? 'bg-gradient-primary text-white shadow-lg shadow-[#00AEEF]/50'
                          : isAvailable
                          ? 'bg-[#0D1B2A]/50 text-white border-2 border-[#00AEEF]/30 hover:border-[#00AEEF]'
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        }
                      `}
                    >
                      {num}
                    </motion.button>
                  );
                })}
              </div>

              {selectedNumbers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0D1B2A]/50 p-6 rounded-lg mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-semibold">Números seleccionados:</span>
                    <span className="text-[#00AEEF] font-bold">{selectedNumbers.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedNumbers.sort((a, b) => a - b).map(num => (
                      <span key={num} className="bg-[#00AEEF] text-white px-3 py-1 rounded-full font-bold">
                        {num}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-white text-lg font-semibold">Total a pagar:</span>
                    <span className="text-[#FFD700] text-2xl font-bold">S/ {totalPrice.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}

              <Button
                onClick={handlePurchase}
                disabled={selectedNumbers.length === 0}
                className="w-full bg-[#00AEEF] hover:bg-[#0077B6] text-white text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Comprar {selectedNumbers.length > 0 ? `(${selectedNumbers.length} ticket${selectedNumbers.length > 1 ? 's' : ''})` : 'Tickets'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default RaffleDetailPage;
  