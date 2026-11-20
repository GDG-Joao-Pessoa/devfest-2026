import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

export default {
  // Serve as páginas pré-renderizadas no build (home, palestrantes...) direto dos
  // static assets. Sem um incremental cache o Worker renderizava essas páginas a
  // cada request: 60–300 ms de CPU (acima dos 10 ms do plano Free → erro 1102) e
  // 500 por promise compartilhada entre requests ("This promise was created by a
  // request that has since ended"). O site não usa revalidação, então o cache
  // read-only de assets basta.
  ...defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache }),
  // O adapter roda `npm run build` por padrão para buildar o Next. Como o
  // script `build` deste projeto é o próprio `opennextjs-cloudflare build`
  // (para funcionar com o comando padrão do painel da Cloudflare), apontar
  // para `build:next` evita a recursão infinita.
  buildCommand: 'npm run build:next',
};
