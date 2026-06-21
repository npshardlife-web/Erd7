import React, {useMemo, useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, Shield, Trophy, Users, Zap, Timer, AlertTriangle, HeartHandshake, Trash2, DollarSign, CheckCircle2 } from 'lucide-react';
import './style.css';

const MODES = {
  STATUS:'Status', MAYHEM:'Mayhem', DOPAMINE:'Dopamine', GUILD:'Guild', DIPLOMACY:'Diplomacy', RECOVERY:'Recovery', SAFETY:'Safety'
};
const BASE_TASKS = [
  {id:'biohazard', label:'Bag obvious trash / food waste', minutes:8, xp:40, cash:0, risk:'health'},
  {id:'paths', label:'Clear 3-foot walking path', minutes:12, xp:60, cash:0, risk:'fall'},
  {id:'laundry', label:'Textiles: keep / wash / discard', minutes:10, xp:35, cash:0, risk:'mold'},
  {id:'value', label:'Pull sellable items to cash zone', minutes:10, xp:50, cash:35, risk:'finance'},
  {id:'dishes', label:'Dishes and water containers to sanitation zone', minutes:7, xp:35, cash:0, risk:'pest'},
  {id:'exit', label:'Door/window/exit access check', minutes:5, xp:45, cash:0, risk:'fire'}
];
const COMMANDS = ['ERD7 activate','ERD7 status','ERD7 mayhem mode','ERD7 dopamine mode','ERD7 guild mode','ERD7 diplomacy mode','ERD7 human conflict','ERD7 recovery sprint','ERD7 cash valuation','ERD7 preview image','ERD7 safety lock'];
function score(tasks){return tasks.filter(t=>t.done).reduce((a,t)=>a+t.xp,0)}
function App(){
  const [mode,setMode]=useState(MODES.STATUS); const [tasks,setTasks]=useState(BASE_TASKS); const [seconds,setSeconds]=useState(8*60); const [running,setRunning]=useState(false); const [log,setLog]=useState(['ERD‑7 ready. Prime directive: recover the environment without escalating conflict.']); const [crew,setCrew]=useState(['Solo operator']); const [photo,setPhoto]=useState(null);
  useEffect(()=>{if(!running)return; const id=setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000); return()=>clearInterval(id)},[running]);
  useEffect(()=>{if(seconds===0&&running){setRunning(false); push('Sprint complete. Record visible win, hydrate, then choose next micro-zone.')}},[seconds,running]);
  const xp=score(tasks), cash=tasks.filter(t=>t.done).reduce((a,t)=>a+t.cash,0), done=tasks.filter(t=>t.done).length;
  const rank= xp>220?'Warchief of Order':xp>120?'Room Ranger':xp>40?'Debris Breaker':'Initiate';
  function push(x){setLog(l=>[x,...l].slice(0,8))}
  function command(c){
    const lc=c.toLowerCase();
    if(lc.includes('mayhem')){setMode(MODES.MAYHEM); push('Mayhem mode: fast, funny, no cruelty. Grab bag. Remove obvious trash. No debates.');}
    else if(lc.includes('dopamine')){setMode(MODES.DOPAMINE); push('Dopamine mode: tiny wins, loud credit, visible XP. Start with the easiest square foot.');}
    else if(lc.includes('guild')){setMode(MODES.GUILD); push('Guild mode: assign registrants roles: Scout, Bag Runner, Sorter, Diplomat, Timer.');}
    else if(lc.includes('diplomacy')||lc.includes('conflict')){setMode(MODES.DIPLOMACY); push('Diplomacy mode: calm script only. “I am clearing safety hazards, not attacking anyone.”');}
    else if(lc.includes('cash')){push(`Cash valuation: current pulled-sale estimate $${cash}. Mark items: sell / donate / keep.`)}
    else if(lc.includes('safety')){setMode(MODES.SAFETY); push('Safety lock: avoid confrontation; document hazards; call local help/code/health services only when necessary.');}
    else {setMode(MODES.RECOVERY); setRunning(true); setSeconds(8*60); push('Recovery sprint started: eight minutes, one bag, one path, one visible improvement.');}
  }
  function toggle(id){setTasks(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t)); const t=tasks.find(x=>x.id===id); push(`${t?.done?'Reopened':'Completed'}: ${t?.label}`)}
  const instruction=useMemo(()=>{
    if(mode===MODES.DIPLOMACY) return 'Use low-heat words. Name the shared goal: safety, less conflict, fewer fines, healthier space.';
    if(mode===MODES.MAYHEM) return 'Chaos becomes cargo: bag it, box it, move it. Do not argue with the pile.';
    if(mode===MODES.GUILD) return 'Recruit helpers only by consent. Give each person one clear job and one reward.';
    if(mode===MODES.SAFETY) return 'Stop for needles, waste, structural danger, violence, or blocked exits. Escalate to appropriate local services.';
    return 'Pick the smallest visible zone. Finish, photograph, reward, repeat.';
  },[mode]);
  return <div className="app"><header><div><h1>ERD‑7</h1><p>Environment Recovery Dynamic · web + Android command core</p></div><button onClick={()=>command('ERD7 activate')}><Zap/>Activate</button></header>
  <main className="grid"><section className="hero"><div className="badge">{mode}</div><h2>{instruction}</h2><div className="stats"><span><Trophy/> {xp} XP</span><span><DollarSign/> ${cash}</span><span><CheckCircle2/> {done}/{tasks.length}</span><span><Shield/> {rank}</span></div><div className="timer"><Timer/> {String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')} <button onClick={()=>setRunning(!running)}>{running?'Pause':'Start'}</button><button onClick={()=>setSeconds(8*60)}>Reset</button></div></section>
  <section className="panel"><h3><Trash2/> Recovery tasks</h3>{tasks.map(t=><label className={'task '+(t.done?'done':'')} key={t.id}><input type="checkbox" checked={!!t.done} onChange={()=>toggle(t.id)}/><span>{t.label}<small>{t.minutes} min · {t.xp} XP · risk: {t.risk}</small></span></label>)}</section>
  <section className="panel"><h3><Zap/> Commands</h3><div className="commands">{COMMANDS.map(c=><button key={c} onClick={()=>command(c)}>{c}</button>)}</div></section>
  <section className="panel"><h3><Camera/> Image / preview workflow</h3><input type="file" accept="image/*" onChange={e=>setPhoto(URL.createObjectURL(e.target.files[0]))}/>{photo&&<img className="preview" src={photo}/>}<p>Use photo input for status review. Future module can connect computer vision for item detection, resale estimate, and cleaned-room preview.</p></section>
  <section className="panel"><h3><Users/> Guild roster</h3><input placeholder="Add registrant name" onKeyDown={e=>{if(e.key==='Enter'&&e.currentTarget.value){setCrew([...crew,e.currentTarget.value]); e.currentTarget.value='';}}}/>{crew.map((m,i)=><div className="crew" key={m}>{m}<small>{['Commander','Scout','Sorter','Diplomat','Runner'][i%5]}</small></div>)}</section>
  <section className="panel"><h3><HeartHandshake/> Conflict-safe script</h3><p>“I am reducing hazards so nobody gets fined, hurt, evicted, or blamed. I will not touch personal property without permission. I am starting with trash, exits, and sanitation.”</p><p className="warn"><AlertTriangle/> Do not threaten residents, escalate arguments, or use dehumanizing labels in real-world interactions.</p></section>
  <section className="panel log"><h3>Mission log</h3>{log.map((l,i)=><p key={i}>{l}</p>)}</section></main></div>
}
createRoot(document.getElementById('root')).render(<App/>);
