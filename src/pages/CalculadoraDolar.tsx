import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonPage, IonContent, IonInput, IonItem, IonLabel } from '@ionic/react';
import { PdSubpageChrome } from '../components/PdSubpageChrome';

const PAGE_TITLE = 'Calculadora dólar tarjeta – Para Dónde?';

const DOLAR_API = 'https://dolarapi.com/v1/dolares/tarjeta';

interface DolarTarjeta {
  venta: number;
  compra: number;
}

export default function CalculadoraDolar() {
  const navigate = useNavigate();
  const [usd, setUsd] = useState<string>('');
  const [cotizacion, setCotizacion] = useState<DolarTarjeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(DOLAR_API)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.venta != null) {
          setCotizacion({ venta: data.venta, compra: data.compra });
        }
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar la cotización.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const numUsd = parseFloat(usd.replace(',', '.')) || 0;
  const valorVenta = cotizacion?.venta ?? 0;
  const pesos = numUsd * valorVenta;

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <IonPage>
      <PdSubpageChrome onBack={() => navigate('/')} />
      <IonContent className="ion-padding">
        <div className="pd-content pd-subpage-inner">
        <h1 style={{ color: 'var(--pd-color-text)', marginBottom: '0.5rem' }}>
          ¿Cuánto me llega en pesos?
        </h1>
        <p style={{ color: 'var(--pd-color-text-muted)', marginBottom: '1rem' }}>
          Gastaste USD con la tarjeta y querés saber cuánto vas a pagar en pesos en el resumen. Usamos el dólar tarjeta (DolarAPI).
        </p>
        {loading && <p>Cargando cotización…</p>}
        {error && <p style={{ color: 'var(--pd-color-primary)' }}>{error}</p>}
        {cotizacion && !loading && (
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            Dólar tarjeta (venta): ${cotizacion.venta.toLocaleString('es-AR')}
          </p>
        )}
        <IonItem>
          <IonLabel position="stacked">Gasté (USD)</IonLabel>
          <IonInput
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={usd}
            onIonInput={(e) => setUsd(e.detail.value ?? '')}
          />
        </IonItem>
        {!loading && (cotizacion || valorVenta === 0) && (
          <p style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
            Te llega aproximadamente: ${pesos.toLocaleString('es-AR')} ARS
          </p>
        )}
        </div>
      </IonContent>
    </IonPage>
  );
}
