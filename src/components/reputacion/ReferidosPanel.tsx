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
  const [expandido, setExpandido] = useState(false);

  const miCodigo = generarCodigoReferido(uid);
  const cantReferidos = puntuacion?.referidosUids?.length ?? 0;
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
    <div className="pd-referidos-panel">
      <button
        type="button"
        className="pd-referidos-panel-header"
        onClick={() => setExpandido((v) => !v)}
        aria-expanded={expandido}
      >
        <span className="pd-referidos-panel-header-icon" aria-hidden>🔗</span>
        <div className="pd-referidos-panel-header-text">
          <strong>Programa de referidos</strong>
          <span className="pd-referidos-panel-header-sub">
            {cantReferidos} {cantReferidos === 1 ? 'amigo' : 'amigos'} referidos · Tu código: {miCodigo}
          </span>
        </div>
        <span className="pd-referidos-panel-chevron" aria-hidden>{expandido ? '▲' : '▼'}</span>
      </button>

      {expandido && (
        <div className="pd-referidos-panel-body">
          <p className="pd-referidos-desc">
            Compartí tu código y ambos ganan <strong>{PUNTOS_REFERIDO_NUEVO} puntos</strong> cuando
            se registren. A partir del referido número {UMBRAL_RED_BONUS + 1}, cada nuevo referido
            te da <strong>{PUNTOS_REFERIDO_EXTRA + PUNTOS_REFERIDO_RED_BONUS} puntos extra</strong>.
          </p>

          <div className="pd-referidos-codigo-row">
            <div className="pd-referidos-codigo-box">
              <span className="pd-referidos-codigo-label">Tu código</span>
              <code className="pd-referidos-codigo-val">{miCodigo}</code>
            </div>
            <button type="button" className="pd-referidos-btn-copiar" onClick={copiarCodigo}>
              {copiado ? '✓ Copiado' : 'Copiar'}
            </button>
            <button type="button" className="pd-referidos-btn-compartir" onClick={compartirCodigo}>
              Compartir
            </button>
          </div>

          <div className="pd-referidos-stats">
            <div className="pd-referidos-stat">
              <span className="pd-referidos-stat-num">{cantReferidos}</span>
              <span className="pd-referidos-stat-lbl">amigos referidos</span>
            </div>
            <div className="pd-referidos-stat">
              <span className="pd-referidos-stat-num">{puntuacion?.porFuente.referidos ?? 0}</span>
              <span className="pd-referidos-stat-lbl">pts por referidos</span>
            </div>
          </div>

          {!yaUsoCodigo && (
            <div className="pd-referidos-ingresar">
              <p className="pd-referidos-ingresar-lbl">¿Alguien te invitó? Ingresá su código:</p>
              <div className="pd-referidos-ingresar-row">
                <input
                  type="text"
                  className="pd-referidos-ingresar-input"
                  placeholder="XXXXXXXX"
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                  maxLength={12}
                  disabled={aplicando}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !aplicando) void handleAplicar(); }}
                />
                <button
                  type="button"
                  className="pd-referidos-ingresar-btn"
                  disabled={aplicando || !codigoInput.trim()}
                  onClick={() => void handleAplicar()}
                >
                  {aplicando ? 'Aplicando…' : 'Aplicar'}
                </button>
              </div>
              {msg && (
                <p className={`pd-referidos-msg pd-referidos-msg--${msg.tipo}`} role="alert">
                  {msg.texto}
                </p>
              )}
            </div>
          )}

          {yaUsoCodigo && (
            <p className="pd-referidos-ya-usado">
              ✅ Ya usaste un código de referido. ¡Gracias por sumarte a la red!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
