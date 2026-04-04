import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';
import { useFloatingChromeScroll } from '../hooks/useFloatingChromeScroll';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { chromeVisible, ionScrollProps } = useFloatingChromeScroll();
  const navigate = useNavigate();
  const { login, user, ready } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Iniciar sesión – Para Dónde?';
  }, []);

  useEffect(() => {
    if (ready && user) navigate('/cuenta', { replace: true });
  }, [ready, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/cuenta', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    }
  };

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate(-1)} chromeVisible={chromeVisible} />
      <IonContent className="ion-padding" {...ionScrollProps}>
        <div className="pd-content pd-subpage-inner">
          <h1 className="pd-auth-page-title">Iniciar sesión</h1>
          <p className="pd-auth-lead">
            Más adelante podrás entrar con Google (Firebase Authentication). Por ahora es una cuenta local de demostración en este dispositivo.
          </p>

          <form className="pd-auth-form" onSubmit={handleSubmit}>
            {error ? <p className="pd-auth-error">{error}</p> : null}
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
                autoComplete="current-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required
                minLength={4}
              />
            </label>
            <button type="submit" className="pd-auth-submit">
              Entrar
            </button>
          </form>

          <p className="pd-auth-footer-link">
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
