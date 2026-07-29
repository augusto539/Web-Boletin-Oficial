# Alternativa descartada: notificaciones enviadas desde el job diario

> **Estado: NO es el plan vigente.** Se guarda como referencia de la
> alternativa evaluada. El plan que se va a implementar pone la detección y el
> envío en el backend web. Todo lo que está fuera de esa decisión (modelo de
> datos, mail resumen por usuario, alcance del "qué cambió", auto-vinculación
> por CUIT/DNI, frontend) es igual en ambos y vale como referencia.

## Por qué se evaluó

Poner la detección y el envío dentro de `run_diario.py` hace que el aviso
salga en la misma corrida que carga los datos, sin un segundo proceso ni
espera. El job ya tiene conexión a Postgres como `boletin_admin` (owner, así
que lee `usuarios` sin grants nuevos) y ya manda mails por Resend
(`_enviar_alerta_fallo`, `_enviar_resultado`).

## Por qué se descartó

- **Plantilla HTML duplicada**: habría que portar el `layout()` de
  `backend/src/mail.ts` a Python y mantener las dos copias en sync a mano.
  Un cambio de marca se aplica en dos repos.
- **Dos repos acoplados**: cada cambio en la lógica de notificaciones obliga a
  buildear, publicar y bajar la imagen del job — con el mantenimiento de
  credenciales de GHCR que eso arrastra.
- **Presupuesto de memoria**: el contenedor corre con `--memory=800m` y ya tuvo
  varios OOM kills durante el catch-up (ver comentarios en
  `deploy/job-diario.service`). Sumarle render de mails es riesgo evitable.
- **Separación de responsabilidades**: `usuarios` y todo lo transaccional de
  mail es del dominio de la app web, no del pipeline de ingesta.

## Diseño que tenía (para referencia)

Módulo nuevo `notificaciones.py` en el repo `job-diario-boletin-oficial`,
invocado desde `main()` de `run_diario.py` justo después del bloque del mail de
resultado (donde ya están `pendientes` y `resumen` en alcance), envuelto en
try/except para que un fallo de notificaciones nunca tumbe la corrida ni
dispare la alerta de fallo.

Pasos, todo con la conexión `conectar()` que ya existe:

1. Resolver `boletines.id` desde `pendientes` (mismo `str(idb)` contra
   `id_pdf` que usa `_calcular_resultado_corrida`).
2. Auto-vincular suscripciones por documento contra `sociedades.cuit` /
   `personas_fisicas.cuit|documento`.
3. Buscar coincidencias excluyendo lo ya avisado (`LEFT JOIN
   notificaciones_enviadas ... WHERE ne.id IS NULL`).
4. Agrupar por usuario y armar un mail por usuario.
5. Enviar por Resend con el mismo `requests.post` de `_enviar_alerta_fallo`
   (`run_diario.py:530`), e insertar en `notificaciones_enviadas` recién ante
   un 2xx.

Env nuevas en `deploy/.env.example`: `BOLETIN_SITE_URL=https://ingcome.com.ar`.
Reusa `RESEND_API_KEY` / `ALERTA_EMAIL_FROM`.

CLI de prueba: `python notificaciones.py --id-pdf <id> [--dry-run]`.

## Qué se conserva del plan vigente

El modelo de datos (`suscripciones_notificacion` + `notificaciones_enviadas`),
el contenido del mail, la UI y el hallazgo sobre `COALESCE` en
`_upgrade_sociedad()` son idénticos — ver el plan vigente.
