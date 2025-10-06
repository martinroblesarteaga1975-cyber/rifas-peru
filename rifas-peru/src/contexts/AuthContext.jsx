import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedIsAdmin = localStorage.getItem('isAdmin');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAdmin(storedIsAdmin === 'true');
    }
  }, []);

  const login = (email, password) => {
    if (email === 'admin@rifa.com' && password === 'admin123') {
      const adminUser = {
        email,
        name: 'Administrador',
        fullName: 'Administrador del Sistema',
        phone: '+51 999 888 777',
        dni: '12345678',
        address: 'Av. Principal 123, Lima, Perú',
        isAdmin: true
      };
      setUser(adminUser);
      setToken('admin-token-123');
      setIsAdmin(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('token', 'admin-token-123');
      localStorage.setItem('isAdmin', 'true');
      return { success: true, isAdmin: true };
    }

    if (email === 'user@test.com' && password === 'user123') {
      const regularUser = {
        email,
        name: 'Usuario Test',
        fullName: 'Usuario de Prueba',
        phone: '+51 999 777 666',
        dni: '87654321',
        address: 'Av. Secundaria 456, Lima, Perú',
        isAdmin: false
      };
      setUser(regularUser);
      setToken('user-token-123');
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(regularUser));
      localStorage.setItem('token', 'user-token-123');
      localStorage.setItem('isAdmin', 'false');
      return { success: true, isAdmin: false };
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData = {
        ...foundUser,
        isAdmin: false
      };
      delete userData.password;
      setUser(userData);
      setToken('user-token-' + Date.now());
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'user-token-' + Date.now());
      localStorage.setItem('isAdmin', 'false');
      return { success: true, isAdmin: false };
    }

    return { success: false, message: 'Credenciales incorrectas' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'El email ya está registrado' };
    }

    if (users.find(u => u.dni === userData.dni)) {
      return { success: false, message: 'El DNI ya está registrado' };
    }

    // Guardar usuario con todos los campos del perfil
    const completeUserData = {
      ...userData,
      fullName: userData.fullName || userData.name,
      phone: userData.phone || '',
      address: userData.address || '',
      registeredAt: new Date().toISOString()
    };

    users.push(completeUserData);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    const newUser = { ...completeUserData, isAdmin: false };
    delete newUser.password;
    setUser(newUser);
    setToken('user-token-' + Date.now());
    setIsAdmin(false);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'user-token-' + Date.now());
    localStorage.setItem('isAdmin', 'false');

    return { success: true };
  };

  // Nueva función para actualizar el perfil del usuario
  const updateUser = (updatedUserData) => {
    try {
      // Actualizar en el estado
      setUser(updatedUserData);

      // Actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(updatedUserData));

      // Si es un usuario registrado, actualizar en la lista de usuarios
      if (!updatedUserData.isAdmin) {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = users.findIndex(u => u.email === updatedUserData.email);

        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updatedUserData };
          localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { success: false, message: 'Error al actualizar el perfil' };
    }
  };

  // Nueva función para obtener el perfil completo
  const getUserProfile = () => {
    if (!user) return null;

    return {
      fullName: user.fullName || user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      dni: user.dni || '',
      address: user.address || '',
      isAdmin: user.isAdmin || false
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAdmin,
      login,
      register,
      logout,
      updateUser,
      getUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};