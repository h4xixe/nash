export type Device = { id: string; name: string; family: string; year: number; chip?: string; ram?: number; screen: string; hz?: number; resolution?: string; source: string };
const source = 'https://support.apple.com/pt-br/108044';
const families: [number, string[], string[]][] = [
  [11, ['', ' Pro', ' Pro Max'], ['6,1', '5,8', '6,5']],
  [12, ['', ' mini', ' Pro', ' Pro Max'], ['6,1', '5,4', '6,1', '6,7']],
  [13, ['', ' mini', ' Pro', ' Pro Max'], ['6,1', '5,4', '6,1', '6,7']],
  [14, ['', ' Plus', ' Pro', ' Pro Max'], ['6,1', '6,7', '6,1', '6,7']],
  [15, ['', ' Plus', ' Pro', ' Pro Max'], ['6,1', '6,7', '6,1', '6,7']],
  [16, ['', ' Plus', ' Pro', ' Pro Max', 'e'], ['6,1', '6,7', '6,3', '6,9', '6,1']],
  [17, ['', ' Pro', ' Pro Max', 'e'], ['6,3', '6,3', '6,9', '6,1']],
];
export const devices: Device[] = families.flatMap(([generation, variants, sizes]) => variants.map((variant, index) => ({
  id: `iphone-${generation}${variant.toLowerCase().replaceAll(' ', '-')}`,
  name: `iPhone ${generation}${variant}`, family: `${generation}`, year: generation + 2008 + (variant === 'e' ? 1 : 0), screen: sizes[index], source,
  ...(generation === 15 && variant === ' Pro' ? { chip: 'A17 Pro', hz: 120, resolution: '2556 × 1179', source: 'https://support.apple.com/pt-br/111829' } : {}),
  ...(generation === 17 && variant === ' Pro' ? { chip: 'A19 Pro', hz: 120, resolution: '2622 × 1206', source: 'https://support.apple.com/en-us/125090' } : {}),
}))).concat({ id: 'iphone-air', name: 'iPhone Air', family: '17', year: 2025, screen: '6,5', source });
export const defaultDevice = devices.find(d => d.id === 'iphone-15-pro')!;
export const unavailable = 'Informação não disponível';
export function deviceSpecs(d: Device) { return [
  ['Processador', d.chip ?? unavailable], ['Memória RAM', d.ram ? `${d.ram} GB` : unavailable],
  ['Tela', `${d.screen} polegadas`], ['Atualização', d.hz ? `Até ${d.hz} Hz` : unavailable],
  ['Resolução', d.resolution ?? unavailable], ['Lançamento', `${d.year}`],
]; }
