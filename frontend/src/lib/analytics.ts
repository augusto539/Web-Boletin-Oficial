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
  // OJO: tiene que pushear el objeto `arguments`, NO un array. gtag.js solo
  // interpreta como comando las entradas del dataLayer que son
  // `[object Arguments]`; si se pushea un Array (que es lo que produce
  // `(...args)` con rest params) las ignora en silencio — gtag.js carga y
  // corre, se ve todo "bien" en el dataLayer, pero el config y los eventos
  // nunca se procesan y no sale ni un hit a /g/collect. Por eso el snippet
  // oficial de Google es literalmente `function gtag(){dataLayer.push(arguments);}`
  // y hay que respetarlo tal cual.
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  // El sitio no usa ads/remarketing: se deniega ad_* de entrada y se concede
  // analytics_storage, que es lo único que necesita.
  //
  // (Nota histórica: este bloque se agregó culpando al Consent Mode de que
  // no llegaran hits. Esa lectura era incorrecta — la causa real era el
  // push de Array de arriba. Se mantiene igual porque denegar ad_* es lo
  // correcto para este sitio, no porque haga falta para que funcione.)
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
