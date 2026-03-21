# Programas de referidos y afiliados (Booking, TripAdvisor, widgets)

Documento de referencia para integrar ofertas, banners y enlaces de hoteles en **Para Dónde?**.  
Última actualización: marzo 2026.

---

## Resumen ejecutivo

| Opción | Dificultad | Personalización | Comisiones |
|--------|------------|-----------------|------------|
| Enlaces afiliado directos (ya en uso) | Baja | Ninguna | Sí |
| Programa afiliado Booking + widgets embed | Media | Limitada | Sí |
| Widget Hatlas (iframe, terceros) | Baja | Ninguna | No |
| Demand API (Booking) | Alta (contrato / account manager) | Total | Sí |

**Recomendación práctica:** registrar el programa de afiliados gratuito de Booking.com y usar widgets embed por destino; con tráfico relevante, evaluar la Demand API.

---

## Booking.com — Demand API (API “completa”)

- Documentación: [developers.booking.com](https://developers.booking.com/api/index.html)
- Permite buscar alojamientos, disponibilidad, precios y flujos de reserva (según producto contratado).

**Limitaciones importantes:**

- No es un “API key gratis” para cualquier desarrollador.
- Requiere ser **Managed Affiliate Partner** con contrato y **Account Manager** de Booking.
- Credenciales típicas: `X-Affiliate-Id` + token en el Partner Centre (tras aprobación).
- Hay **sandbox** para pruebas sin reservas reales.

**Conclusión:** para un sitio nuevo o pequeño, el acceso suele ser difícil; es un canal B2B/partners, no auto-servicio masivo.

---

## Booking.com — Programa de afiliados (camino habitual)

- Portal: [partnerships.booking.com](https://partnerships.booking.com/)
- Registro **gratuito**; aprobación frecuente en **1–3 días hábiles** (puede variar).
- Se pide URL del sitio, fuente de tráfico, categoría de contenido, etc.

**Qué obtienes sin API:**

- **Widgets / iframes** (search box, listados, banners) generados desde el **Affiliate Partner Centre**.
- Enlaces con tu ID de afiliado hacia destinos o propiedades.
- Comisiones orientativas en la industria del **25–40 %** sobre la comisión de Booking (según volumen y condiciones vigentes del programa).

**Centro de ayuda afiliados (widgets, API access):**  
[affiliates.support.booking.com](https://affiliates.support.booking.com/)

**Limitación:** el diseño del widget es de Booking; integración limitada con UI propia tipo “glass” sin iframe o sin API.

---

## Alternativa sin API propia: widget Hatlas (terceros)

- Ejemplo documentado: widget tipo iframe que muestra hoteles de Booking por ciudad o coordenadas.
- **Ventaja:** implementación rápida (copiar/pegar HTML).
- **Desventajas:** poca o nula personalización visual; puede no generar comisiones si no está vinculado a tu cuenta de afiliado; dependencia de un tercero.

Buscar referencias actuales con términos como “Booking hotel affiliate widget iframe”.

---

## TripAdvisor

- **Widgets oficiales** (reseñas, ratings, detalle de propiedad): suelen pasar por el **Developer / Partner Portal** y pueden requerir aprobación.
- Enfoque típico: **reseñas y reputación**, no tanto “ofertas del día” como un OTA.
- Documentación histórica: [developer-tripadvisor.com](https://developer-tripadvisor.com/) (verificar rutas actuales en su sitio).

**Alternativas de terceros:** existen agregadores de reseñas (embed) que consumen contenido público; revisar términos de uso y si cumplen con las políticas de TripAdvisor.

---

## Qué encaja con Para Dónde?

1. **Mantener / ampliar enlaces afiliado** en fichas de destino (Booking, TripAdvisor) — ya alineado con el modelo actual.
2. **Afiliado Booking + widget** debajo de la guía de un destino (ciudad + país en el embed), si el Partner Centre lo permite para esa ubicación.
3. **No depender** de la Demand API hasta tener volumen y contacto comercial claro.
4. **Documentar** en privado el `affiliate_id` y no subir keys al repositorio (variables de entorno / Firebase si en el futuro hay backend).

---

## Enlaces útiles (verificar que sigan vigentes)

| Recurso | URL |
|---------|-----|
| Booking Partnerships / afiliados | https://partnerships.booking.com/ |
| Booking Developers | https://developers.booking.com/ |
| Soporte afiliados Booking | https://affiliates.support.booking.com/ |
| TripAdvisor Developer | https://developer-tripadvisor.com/ |

---

## Nota legal

Los porcentajes de comisión, requisitos de aprobación y productos API cambian con el tiempo. Antes de integrar algo en producción, revisar los **términos del programa** y la documentación oficial vigente.
