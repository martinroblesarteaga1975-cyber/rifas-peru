import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Ticket, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const RaffleCard = ({ raffle }) => {
  const navigate = useNavigate();
  const progress = (raffle.soldTickets / raffle.totalTickets) * 100;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-effect rounded-xl overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/raffle/${raffle.id}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={raffle.image}
          alt={raffle.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] to-transparent" />
        <div className="absolute top-4 right-4 bg-[#FFD700] text-[#0D1B2A] px-3 py-1 rounded-full font-bold">
          S/ {raffle.ticketPrice.toFixed(2)}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-white group-hover:text-[#00AEEF] transition-colors">
          {raffle.title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Trophy className="w-4 h-4 text-[#FFD700]" />
            <span className="font-semibold">{raffle.prizes[0]?.name}</span>
          </div>
          {raffle.prizes.length > 1 && (
            <div className="text-xs text-gray-400 ml-6">
              +{raffle.prizes.length - 1} premio{raffle.prizes.length > 2 ? 's' : ''} más
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Vendidos</span>
            <span className="text-[#00AEEF] font-bold">
              {raffle.soldTickets}/{raffle.totalTickets}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full gradient-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Sorteo: {new Date(raffle.drawDate).toLocaleDateString('es-PE')}</span>
        </div>

        <Button className="w-full bg-[#00AEEF] hover:bg-[#0077B6] text-white">
          <Ticket className="w-4 h-4 mr-2" />
          Comprar Tickets
        </Button>
      </div>
    </motion.div>
  );
};

export default RaffleCard;