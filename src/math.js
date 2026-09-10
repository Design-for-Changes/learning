export const mean = xs => xs.reduce((a,b)=>a+b,0)/xs.length;
export const variance = xs => {const m=mean(xs);return xs.reduce((s,x)=>s+(x-m)**2,0)/(xs.length-1);};
export const median = xs => {const a=[...xs].sort((x,y)=>x-y),n=a.length;return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2;};
export function regression(points){const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),mx=mean(xs),my=mean(ys);const xx=xs.reduce((s,x)=>s+(x-mx)**2,0),yy=ys.reduce((s,y)=>s+(y-my)**2,0),xy=points.reduce((s,[x,y])=>s+(x-mx)*(y-my),0);return {slope:xy/xx,intercept:my-xy/xx*mx,r:yy?xy/Math.sqrt(xx*yy):0};}
export function pca2(points){const mx=mean(points.map(p=>p[0])),my=mean(points.map(p=>p[1]));const centered=points.map(([x,y])=>[x-mx,y-my]);const n=points.length-1,a=centered.reduce((s,[x])=>s+x*x,0)/n,d=centered.reduce((s,[,y])=>s+y*y,0)/n,b=centered.reduce((s,[x,y])=>s+x*y,0)/n;const angle=.5*Math.atan2(2*b,a-d),delta=Math.sqrt((a-d)**2+4*b*b),l1=(a+d+delta)/2,l2=(a+d-delta)/2;return {angle,centered,mean:[mx,my],values:[l1,l2],ratio:l1/(l1+l2)};}
export function projectionVariance(points,angle){const u=[Math.cos(angle),Math.sin(angle)];return variance(points.map(([x,y])=>x*u[0]+y*u[1]));}
export const chairPoints=[[38,37],[40,42],[43,39],[45,47],[46,43],[49,51],[51,48],[54,56],[56,52],[59,61],[62,57],[65,65]];
export const pairedTimes={a:[62,55,70,48,66,59,73,51,64,57,69,60],b:[54,57,56,44,72,49,73,35,62,61,57,54]};
