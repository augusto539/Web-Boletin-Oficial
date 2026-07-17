const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let iniciado = false;

// Solo carga gtag.js si hay un ID configurado y estamos en build de producción
// (así el desarrollo local nunca ensucia las métricas reales, sin tener que
// acordarse de sacar la variable de entorno).
export function iniciarAnalytics() {
  if (iniciado || !GA_ID || !import.meta.env.PROD) return;
  iniciado = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  // Sin este "consent default" el tag queda en Consent Mode (lo confirma
  // gtm.init_consent en el dataLayer) sin ninguna señal de consentimiento,
  // y gtag.js directamente nunca manda el hit — se ve procesar todo
  // localmente (incluso "Tag fired" en el debugger) pero nada llega a
  // Google (0 en DebugView/Realtime). El sitio no usa ads/remarketing, así
  // que no hace falta pedirle consentimiento al visitante para eso: se
  // deniega ad_* de entrada y se concede analytics_storage, que es lo único
  // que este sitio necesita.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  window.gtag("config", GA_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

export function trackPageview(path: string) {
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(nombre: string, parametros: Record<string, unknown> = {}) {
  window.gtag?.("event", nombre, parametros);
}
