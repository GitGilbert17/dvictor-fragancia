/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: Frontend/src/admin.tsx
 * QUÉ ES: Punto de entrada React para el Panel Administrativo.
 *         Se carga ÚNICAMENTE desde admin.html (/admin).
 *         Es completamente independiente de main.tsx y la landing page.
 * DÓNDE SE VE: URL /admin — sólo visible para el administrador.
 * NOTAS:
 *   - Este archivo NO es importado en ningún lugar de la landing page.
 *   - Vite lo empaqueta como un bundle separado gracias a rollupOptions.input.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminPage } from './components/AdminPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <AdminPage
      onProductsChanged={() => {
        // En la página standalone del admin no hay landing page que recargar.
        // Si en el futuro se requiere, se puede agregar lógica aquí.
      }}
      onGoToStore={() => {
        window.location.href = '/';
      }}
    />
  </React.StrictMode>
);
