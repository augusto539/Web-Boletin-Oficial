import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

// Sin esto, un hipo de red transitorio (típico en la instancia de prod, que
// corre justa de recursos) hace fallar la query una vez y ahí queda: páginas
// como Sociedad.tsx/Persona.tsx tratan cualquier error de red igual que un
// "no existe", mostrando un 404 permanente hasta que el usuario recarga a
// mano. Reintentar automático evita que un hipo de un segundo se vea como un
// dato roto.
const retryLink = new RetryLink({
  delay: { initial: 300, max: 3000, jitter: true },
  attempts: { max: 3 },
});

export const apollo = new ApolloClient({
  link: retryLink.concat(
    new HttpLink({
      // Sin VITE_GRAPHQL_URL (siempre el caso en dev; en prod el Dockerfile
      // la fija a "/graphql", relativa) se usa el mismo host desde el que se
      // cargó la página, no "localhost" fijo: así funciona igual entrando
      // por localhost:5173 o por la IP de LAN de la máquina desde el celu.
      uri: import.meta.env.VITE_GRAPHQL_URL ?? `http://${window.location.hostname}:5050/graphql`,
    }),
  ),
  cache: new InMemoryCache(),
});
