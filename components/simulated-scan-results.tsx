import { ShieldCheck, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SIMULATED_SCAN_NOTICE, SIMULATED_SCAN_STATUS, simulatedScanItems } from '@/lib/simulated-scan';

export function SimulatedScanResults() {
  return (
    <section className="panel flex flex-col gap-5 p-6" aria-labelledby="simulated-scan-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="simulated-scan-title" className="font-medium">
          Varredura de apps e modificações
        </h2>
        <Badge variant="outline">Simulação</Badge>
      </div>
      <ul className="flex flex-col divide-y divide-border">
        {simulatedScanItems.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-4 py-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">{item.detail}</span>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-primary">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {SIMULATED_SCAN_STATUS}
            </span>
          </li>
        ))}
      </ul>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {SIMULATED_SCAN_NOTICE}
      </p>
    </section>
  );
}
