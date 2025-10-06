
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, TrendingUp, Ticket, DollarSign, Trophy } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useRaffles } from '../contexts/RaffleContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from '../components/ui/use-toast';
import { Toaster } from '../components/ui/toaster';

const AdminDashboardPage = () => {
  const { raffles, createRaffle, updateRaffle, deleteRaffle, getStats } = useRaffles();
  const stats = getStats();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    ticketPrice: '',
    totalTickets: '',
    drawDate: '',
    image: '',
    prizes: [{ id: 1, name: '', position: 1 }]
  });

  const resetForm = () => {
    setFormData({
      title: '',
      ticketPrice: '',
      totalTickets: '',
      drawDate: '',
      image: '',
      prizes: [{ id: 1, name: '', position: 1 }]
    });
    setEditingRaffle(null);
  };

  const handleEdit = (raffle) => {
    setEditingRaffle(raffle);
    setFormData({
      title: raffle.title,
      ticketPrice: raffle.ticketPrice.toString(),
      totalTickets: raffle.totalTickets.toString(),
      drawDate: raffle.drawDate,
      image: raffle.image,
      prizes: raffle.prizes
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta rifa?')) {
      deleteRaffle(id);
      toast({
        title: 'Rifa eliminada',
        description: 'La rifa ha sido eliminada correctamente',
      });
    }
  };

  const addPrize = () => {
    setFormData({
      ...formData,
      prizes: [...formData.prizes, { id: Date.now(), name: '', position: formData.prizes.length + 1 }]
    });
  };

  const removePrize = (id) => {
    if (formData.prizes.length > 1) {
      setFormData({
        ...formData,
        prizes: formData.prizes.filter(p => p.id !== id)
      });
    }
  };

  const updatePrize = (id, name) => {
    setFormData({
      ...formData,
      prizes: formData.prizes.map(p => p.id === id ? { ...p, name } : p)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const raffleData = {
      title: formData.title,
      ticketPrice: parseFloat(formData.ticketPrice),
      totalTickets: parseInt(formData.totalTickets),
      drawDate: formData.drawDate,
      image: formData.image || 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80',
      prizes: formData.prizes.filter(p => p.name.trim() !== '')
    };

    if (editingRaffle) {
      updateRaffle(editingRaffle.id, raffleData);
      toast({
        title: 'Rifa actualizada',
        description: 'Los cambios han sido guardados correctamente',
      });
    } else {
      createRaffle(raffleData);
      toast({
        title: 'Rifa creada',
        description: 'La nueva rifa ha sido creada exitosamente',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - RifaPeru</title>
        <meta name="description" content="Panel de administración de rifas" />
      </Helmet>

      <div className="min-h-screen bg-[#0D1B2A]">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-gray-400">Gestiona tus rifas y monitorea estadísticas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect p-6 rounded-xl"
            >
              <Ticket className="w-10 h-10 text-[#00AEEF] mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{stats.activeRaffles}</div>
              <div className="text-gray-400">Rifas Activas</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect p-6 rounded-xl"
            >
              <TrendingUp className="w-10 h-10 text-[#FFD700] mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{stats.totalTicketsSold}</div>
              <div className="text-gray-400">Tickets Vendidos</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect p-6 rounded-xl"
            >
              <DollarSign className="w-10 h-10 text-[#00AEEF] mb-4" />
              <div className="text-3xl font-bold text-white mb-2">S/ {stats.totalRevenue.toFixed(2)}</div>
              <div className="text-gray-400">Ingresos Totales</div>
            </motion.div>
          </div>

          <div className="glass-effect p-8 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Gestión de Rifas</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={resetForm}
                    className="bg-[#00AEEF] hover:bg-[#0077B6]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Rifa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0D1B2A] border-[#00AEEF]/30">
                  <DialogHeader>
                    <DialogTitle className="text-white text-2xl">
                      {editingRaffle ? 'Editar Rifa' : 'Crear Nueva Rifa'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Título de la Rifa</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-[#0D1B2A]/50 border-[#00AEEF]/30 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Precio por Ticket (S/)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.ticketPrice}
                          onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                          className="bg-[#0D1B2A]/50 border-[#00AEEF]/30 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Total de Tickets</Label>
                        <Input
                          type="number"
                          value={formData.totalTickets}
                          onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                          className="bg-[#0D1B2A]/50 border-[#00AEEF]/30 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Fecha del Sorteo</Label>
                      <Input
                        type="date"
                        value={formData.drawDate}
                        onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                        className="bg-[#0D1B2A]/50 border-[#00AEEF]/30 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">URL de Imagen</Label>
                      <Input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="bg-[#0D1B2A]/50 border-[#00AEEF]/30 text-white"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-white text-lg">Premios</Label>
                        <Button
                          type="button"
                          onClick={addPrize}
                          className="bg-[#FFD700] hover:bg-[#FFA500] text-[#0D1B2A]"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar Premio
                        </Button>
                      </div>

                      {formData.prizes.map((prize, index) => (
                        <div key={prize.id} className="flex gap-2 items-center">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                            <span className="text-[#0D1B2A] font-bold">{index + 1}°</span>
                          </div>
                          <Input
                            value={prize.name}
                            onChange={(e) => updatePrize(prize.id, e.target.value)}
                            placeholder={`Premio ${index + 1}° lugar`}
                            className="bg-[#0D1B2A]/50 border-[#00AEEF]/30 text-white"
                            required
                          />
                          {formData.prizes.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removePrize(prize.id)}
                              variant="outline"
                              size="icon"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#00AEEF] hover:bg-[#0077B6] text-white"
                    >
                      {editingRaffle ? 'Actualizar Rifa' : 'Crear Rifa'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Rifa</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Premios</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Precio</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Vendidos</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Disponibles</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Sorteo</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {raffles.map((raffle) => (
                    <tr key={raffle.id} className="border-b border-gray-800 hover:bg-[#0D1B2A]/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={raffle.image}
                            alt={raffle.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="text-white font-medium">{raffle.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {raffle.prizes.map((prize, idx) => (
                            <div key={prize.id} className="flex items-center gap-2 text-sm">
                              <Trophy className="w-3 h-3 text-[#FFD700]" />
                              <span className="text-gray-300">
                                {idx + 1}° {prize.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#FFD700] font-bold">
                        S/ {raffle.ticketPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-white">{raffle.soldTickets}</td>
                      <td className="py-4 px-4 text-[#00AEEF]">{raffle.availableNumbers.length}</td>
                      <td className="py-4 px-4 text-gray-300">
                        {new Date(raffle.drawDate).toLocaleDateString('es-PE')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(raffle)}
                            size="sm"
                            className="bg-[#00AEEF] hover:bg-[#0077B6]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(raffle.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AdminDashboardPage;
  