import { useCallback, useRef, useState } from 'react';

const TOP_REVEAL_PX = 72;
const DELTA_THRESHOLD = 10;

type ScrollDetail = { scrollTop: number };

/**
 * Oculta la barra flotante al bajar y la muestra al subir (estilo “chrome” móvil).
 * Usar con IonContent: scrollEvents + onIonScroll, o con un contenedor scroll nativo.
 */
export function useFloatingChromeScroll() {
  const [chromeVisible, setChromeVisible] = useState(true);
  const lastTop = useRef(0);
  const ticking = useRef(false);

  const applyScroll = useCallback((scrollTop: number) => {
    if (scrollTop < TOP_REVEAL_PX) {
      setChromeVisible(true);
      lastTop.current = scrollTop;
      return;
    }
    const delta = scrollTop - lastTop.current;
    lastTop.current = scrollTop;
    if (delta > DELTA_THRESHOLD) setChromeVisible(false);
    else if (delta < -DELTA_THRESHOLD) setChromeVisible(true);
  }, []);

  const onIonScroll = useCallback(
    (ev: CustomEvent<ScrollDetail>) => {
      const top = ev.detail?.scrollTop ?? 0;
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        applyScroll(top);
      });
    },
    [applyScroll],
  );

  /** Para div con overflow (ej. página Destino) vía listener propio. */
  const notifyScrollTop = useCallback(
    (scrollTop: number) => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        applyScroll(scrollTop);
      });
    },
    [applyScroll],
  );

  const onNativeScroll = useCallback(
    (ev: React.UIEvent<HTMLDivElement>) => {
      notifyScrollTop(ev.currentTarget.scrollTop);
    },
    [notifyScrollTop],
  );

  return {
    chromeVisible,
    ionScrollProps: { scrollEvents: true as const, onIonScroll },
    onNativeScroll,
    notifyScrollTop,
  };
}
