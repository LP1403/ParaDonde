import { useRef, useState } from 'react';
import type { MisionDestino } from '../../data/misiones';
import { comprimirImagenAThumb } from '../../logic/puntuacionStorage';

interface Props {
  mision: MisionDestino;
  completada: boolean;
  fotoThumb?: string;
  onCompletar: (fotoThumb?: string) => Promise<void>;
  uid: string | null;
}

const dificultadLabel: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Media',
  dificil: 'Difícil',
};

export function MisionCard({ mision, completada, fotoThumb, onCompletar, uid }: Props) {
  const [preview, setPreview] = useState<string | undefined>(fotoThumb);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const coverUrl = mision.imagenUrl;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setCargando(true);
    try {
      const thumb = await comprimirImagenAThumb(file);
      setPreview(thumb);
    } catch {
      setError('No se pudo procesar la imagen.');
    } finally {
      setCargando(false);
    }
  };

  const handleCompletar = async () => {
    if (!uid) {
      setError('Tenés que iniciar sesión para completar misiones.');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      await onCompletar(preview);
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={`pd-mision-card ${completada ? 'pd-mision-card--completada' : ''}`}>

      {/* Cover image con emoji superpuesto */}
      <div className="pd-mision-card-cover">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="pd-mision-card-cover-img"
            aria-hidden
            loading="lazy"
          />
        ) : (
          <div className="pd-mision-card-cover-placeholder" aria-hidden />
        )}
        <div className="pd-mision-card-cover-overlay" aria-hidden />
        {completada && (
          <span className="pd-mision-card-cover-check" aria-hidden>✅</span>
        )}
        <div className="pd-mision-card-cover-meta">
          <span className={`pd-mision-card-dif pd-mision-card-dif--${mision.dificultad}`}>
            {dificultadLabel[mision.dificultad]}
          </span>
          <span className="pd-mision-card-puntos">+{mision.puntos} pts</span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="pd-mision-card-body">
        <h3 className="pd-mision-card-titulo">{mision.titulo}</h3>
        <p className="pd-mision-card-desc">{mision.descripcion}</p>

        {mision.lugarHint && (
          <p className="pd-mision-card-hint">
            <span aria-hidden>📍</span> {mision.lugarHint}
          </p>
        )}

        {completada ? (
          <div className="pd-mision-card-completada-wrap">
            <span className="pd-mision-card-check-label">✅ Completada</span>
            {preview && (
              <a
                href={preview}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-mision-card-ver-foto"
                download="mision.jpg"
              >
                📷 Ver foto
              </a>
            )}
          </div>
        ) : (
          <div className="pd-mision-card-actions">
            {mision.tipo === 'foto' && (
              <>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="pd-mision-card-file-input"
                  aria-label="Subir foto"
                  onChange={handleFile}
                />
                <button
                  type="button"
                  className="pd-mision-card-btn-foto"
                  onClick={() => inputRef.current?.click()}
                  disabled={cargando}
                >
                  {preview ? '📷 Cambiar foto' : '📷 Subir foto'}
                </button>
                {preview && (
                  <img src={preview} alt="Vista previa" className="pd-mision-card-preview" />
                )}
              </>
            )}
            <button
              type="button"
              className={`pd-mision-card-btn-completar${!preview && mision.tipo === 'foto' ? ' pd-mision-card-btn-completar--disabled' : ''}`}
              onClick={handleCompletar}
              disabled={cargando || (!preview && mision.tipo === 'foto')}
            >
              {cargando ? 'Guardando…' : 'Marcar como completada'}
            </button>
            {error && <p className="pd-mision-card-error" role="alert">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
