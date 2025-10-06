import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Cargar rifas
    const storedRaffles = localStorage.getItem('raffles');
    if (storedRaffles) {
      setRaffles(JSON.parse(storedRaffles));
    } else {
      setRaffles(initialRaffles);
      localStorage.setItem('raffles', JSON.stringify(initialRaffles));
    }

    // Cargar tickets
    const storedTickets = localStorage.getItem('userTickets');
    if (storedTickets) {
      setUserTickets(JSON.parse(storedTickets));
    }

    // Cargar vendedores
    const storedSellers = localStorage.getItem('sellers');
    if (storedSellers) {
      setSellers(JSON.parse(storedSellers));
    }
  }, []);

  // Función para generar código de vendedor
  const generateSellerCode = (userId, name, email) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newSeller = {
      id: code,
      userId,
      name,
      email,
      createdAt: new Date().toISOString(),
      ticketsSold: 0
    };
    
    const updatedSellers = [...sellers, newSeller];
    setSellers(updatedSellers);
    localStorage.setItem('sellers', JSON.stringify(updatedSellers));
    
    return code;
  };

  // Función para validar código de vendedor
  const validateSellerCode = (code) => {
    return sellers.find(seller => seller.id === code);
  };

  // Función para obtener estadísticas del vendedor
  const getSellerStats = (sellerCode) => {
    const sellerTickets = userTickets.filter(ticket => ticket.sellerCode === sellerCode);
    const uniqueBuyers = [...new Set(sellerTickets.map(ticket => ticket.userEmail))];
    const totalSales = sellerTickets.reduce((sum, ticket) => {
      const raffle = raffles.find(r => r.id === ticket.raffleId);
      return sum + (raffle ? raffle.ticketPrice : 0);
    }, 0);

    return {
      ticketsSold: sellerTickets.length,
      uniqueBuyers: uniqueBuyers.length,
      totalSales: totalSales.toFixed(2)
    };
  };

  // Función para obtener vendedor por userId
  const getSellerByUserId = (userId) => {
    return sellers.find(seller => seller.userId === userId);
  };

  const createRaffle = (raffleData) => {
    const newRaffle = {
      ...raffleData,
      id: Date.now().toString(),
      soldTickets: 0,
      availableNumbers: Array.from({ length: raffleData.totalTickets }, (_, i) => i + 1),
      status: 'active'
    };
    const updatedRaffles = [...raffles, newRaffle];
    setRaffles(updatedRaffles);
    localStorage.setItem('raffles', JSON.stringify(updatedRaffles));
    return newRaffle;
  };

  const updateRaffle = (id, raffleData) => {
    const updatedRaffles = raffles.map(raffle =>
      raffle.id === id ? { ...raffle, ...raffleData } : raffle
    );
    setRaffles(updatedRaffles);
    localStorage.setItem('raffles', JSON.stringify(updatedRaffles));
  };

  const deleteRaffle = (id) => {
    const updatedRaffles = raffles.filter(raffle => raffle.id !== id);
    setRaffles(updatedRaffles);
    localStorage.setItem('raffles', JSON.stringify(updatedRaffles));
  };

  // Modificada para incluir código de vendedor
  const purchaseTicket = (raffleId, numbers, userEmail, sellerCode = null) => {
    const raffle = raffles.find(r => r.id === raffleId);
    if (!raffle) return { success: false, message: 'Rifa no encontrada' };

    // Validar código de vendedor si se proporciona
    if (sellerCode && !validateSellerCode(sellerCode)) {
      return { success: false, message: 'Código de vendedor inválido' };
    }

    const unavailableNumbers = numbers.filter(num => !raffle.availableNumbers.includes(num));
    if (unavailableNumbers.length > 0) {
      return { success: false, message: 'Algunos números ya no están disponibles' };
    }

    const updatedRaffles = raffles.map(r => {
      if (r.id === raffleId) {
        return {
          ...r,
          soldTickets: r.soldTickets + numbers.length,
          availableNumbers: r.availableNumbers.filter(num => !numbers.includes(num))
        };
      }
      return r;
    });

    const newTickets = numbers.map(num => ({
      id: Date.now().toString() + num,
      raffleId,
      raffleTitle: raffle.title,
      number: num,
      userEmail,
      sellerCode, // Agregamos el código del vendedor
      purchaseDate: new Date().toISOString(),
      status: 'active'
    }));

    const updatedUserTickets = [...userTickets, ...newTickets];

    setRaffles(updatedRaffles);
    setUserTickets(updatedUserTickets);
    localStorage.setItem('raffles', JSON.stringify(updatedRaffles));
    localStorage.setItem('userTickets', JSON.stringify(updatedUserTickets));

    return { success: true, tickets: newTickets };
  };

  const getUserTickets = (userEmail) => {
    return userTickets.filter(ticket => ticket.userEmail === userEmail);
  };

  const getStats = () => {
    const activeRaffles = raffles.filter(r => r.status === 'active').length;
    const totalTicketsSold = raffles.reduce((sum, r) => sum + r.soldTickets, 0);
    const totalRevenue = raffles.reduce((sum, r) => sum + (r.soldTickets * r.ticketPrice), 0);

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