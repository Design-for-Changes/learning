export const mean = xs => xs.reduce((a,b)=>a+b,0)/xs.length;
export const variance = xs => {const m=mean(xs);return xs.reduce((s,x)=>s+(x-m)**2,0)/(xs.length-1);};
export const median = xs => {const a=[...xs].sort((x,y)=>x-y),n=a.length;return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2;};
export function regression(points){const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),mx=mean(xs),my=mean(ys);const xx=xs.reduce((s,x)=>s+(x-mx)**2,0),yy=ys.reduce((s,y)=>s+(y-my)**2,0),xy=points.reduce((s,[x,y])=>s+(x-mx)*(y-my),0);return {slope:xy/xx,intercept:my-xy/xx*mx,r:yy?xy/Math.sqrt(xx*yy):0};}
export function pca2(points){const mx=mean(points.map(p=>p[0])),my=mean(points.map(p=>p[1]));const centered=points.map(([x,y])=>[x-mx,y-my]);const n=points.length-1,a=centered.reduce((s,[x])=>s+x*x,0)/n,d=centered.reduce((s,[,y])=>s+y*y,0)/n,b=centered.reduce((s,[x,y])=>s+x*y,0)/n;const angle=.5*Math.atan2(2*b,a-d),delta=Math.sqrt((a-d)**2+4*b*b),l1=(a+d+delta)/2,l2=(a+d-delta)/2;return {angle,centered,mean:[mx,my],values:[l1,l2],ratio:l1/(l1+l2)};}
export function projectionVariance(points,angle){const u=[Math.cos(angle),Math.sin(angle)];return variance(points.map(([x,y])=>x*u[0]+y*u[1]));}
export const chairPoints=[[38,37],[40,42],[43,39],[45,47],[46,43],[49,51],[51,48],[54,56],[56,52],[59,61],[62,57],[65,65]];
export const pairedTimes={a:[62,55,70,48,66,59,73,51,64,57,69,60],b:[54,57,56,44,72,49,73,35,62,61,57,54]};

export function normalPDF(x, mu=0, sigma=1) {
  if(!Number.isFinite(sigma)||sigma<=0)throw new RangeError('標準偏差は正の値です。');
  const z=(x-mu)/sigma;
  return Math.exp(-z*z/2)/(sigma*Math.sqrt(2*Math.PI));
}
export function normalCDF(x, mu=0, sigma=1) {
  if(!Number.isFinite(sigma)||sigma<=0)throw new RangeError('標準偏差は正の値です。');
  const z=(x-mu)/(sigma*Math.sqrt(2)), sign=z<0?-1:1, t=1/(1+.3275911*Math.abs(z));
  const erf=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z);
  return (1+sign*erf)/2;
}
export function normalProbability(low, high, mu=0, sigma=1) {
  if(low>high)throw new RangeError('区間の下限は上限以下にしてください。');
  return normalCDF(high,mu,sigma)-normalCDF(low,mu,sigma);
}
export function twoPredictorVIF(r) {
  if(!Number.isFinite(r)||Math.abs(r)>1)throw new RangeError('相関係数は-1から1です。');
  return 1/(1-r*r);
}
export function correlatedPoints(r) {
  twoPredictorVIF(r);
  const x=Array.from({length:12},(_,i)=>i-5.5);
  const raw=[2,-3,1,4,-1,2,-4,3,-2,1,-3,0],m=mean(raw);
  const c=raw.map(v=>v-m), dot=x.reduce((s,v,i)=>s+v*c[i],0)/x.reduce((s,v)=>s+v*v,0);
  const orthogonal=c.map((v,i)=>v-dot*x[i]);
  const scale=Math.sqrt(variance(x)/variance(orthogonal));
  return x.map((v,i)=>[v,r*v+Math.sqrt(1-r*r)*orthogonal[i]*scale]);
}
