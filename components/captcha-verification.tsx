'use client';
import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, LoaderCircle, Check } from 'lucide-react';
import { Device } from '@/data/iphone-models';
import { Game } from '@/data/game-requirements';
import { Report, analyze, detectCapabilities } from '@/lib/analysis';
export function CaptchaVerification({ device, game, ios, onSuccess }: { device:Device;game:Game;ios:string;onSuccess:(report:Report)=>void }) {
 const [status,setStatus]=useState<'idle'|'checking'|'done'>('idle');
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 function start(){
  if(status!=='idle')return;
  setStatus('checking');
  timer.current=setTimeout(()=>{
   setStatus('done');
   timer.current=setTimeout(()=>onSuccess(analyze(device,game,ios,detectCapabilities())),600);
  },1200);
 }
 return <section className="panel mx-auto flex max-w-xl flex-col items-center gap-6 px-5 py-12 text-center">
  <span className="flex size-16 items-center justify-center rounded-2xl border bg-background"><ShieldCheck className="size-7 text-primary" strokeWidth={1.4}/></span>
  <div className="flex flex-col gap-2"><h2 className="text-xl font-semibold">CAPTCHA demonstrativo</h2><p className="text-sm text-muted-foreground">Uma etapa visual para continuar sua experiência.</p></div>
  <button type="button" onClick={start} disabled={status!=='idle'} className="flex w-full max-w-sm items-center gap-4 rounded-lg border bg-background px-5 py-5 text-left focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default" aria-label="Não sou um robô — simulação">
   <span className="flex size-7 shrink-0 items-center justify-center rounded border border-primary text-primary">{status==='checking'?<LoaderCircle className="size-5 animate-spin"/>:status==='done'?<Check className="size-5"/>:null}</span>
   <span className="flex flex-col gap-1"><span className="text-sm font-medium">Não sou um robô</span><span className="text-sm text-muted-foreground">Modo demonstrativo</span></span>
  </button>
  <p role="status" className="text-sm text-primary">{status==='checking'?'Simulando verificação…':status==='done'?'Simulação concluída. Continuando…':'Clique acima para continuar.'}</p>
  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Este CAPTCHA é fictício: não valida sua identidade nem oferece proteção contra robôs. Sem Cloudflare ou envio de dados a terceiros.</p>
 </section>
}
