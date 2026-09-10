import { useState } from 'react';
export function Prompt({text}){
 const [status,setStatus]=useState('');
 async function copy(){try{await navigator.clipboard.writeText(text);setStatus('コピーしました');}catch{setStatus('コピーできませんでした。文章を選択してコピーしてください。');}}
 return <section className="ai-box"><div className="ai-heading"><h3>もう少し知りたくなったら、AIに聞く</h3><button onClick={copy}>コピー</button></div><textarea aria-label="AIに聞く文章" readOnly value={text} rows={5}/><p className="copy-status" role="status">{status}</p></section>;
}
export function Section({id,title,children}){return <section id={id} className="section"><h2>{title}</h2>{children}</section>;}
