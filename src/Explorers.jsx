import { useState } from 'react';
import { mean, median, pca2, projectionVariance, chairPoints, pairedTimes } from './math.js';

export function MeanExplorer() {
  const [last, setLast] = useState(60);
  const values = [10,10,10,10,last];
  return <div className="explorer"><div className="explorer-heading"><h3>1人の値が変わると、平均はどう動く？</h3><span>動かしてみる</span></div>
    <p>5人の操作時間。4人は10秒、残りの1人の時間を変えてみてください。</p>
    <svg className="plot" viewBox="0 0 640 185" role="img" aria-label={`5人の操作時間。平均${mean(values).toFixed(1)}秒、中央値${median(values)}秒`}>
      {[0,20,40,60,80,100].map(x=><g key={x}><line x1={45+x*5.4} x2={45+x*5.4} y1="20" y2="145" stroke="#d9dfe7"/><text x={45+x*5.4} y="174" textAnchor="middle">{x}秒</text></g>)}
      {values.map((x,i)=><circle key={i} cx={45+x*5.4} cy={40+i*22} r="7" fill={i===4?'#b7401d':'#2257c6'}/>)}
      <line x1={45+mean(values)*5.4} x2={45+mean(values)*5.4} y1="20" y2="145" stroke="#b7401d" strokeWidth="2" strokeDasharray="5 4"/>
    </svg>
    <label className="control">5人目の操作時間：{last}秒<input type="range" min="0" max="100" step="1" value={last} onChange={e=>setLast(+e.target.value)}/></label>
    <div className="metric-row"><span>平均 <strong>{mean(values).toFixed(1)}秒</strong></span><span>中央値 <strong>{median(values)}秒</strong></span></div>
    <p className="explainer">平均はすべての値の影響を受けます。中央値は順番に並べた真ん中の値です。長く迷った1人も大切な観察なので、平均を整えるために消してはいけません。</p>
  </div>;
}

export function PCAExplorer() {
  const [degrees,setDegrees]=useState(0);
  const model=pca2(chairPoints),angle=degrees*Math.PI/180;
  const share=projectionVariance(model.centered,angle)/(model.values[0]+model.values[1]);
  const sx=x=>300+x*7,sy=y=>170-y*7;
  return <div className="explorer"><div className="explorer-heading"><h3>点の広がりを、よく捉える向きは？</h3><span>軸を回してみる</span></div>
    <p>12脚の椅子の幅と奥行きを測った架空のデータです。青い点から橙の軸へ垂直に線を下ろし、1つの数値にまとめます。</p>
    <svg viewBox="0 0 600 340" className="plot" role="img" aria-label={`主成分分析の投影。軸の角度${degrees}度。この軸が捉える分散は全体の${(share*100).toFixed(1)}パーセント`}>
      <line x1="60" y1="170" x2="540" y2="170" className="axis"/><line x1="300" y1="20" x2="300" y2="315" className="axis"/>
      <text x="525" y="196">幅</text><text x="310" y="25">奥行き</text>
      <line x1={sx(-23*Math.cos(angle))} x2={sx(23*Math.cos(angle))} y1={sy(-23*Math.sin(angle))} y2={sy(23*Math.sin(angle))} stroke="#b7401d" strokeWidth="2"/>
      {model.centered.map(([x,y],i)=>{const score=x*Math.cos(angle)+y*Math.sin(angle),px=score*Math.cos(angle),py=score*Math.sin(angle);return <g key={i}><line x1={sx(x)} y1={sy(y)} x2={sx(px)} y2={sy(py)} stroke="#a9b5c6" strokeDasharray="3 3"/><circle cx={sx(px)} cy={sy(py)} r="4" fill="#b7401d"/><circle cx={sx(x)} cy={sy(y)} r="6" fill="#2257c6"/></g>;})}
    </svg>
    <label className="control">軸の角度：{degrees}°<input type="range" min="-90" max="90" value={degrees} onChange={e=>setDegrees(+e.target.value)}/></label>
    <div className="metric-row"><span>この軸が捉える分散 <strong>{(share*100).toFixed(1)}%</strong></span><button onClick={()=>setDegrees(Math.round(model.angle*180/Math.PI))}>第1主成分の向きへ</button></div>
    <p className="explainer">投影した点のばらつきが最大になる向きが、第1主成分です。ここでは幅と奥行きを同じ単位のまま中心化しています。重さなど単位の異なる項目を加えるときは、標準化を含めて考えます。</p>
  </div>;
}

export function PairedExplorer() {
  const [view,setView]=useState('individual');
  const a=pairedTimes.a,b=pairedTimes.b,ys=x=>310-(x-30)*5.5;
  return <div className="explorer"><div className="explorer-heading"><h3>平均だけを見る／一人ひとりを見る</h3><span>同じ12人がA・Bを使用</span></div>
    <div className="segmented" role="group" aria-label="図の表示"><button aria-pressed={view==='individual'} onClick={()=>setView('individual')}>一人ひとり</button><button aria-pressed={view==='mean'} onClick={()=>setView('mean')}>平均だけ</button></div>
    <svg viewBox="0 0 600 340" className="plot" role="img" aria-label={view==='mean'?'Aの平均61.17秒、Bの平均56.17秒':'同じ12人の操作時間を線で結ぶ。Bが速い8人、遅い3人、同じ1人'}>
      {[30,40,50,60,70,80].map(v=><g key={v}><line x1="90" x2="500" y1={ys(v)} y2={ys(v)} stroke="#d9dfe7"/><text x="38" y={ys(v)+5}>{v}秒</text></g>)}
      {view==='individual'&&a.map((v,i)=><g key={i}><line x1="175" x2="415" y1={ys(v)} y2={ys(b[i])} stroke={v>b[i]?'#819bc9':'#b7401d'} opacity=".7"/><circle cx="175" cy={ys(v)} r="4" fill="#2257c6"/><circle cx="415" cy={ys(b[i])} r="4" fill="#2257c6"/></g>)}
      {view==='mean'&&<><line x1="175" x2="415" y1={ys(mean(a))} y2={ys(mean(b))} stroke="#b7401d" strokeWidth="3"/><circle cx="175" cy={ys(mean(a))} r="8" fill="#b7401d"/><circle cx="415" cy={ys(mean(b))} r="8" fill="#b7401d"/></>}
      <text x="175" y="335" textAnchor="middle">画面A</text><text x="415" y="335" textAnchor="middle">画面B</text>
    </svg>
    <p className="explainer">Bの平均は5秒速い。それでも全員が速くなったわけではありません。同じ人の変化を見ることと、集団の平均を見ることは、どちらも必要です。</p>
  </div>;
}
