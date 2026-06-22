import { useState, useEffect, useRef, useCallback } from "react";

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0f0f13; color: #e8e8f0; font-family: 'Courier New', monospace; min-height: 100vh; }
.app { max-width: 960px; margin: 0 auto; padding: 2rem 1rem; }
.header { text-align: center; margin-bottom: 2rem; }
.header h1 { font-size: 1.9rem; font-weight: 700; color: #7c6cfa; }
.header p { color: #888899; font-size: 0.82rem; margin-top: 0.3rem; }
.tabs { display: flex; gap: 4px; margin-bottom: 2rem; border-bottom: 1px solid #2e2e3e; flex-wrap: wrap; }
.tab { background: none; border: none; color: #888899; padding: 0.6rem 1.1rem; cursor: pointer; font-family: inherit; font-size: 0.82rem; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
.tab:hover { color: #e8e8f0; }
.tab.active { color: #7c6cfa; border-bottom-color: #7c6cfa; }
.module { animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);} }
.card { background: #1a1a22; border: 1px solid #2e2e3e; border-radius: 8px; padding: 1.1rem; margin-bottom: 0.9rem; }
.card-title { font-size: 0.72rem; color: #888899; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.7rem; }
.row { display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem; }
.row label { font-size: 0.78rem; color: #888899; min-width: 110px; }
.row input[type=range] { flex: 1; accent-color: #7c6cfa; }
.val { font-size: 0.82rem; font-weight: 700; min-width: 65px; text-align: right; }
.btn { background: #22222e; border: 1px solid #2e2e3e; color: #e8e8f0; padding: 0.45rem 1rem; border-radius: 6px; cursor: pointer; font-family: inherit; font-size: 0.8rem; transition: all 0.15s; }
.btn:hover { border-color: #7c6cfa; color: #7c6cfa; }
.btn.on { background: #7c6cfa; border-color: #7c6cfa; color: #fff; }
.btn.reset { border-color: #fa6c9f; color: #fa6c9f; }
.btn.reset:hover { background: #fa6c9f22; }
.btns { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 0.75rem; }
canvas { width: 100%; background: #0d0d12; border-radius: 4px; border: 1px solid #2e2e3e; display: block; }
.info { background: #22222e; border-left: 3px solid #7c6cfa; padding: 0.65rem 0.9rem; border-radius: 0 6px 6px 0; font-size: 0.8rem; color: #888899; line-height: 1.55; margin: 0.75rem 0; }
.info strong { color: #e8e8f0; }
.step-label { font-size: 0.85rem; font-weight: 700; color: #7c6cfa; display: flex; align-items: center; gap: 8px; margin-bottom: 0.5rem; }
.step-badge { background: #7c6cfa; color: #fff; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0; }
.retention-bar { height: 6px; background: #22222e; border-radius: 3px; overflow: hidden; margin: 4px 0 8px; }
.retention-fill { height: 100%; border-radius: 3px; transition: width 0.3s, background 0.3s; }
.canvas-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 6px; }
.canvas-label { font-size: 0.68rem; color: #888899; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.06em; }
.tone-big { font-size: 1.5rem; font-weight: 700; color: #7c6cfa; }
.tone-note { font-size: 0.9rem; color: #fa6c9f; margin-left: 6px; }
.audio-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 0.9rem; margin: 0.9rem 0; }
.audio-card { background: #1a1a22; border: 1px solid #2e2e3e; border-radius: 8px; padding: 0.9rem; }
.audio-card.correct { border-color: #4ade80; background: #4ade8012; }
.audio-card.wrong { border-color: #f87171; background: #f8717112; }
.audio-label { font-size: 0.68rem; color: #888899; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
.audio-player { width: 100%; margin: 0.4rem 0; accent-color: #7c6cfa; }
.method-btns { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 0.4rem; }
.method-btn { background: #22222e; border: 1px solid #2e2e3e; color: #888899; padding: 3px 9px; border-radius: 4px; cursor: pointer; font-family: inherit; font-size: 0.72rem; transition: all 0.12s; }
.method-btn:hover { border-color: #7c6cfa; color: #7c6cfa; }
.method-btn.sel { border-color: #7c6cfa; color: #7c6cfa; background: #7c6cfa22; }
.quiz-score { display: flex; align-items: center; gap: 1rem; padding: 0.7rem 1rem; background: #1a1a22; border: 1px solid #2e2e3e; border-radius: 8px; margin-bottom: 1rem; }
.video-wrap { position: relative; background: #0a0a0f; border: 1px solid #2e2e3e; border-radius: 8px; overflow: hidden; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; }
.video-wrap video { width: 100%; height: 100%; object-fit: contain; }
.video-ph { text-align: center; padding: 2.5rem; }
.video-ph .ico { font-size: 2.5rem; margin-bottom: 0.75rem; }
.video-ph p { color: #888899; font-size: 0.82rem; line-height: 1.6; }
.video-ph code { background: #22222e; padding: 2px 5px; border-radius: 3px; font-size: 0.78rem; color: #7c6cfa; }
@media(max-width:600px){ .audio-grid{grid-template-columns:1fr;} .canvas-row{grid-template-columns:1fr;} }
`;

const METHODS=["Oryginał","DCT top-k","DCT psycho","Stary AE","DAE STFT","VAE"];
const NOTES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
function hzToNote(hz){if(hz<20)return"";const m=Math.round(69+12*Math.log2(hz/440));return NOTES[((m%12)+12)%12]+(Math.floor(m/12)-1);}

function makeDCTfn(N){return sig=>{const out=new Float32Array(N);for(let k=0;k<N;k++){let s=0;for(let n=0;n<N;n++)s+=sig[n]*Math.cos(Math.PI/N*(n+0.5)*k);out[k]=s;}return out;};}
function makeIDCTfn(N){return dct=>{const out=new Float32Array(N);for(let n=0;n<N;n++){let s=dct[0]/N;for(let k=1;k<N;k++)s+=(2/N)*dct[k]*Math.cos(Math.PI/N*(n+0.5)*k);out[n]=s;}return out;};}
function quantize(arr,bits){const mx=Math.max(...arr.map(Math.abs))+1e-9;const lv=Math.pow(2,bits);return arr.map(v=>Math.round(v/mx*(lv/2))/(lv/2)*mx);}
function barkMask(dct,spreadDb){return dct.map((v,i)=>{let mx=0;dct.forEach((vn,j)=>{const dist=Math.abs(i-j)/dct.length*24;const thr=Math.abs(vn)*Math.pow(10,(-spreadDb*dist/24)/20);if(thr>mx)mx=thr;});return Math.abs(v)>mx?v:0;});}

function drawSignalCanvas(cv, sig, color, origSig){
  if(!cv)return;
  const ctx=cv.getContext("2d");
  const W=cv.width=cv.offsetWidth*devicePixelRatio;
  const H=cv.height=110*devicePixelRatio;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle="#1e1e2a";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();
  const drawLine=(arr,col,lw,alpha=1)=>{
    ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=col;ctx.lineWidth=lw*devicePixelRatio;ctx.beginPath();
    arr.forEach((v,i)=>{const x=i/arr.length*W,y=H/2-v*(H*0.42);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.stroke();ctx.restore();
  };
  if(origSig)drawLine(origSig,"#fa6c9f",1.5,0.4);
  drawLine(sig,color,2);
}

function drawSpectrumCanvas(cv, dct, color, origDct){
  if(!cv)return;
  const ctx=cv.getContext("2d");
  const W=cv.width=cv.offsetWidth*devicePixelRatio;
  const H=cv.height=110*devicePixelRatio;
  ctx.clearRect(0,0,W,H);
  const N=dct.length;
  const allVals=[...dct.map(Math.abs)];
  if(origDct)allVals.push(...origDct.map(Math.abs));
  const maxV=Math.max(...allVals)+1e-9;
  if(origDct){
    origDct.forEach((v,i)=>{
      const x=i/N*W,w=Math.max(1.5,W/N-1),h=(Math.abs(v)/maxV)*H*0.88;
      ctx.fillStyle="rgba(250,108,159,0.25)";ctx.fillRect(x,H-h,w,h);
    });
  }
  dct.forEach((v,i)=>{
    const x=i/N*W,w=Math.max(1.5,W/N-1),h=(Math.abs(v)/maxV)*H*0.88;
    ctx.fillStyle=Math.abs(v)>0.001?color:"transparent";ctx.fillRect(x,H-h,w,h);
  });
}

const STEP_META={
  signal:{badge:"1",label:"Sygnał wejściowy",color:"#7c6cfa",desc:"128 próbek — suma dwóch sinusoid. Różowy = oryginał (zawsze widoczny dla porównania)."},
  dct:   {badge:"2",label:"DCT — widmo częstotliwościowe",color:"#fbbf24",desc:"128 współczynników po transformacie kosinusowej. Energia skupia się w kilku binach — resztę można usunąć bez dużej straty."},
  topk:  {badge:"3",label:"Top-k — zachowane współczynniki",color:"#7c6cfa",desc:"Zachowujemy tylko k współczynników o największej amplitudzie. Pasek pokazuje % zachowanej energii sygnału."},
  quant: {badge:"4",label:"Kwantyzacja — redukcja precyzji",color:"#fa6c9f",desc:"Współczynniki zaokrąglone do N bitów. float32=32bit, int16=16bit (2× mniejszy plik, strata <0.5dB), int8=8bit (4× mniejszy, ~2–3dB straty)."},
  bark:  {badge:"5",label:"Maskowanie Barksa",color:"#4ade80",desc:"Usuwamy współczynniki zamaskowane przez głośniejsze sąsiednie pasma (psychoakustyka). Różowy = oryginalne DCT, zielony = po maskowaniu."},
  recon: {badge:"6",label:"Rekonstrukcja IDCT",color:"#7c6cfa",desc:"Różowy = oryginał, niebieski = zrekonstruowany sygnał. Im mniejsze k lub niższy quantBits tym większe zniekształcenia."},
};

function retentionPct(step, k, N, quantBits, spreadDb, dctData){
  if(step==="signal") return 100;
  if(step==="dct")    return 100;
  if(step==="topk")   return Math.round(k/N*100);
  if(step==="quant")  return Math.round(k/N*100*(quantBits/32));
  if(step==="bark"){
    if(!dctData) return 50;
    const masked=barkMask(dctData,spreadDb);
    const kept=masked.filter(v=>Math.abs(v)>0.001).length;
    return Math.round(kept/dctData.length*100);
  }
  if(step==="recon")  return Math.round(k/N*100*(quantBits/32));
  return 100;
}

function DCTEarPage(){
  const N=128;
  const [freq,setFreq]=useState(3);
  const [freq2,setFreq2]=useState(7);
  const [mix,setMix]=useState(0.6);
  const [k,setK]=useState(16);
  const [quantBits,setQuantBits]=useState(8);
  const [spreadDb,setSpreadDb]=useState(36);
  const [step,setStep]=useState("signal");
  const [earHz,setEarHz]=useState(440);
  const [earPlaying,setEarPlaying]=useState(false);

  const mainCanvas=useRef(null);
  const earSpecCanvas=useRef(null);
  const actx=useRef(null),oscRef=useRef(null),gainRef=useRef(null);
  const dctCacheRef=useRef(null);

  const getCtx=()=>{if(!actx.current)actx.current=new(window.AudioContext||window.webkitAudioContext)();return actx.current;};

  const buildSignal=useCallback(()=>{
    const s=new Float32Array(N);
    for(let i=0;i<N;i++)s[i]=Math.sin(2*Math.PI*freq*i/N)+mix*Math.sin(2*Math.PI*freq2*i/N);
    const mx=Math.max(...s.map(Math.abs));return s.map(v=>v/mx);
  },[N,freq,freq2,mix]);

  const compute=useCallback(()=>{
    const sig=buildSignal();
    const dct=makeDCTfn(N)(sig);
    dctCacheRef.current=dct;
    const idct=makeIDCTfn(N);
    const sorted=[...dct].map((v,i)=>({a:Math.abs(v),i,v})).sort((a,b)=>b.a-a.a);
    const topkArr=new Float32Array(N);sorted.forEach((x,r)=>{if(r<k)topkArr[x.i]=x.v;});
    const quantArr=quantize(topkArr,quantBits);
    const barkArr=barkMask(dct,spreadDb);
    return{sig,dct,topkArr,quantArr,barkArr,recon:idct(quantArr)};
  },[buildSignal,N,k,quantBits,spreadDb]);

  useEffect(()=>{
    const {sig,dct,topkArr,quantArr,barkArr,recon}=compute();
    const cv=mainCanvas.current;
    const meta=STEP_META[step];
    switch(step){
      case"signal": drawSignalCanvas(cv,sig,meta.color,null); break;
      case"dct":    drawSpectrumCanvas(cv,dct,meta.color,null); break;
      case"topk":   drawSpectrumCanvas(cv,topkArr,meta.color,dct); break;
      case"quant":  drawSpectrumCanvas(cv,quantArr,meta.color,dct); break;
      case"bark":   drawSpectrumCanvas(cv,barkArr,meta.color,dct); break;
      case"recon":  drawSignalCanvas(cv,recon,meta.color,sig); break;
      default: break;
    }
  },[compute,step]);

  useEffect(()=>{
    const cv=earSpecCanvas.current;if(!cv)return;
    const ctx=cv.getContext("2d");
    const W=cv.width=cv.offsetWidth*devicePixelRatio,H=cv.height=50*devicePixelRatio;
    ctx.clearRect(0,0,W,H);
    const xf=f=>(Math.log10(f/20)/Math.log10(20000/20))*W;
    ctx.fillStyle="#7c6cfa33";const x=xf(earHz),bw=Math.max(6,xf(earHz*1.12)-xf(earHz*0.88));
    ctx.fillRect(x-bw/2,0,bw,H);
    ctx.strokeStyle="#7c6cfa";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
    [100,500,1000,5000,10000].forEach(f=>{
      const fx=xf(f);ctx.strokeStyle="#2e2e3e";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(fx,0);ctx.lineTo(fx,H);ctx.stroke();
      ctx.fillStyle="#555";ctx.font=`${8*devicePixelRatio}px monospace`;ctx.fillText(f>=1000?`${f/1000}k`:f,fx+2,H-2);
    });
  },[earHz]);

  const stopTone=useCallback(()=>{
    if(gainRef.current&&actx.current){gainRef.current.gain.linearRampToValueAtTime(0,actx.current.currentTime+0.05);setTimeout(()=>{try{oscRef.current.stop();}catch(e){}},100);}
    setEarPlaying(false);
  },[]);

  const playTone=useCallback(()=>{
    const c=getCtx();if(oscRef.current){try{oscRef.current.stop();}catch(e){}}
    gainRef.current=c.createGain();gainRef.current.gain.setValueAtTime(0,c.currentTime);gainRef.current.gain.linearRampToValueAtTime(0.2,c.currentTime+0.05);gainRef.current.connect(c.destination);
    oscRef.current=c.createOscillator();oscRef.current.type="sine";oscRef.current.frequency.value=earHz;oscRef.current.connect(gainRef.current);oscRef.current.start();
    setEarPlaying(true);
  },[earHz]);

  useEffect(()=>{if(earPlaying&&oscRef.current)oscRef.current.frequency.value=earHz;},[earHz,earPlaying]);
  useEffect(()=>()=>{stopTone();if(actx.current)actx.current.close();},[stopTone]);

  const meta=STEP_META[step];
  const pct=retentionPct(step,k,N,quantBits,spreadDb,dctCacheRef.current);
  const barColor=pct>60?"#4ade80":pct>30?"#fbbf24":"#f87171";

  return(
    <div className="module">
      <p style={{color:"#888899",fontSize:"0.8rem",lineHeight:1.5,marginBottom:"1rem"}}>
        Sygnał sinusoidalny przechodzi przez kolejne etapy kompresji DCT. Wybierz krok — jedno okno pokazuje wynik. Różowy to zawsze oryginał dla porównania.
      </p>

      <div className="card">
        <div className="card-title">Parametry sygnału</div>
        <div className="row"><label>Częstotliwość 1</label><input type="range" min={1} max={20} value={freq} onChange={e=>setFreq(+e.target.value)}/><span className="val">f = {freq}</span></div>
        <div className="row"><label>Częstotliwość 2</label><input type="range" min={1} max={20} value={freq2} onChange={e=>setFreq2(+e.target.value)}/><span className="val">f = {freq2}</span></div>
        <div className="row"><label>Mieszanie</label><input type="range" min={0} max={1} step={0.05} value={mix} onChange={e=>setMix(+e.target.value)}/><span className="val">{Math.round(mix*100)}%</span></div>
        {["topk","quant","recon"].includes(step)&&(
          <div className="row">
            <label>k (top-k)</label>
            <input type="range" min={1} max={N} value={k} onChange={e=>setK(+e.target.value)}/>
            <span className="val">{k}/{N} · {Math.round(k/N*100)}%</span>
          </div>
        )}
        {["quant","recon"].includes(step)&&(
          <div className="row">
            <label>Kwantyzacja</label>
            <input type="range" min={2} max={16} value={quantBits} onChange={e=>setQuantBits(+e.target.value)}/>
            <span className="val">{quantBits} bit</span>
          </div>
        )}
        {step==="bark"&&(
          <div className="row">
            <label>Spreading dB</label>
            <input type="range" min={6} max={48} step={6} value={spreadDb} onChange={e=>setSpreadDb(+e.target.value)}/>
            <span className="val">{spreadDb} dB</span>
          </div>
        )}
      </div>

      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"}}>
          <div className="step-label">
            <span className="step-badge">{meta.badge}</span>
            {meta.label}
          </div>
          <button className="btn reset" style={{flexShrink:0}} onClick={()=>setStep("signal")}>↺ Oryginał</button>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:"0.72rem",color:"#888899",whiteSpace:"nowrap"}}>Zachowane dane:</span>
          <div style={{flex:1}}><div className="retention-bar"><div className="retention-fill" style={{width:`${pct}%`,background:barColor}}/></div></div>
          <span style={{fontSize:"0.78rem",fontWeight:700,color:barColor,minWidth:40,textAlign:"right"}}>{pct}%</span>
        </div>

        <canvas ref={mainCanvas} style={{height:260}}/>
        <div className="info" style={{marginTop:"0.6rem"}}>{meta.desc}</div>

        <div className="btns">
          {Object.entries(STEP_META).map(([id,s])=>(
            <button key={id} className={`btn ${step===id?"on":""}`} onClick={()=>setStep(id)}>
              {s.badge}. {id==="signal"?"Sygnał":id==="dct"?"DCT":id==="topk"?"Top-k":id==="quant"?"Kwantyzacja":id==="bark"?"Barks":"Rekonstrukcja"}
            </button>
          ))}
        </div>
      </div>

      <div style={{borderTop:"1px solid #2e2e3e",margin:"1.5rem 0"}}/>

      <div style={{marginBottom:"0.5rem",fontSize:"0.72rem",color:"#7c6cfa",textTransform:"uppercase",letterSpacing:"0.08em"}}>▸ Jak słyszy ludzkie ucho</div>
      <p style={{color:"#888899",fontSize:"0.8rem",lineHeight:1.5,marginBottom:"1rem"}}>
        Ucho nie słyszy liniowo — najlepiej w zakresie 1–5 kHz (mowa ludzka). Przesuń slider żeby zobaczyć która część widma jest aktywowana.
      </p>

      <div className="card">
        <div className="card-title">Generator tonu — pozycja na widmie słyszalności</div>
        <div className="row"><label>Częstotliwość</label><input type="range" min={20} max={16000} value={earHz} onChange={e=>setEarHz(+e.target.value)}/><span className="val">{earHz} Hz</span></div>
        <div style={{display:"flex",alignItems:"baseline",gap:6,margin:"0.4rem 0 0.6rem"}}>
          <span className="tone-big">{earHz}</span>
          <span style={{color:"#888899"}}>Hz</span>
          <span className="tone-note">{hzToNote(earHz)}</span>
          <span style={{marginLeft:"auto",fontSize:"0.75rem",color:"#888899"}}>
            {earHz<100?"niska czułość":earHz<300?"umiarkowana":earHz<5000?"maksymalna czułość":earHz<12000?"dobra czułość":"słaba czułość"}
          </span>
        </div>
        <canvas ref={earSpecCanvas} style={{height:50}}/>
        <div className="btns">
          <button className={`btn ${earPlaying?"on":""}`} onClick={()=>earPlaying?stopTone():playTone()}>
            {earPlaying?"⏹ Stop":"▶ Odtwórz"}
          </button>
          {[82,440,1000,4000,12000].map(f=>(
            <button key={f} className="btn" onClick={()=>setEarHz(f)}>{f>=1000?`${f/1000}k`:f}Hz</button>
          ))}
        </div>
        <div className="info" style={{marginTop:"0.75rem"}}>
          <strong>Dlaczego to ważne dla kompresji?</strong> DCT psycho usuwa współczynniki poniżej progu maskowania w każdym paśmie Barksa. Zaoszczędzone bity idą na pasma gdzie ucho jest bardziej czułe — wyższy SNR percepcyjny przy tym samym bitrate.
        </div>
      </div>
    </div>
  );
}


function EvalPage(){
  const [err,setErr]=useState(false);
  return(
    <div className="module">
      <h2>Ocena AI własnej pracy</h2>
      <p style={{color:"#888899",fontSize:"0.8rem",lineHeight:1.5,marginBottom:"1rem"}}>
        Nagranie z omówieniem projektu — AI ocenia wykonane eksperymenty, wyniki i ograniczenia.
      </p>
      <div className="video-wrap">
        {!err
          ?<video controls preload="metadata" onError={()=>setErr(true)}>
              <source src="/video/ai_eval.mp4" type="video/mp4"/>
              Brak wsparcia video.
            </video>
          :<div className="video-ph">
              <div className="ico">🎙</div>
              <p>Wrzuć nagranie do:<br/><code>public/video/ai_eval.mp4</code></p>
            </div>}
      </div>
    </div>
  );
}

// function AudioQuizPage(){
//   const [sel,setSel]=useState({});
//   const [revealed,setRevealed]=useState({});
//   const [score,setScore]=useState(0);
//   const [total,setTotal]=useState(0);

//   const reveal=(sample)=>{
//     if(revealed[sample.id])return;
//     let c=0,t=0;
//     Object.keys(sample.files).forEach(m=>{const key=`${sample.id}_${m}`;if(sel[key]===m)c++;t++;});
//     setScore(s=>s+c);setTotal(t=>t+t);
//     setRevealed(prev=>({...prev,[sample.id]:true}));
//   };

//   return(
//     <div className="module">
//       <h2>Zgadnij metodę kompresji</h2>
//       <p style={{color:"#888899",fontSize:"0.8rem",lineHeight:1.5,marginBottom:"1rem"}}>
//         Posłuchaj nagrań i przypisz każdemu metodę kompresji. Naciśnij "Odkryj" żeby zobaczyć odpowiedzi.<br/>
//         <strong style={{color:"#e8e8f0"}}>Dodaj pliki:</strong> wrzuć WAV do <code style={{background:"#22222e",padding:"1px 4px",borderRadius:3,color:"#7c6cfa"}}>public/audio/</code> zgodnie z nazwami w stałej AUDIO_SAMPLES.
//       </p>
//       <div className="quiz-score">
//         <div style={{fontSize:"1.4rem",fontWeight:700,color:"#7c6cfa"}}>{score}/{total}</div>
//         <div style={{color:"#888899",fontSize:"0.82rem"}}>poprawnych</div>
//         <button className="btn" style={{marginLeft:"auto"}} onClick={()=>{setSel({});setRevealed({});setScore(0);setTotal(0);}}>Reset</button>
//       </div>
//       {AUDIO_SAMPLES.map(sample=>(
//         <div className="card" key={sample.id}>
//           <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
//             <div><div className="card-title">{sample.title}</div><div style={{fontSize:"0.78rem",color:"#888899"}}>{sample.hint}</div></div>
//             {!revealed[sample.id]
//               ?<button className="btn" style={{borderColor:"#4ade80",color:"#4ade80"}} onClick={()=>reveal(sample)}>Odkryj odpowiedzi</button>
//               :<span style={{fontSize:"0.78rem",color:"#4ade80"}}>✓ Odkryto</span>}
//           </div>
//           <div className="audio-grid">
//             {Object.entries(sample.files).map(([correctMethod,filePath],idx)=>{
//               const key=`${sample.id}_${correctMethod}`;
//               const userGuess=sel[key];
//               const isOk=revealed[sample.id]&&userGuess===correctMethod;
//               const isBad=revealed[sample.id]&&userGuess&&userGuess!==correctMethod;
//               return(
//                 <div key={correctMethod} className={`audio-card ${isOk?"correct":isBad?"wrong":""}`}>
//                   <div className="audio-label">Nagranie {String.fromCharCode(65+idx)}</div>
//                   <audio className="audio-player" controls src={filePath} preload="none"/>
//                   {revealed[sample.id]
//                     ?<div style={{marginTop:"0.4rem",fontSize:"0.78rem"}}>
//                         <span style={{color:"#4ade80",fontWeight:700}}>✓ {correctMethod}</span>
//                         {userGuess&&userGuess!==correctMethod&&<span style={{color:"#f87171",marginLeft:6}}>(zgadłeś: {userGuess})</span>}
//                         {!userGuess&&<span style={{color:"#555",marginLeft:6}}>(nie zgadywałeś)</span>}
//                       </div>
//                     :<div className="method-btns">
//                         {METHODS.map(m=><button key={m} className={`method-btn ${userGuess===m?"sel":""}`} onClick={()=>setSel(p=>({...p,[key]:m}))}>{m}</button>)}
//                       </div>}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

function VideoPage(){
  const [err,setErr]=useState(false);
  return(
    <div className="module">
      <h2>Jak działa kodowanie muzyczne</h2>
      <p style={{color:"#888899",fontSize:"0.8rem",lineHeight:1.5,marginBottom:"1rem"}}>Wizualizacja z NotebookLM — pipeline kompresji audio od sygnału do bitstreamu.</p>
      <div className="video-wrap">
        {!err
          ?<video controls preload="metadata" onError={()=>setErr(true)}><source src="/video/how_music_coding_works.mp4" type="video/mp4"/>Brak wsparcia video.</video>
          :<div className="video-ph"><div className="ico">🎬</div><p>Wrzuć plik do:<br/><code>public/video/how_music_coding_works.mp4</code></p></div>}
      </div>
      <div className="info" style={{marginTop:"1rem"}}>
        <strong>Tematy:</strong> STFT i spektrogram · pasma Barksa · DCT top-k vs ramkowa · psychoakustyczny model kompresji · autoenkodery na spektrogramach · VAE i przestrzeń latentowa · porównanie z MP3/AAC.
      </div>
    </div>
  );
}

const TABS=[{id:"dct",l:"1. DCT + Ucho"},{id:"eval",l:"2. Ocena AI"},{id:"video",l:"3. Jak to działa"}];

export default function App(){
  const [tab,setTab]=useState("dct");
  return(<>
    <style>{css}</style>
    <div className="app">
      <div className="header">
        <h1>Kompresja Audio</h1>
        <p>Redukcja wymiaru danych w muzyce — psychoakustyka, DCT i autoenkodery</p>
      </div>
      <nav className="tabs">
        {TABS.map(t=><button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.l}</button>)}
      </nav>
      <main>
        {tab==="dct"&&<DCTEarPage/>}
        {tab==="eval"&&<EvalPage/>}
        {tab==="video"&&<VideoPage/>}
      </main>
    </div>
  </>);
}