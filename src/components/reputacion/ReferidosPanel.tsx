import { useState } from 'react';
import { aplicarCodigoReferido, generarCodigoReferido } from '../../logic/puntuacionStorage';
import { PUNTOS_REFERIDO_NUEVO, PUNTOS_REFERIDO_EXTRA, UMBRAL_RED_BONUS, PUNTOS_REFERIDO_RED_BONUS } from '../../data/reputacion';
import type { PuntuacionGlobal } from '../../services/firestoreService';

interface Props {
  uid: string;
  displayName: string;
  puntuacion: PuntuacionGlobal | null;
  onPuntuacionChanged: () => void;
}

export function ReferidosPanel({ uid, displayName, puntuacion, onPuntuacionChanged }: Props) {
  const [copiado, setCopiado] = useState(false);
  const [codigoInput, setCodigoInput] = useState('');
  const [aplicando, setAplicando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [mostrarIngresar, setMostrarIngresar] = useState(false);

  const miCodigo = generarCodigoReferido(uid);
  const cantReferidos = puntuacion?.referidosUids?.length ?? 0;
  const ptsPorReferidos = puntuacion?.porFuente.referidos ?? 0;
  const yaUsoCodigo = Boolean(puntuacion?.referidoPor);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(miCodigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // ignore
    }
  };

  const compartirCodigo = async () => {
    const texto = `¡Sumate a Para Dónde? y planificá tu próxima aventura! Usá mi código ${miCodigo} al registrarte y ambos ganamos ${PUNTOS_REFERIDO_NUEVO} puntos. 🌎✈️`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Para Dónde?', text: texto });
      } else {
        await navigator.clipboard.writeText(texto);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }
    } catch {
      // ignore cancel
    }
  };

  const handleAplicar = async () => {
    const codigo = codigoInput.trim().toUpperCase();
    if (!codigo || codigo.length < 6) {
      setMsg({ tipo: 'error', texto: 'Ingresá un código válido.' });
      return;
    }
    setAplicando(true);
    setMsg(null);
    const res = await aplicarCodigoReferido(uid, displayName, codigo);
    setAplicando(false);
    if (res.ok) {
      setMsg({ tipo: 'ok', texto: `¡Genial! Ganaste ${PUNTOS_REFERIDO_NUEVO} puntos.` });
      setCodigoInput('');
      onPuntuacionChanged();
    } else {
      setMsg({ tipo: 'error', texto: res.error ?? 'Error desconocido.' });
    }
  };

  return (
    <div className="pd-ref2-panel">
      {/* Header */}
      <div className="pd-ref2-header">
        <div className="pd-ref2-header-icon" aria-hidden>🔗</div>
        <div className="pd-ref2-header-text">
          <h3 className="pd-ref2-titulo">Programa de referidos</h3>
          <p className="pd-ref2-subtitulo">
            Invitá amigos y ambos ganan <strong>{PUNTOS_REFERIDO_NUEVO} pts</strong>.
            Desde el referido {UMBRAL_RED_BONUS + 1}° sumarás <strong>{PUNTOS_REFERIDO_EXTRA + PUNTOS_REFERIDO_RED_BONUS} pts extra</strong>.
          </p>
        </div>
      </div>

      {/* Tu código */}
      <div className="pd-ref2-codigo-section">
        <p className="pd-ref2-codigo-label">Tu código de invitación</p>
        <div className="pd-ref2-codigo-display">
          <code className="pd-ref2-codigo-val">{miCodigo}</code>
          <button type="button" className="pd-ref2-btn-copy" onClick={copiarCodigo} aria-label="Copiar código">
            {copiado ? '✓' : '⎘'}
          </button>
        </div>
        <button type="button" className="pd-ref2-btn-invitar" onClick={compartirCodigo}>
          <span aria-hidden>🚀</span> Invitar amigos
        </button>
      </div>

      {/* Stats */}
      <div className="pd-ref2-stats">
        <div className="pd-ref2-stat">
          <span className="pd-ref2-stat-num">{cantReferidos}</span>
          <span className="pd-ref2-stat-lbl">amigos referidos</span>
        </div>
        <div className="pd-ref2-stat-div" aria-hidden />
        <div className="pd-ref2-stat">
          <span className="pd-ref2-stat-num">{ptsPorReferidos.toLocaleString('es-AR')}</span>
          <span className="pd-ref2-stat-lbl">pts ganados</span>
        </div>
        <div className="pd-ref2-stat-div" aria-hidden />
        <div className="pd-ref2-stat">
          <span className="pd-ref2-stat-num">{PUNTOS_REFERIDO_NUEVO}</span>
          <span className="pd-ref2-stat-lbl">pts por referido</span>
        </div>
      </div>

      {/* Aplicar código de otro */}
      {yaUsoCodigo ? (
        <p className="pd-ref2-ya-usado">
          ✅ Ya usaste un código de referido. ¡Gracias por sumarte a la red!
        </p>
      ) : (
        <div className="pd-ref2-ingresar">
          <button
            type="button"
            className="pd-ref2-ingresar-toggle"
            onClick={() => setMostrarIngresar((v) => !v)}
            aria-expanded={mostrarIngresar}
          >
            <span>¿Alguien te invitó? Ingresá su código</span>
            <span aria-hidden>{mostrarIngresar ? '▲' : '▼'}</span>
          </button>
          {mostrarIngresar && (
            <div className="pd-ref2-ingresar-body">
              <div className="pd-ref2-ingresar-row">
                <input
                  type="text"
                  className="pd-ref2-ingresar-input"
                  placeholder="XXXXXXXX"
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                  maxLength={12}
                  disabled={aplicando}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !aplicando) void handleAplicar(); }}
                />
                <button
                  type="button"
                  className="pd-ref2-ingresar-btn"
                  disabled={aplicando || !codigoInput.trim()}
                  onClick={() => void handleAplicar()}
                >
                  {aplicando ? 'Aplicando…' : 'Aplicar'}
                </button>
              </div>
              {msg && (
                <p className={`pd-ref2-msg pd-ref2-msg--${msg.tipo}`} role="alert">
                  {msg.texto}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
