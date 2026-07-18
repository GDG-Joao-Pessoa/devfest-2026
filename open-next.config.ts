import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default {
  ...defineCloudflareConfig(),
  // O adapter roda `npm run build` por padrão para buildar o Next. Como o
  // script `build` deste projeto é o próprio `opennextjs-cloudflare build`
  // (para funcionar com o comando padrão do painel da Cloudflare), apontar
  // para `build:next` evita a recursão infinita.
  buildCommand: 'npm run build:next',
};
