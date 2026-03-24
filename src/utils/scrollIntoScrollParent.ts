/**
 * Hace scroll hasta que `element` quede arriba del todo del primer ancestro con overflow scroll.
 * Cubre IonContent y contenedores custom.
 */
export function scrollElementToTopInScrollParent(element: HTMLElement | null): void {
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
        scrollRoot.getBoundingClientRect().top;
      scrollRoot.scrollTo({ top, behavior: 'smooth' });
      return;
    }
    scrollRoot = scrollRoot.parentElement;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
