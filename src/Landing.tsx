// src/Landing.tsx
// Página PÚBLICA (no está detrás de RequireAuth). Solo ofrece login/logout;
// el contenido protegido vive en /dashboard, detrás del guard.
import { Link } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './authConfig';
import './Login.css';

export function Landing() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    if (inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRequest).catch((e) => console.error(e));
    }
  };

  return (
    <div className="login-page">
      {/* Decoración de fondo (blobs difuminados) */}
      <div className="login-blob login-blob-1" aria-hidden="true" />
      <div className="login-blob login-blob-2" aria-hidden="true" />
      <div className="login-blob login-blob-3" aria-hidden="true" />

      <div className="login-card">
        <div className="login-logo">⚡</div>

        {isAuthenticated ? (
          <>
            <h2 className="login-title">Ya iniciaste sesión</h2>
            <p className="login-subtitle">
              Ve al Dashboard para consumir el backend protegido.
            </p>
            <Link className="btn btn-login btn-lg btn-block" to="/dashboard">
              Ir al Dashboard
            </Link>
          </>
        ) : (
          <>
            <span className="login-brand">Pedidos360</span>
            <h2 className="login-title">Bienvenido de nuevo</h2>
            <p className="login-subtitle">
              Para ingresar al sistema debes validar tus credenciales corporativas
              o institucionales con Microsoft Entra ID.
            </p>
            <button
              className="btn btn-microsoft btn-lg btn-block"
              onClick={handleLogin}
              disabled={inProgress !== InteractionStatus.None}
            >
              <svg
                className="btn-microsoft-icon"
                viewBox="0 0 21 21"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              {inProgress !== InteractionStatus.None
                ? 'Cargando...'
                : 'Iniciar Sesión con Microsoft'}
            </button>
            <p className="login-note">
              Solo cuentas corporativas / institucionales del dominio permitido.
            </p>
          </>
        )}
      </div>
    </div>
  );
}