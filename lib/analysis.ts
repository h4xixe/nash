import { Device, deviceSpecs } from '@/data/iphone-models';
import { Game, checkedOn } from '@/data/game-requirements';
export type Capabilities = { viewport: string; pixelRatio: number; webgl: boolean; language: string };
export type Report = ReturnType<typeof analyze>;
export function analyze(device: Device, game: Game, ios: string, browser: Capabilities) {
  const osKnown = /^\d+$/.test(ios);
  const osCompatible = osKnown && Number(ios) >= game.minIOS;
  return { device, game, ios, browser, date: new Date().toISOString(), checkedOn,
    indicators: [
      { title: 'Compatibilidade com o jogo', status: !osKnown ? 'Informação insuficiente' : osCompatible ? 'Compatibilidade parcial' : 'Não compatível', detail: !osKnown ? 'Informe o iOS para comparar o requisito mínimo.' : osCompatible ? `O iOS informado atende ao mínimo (${game.minIOS}). Armazenamento e desempenho não foram medidos.` : `O jogo requer iOS ${game.minIOS} ou posterior.` },
      { title: 'Capacidade de processamento', status: 'Informação insuficiente', detail: device.chip ? `${device.chip} cadastrado. Sem requisito de chipset confirmado ou benchmark.` : 'Chipset não cadastrado com fonte verificada.' },
      { title: 'Memória segundo especificações', status: 'Informação insuficiente', detail: 'A Apple não informa RAM na ficha consultada. A memória livre não é acessível.' },
      { title: 'Recursos gráficos conhecidos', status: 'Informação insuficiente', detail: `WebGL ${browser.webgl ? 'disponível' : 'não disponível'} neste navegador. Isso não comprova suporte gráfico do jogo nativo.` },
    ],
    recommendations: [
      !osCompatible ? `Verifique o iOS do aparelho: ${game.name} requer a versão ${game.minIOS} ou posterior.` : 'Mantenha o iOS e o jogo atualizados.',
      game.id === 'free-fire-max' ? 'No Free Fire MAX, comece com qualidade gráfica padrão e ajuste durante uma partida.' : 'No Free Fire, ajuste a qualidade gráfica nas configurações conforme a fluidez observada.',
      ...(device.hz === 120 ? ['A tela de até 120 Hz não garante 120 FPS: a taxa depende do jogo e das configurações.'] : []),
      'Confira o armazenamento livre em Ajustes > Geral > Armazenamento do iPhone.',
      'Evite tarefas pesadas em segundo plano e interrompa a sessão se houver aquecimento perceptível.',
    ],
    specs: deviceSpecs(device),
    methodology: 'Comparação documental, não um benchmark. Modelo e iOS declarados pelo usuário; especificações cadastradas com fontes; viewport, densidade de pixels e suporte a WebGL detectados no navegador atual, que pode não ser o iPhone selecionado. O progresso de 180 segundos é uma apresentação temporizada. Não há acesso a sensores, temperatura, RAM livre ou FPS. Campos do jogador não participam da avaliação.',
  };
}
export function detectCapabilities(): Capabilities {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  const webgl = !!gl;
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return { viewport: `${window.innerWidth} × ${window.innerHeight} CSS px`, pixelRatio: window.devicePixelRatio, webgl, language: navigator.language };
}
export const phases = [
  { at: 0, title: 'Preparação', detail: 'Conferindo informações fornecidas' },
  { at: 20, title: 'Processador', detail: 'Apresentando especificações cadastradas do chipset' },
  { at: 50, title: 'Memória', detail: 'Conferindo a disponibilidade de dados de RAM' },
  { at: 80, title: 'Tela e gráficos', detail: 'Organizando os recursos informados pelo navegador' },
  { at: 110, title: 'Compatibilidade com o jogo', detail: 'Apresentando a comparação de requisitos conhecidos' },
  { at: 140, title: 'Consolidação', detail: 'Organizando o relatório de compatibilidade' },
  { at: 165, title: 'Finalização', detail: 'Concluindo a apresentação dos resultados' },
];
export const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
