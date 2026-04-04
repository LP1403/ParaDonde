/**
 * Píxeles extra al alinear con la flecha “bajar al contenido”: despega de la barra fija y del borde.
 */
export const SCROLL_EXTRA_PAST_CONTENT_TOP_PX = 96;

/**
 * Hace scroll hasta que `element` quede arriba del todo del primer ancestro con overflow scroll.
 * Cubre IonContent y contenedores custom.
 * @param extraScrollDownPx suma scroll (baja más el contenido); usar SCROLL_EXTRA_PAST_CONTENT_TOP_PX en héroes con chrome fijo.
 */
export function scrollElementToTopInScrollParent(
  element: HTMLElement | null,
  extraScrollDownPx = 0,
): void {
  if (!element) return;

  let scrollRoot: HTMLElement | null = element.parentElement;
  while (scrollRoot && scrollRoot !== document.documentElement) {
    const { overflowY } = getComputedStyle(scrollRoot);
    const canScroll = scrollRoot.scrollHeight > scrollRoot.clientHeight + 2;
    if (
      canScroll &&
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay')
    ) {
      const top =
        scrollRoot.scrollTop +
        element.getBoundingClientRect().top -
        scrollRoot.getBoundingClientRect().top +
        extraScrollDownPx;
      scrollRoot.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      return;
    }
    scrollRoot = scrollRoot.parentElement;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
