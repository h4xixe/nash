'use client';
import { useEffect, useRef, useState } from 'react';
import type { FaceLandmarker } from '@mediapipe/tasks-vision';
import { Camera, ShieldCheck } from 'lucide-react';

// MediaPipe's WASM runtime routes informational logs (e.g. "INFO: Created TensorFlow Lite XNNPACK delegate")
// through stderr, which surfaces as console.error and is reported as a runtime error by the preview.
const MEDIAPIPE_INFO_LOG = /^(INFO:|[IW]\d{4} )|TensorFlow Lite|XNNPACK|gl_context|landmark_projection_calculator/;
let originalConsoleError: typeof console.error | null = null;
function suppressMediapipeInfoLogs() {
 if (originalConsoleError) return;
 const original = console.error;
 originalConsoleError = original;
 console.error = (...args: unknown[]) => {
  const first = args[0];
  const text = typeof first === 'string' ? first : first instanceof Error ? first.message : '';
  if (MEDIAPIPE_INFO_LOG.test(text)) return;
  original(...args);
 };
}

export function IrisSimulation({onComplete}:{onComplete:()=>void}) {
 const video=useRef<HTMLVideoElement>(null);
 const stream=useRef<MediaStream|null>(null);
 const detector=useRef<FaceLandmarker|null>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const generation=useRef(0);
 const [status,setStatus]=useState<'idle'|'loading'|'active'|'error'>('idle');
 const [message,setMessage]=useState('Permita a câmera frontal para posicionar seu olho.');
 const [progress,setProgress]=useState(0);
 function release(){stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;if(timer.current)clearTimeout(timer.current);detector.current?.close();detector.current=null;}
 useEffect(()=>()=>{generation.current++;release()},[]);
 async function start(){
  const attempt=++generation.current; release();setProgress(0);setStatus('loading');setMessage('Solicitando câmera e preparando detecção…');
  try {
   if(!navigator.mediaDevices?.getUserMedia)throw new Error('Abra esta página em HTTPS em um navegador com suporte à câmera.');
   const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
   if(attempt!==generation.current){media.getTracks().forEach(t=>t.stop());return;}
   stream.current=media;
   if(!video.current)throw new Error('Não foi possível abrir o vídeo. Tente novamente.');
   video.current.srcObject=media;await video.current.play();
   suppressMediapipeInfoLogs();
   const {FaceLandmarker,FilesetResolver}=await import('@mediapipe/tasks-vision');
   const files=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm');
   const model=await FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'},runningMode:'VIDEO',numFaces:2,minFaceDetectionConfidence:0.7,minFacePresenceConfidence:0.7,minTrackingConfidence:0.7});
   if(attempt!==generation.current){model.close();return;} detector.current=model;setStatus('active');
   let held=0;let last=performance.now();let lastFrame=-1;
   const tick=()=>{
    if(attempt!==generation.current)return;
    try{
     const v=video.current;const now=performance.now();
     if(!v||v.readyState<2||v.currentTime===lastFrame||document.hidden){held=0;last=now;setProgress(0);timer.current=setTimeout(tick,120);return;}
     lastFrame=v.currentTime;
     const faces=model.detectForVideo(v,now).faceLandmarks;
     const face=faces.length===1?faces[0]:null;
     const eye=face?.[468];const other=face?.[473];
     const valid=!!(eye&&other&&eye.x>0.15&&eye.x<0.85&&eye.y>0.25&&eye.y<0.65&&Math.abs(eye.x-other.x)>0.12&&Math.abs(eye.x-other.x)<0.5);
     held=valid?held+Math.min(now-last,250):0;last=now;setProgress(Math.min(100,Math.floor(held/30)));
     setMessage(valid?'Olho detectado. Mantenha a posição por 3 segundos.':faces.length>1?'Apenas uma pessoa deve aparecer na câmera.':'Olhe para a câmera e mantenha os olhos na faixa central. Deixe seu rosto visível.');
     if(held>=3000){release();onComplete();return;}
     timer.current=setTimeout(tick,120);
    }catch{release();setStatus('error');setMessage('A detecção foi interrompida. Tente novamente em um navegador atualizado.');}
   };tick();
  }catch(error){if(attempt!==generation.current)return;release();setStatus('error');const name=error instanceof Error?error.name:'';setMessage(name==='NotAllowedError'?'Acesso à câmera negado ou bloqueado. Permita a câmera nas configurações do navegador. Se estiver no preview incorporado, abra o site em uma nova aba.':name==='NotFoundError'?'Nenhuma câmera foi encontrada neste dispositivo.':'Não foi possível iniciar a câmera ou carregar o detector. Confira sua conexão e tente novamente.');}
 }
 return <section className="panel mx-auto flex max-w-xl flex-col items-center gap-6 px-5 py-8">
  <h2 className="flex items-center gap-2 text-lg font-medium"><Camera className="size-5"/>Posicione seu olho na câmera</h2>
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-background">
   <video ref={video} autoPlay muted playsInline aria-label="Prévia da câmera frontal" className="h-full w-full -scale-x-100 object-contain"/>
   <div aria-hidden="true" className="pointer-events-none absolute left-[15%] top-[25%] h-[40%] w-[70%] rounded-[50%] border-2 border-primary"/>
  </div>
  <p role="status" className="text-center text-sm leading-relaxed">{message}</p>
  <progress value={progress} max={100} aria-label="Tempo de enquadramento do olho" className="h-2 w-full accent-primary"/>
  {(status==='idle'||status==='error')&&<button onClick={start} className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">{status==='error'?'Tentar novamente':'Permitir câmera e começar'}</button>}
  {status==='loading'&&<p className="text-sm text-muted-foreground">Aguarde o carregamento do detector…</p>}
  <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><ShieldCheck className="mt-1 size-4 shrink-0"/>As imagens são processadas somente neste navegador, sem envio ou gravação. Esta etapa verifica o enquadramento do olho, não a identidade pela íris. Modelos de detecção são baixados ao iniciar.</p>
 </section>
}
