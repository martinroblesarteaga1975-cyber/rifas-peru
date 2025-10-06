import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const RaffleContext = createContext(null);

const initialRaffles = [
  {
    id: '1',
    title: 'Rifa del iPhone 15 Pro Max',
    ticketPrice: 10.00,
    totalTickets: 100,
    soldTickets: 45,
    prizes: [
      { id: 1, name: 'iPhone 15 Pro Max 256GB', position: 1 },
      { id: 2, name: 'AirPods Pro 2da Gen', position: 2 },
      { id: 3, name: 'Apple Watch SE', position: 3 }
    ],
    availableNumbers: Array.from({ length: 55 }, (_, i) => i + 46),
    drawDate: '2025-12-31',
    image: 'https://images.unsplash.com/photo-1592286927505-b0c2fc1dd9bd?w=800&q=80',
    status: 'active'
  },
  {
    id: '2',
    title: 'Rifa de Laptop Gaming',
    ticketPrice: 15.00,
    totalTickets: 80,
    soldTickets: 30,
    prizes: [
      { id: 1, name: 'Laptop ASUS ROG Strix G15', position: 1 },
      { id: 2, name: 'Mouse Logitech G502', position: 2 }
    ],
    availableNumbers: Array.from({ length: 50 }, (_, i) => i + 31),
    drawDate: '2025-11-30',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    status: 'active'
  }
];

export const RaffleProvider = ({ children }) => {
  const [raffles, setRaffles] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // Cargar rifas
      const { data: rafflesData, error: rafflesError } = await supabase
        .from('raffles')
        .select('*');
      
      if (rafflesError) throw rafflesError;
      
      if (rafflesData.length === 0) {
        // Insertar rifas iniciales
        for (const raffle of initialRaffles) {
          const { data: newRaffle } = await supabase
            .from('raffles')
            .insert({
              id: raffle.id,
              title: raffle.title,
              ticket_price: raffle.ticketPrice,
              total_tickets: raffle.totalTickets,
              sold_tickets: raffle.soldTickets,
              draw_date: raffle.drawDate,
              image: raffle.image,
              status: raffle.status,
              available_numbers: raffle.availableNumbers
            })
            .select()
            .single();
          
          // Insertar premios
          for (const prize of raffle.prizes) {
            await supabase
              .from('prizes')
              .insert({
                id: prize.id,
                raffle_id: raffle.id,
                name: prize.name,
                position: prize.position
              });
          }
        }
        
        // Recargar rifas
        const { data: reloadedRaffles } = await supabase
          .from('raffles')
          .select('*');
        setRaffles(reloadedRaffles || []);
      } else {
        setRaffles(rafflesData);
      }

      // Cargar tickets
      const { data: ticketsData } = await supabase
        .from('tickets')
        .select('*');
      setUserTickets(ticketsData || []);

      // Cargar vendedores
      const { data: sellersData } = await supabase
        .from('sellers')
        .select('*');
      setSellers(sellersData || []);

    } catch (error) {
      console.error('Error initializing data:', error);
      // Fallback a localStorage si hay error
      const storedRaffles = localStorage.getItem('raffles');
      if (storedRaffles) {
        setRaffles(JSON.parse(storedRaffles));
      } else {
        setRaffles(initialRaffles);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para generar código de vendedor
  const generateSellerCode = async (userId, name, email) => {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: newSeller } = await supabase
        .from('sellers')
        .insert({
          id: code,
          user_id: userId,
          name,
          email
        })
        .select()
        .single();
      
      setSellers(prev => [...prev, newSeller]);
      return code;
    } catch (error) {
      console.error('Error generating seller code:', error);
      return null;
    }
  };

  // Función para validar código de vendedor
  const validateSellerCode = (code) => {
    return sellers.find(seller => seller.id === code);
  };

  // Función para obtener estadísticas del vendedor
  const getSellerStats = (sellerCode) => {
    const sellerTickets = userTickets.filter(ticket => ticket.seller_code === sellerCode);
    const uniqueBuyers = [...new Set(sellerTickets.map(ticket => ticket.user_email))];
    const totalSales = sellerTickets.reduce((sum, ticket) => {
      const raffle = raffles.find(r => r.id === ticket.raffle_id);
      return sum + (raffle ? raffle.ticket_price : 0);
    }, 0);

    return {
      ticketsSold: sellerTickets.length,
      uniqueBuyers: uniqueBuyers.length,
      totalSales: totalSales.toFixed(2)
    };
  };

  // Función para obtener vendedor por userId
  const getSellerByUserId = (userId) => {
    return sellers.find(seller => seller.user_id === userId);
  };

  const createRaffle = async (raffleData) => {
    try {
      const { data: newRaffle } = await supabase
        .from('raffles')
        .insert({
          id: Date.now().toString(),
          title: raffleData.title,
          ticket_price: raffleData.ticketPrice,
          total_tickets: raffleData.totalTickets,
          sold_tickets: 0,
          draw_date: raffleData.drawDate,
          image: raffleData.image,
          status: 'active',
          available_numbers: Array.from({ length: raffleData.totalTickets }, (_, i) => i + 1)
        })
        .select()
        .single();

      setRaffles(prev => [...prev, newRaffle]);
      return newRaffle;
    } catch (error) {
      console.error('Error creating raffle:', error);
      return null;
    }
  };

  const updateRaffle = async (id, raffleData) => {
    try {
      const { data: updatedRaffle } = await supabase
        .from('raffles')
        .update({
          title: raffleData.title,
          ticket_price: raffleData.ticketPrice,
          total_tickets: raffleData.totalTickets,
          draw_date: raffleData.drawDate,
          image: raffleData.image,
          status: raffleData.status
        })
        .eq('id', id)
        .select()
        .single();

      setRaffles(prev => prev.map(r => r.id === id ? updatedRaffle : r));
      return updatedRaffle;
    } catch (error) {
      console.error('Error updating raffle:', error);
      return null;
    }
  };

  const deleteRaffle = async (id) => {
    try {
      await supabase
        .from('raffles')
        .delete()
        .eq('id', id);

      setRaffles(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting raffle:', error);
    }
  };

  // Modificada para incluir código de vendedor
  const purchaseTicket = async (raffleId, numbers, userEmail, sellerCode = null) => {
    try {
      // Validar código de vendedor si se proporciona
      if (sellerCode && !validateSellerCode(sellerCode)) {
        return { success: false, message: 'Código de vendedor inválido' };
      }

      // Obtener raffle actual
      const { data: raffle } = await supabase
        .from('raffles')
        .select('*')
        .eq('id', raffleId)
        .single();

      if (!raffle) {
        return { success: false, message: 'Rifa no encontrada' };
      }

      // Validar números disponibles
      const unavailableNumbers = numbers.filter(num => !raffle.available_numbers.includes(num));
      if (unavailableNumbers.length > 0) {
        return { success: false, message: 'Algunos números ya no están disponibles' };
      }

      // Actualizar raffle
      const newAvailableNumbers = raffle.available_numbers.filter(num => !numbers.includes(num));
      await supabase
        .from('raffles')
        .update({
          sold_tickets: raffle.sold_tickets + numbers.length,
          available_numbers: newAvailableNumbers
        })
        .eq('id', raffleId);

      // Crear tickets
      const newTickets = numbers.map(num => ({
        id: Date.now().toString() + num,
        raffle_id: raffleId,
        raffle_title: raffle.title,
        number: num,
        user_email: userEmail,
        seller_code: sellerCode,
        status: 'active'
      }));

      const { data: createdTickets } = await supabase
        .from('tickets')
        .insert(newTickets)
        .select();

      // Actualizar estado local
      setRaffles(prev => prev.map(r => 
        r.id === raffleId 
          ? { ...r, sold_tickets: r.sold_tickets + numbers.length, available_numbers: newAvailableNumbers }
          : r
      ));
      
      setUserTickets(prev => [...prev, ...createdTickets]);

      return { success: true, tickets: createdTickets };
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      return { success: false, message: 'Error al procesar la compra' };
    }
  };

  const getUserTickets = (userEmail) => {
    return userTickets.filter(ticket => ticket.user_email === userEmail);
  };

  const getStats = () => {
    const activeRaffles = raffles.filter(r => r.status === 'active').length;
    const totalTicketsSold = raffles.reduce((sum, r) => sum + r.sold_tickets, 0);
    const totalRevenue = raffles.reduce((sum, r) => sum + (r.sold_tickets * r.ticket_price), 0);

    return {
      activeRaffles,
      totalTicketsSold,
      totalRevenue
    };
  };

  return (
    <RaffleContext.Provider
      value={{
        raffles,
        userTickets,
        sellers,
        loading,
        createRaffle,
        updateRaffle,
        deleteRaffle,
        purchaseTicket,
        getUserTickets,
        getStats,
        generateSellerCode,
        validateSellerCode,
        getSellerStats,
        getSellerByUserId
      }}
    >
      {children}
    </RaffleContext.Provider>
  );
};

export const useRaffles = () => {
  const context = useContext(RaffleContext);
  if (!context) {
    throw new Error('useRaffles must be used within a RaffleProvider');
  }
  return context;
};
