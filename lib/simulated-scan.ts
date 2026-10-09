export const SIMULATED_SCAN_NOTICE =
  'Resultado simulado — este site não verifica aplicativos, arquivos ou perfis instalados no aparelho.';

export const simulatedScanItems = [
  { name: 'Arquivos .IPA', detail: 'Pacotes de apps iOS fora da App Store' },
  { name: 'Sideloadly', detail: 'Instalação de IPAs via computador' },
  { name: 'AltStore / SideStore', detail: 'Lojas alternativas de sideload' },
  { name: 'TrollStore', detail: 'Instalação permanente de IPAs' },
  { name: 'Certificados empresariais', detail: 'Apps assinados fora da App Store' },
  { name: 'Perfis de configuração', detail: 'Perfis MDM ou VPN suspeitos' },
  { name: 'Injeção de dylibs / tweaks', detail: 'Bibliotecas modificadas em jogos' },
  { name: 'Jailbreak', detail: 'Sinais de sistema modificado' },
  { name: 'Hacks e cheats', detail: 'Mod menus, aimbots e similares' },
] as const;

export const SIMULATED_SCAN_STATUS = 'Nada encontrado';
