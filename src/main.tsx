/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHIVO: src/main.tsx
 * QUÉ ES: Punto de entrada de React. Monta <App /> dentro de #root y carga
 *         los estilos globales.
 * DÓNDE SE VE: No se ve directamente; es el arranque de toda la app.
 * QUÉ TOCAR: Providers globales (si algún día se agregan) o estilos base.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
