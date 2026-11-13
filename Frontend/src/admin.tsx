/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/admin.tsx
 * QUÉ ES: Punto de entrada React para el Panel Administrativo.
 *         Se carga ÚNICAMENTE desde admin.html (/admin).
 *         Gestiona la autenticación de roles (SuperAdmin y Administrador).
 * DÓNDE SE VE: URL /admin — sólo visible para administradores autenticados.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AdminPage } from './components/AdminPage';
import { AdminLogin } from './components/AdminLogin';
import { authService, AuthUser } from './services/authService';
import './index.css';

function AdminApp() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  // Si el navegador restaura la página desde el bfcache (flecha atrás),
  // forzamos logout para que siempre pida credenciales al volver.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        authService.logout();
        setCurrentUser(null);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const user = await authService.login(username, password);
      setCurrentUser(user);
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminPage
      currentUser={currentUser}
      onUserUpdated={(updatedUser) => {
        setCurrentUser(updatedUser);
      }}
      onLogout={handleLogout}
      onProductsChanged={() => {
        // Notificación de productos actualizados
      }}
      onGoToStore={() => {
        window.location.href = '/';
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
