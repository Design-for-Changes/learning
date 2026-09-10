import { useState } from 'react';
import { Section } from './Common.jsx';
import { normalPDF, normalProbability } from './math.js';
const distributions=[
 ['正規分布','平均を中心に左右対称にばらつく連続的な値。','測定誤差などのモデル。平均と標準偏差で形が決まる。'],
 ['二項分布','決めた回数の試行のうち、何回成功したか。','20人中、何人が操作に成功したか。試行の独立性と、成功確率が一定であることを仮定する。'],
 ['ポアソン分布','一定の時間・範囲に、何回起きたか。','1時間の問い合わせ件数など。一定の発生率や独立な発生を仮定するので、集中して起きる場合には合わないことがある。'],
 ['一様分布','ある区間で、密度が一定の連続的な値。','0〜1の一様乱数など。同じ幅の区間には、同じ確率が割り当てられる。'],
 ['t分布','正規分布に似ているが、裾が厚い分布。','母集団の標準偏差を標本から推定するときの、平均の検定・信頼区間などに使う。形は自由度で変わる。'],
];
function NormalExplorer(){
 const [mu,setMu]=useState(0),[sigma,setSigma]=useState(1),[low,setLow]=useState(-1),[high,setHigh]=useState(1);
 const sx=x=>52+(x+6)/12*548, top=1.4,sy=y=>264-y/top*224;
 const points=Array.from({length:241},(_,i)=>{const x=-6+i/20;return [sx(x),sy(normalPDF(x,mu,sigma))];});
 const curve=points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
 const fill=Array.from({length:121},(_,i)=>{const x=low+(high-low)*i/120;return `${sx(x).toFixed(2)},${sy(normalPDF(x,mu,sigma)).toFixed(2)}`;});
 const probability=normalProbability(low,high,mu,sigma);
 return <div className="explorer"><div className="explorer-heading"><h3>確率は、曲線の下の面積</h3><span>平均・標準偏差・区間を変える</span></div>
 <svg className="plot" viewBox="0 0 640 310" role="img" aria-label={`平均${mu}、標準偏差${sigma}の正規分布。${low}から${high}の確率は${(probability*100).toFixed(2)}パーセント。`}>
  {[0,.5,1].map(f=><g key={f}><line x1="52" x2="600" y1={sy(top*f)} y2={sy(top*f)} stroke="#ddd"/><text x="44" y={sy(top*f)+5} textAnchor="end">{(top*f).toFixed(2)}</text></g>)}
  <text x="52" y="23">確率密度</text>
  <path d={`M${sx(low)},264 L${fill.join(' L')} L${sx(high)},264 Z`} fill="#cc2939" opacity=".18"/>
  <path d={curve} fill="none" stroke="#111" strokeWidth="2.5"/>
  {[low,high].map((x,i)=><line key={i} x1={sx(x)} x2={sx(x)} y1="264" y2={sy(normalPDF(x,mu,sigma))} stroke="#cc2939" strokeWidth="2"/>)}
  {[-6,-3,0,3,6].map(x=><text key={x} x={sx(x)} y="289" textAnchor="middle">{x}</text>)}
  <text x="608" y="289">x</text>
 </svg>
 <div className="distribution-controls">
  <label>平均 μ：{mu.toFixed(1)}<input type="range" min="-2" max="2" step="0.1" value={mu} onChange={e=>setMu(+e.target.value)}/></label>
  <label>標準偏差 σ：{sigma.toFixed(1)}<input type="range" min="0.3" max="2" step="0.1" value={sigma} onChange={e=>setSigma(+e.target.value)}/></label>
  <label>区間の下限：{low.toFixed(1)}<input type="range" min="-6" max={high} step="0.1" value={low} onChange={e=>setLow(+e.target.value)}/></label>
  <label>区間の上限：{high.toFixed(1)}<input type="range" min={low} max="6" step="0.1" value={high} onChange={e=>setHigh(+e.target.value)}/></label>
 </div>
 <div className="segmented"><button onClick={()=>{setLow(mu-sigma);setHigh(mu+sigma);}}>平均 ± 1σ</button><button onClick={()=>{setLow(mu-2*sigma);setHigh(mu+2*sigma);}}>平均 ± 2σ</button></div>
 <div className="metric-row"><span>赤い区間に入る確率 <strong>{(probability*100).toFixed(2)}%</strong></span></div>
 <p className="explainer">縦軸の高さは確率密度、赤く塗った面積が確率です。標準偏差を小さくすると山は高くなりますが、曲線全体の面積は1のままです。曲線は表示範囲の外にも続きます。</p>
 </div>;
}
export default function DistributionContent(){return <>
 <Section title="まず、集めたデータの分布を見る"><p>平均だけでは、どんな値がどのくらい出てくるかは分かりません。その全体の形を表すのが「分布」です。</p><p>操作時間を「0〜10秒」「10〜20秒」のように区切り、それぞれ何人いたかを数えてみます。区間ごとの件数を棒で表すと、よく出る値や、長く時間がかかった人が見えてきます。これがヒストグラムです。</p><p>区間の幅を変えると図の見え方も変わります。棒の高さが件数なのか、割合なのか、密度なのかも区別してください。幅が違う区間を比べる場合、件数の高さだけで比較すると誤解が生じます。</p><p>集めたデータの分布は、観察した結果です。一方、<strong>確率分布</strong>は「どんな値が、どのくらいの確率で生じるか」を表すモデルです。観測した形と、仮定するモデルを照らし合わせて考えます。</p></Section>
 <Section title="確率と確率密度は違う"><p>サイコロなら「1が出る確率」は1/6です。このような飛び飛びの値では、それぞれの値に確率を割り当てられます。</p><p>時間や長さを連続的な値として扱う場合は、「10秒から11秒まで」のような<strong>区間に入る確率</strong>を考えます。確率密度の曲線を描くと、その区間の曲線の下の面積が確率になります。</p><p><strong>曲線の高さそのものは確率ではありません。</strong>密度が1を超えても構いません。全体の面積が1になります。連続分布のモデルで「ちょうど10秒」という一点の確率は0ですが、測定器で10秒と記録されることはあります。測定値が丸められているためです。</p></Section>
 <Section title="よく出てくる確率分布"><p>分布は、見た目だけで選ぶものではありません。値がどのように生じたのか、何をモデル化するのかに合わせて考えます。</p><div className="reference-list">{distributions.map(([name,body,example])=><article key={name}><h3>{name}</h3><p>{body}</p><p className="tool-detail">{example}</p></article>)}</div><p>ここに挙げたものは一部です。二項分布やポアソン分布は飛び飛びの値、正規分布・一様分布・t分布は連続的な値の分布です。</p></Section>
 <Section title="正規分布は、山形のモデル"><p>正規分布は、平均を中心に左右対称の山形をした確率分布です。平均μが中心の位置、標準偏差σが広がりを決めます。平均0、標準偏差1のものを標準正規分布と呼びます。</p><NormalExplorer/><p>正規分布では、平均±1標準偏差に約68%、±2標準偏差に約95%が入ります。あらゆるデータに使える割合ではなく、正規分布の場合の性質です。</p></Section>
 <Section title="平均を取り直すと、平均もばらつく"><p>別の12人を集めて測ったら、平均は少し変わるはずです。このように、標本を取り直したときの統計量の分布を<strong>標本分布</strong>と呼びます。</p>  <div className="concept-pair"><article><h3>個々の値のばらつき</h3><p>同じ12人の中でも、操作時間には個人差があります。その広がりを表すのが標準偏差です。</p></article><article><h3>推定値のばらつき</h3><p>別の12人を調べれば、平均も変わります。この平均の標本分布の広がりを表すのが標準誤差です。</p></article></div>
  <p>独立に集めた同じ分布のデータなら、平均の標準誤差は<strong>標準偏差 ÷ √標本数</strong>で推定できます。個人差が同じくらいなら、調べる人数が多いほど、平均の推定は安定します。集め方の偏りは、人数を増やすだけでは解消しません。</p><p>独立で同じ分布から得た値に、有限の平均・分散があるなどの条件のもとでは、標本数が大きくなると平均の標本分布は正規分布に近づきます。これが中心極限定理です。元のデータ自体が正規分布に変わるわけではなく、「30件あれば何でも大丈夫」という意味でもありません。</p></Section>
 </>;}
