import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { mean,median,variance,regression,pca2,projectionVariance,chairPoints,pairedTimes,normalPDF,normalCDF,normalProbability,twoPredictorVIF,correlatedPoints } from '../src/math.js';
import { questionsFor,recommend,validateAnswers,changeAnswer } from '../src/chooser.js';
import { methods } from '../src/content.js';
const close=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
close(mean([10,10,10,10,60]),20);close(median([10,60,10,10,10]),10);
close(variance([1,2,3]),1);close(regression([[1,3],[2,5],[3,7]]).slope,2);close(regression([[1,3],[2,5],[3,7]]).r,1);
const p=pca2(chairPoints);
close(projectionVariance(p.centered,p.angle),p.values[0]);close(projectionVariance(p.centered,p.angle+Math.PI/2),p.values[1]);
close(p.values[0]+p.values[1],variance(chairPoints.map(x=>x[0]))+variance(chairPoints.map(x=>x[1])));
close(mean(p.centered.map(x=>x[0])),0);close(mean(p.centered.map(x=>x[1])),0);
assert.ok(p.ratio>0&&p.ratio<=1);
for(let d=-90;d<=90;d++)assert.ok(projectionVariance(p.centered,d*Math.PI/180)<=p.values[0]+1e-9);
const diff=pairedTimes.a.map((v,i)=>v-pairedTimes.b[i]);close(mean(diff),5);close(Math.sqrt(variance(diff)),7.211102550927978);
assert.equal(diff.filter(x=>x>0).length,8);assert.equal(diff.filter(x=>x<0).length,3);
// Distribution areas and VIF must match known values, independently of the drawings.
close(normalPDF(0),0.3989422804014327);
close(normalCDF(0),0.5);
close(normalProbability(-1,1),0.682689492137,2e-7);
close(normalProbability(-2,2),0.954499736104,2e-7);
close(normalProbability(1,5,3,2),normalProbability(-1,1));
assert.ok(normalPDF(0,0,.3)>1);
assert.equal(normalProbability(1,1),0);
for(const sigma of [.3,1,2]){
 const step=sigma/100,low=1-8*sigma;
 const area=Array.from({length:1600},(_,i)=>normalPDF(low+(i+.5)*step,1,sigma)*step).reduce((a,b)=>a+b,0);
 close(area,1,1e-8);
}
assert.throws(()=>normalPDF(0,0,0));assert.throws(()=>normalCDF(0,0,-1));
assert.throws(()=>normalProbability(2,1));assert.throws(()=>twoPredictorVIF(1.01));
close(twoPredictorVIF(0),1);close(twoPredictorVIF(.9),5.263157894736842);
close(twoPredictorVIF(.99),50.251256281407);assert.equal(twoPredictorVIF(1),Infinity);
for(const r of [-.99,-.5,0,.3,.9,.99])close(regression(correlatedPoints(r)).r,r);
const compare={response:'yes',goal:'compare',outcome:'numeric',dependency:'independent',groups:'two'};
const ids=a=>recommend(a).candidates.map(x=>x.id);
assert.deepEqual(ids(compare),['welch']);assert.deepEqual(ids({...compare,dependency:'repeated'}),['paired']);
assert.deepEqual(ids({...compare,outcome:'binary',dependency:'repeated'}),['mcnemar']);
assert.deepEqual(ids({...compare,outcome:'binary'}),['categorical']);
assert.deepEqual(ids({...compare,groups:'many',dependency:'repeated'}),['anova','mixed']);
assert.deepEqual(ids({...compare,outcome:'ordinal'}),['ranks']);
assert.deepEqual(ids({response:'yes',goal:'compare',outcome:'numeric',dependency:'unsure'}),[]);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'numeric'}),['pca']);
assert.deepEqual(ids({response:'no',exploration:'latent',format:'numeric'}),['factor']);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'category'}),['mca']);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'table'}),['ca']);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'distance'}),['mds']);
assert.deepEqual(ids({response:'no',exploration:'compress',format:'mixed'}),[]);
assert.deepEqual(ids({response:'unsure'}),[]);
assert.deepEqual(changeAnswer(compare,'response','no'),{response:'no'});
assert.deepEqual(changeAnswer(compare,'outcome','binary'),{response:'yes',goal:'compare',outcome:'binary'});
assert.throws(()=>validateAnswers({response:'no',goal:'compare'}));
assert.throws(()=>validateAnswers({response:'invalid'}));assert.throws(()=>validateAnswers([]));
assert.throws(()=>validateAnswers({response:'yes',outcome:'numeric'}));
let leaves=0;
function visit(a){const result=recommend(a);for(const c of result.candidates){assert.ok(methods.some(m=>m.id===c.id));assert.ok(c.reason&&c.check);}const next=questionsFor(a).find(q=>!a[q.key]);if(!next){leaves++;return;}for(const option of next.options)visit({...a,[next.key]:option.value});}
visit({});
const csv=(await readFile('public/data/ui_comparison.csv','utf8')).trim().split(/\r?\n/).slice(1).map(x=>x.split(','));
assert.equal(csv.length,12);assert.equal(new Set(csv.map(r=>r[0])).size,12);assert.equal(csv.filter(r=>r[1]==='AB').length,6);
assert.deepEqual(csv.map(r=>+r[2]),pairedTimes.a);assert.deepEqual(csv.map(r=>+r[3]),pairedTimes.b);
const notebook=JSON.parse(await readFile('public/data/ui-comparison.ipynb','utf8'));
assert.equal(notebook.nbformat,4);assert.ok(notebook.cells.some(c=>c.cell_type==='code'));
const baseline=await readFile('public/data/analysis.py','utf8');
const notebookCode=notebook.cells.filter(c=>c.cell_type==='code').map(c=>c.source.join('')).join('\n');
assert.ok(notebookCode.includes(baseline.slice(0,baseline.indexOf('# 練習では')).trim()));
assert.ok(notebookCode.includes(baseline.slice(baseline.indexOf('# 練習では')).trim()));
assert.equal(methods.length,22);assert.equal(new Set(methods.map(m=>m.id)).size,22);
console.log(`Math, practice data and ${leaves} complete analysis-choice paths passed.`);

// Render all routes without a browser to catch missing components and internal links.
const {createServer}=await import('vite');
const server=await createServer({server:{middlewareMode:true,watch:null,ws:false},appType:'custom'});
try{
 const {default:App}=await server.ssrLoadModule('/src/App.jsx');
 const {default:React}=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');
 const routes=['/','/statistics','/statistics/basics','/statistics/variables','/statistics/distributions','/statistics/choose','/statistics/methods','/statistics/checks','/statistics/tools','/statistics/python',...methods.map(m=>`/statistics/method/${m.id}`)];
 let homeHTML='',basicsHTML='',legacyDistributionHTML='';
 for(const route of routes){
  globalThis.location={hash:`#${route}`};
  const html=renderToStaticMarkup(React.createElement(App));
  assert.ok(html.includes('id="main"'));assert.ok(!html.includes('ページが見つかりません'));assert.ok(!html.includes('undefined'));
  for(const m of html.matchAll(/href="#(\/[^\"]*)"/g))assert.ok(routes.includes(m[1]),`Invalid route ${m[1]}`);
  for(const m of html.matchAll(/href="\/learning\/(data\/[^\"]*)"/g))await access(`public/${m[1]}`);
  if(route==='/')homeHTML=html;
  if(route==='/statistics/basics')basicsHTML=html;
  if(route==='/statistics/distributions')legacyDistributionHTML=html;
 }
 assert.equal(legacyDistributionHTML,basicsHTML,'Old distribution URL must open the merged basics lesson');
 assert.equal((homeHTML.match(/準備中/g)||[]).length,9);assert.ok(homeHTML.includes('デザイン学入門'));assert.ok(homeHTML.includes('ウェブインタラクション入門'));
 const {default:Chooser}=await server.ssrLoadModule('/src/Chooser.jsx');
 const html=renderToStaticMarkup(React.createElement(Chooser,{answers:{...compare,dependency:'repeated'},setAnswers:()=>{}}));
 assert.ok(html.includes('対応のあるt検定'));assert.ok(html.includes('checked=""'));
 console.log(`${routes.length} routes rendered; portal, candidate output, internal links and downloads passed.`);
}finally{await server.close();delete globalThis.location;}
