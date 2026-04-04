import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { register, user, ready } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Crear cuenta – Para Dónde?';
  }, []);

  useEffect(() => {
    if (ready && user) navigate('/cuenta', { replace: true });
  }, [ready, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, displayName);
      navigate('/cuenta', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
    }
  };

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding" {...ionScrollProps}>
        <div className="pd-content pd-subpage-inner">
          <h1 className="pd-auth-page-title">Crear cuenta</h1>
          <p className="pd-auth-lead">
            Registro de demostración guardado en este navegador. Cuando conectemos Firebase, el mismo flujo pasará a usar Google o email verificado.
          </p>

          <form className="pd-auth-form" onSubmit={handleSubmit}>
            {error ? <p className="pd-auth-error">{error}</p> : null}
            <label className="pd-auth-label">
              Nombre o apodo
              <input
                className="pd-auth-input"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(ev) => setDisplayName(ev.target.value)}
                placeholder="Cómo te mostramos en la app"
              />
            </label>
            <label className="pd-auth-label">
              Correo
              <input
                className="pd-auth-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />
            </label>
            <label className="pd-auth-label">
              Contraseña
              <input
                className="pd-auth-input"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required
                minLength={6}
              />
            </label>
            <button type="submit" className="pd-auth-submit">
              Registrarme
            </button>
          </form>

          <p className="pd-auth-footer-link">
            ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
