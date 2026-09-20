// src/App.tsx
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './authConfig';
import { RequireAuth } from './RequireAuth';
import { RequireRole } from './RequireRole';
import { Landing } from './Landing';
import { Dashboard } from './Dashboard';
import { AdminDemo } from './AdminDemo';
import { Catalog } from './Catalog'; // 1. IMPORTACIÓN DEL COMPONENTE CATÁLOGO
import './App.css';

function Nav() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    if (inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRequest).catch((e) => console.error(e));
    }
  };

  const handleLogout = () => {
    if (inProgress === InteractionStatus.None) {
      instance
        .logoutRedirect({ postLogoutRedirectUri: '/' })
        .catch((e) => console.error(e));
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <header className="navbar">
      <div className="logo">
        ⚡ <span>Portal MiApp</span>
      </div>

      {isAuthenticated && (
        <nav className="nav-links">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          {/* 2. ENLACE A LA RUTA /catalog EN EL MENÚ */}
          <NavLink to="/catalog" className={linkClass}>
            Catálogo
          </NavLink>

          {/* Sin el App Role "Admin" asignado, RequireRole igual bloquea el
              contenido — el link queda visible a propósito para poder
              demostrar el guard de autorización en vivo. */}
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        </nav>
      )}

      <div>
        {isAuthenticated ? (
          <button
            className="btn btn-logout"
            onClick={handleLogout}
            disabled={inProgress !== InteractionStatus.None}
          >
            Cerrar Sesión
          </button>
        ) : (
          <button
            className="btn btn-login"
            onClick={handleLogin}
            disabled={inProgress !== InteractionStatus.None}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Nav />
        <main className="container">
          <Routes>
            {/* Pública: no está bajo RequireAuth */}
            <Route path="/" element={<Landing />} />

            {/* Guard de AUTENTICACIÓN: agrupa las rutas que exigen sesión */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* 3. RUTA /catalog PROTEGIDA POR AUTENTICACIÓN Y ROLES (Admin / Operator) */}
              <Route path="/catalog" element={<Catalog />} />

              {/* Guard de AUTORIZACIÓN anidado: además exige el rol Admin */}
              <Route element={<RequireRole role="Admin" />}>
                <Route path="/admin" element={<AdminDemo />} />
              </Route>
            </Route>

            <Route path="*" element={<Landing />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}