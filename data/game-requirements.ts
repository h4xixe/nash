export const games = [
  { id: 'free-fire', name: 'Free Fire', edition: 'EXPERIÊNCIA CLÁSSICA', description: 'Partidas rápidas, ação intensa. A experiência original de battle royale.', minIOS: 12, source: 'https://apps.apple.com/br/app/free-fire/id1300146617', note: 'iOS 12.0 ou posterior, segundo a página da App Store consultada. Confirme os requisitos atuais antes de instalar.' },
  { id: 'free-fire-max', name: 'Free Fire MAX', edition: 'EXPERIÊNCIA APRIMORADA', description: 'O mesmo campo de batalha, com gráficos e efeitos visuais aprimorados.', minIOS: 13, source: 'https://ffsupport.garena.com/hc/en-us', note: 'iOS 13 ou posterior, conforme comunicado de suporte de junho de 2026. Verifique também a disponibilidade regional na App Store.' },
] as const;
export type Game = typeof games[number];
export const checkedOn = '09/10/2026';
