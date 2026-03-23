import{R as Ot,W as Ut,o as Wt,Z as Ht,j as zt,k as E,$ as mt,m as ht,w as nt,q as Kt,h as Qt,a0 as Xt}from"./DAMfl7Xl.js";import{_ as Zt}from"./BplC_bTi.js";const ct=Symbol();let j=[],xt=[],ft=null;function A(t){return typeof t=="function"&&!!t.isT}function H(t){return t!==null&&typeof t=="object"}function P(t){return H(t)&&"$on"in t}function q(t){return H(t)&&"ref"in t}function Gt(t){const n=t;return(e,s)=>{n[ct]||(n[ct]=!0,n._n=e,n._o=s,j.length||queueMicrotask(vt),j.push(n))}}function vt(){const t=j;j=[];const n=xt;xt=[];for(let e=0;e<t.length;e++){const s=t[e],i=s._n,r=s._o;s._n=void 0,s._o=void 0,s[ct]=!1,s(i,r)}for(let e=0;e<n.length;e++)n[e]();j.length&&queueMicrotask(vt)}function yt(t){const n=ft;return ft=t,n}function Yt(t){ft?.push(t)}const v=[],K=[],bt=[];let st=0;function Jt(t){const n=bt[t],e=n?.length?n.pop():st;return v[e]=t,e===st&&(st+=t+1),e}function $t(t,n,e=0){const s=v[n];for(let i=1;i<=s;i++){const r=t[e+i-1],u=n+i;Object.is(v[u],r)||(v[u]=r,K[u]?.(r))}}function Q(t,n){if(n){K[t]=n;return}delete K[t]}function te(t){const n=v[t];if(n!==void 0){for(let e=0;e<=n;e++)delete v[t+e],delete K[t+e];(bt[n]??=[]).push(t)}}const Tt=new WeakMap,X=[],R=[],C=t=>Tt.get(t);let it=-1,ee=0,Z=0;const F=[],O=[],At=[],_t=[],M=[];function tt(t){if(typeof t=="function")return ue(t);if(P(t))return t;if(!H(t))throw Error("Expected object");const n=++it;R[n]={};const e=new Proxy(t,re);return Tt.set(t,it).set(e,it),e}function ne(t,n,e){return e in lt?!0:(G(t,e),e in n)}function se(t,n,e,s){if(e in lt)return lt[e];const i=Reflect.get(n,e,s);let r;H(i)&&!P(i)&&(r=Mt(i,t,e),n[e]=r);const u=r??i;return Array.isArray(n)?ie(t,e,n,u):St(u)?Pt(u,t,e):(G(t,e),u)}function ie(t,n,e,s){if(typeof s=="function"&&me(n)){let i=_t[t];i||(i=_t[t]={});let r=i[n];return r||(r=(...u)=>{const a=Reflect.apply(s,e,u);return at(t),a},i[n]=r),r}return St(s)?Pt(s,t,n):s}function oe(t,n,e,s,i){const r=!(e in n),u=H(s)&&!P(s)?Mt(s,t,e):null,a=n[e],l=u??s;P(l)&&X[C(l)]&&et(C(l),t,e);const p=Reflect.set(n,e,l,i);return a!==l&&P(a)&&P(l)&&ce(t,e,C(a),C(l)),kt(t,e,s,a,r||e==="value"&&X[t]),Array.isArray(n)&&e==="length"&&at(t),p}const re={has(t,n){return ne(C(t),t,n)},get(t,n,e){return se(C(t),t,n,e)},set(t,n,e,s){return oe(C(t),t,n,e,s)}};function Mt(t,n,e){const s=tt(t);return et(C(t),n,e),s}function ue(t){const e=tt({value:void 0});return X[C(e)]=!0,pt(t,s=>e.value=s),e}function St(t){return P(t)&&X[C(t)]}function Pt(t,n,e){const s=C(t);return G(n,e),et(s,n,e),G(s,"value"),t.value}function et(t,n,e){const s=M[t];if(s)for(let i=0;i<s.length;i++){const[r,u]=s[i];if(r===n&&u===e)return}else M[t]=[];M[t].push([n,e])}function ce(t,n,e,s){if(M[e]){let i=-1;for(let r=0;r<M[e].length;r++){const[u,a]=M[e][r];if(u==t&&a==n){i=r;break}}i>-1&&M[e].splice(i,1)}et(s,t,n)}function kt(t,n,e,s,i){const u=R[t][n];if(u)if(typeof u=="function")u(e,s);else for(const a of u)a(e,s);i&&at(t)}function at(t){const n=M[t];if(n)for(let e=0;e<n.length;e++){const[s,i]=n[e];kt(s,i)}}function fe(t,n){Lt(R[C(this)],t,n)}function le(t,n){Bt(R[C(this)],t,n)}const lt={$on:fe,$off:le};function G(t,n){Z&&F[Z].push(t,n)}function de(){F[++Z]=pe()}function ae(t,n){const e=Z--,s=F[e],i=O[t];if(ge(i,s)){O[t]=i,Rt(s),F[e]=void 0;return}Et(i,n);const r=s.length;for(let u=0;u<r;u+=2)Lt(R[s[u]],s[u+1],n);O[t]=s,F[e]=void 0}function Et(t,n){if(!t)return;const e=t.length;for(let s=0;s<e;s+=2)Bt(R[t[s]],t[s+1],n);Rt(t)}function Lt(t,n,e){const s=t[n];if(!s){t[n]=e;return}if(s!==e){if(typeof s=="function"){t[n]=new Set([s,e]);return}s.add(e)}}function Bt(t,n,e){const s=t[n];if(s){if(s===e){delete t[n];return}typeof s!="function"&&(s.delete(e),s.size===1?t[n]=s.values().next().value:s.size||delete t[n])}}function pe(){return At.pop()??[]}function ge(t,n){if(!t||!n)return!1;const e=t.length;if(e!==n.length)return!1;for(let s=0;s<e;s++)if(t[s]!==n[s])return!1;return!0}function Rt(t){t&&(t.length=0,At.push(t))}function pt(t,n){const e=++ee,s=typeof t=="number";let i=Gt(r);function r(){de();const a=s?v[t]():t();return ae(e,i),n?n(a):a}const u=()=>{Et(O[e],i),O[e]=void 0,s&&Q(t),i=null};return s||Yt(u),s&&Q(t,r),[r(),u]}function me(t){switch(t){case"push":case"pop":case"shift":case"unshift":case"splice":case"sort":case"copyWithin":case"fill":case"reverse":return!0}return!1}Object.getPrototypeOf(async function(){}).constructor;const he={get(t,n){const e=t[0];if(e)return e[n]},set(t,n,e){const s=t[0];return s?Reflect.set(s,n,e):!1}};function U(t){return!!t&&typeof t=="object"&&"h"in t}function xe(t,n,e){const s=tt({0:t,1:n,2:e}),i=((r,u)=>{const l=s[2]?.[r];typeof l=="function"&&l(u)});return[new Proxy(s,he),i,s]}function ot(t,n,e){(n==="value"&&"value"in t||n==="checked"||n[0]==="."&&(n=n.slice(1)))&&(t[n]=e,t.getAttribute(n)!=e&&(e=!1)),e!==!1?t.setAttribute(n,e):t.removeAttribute(n)}const Y=Symbol();let D=-1;const I=[],rt=[],ye="¤",Nt=`<!--${ye}-->`,Dt=1024,wt={},ut=new WeakMap,J=new Map,W=new Map;let k,_e=0;Vt(Dt);function L(t,n,e){let s=t.f;if(!n||!s)return;const i=t.l;if(s===i){n.insertBefore(s,e||null);return}for(;s;){const r=s===i?null:s.nextSibling;if(n.insertBefore(s,e||null),!r)break;s=r}}function we(t,n){t.mk=n}function Ce(t,n){return t.mk===n}function It(t){const n=t._p;return n||(t._p=ve(t._s))}function ve(t){const n=ut.get(t);if(n)return n;const e=t.join(Nt),s=wt[e];if(s)return ut.set(t,s),s;const i=document.createElement("template");i.innerHTML=e;const r=Ue(i.content),u=t.length-1;if(We(r[0])!==u)throw Error("Invalid HTML position");const a={template:i,paths:r,signature:e,expressions:u};return ut.set(t,a),wt[e]=a,a}function B(t,n,e=!1){n._t&&n._t!==t&&n._t.d?.(),n._t=t,n.k=t._k,n.i=t._i,t._h=n,t._m=e,$t(t._a,n.e,t._o)}function be(){k||Vt(Dt);const t=k;return k=t.next,t.next=void 0,t}function Vt(t){let n,e;for(let s=0;s<t;s++){const i={paths:[[],[]],dom:null,ref:{f:null,l:null},_t:null,e:-1,g:"",b:!1,r:!0,st:!1,u:null,v:null,s:void 0,k:void 0,i:void 0,bkn:void 0,next:void 0};e?e.next=i:n=i,e=i}e&&(e.next=k),k=n}function $e(t){t.next=k,k=t}function Te(t,n,e){t.paths=n.paths,t.g=n.signature,t.dom=n.template.content.cloneNode(!0),t.ref.f=t.dom.firstChild,t.ref.l=t.dom.lastChild,t.e=Jt(n.expressions),t.b=!1,t.r=!0,t.st=!1,t.u=null,t.v=null,t.s=void 0,t.bkn=void 0,B(e,t)}function Ae(t){const n=It(t),e=t._i===void 0?void 0:J.get(t._i);if(e&&e.g!==n.signature)throw Error("shape mismatch");if(e&&e.g===n.signature&&e.r)return gt(e),B(t,e),e;const s=Me(n.signature);if(s)return B(t,s),s;const i=be();return Te(i,n,t),i}function Me(t){const e=W.get(t)?.head;if(e)return gt(e),e}function Se(t){if(t.st||!t.r)return;t.st=!0;const n=t.g;let e=W.get(n);e||(e={},W.set(n,e)),t.bkn=e.head,e.head=t,t.i!==void 0&&J.set(t.i,t)}function gt(t){if(!t.st)return;const n=W.get(t.g);if(n){let e,s=n.head;for(;s&&s!==t;)e=s,s=s.bkn;s&&(e?e.bkn=s.bkn:n.head=s.bkn,n.head||W.delete(t.g))}t.i!==void 0&&J.get(t.i)===t&&J.delete(t.i),t.st=!1,t.bkn=void 0}function jt(t){const n=this[Y]?.[t.type];if(!n)return;const e=n.c;e.st||!e._t._m||v[n.p]?.(t)}function Pe(t){const n=t.v;if(n)for(let e=0;e<n.length;e++){const[s,i]=n[e],r=s[Y];if(r){delete r[i];let u=!1;for(const a in r){u=!0;break}u||delete s[Y]}s.removeEventListener(i,jt)}}function ke(t){const n=arguments,e=(s=>Ne(e,s));return e.isT=!0,e._a=n,e._c=Ee,e._m=!1,e._o=1,e._s=t,e.key=Le,e.id=Be,e.d=Re,e}function Ee(){let t=this._h;return t||(t=Ae(this),this._h=t),t}function Le(t){return this._k=t,this._h&&(this._h.k=t),this}function Be(t){return this._i=t,this._h&&(this._h.i=t),this}function Re(){this._m=!1,this._h=void 0}function Ne(t,n){const e=t._c();return t._m?(L(e.ref,e.dom),n?n.appendChild(e.dom):e.dom):(t._m=!0,e.b?n?n.appendChild(e.dom)&&n:e.dom:($t(t._a,e.e,t._o),De(e,n)))}function De(t,n){const e=t.e,s=v[e],[i,r]=t.paths,u=D+1;let a=0;rt[0]=t.dom;for(let p=0;p<s;p++){const x=i[a++];let c=i[a++],o=x,f=rt[o];for(;c--;)f=f.childNodes[i[a++]],rt[++o]=f;I[++D]=f,I[++D]=i[a++]}const l=D;for(let p=u,x=e+1;p<l;p++,x++){const c=I[p],o=I[++p];o?Ve(c,r[o-1],x,t):Ie(c,x,t)}return I.length=u,D=u-1,t.b=!0,n?n.appendChild(t.dom)&&n:t.dom}function Ie(t,n,e){let s;const i=v[n];if(U(i)||A(i)||Array.isArray(i))e.r=!1,s=Ct()(i);else if(typeof i=="function"){let r=null,u=null;const[a,l]=pt(n,p=>{if(!u){if(U(p)||A(p)||Array.isArray(p)){e.r=!1,u=Ct();const c=u(p);return r&&(r.parentNode?.replaceChild(c,r),r=null),c}if(!r)return r=document.createTextNode(S(p)),r;const x=S(p);return r.nodeValue!==x&&(r.nodeValue=x),r}return u(p)});(e.u??=[]).push(l),s=a}else{let r=document.createTextNode(S(i));s=r,Q(n,u=>r.nodeValue=S(u))}if(t===e.ref.f||t===e.ref.l){const r=s.nodeType===11?s.lastChild:s;t===e.ref.f&&(e.ref.f=s.nodeType===11?s.firstChild:s),t===e.ref.l&&(e.ref.l=r)}t.parentNode?.replaceChild(s,t)}function Ve(t,n,e,s){if(t.nodeType!==1)return;let i=t;const r=v[e];if(n[0]==="@"){const u=n.slice(1),a=i[Y]??={};a[u]={c:s,p:e};const l=[i,u];i.addEventListener(u,jt),i.removeAttribute(n),(s.v??=[]).push(l)}else if(typeof r=="function"&&!A(r)){const[,u]=pt(e,a=>ot(i,n,a));(s.u??=[]).push(u)}else ot(i,n,r),Q(e,u=>ot(i,n,u))}function Ct(t){let n;const e={};let s=null;const i=function(o){if(!n){if(U(o)){const[f,h]=x(o);return n=l(f,h),f}if(A(o)){const f=o();return n=l(f,o._c()),f}if(Array.isArray(o)){const[f,h]=r(o);return n=h,f}return n=document.createTextNode(S(o))}if(Array.isArray(o))if(Array.isArray(n)){let f=0;const h=o.length,y=n.length;let w;const d=[],g=++_e;for(h>y&&(s??=document.createDocumentFragment());f<h;f++){let m=o[f];const _=n[f];let T;if(A(m)&&(T=m._k)!==void 0&&T in e){const N=e[T];B(m,N,!0),m=N._t}if(f>y-1){d[f]=a(m,s);continue}const b=u(m,_,w);w=$(b),d[f]=b,we(b,g)}for(h?h>y&&w?.after(s):$(n[0]).after(d[0]=document.createTextNode("")),f=0;f<y;f++){const m=n[f];Ce(m,g)||(p(m),V(m))}n=d}else{const[f,h]=r(o);$(n).after(f),p(n),V(n),n=h}else n=u(o,n)};i.adopt=(c,o)=>{};function r(c){const o=document.createDocumentFragment();if(!c.length){const h=document.createTextNode("");return o.appendChild(h),[o,[h]]}const f=new Array(c.length);for(let h=0;h<c.length;h++)f[h]=a(c[h],o);return[o,f]}function u(c,o,f){const h=o.nodeType??0;if(U(c)){const w=c.k;if(w!==void 0&&w in e){const _=e[w];if(_.s?.[1]===c.h){if(_.s[0]!==c.p&&(_.s[0]=c.p),_.s[2]!==c.e&&(_.s[2]=c.e),_===o)return o;if(f)L(_.ref,f.parentNode,f.nextSibling);else{const T=$(o,void 0,!0);L(_.ref,T.parentNode,T)}return _}}else if(q(o)&&o.s?.[1]===c.h)return o.s[0]!==c.p&&(o.s[0]=c.p),o.s[2]!==c.e&&(o.s[2]=c.e),o.k!==c.k&&(p(o),o.k=c.k,o.k!==void 0&&(e[o.k]=o)),o;const[d,g]=x(c),m=l(d,g);return $(o,f).after(d),p(o),V(o),g.k!==void 0&&(e[g.k]=g),m}if(!A(c)&&h===3){const w=S(c);return o.data!==w&&(o.data=w),o}if(A(c)){const w=c,d=w._k;if(d!==void 0&&d in e){const b=e[d];if(B(w,b,!0),b===o)return o;if(f)L(b.ref,f.parentNode,f.nextSibling);else{const N=$(o,void 0,!0);L(b.ref,N.parentNode,N)}return b}const g=It(w);if(q(o)&&o.g===g.signature)return B(w,o,!0),o;const m=w._c(),_=c(),T=l(_,m);return $(o,f).after(_),p(o),V(o),m.k!==void 0&&(e[m.k]=m),T}const y=document.createTextNode(S(c));return $(o,f).after(y),p(o),V(o),y}function a(c,o){if(U(c)){const[h,y]=x(c);return o.appendChild(h),y.k!==void 0&&(e[y.k]=y),l(o,y)}if(A(c)){o.appendChild(c());const h=c._c();return h.k!==void 0&&(e[h.k]=h),l(o,h)}const f=document.createTextNode(S(c));return o.appendChild(f),f}function l(c,o){if(o.ref.f||o.ref.l)return o;const f=document.createTextNode("");return c.appendChild(f),f}function p(c){q(c)&&c.k!==void 0&&e[c.k]===c&&delete e[c.k]}function x(c){const[o,f,h]=xe(c.p,c.h,c.e),y=[],w=yt(y);let d,g;try{d=c.h(o,f),g=d()}finally{yt(w)}const m=d._c();return y.length&&(m.u??=[]).push(...y),m.r=!1,m.s=h,m.k=c.k,[g,m]}return i}let z=[];function je(t){if(t.st&&gt(t),t._t.d?.(),Pe(t),t.u){for(let e=0;e<t.u.length;e++)t.u[e]();t.u=null}t.e+1&&(te(t.e),t.e=-1);let n=t.ref.f;if(n){const e=t.ref.l;if(n===e)n.remove();else for(;n;){const s=n===e?null:n.nextSibling;if(n.remove(),!s)break;n=s}}t.dom.textContent="",t.ref.f=null,t.ref.l=null,t.k=void 0,t.i=void 0,t.s=void 0,t.v=null,t.b=!1,t.r=!0,t.g="",$e(t)}function qe(t){L(t.ref,t.dom),t._t.d?.(),Se(t)}let dt=!1;function qt(t){if(q(t)){t.r?qe(t):je(t);return}if(Array.isArray(t)){for(let n=0;n<t.length;n++)qt(t[n]);return}t.remove()}function Fe(){dt=!1;const t=z;z=[];for(let n=0;n<t.length;n++)qt(t[n]);z.length&&Ft()}function Ft(){dt||(dt=!0,queueMicrotask(Fe))}function V(t){t&&(z.push(t),Ft())}function Oe(t){return!t&&t!==0}function S(t){return Oe(t)?"":t}function $(t,n,e){return!t&&n?n:q(t)?e?t.ref.f||t.ref.l:t.ref.l||t.ref.f||n:Array.isArray(t)?$(t[e?0:t.length-1],n,e):t}function Ue(t){const n=[],e=[],s=[],i=[],r=l=>{const p=s.length,x=i.length,c=p<x?p:x;let o=0;for(;o<c&&i[o]===s[o];)o++;n.push(o,p-o);for(let f=o;f<p;f++)n.push(s[f]);n.push(l?e.push(l):0),i.length=p;for(let f=0;f<p;f++)i[f]=s[f]},u=l=>{if(l.nodeType===1){const x=l.attributes;for(let c=0;c<x.length;c++){const o=x[c];o.value===Nt&&r(o.name)}}else l.nodeType===8&&r();const p=l.childNodes;for(let x=0;x<p.length;x++)s.push(x),u(p[x]),s.pop()},a=t.childNodes;for(let l=0;l<a.length;l++)s.push(l),u(a[l]),s.pop();return[n,e]}function We(t){let n=0;for(let e=0;e<t.length;){const s=t[e+1]??0;e+=s+3,n++}return n}const He=globalThis.setInterval,ze={class:"space-y-6 py-10"},Xe=Ot({__name:"streaming-chart",setup(t){Ut({title:"Arrow.js Streaming Chart Demo",description:"Client-only streaming chart demo using Arrow.js reactivity in a Nuxt 4 + Nuxt UI app."});const n=Kt(null),e={width:760,height:280,padding:24},s=tt({running:!0,samples:120,tickMs:120,points:[],phase:0,baseline:52,amplitude:24,noise:8,ticks:0}),i=(d,g,m)=>Math.min(m,Math.max(g,d)),r=()=>{const d=Math.sin(s.phase/8)*s.amplitude,g=(Math.random()-.5)*s.noise;return s.phase+=1,i(s.baseline+d+g,0,100)},u=()=>{const d=r(),g=[...s.points,d];s.points=g.slice(-s.samples),s.ticks+=1},a=(d,g)=>{const m=e.width-e.padding*2,_=Math.max(g-1,1);return e.padding+d/_*m},l=d=>{const g=e.height-e.padding*2;return e.padding+(100-d)/100*g},p=()=>{const d=s.points;return d.length?d.map((g,m)=>`${m===0?"M":"L"} ${a(m,d.length)} ${l(g)}`).join(" "):""},x=()=>{const d=s.points;if(!d.length)return"";const g=a(0,d.length),m=a(d.length-1,d.length),_=l(0);return`${p()} L ${m} ${_} L ${g} ${_} Z`},c=()=>{const d=s.points.at(-1);return d===void 0?"—":d.toFixed(1)},o=()=>s.points.length?(s.points.reduce((g,m)=>g+m,0)/s.points.length).toFixed(1):"—",f=()=>{s.running=!s.running},h=()=>{s.points=[],s.ticks=0,s.phase=0;for(let d=0;d<24;d+=1)u()};let y;const w=()=>{y&&clearInterval(y),y=He(()=>{s.running&&u()},s.tickMs)};return Wt(()=>{if(h(),w(),!n.value)return;const d=ke`
    <section class="space-y-6">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="rounded-lg border border-default px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-muted">Latest</p>
          <p class="text-2xl font-semibold">${c}</p>
        </div>
        <div class="rounded-lg border border-default px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-muted">Average</p>
          <p class="text-2xl font-semibold">${o}</p>
        </div>
        <div class="rounded-lg border border-default px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-muted">Window</p>
          <p class="text-2xl font-semibold">${()=>s.points.length}</p>
        </div>
        <div class="rounded-lg border border-default px-4 py-3">
          <p class="text-xs uppercase tracking-wide text-muted">Ticks</p>
          <p class="text-2xl font-semibold">${()=>s.ticks}</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-default bg-elevated">
        <svg
          viewBox="0 0 ${e.width} ${e.height}"
          class="h-72 w-full"
          role="img"
          aria-label="Streaming line chart"
        >
          <line
            x1="${e.padding}"
            y1="${l(75)}"
            x2="${e.width-e.padding}"
            y2="${l(75)}"
            stroke="currentColor"
            opacity="0.15"
          />
          <line
            x1="${e.padding}"
            y1="${l(50)}"
            x2="${e.width-e.padding}"
            y2="${l(50)}"
            stroke="currentColor"
            opacity="0.2"
          />
          <line
            x1="${e.padding}"
            y1="${l(25)}"
            x2="${e.width-e.padding}"
            y2="${l(25)}"
            stroke="currentColor"
            opacity="0.15"
          />
          <path d="${x}" fill="currentColor" opacity="0.08" />
          <path
            d="${p}"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div class="grid gap-4 md:grid-cols-[auto_auto_1fr] md:items-center">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-md border border-default px-3 py-2 text-sm font-medium hover:bg-elevated"
            @click="${f}"
          >
            ${()=>s.running?"Pause stream":"Resume stream"}
          </button>
          <button
            type="button"
            class="rounded-md border border-default px-3 py-2 text-sm font-medium hover:bg-elevated"
            @click="${h}"
          >
            Reset
          </button>
        </div>

        <div class="text-sm text-muted">
          ${()=>s.running?"Status: running":"Status: paused"}
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="space-y-1 text-sm">
            <span class="text-muted">Render interval: ${()=>s.tickMs}ms</span>
            <input
              type="range"
              min="30"
              max="400"
              step="10"
              value="${()=>s.tickMs}"
              class="w-full"
              @input="${g=>{s.tickMs=Number(g.target.value),w()}}"
            />
          </label>
          <label class="space-y-1 text-sm">
            <span class="text-muted">Window size: ${()=>s.samples}</span>
            <input
              type="range"
              min="30"
              max="220"
              step="10"
              value="${()=>s.samples}"
              class="w-full"
              @input="${g=>{s.samples=Number(g.target.value),s.points=s.points.slice(-s.samples)}}"
            />
          </label>
        </div>
      </div>
    </section>
  `;n.value.replaceChildren(),d(n.value)}),Ht(()=>{y&&clearInterval(y)}),(d,g)=>{const m=Xt,_=Zt;return Qt(),zt("div",ze,[g[1]||(g[1]=E("div",{class:"space-y-2"},[E("h1",{class:"text-3xl font-bold tracking-tight"},"Arrow.js streaming chart demo"),E("p",{class:"text-muted"},[mt(" A client-rendered example using "),E("code",null,"@arrow-js/core"),mt(" for reactivity and SVG for fast streaming updates in this Nuxt UI app. ")])],-1)),ht(_,null,{default:nt(()=>[ht(m,null,{fallback:nt(()=>[...g[0]||(g[0]=[E("div",{class:"py-8 text-sm text-muted"},"Loading client-only chart…",-1)])]),default:nt(()=>[E("div",{ref_key:"mountEl",ref:n},null,512)]),_:1})]),_:1})])}}});export{Xe as default};
