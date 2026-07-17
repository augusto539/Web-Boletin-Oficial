import type { NextFunction, Request, RequestHandler, Response } from "express";

// Express 4 no atrapa el rechazo de una promesa dentro de un handler async:
// sin este wrapper, un error de pool().query() (ej. un hipo transitorio de
// conexión a la base) queda como una promesa rechazada sin manejar, y desde
// Node 15 eso mata el proceso entero — el contenedor se reinicia solo, pero
// cualquier pedido en vuelo en ese momento le llega a Caddy con la conexión
// cortada (502). Este wrapper reenvía el error a next(), que lo atrapa el
// error handler global de server.ts en vez de tirar todo el servidor abajo.
export function asyncHandler<Req extends Request = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req as Req, res, next).catch(next);
  };
}
