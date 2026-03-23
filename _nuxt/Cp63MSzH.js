import{R as Ot,W as Wt,o as Ut,Z as Ht,$ as zt,j as Kt,k as L,a0 as mt,m as ht,w as nt,h as Qt,a1 as Xt,q as Zt}from"./BaJj7Pbd.js";import{_ as Gt}from"./DCQ0nUwL.js";const ct=Symbol();let j=[],xt=[],ft=null;function M(t){return typeof t=="function"&&!!t.isT}function H(t){return t!==null&&typeof t=="object"}function k(t){return H(t)&&"$on"in t}function q(t){return H(t)&&"ref"in t}function Yt(t){const n=t;return(e,s)=>{n[ct]||(n[ct]=!0,n._n=e,n._o=s,j.length||queueMicrotask(vt),j.push(n))}}function vt(){const t=j;j=[];const n=xt;xt=[];for(let e=0;e<t.length;e++){const s=t[e],i=s._n,r=s._o;s._n=void 0,s._o=void 0,s[ct]=!1,s(i,r)}for(let e=0;e<n.length;e++)n[e]();j.length&&queueMicrotask(vt)}function yt(t){const n=ft;return ft=t,n}function Jt(t){ft?.push(t)}const A=[],K=[],$t=[];let st=0;function te(t){const n=$t[t],e=n?.length?n.pop():st;return A[e]=t,e===st&&(st+=t+1),e}function bt(t,n,e=0){const s=A[n];for(let i=1;i<=s;i++){const r=t[e+i-1],u=n+i;Object.is(A[u],r)||(A[u]=r,K[u]?.(r))}}function Q(t,n){if(n){K[t]=n;return}delete K[t]}function ee(t){const n=A[t];if(n!==void 0){for(let e=0;e<=n;e++)delete A[t+e],delete K[t+e];($t[n]??=[]).push(t)}}const At=new WeakMap,X=[],N=[],b=t=>At.get(t);let it=-1,ne=0,Z=0;const F=[],O=[],Tt=[],_t=[],S=[];function tt(t){if(typeof t=="function")return ce(t);if(k(t))return t;if(!H(t))throw Error("Expected object");const n=++it;N[n]={};const e=new Proxy(t,ue);return At.set(t,it).set(e,it),e}function se(t,n,e){return e in lt?!0:(G(t,e),e in n)}function ie(t,n,e,s){if(e in lt)return lt[e];const i=Reflect.get(n,e,s);let r;H(i)&&!k(i)&&(r=Mt(i,t,e),n[e]=r);const u=r??i;return Array.isArray(n)?oe(t,e,n,u):St(u)?Pt(u,t,e):(G(t,e),u)}function oe(t,n,e,s){if(typeof s=="function"&&he(n)){let i=_t[t];i||(i=_t[t]={});let r=i[n];return r||(r=(...u)=>{const a=Reflect.apply(s,e,u);return at(t),a},i[n]=r),r}return St(s)?Pt(s,t,n):s}function re(t,n,e,s,i){const r=!(e in n),u=H(s)&&!k(s)?Mt(s,t,e):null,a=n[e],l=u??s;k(l)&&X[b(l)]&&et(b(l),t,e);const p=Reflect.set(n,e,l,i);return a!==l&&k(a)&&k(l)&&fe(t,e,b(a),b(l)),kt(t,e,s,a,r||e==="value"&&X[t]),Array.isArray(n)&&e==="length"&&at(t),p}const ue={has(t,n){return se(b(t),t,n)},get(t,n,e){return ie(b(t),t,n,e)},set(t,n,e,s){return re(b(t),t,n,e,s)}};function Mt(t,n,e){const s=tt(t);return et(b(t),n,e),s}function ce(t){const e=tt({value:void 0});return X[b(e)]=!0,pt(t,s=>e.value=s),e}function St(t){return k(t)&&X[b(t)]}function Pt(t,n,e){const s=b(t);return G(n,e),et(s,n,e),G(s,"value"),t.value}function et(t,n,e){const s=S[t];if(s)for(let i=0;i<s.length;i++){const[r,u]=s[i];if(r===n&&u===e)return}else S[t]=[];S[t].push([n,e])}function fe(t,n,e,s){if(S[e]){let i=-1;for(let r=0;r<S[e].length;r++){const[u,a]=S[e][r];if(u==t&&a==n){i=r;break}}i>-1&&S[e].splice(i,1)}et(s,t,n)}function kt(t,n,e,s,i){const u=N[t][n];if(u)if(typeof u=="function")u(e,s);else for(const a of u)a(e,s);i&&at(t)}function at(t){const n=S[t];if(n)for(let e=0;e<n.length;e++){const[s,i]=n[e];kt(s,i)}}function le(t,n){Lt(N[b(this)],t,n)}function de(t,n){Bt(N[b(this)],t,n)}const lt={$on:le,$off:de};function G(t,n){Z&&F[Z].push(t,n)}function ae(){F[++Z]=ge()}function pe(t,n){const e=Z--,s=F[e],i=O[t];if(me(i,s)){O[t]=i,Rt(s),F[e]=void 0;return}Et(i,n);const r=s.length;for(let u=0;u<r;u+=2)Lt(N[s[u]],s[u+1],n);O[t]=s,F[e]=void 0}function Et(t,n){if(!t)return;const e=t.length;for(let s=0;s<e;s+=2)Bt(N[t[s]],t[s+1],n);Rt(t)}function Lt(t,n,e){const s=t[n];if(!s){t[n]=e;return}if(s!==e){if(typeof s=="function"){t[n]=new Set([s,e]);return}s.add(e)}}function Bt(t,n,e){const s=t[n];if(s){if(s===e){delete t[n];return}typeof s!="function"&&(s.delete(e),s.size===1?t[n]=s.values().next().value:s.size||delete t[n])}}function ge(){return Tt.pop()??[]}function me(t,n){if(!t||!n)return!1;const e=t.length;if(e!==n.length)return!1;for(let s=0;s<e;s++)if(t[s]!==n[s])return!1;return!0}function Rt(t){t&&(t.length=0,Tt.push(t))}function pt(t,n){const e=++ne,s=typeof t=="number";let i=Yt(r);function r(){ae();const a=s?A[t]():t();return pe(e,i),n?n(a):a}const u=()=>{Et(O[e],i),O[e]=void 0,s&&Q(t),i=null};return s||Jt(u),s&&Q(t,r),[r(),u]}function he(t){switch(t){case"push":case"pop":case"shift":case"unshift":case"splice":case"sort":case"copyWithin":case"fill":case"reverse":return!0}return!1}Object.getPrototypeOf(async function(){}).constructor;const xe={get(t,n){const e=t[0];if(e)return e[n]},set(t,n,e){const s=t[0];return s?Reflect.set(s,n,e):!1}};function W(t){return!!t&&typeof t=="object"&&"h"in t}function ye(t,n,e){const s=tt({0:t,1:n,2:e}),i=((r,u)=>{const l=s[2]?.[r];typeof l=="function"&&l(u)});return[new Proxy(s,xe),i,s]}function ot(t,n,e){(n==="value"&&"value"in t||n==="checked"||n[0]==="."&&(n=n.slice(1)))&&(t[n]=e,t.getAttribute(n)!=e&&(e=!1)),e!==!1?t.setAttribute(n,e):t.removeAttribute(n)}const Y=Symbol();let D=-1;const I=[],rt=[],_e="¤",Nt=`<!--${_e}-->`,Dt=1024,wt={},ut=new WeakMap,J=new Map,U=new Map;let E,we=0;Vt(Dt);function B(t,n,e){let s=t.f;if(!n||!s)return;const i=t.l;if(s===i){n.insertBefore(s,e||null);return}for(;s;){const r=s===i?null:s.nextSibling;if(n.insertBefore(s,e||null),!r)break;s=r}}function Ce(t,n){t.mk=n}function ve(t,n){return t.mk===n}function It(t){const n=t._p;return n||(t._p=$e(t._s))}function $e(t){const n=ut.get(t);if(n)return n;const e=t.join(Nt),s=wt[e];if(s)return ut.set(t,s),s;const i=document.createElement("template");i.innerHTML=e;const r=Ue(i.content),u=t.length-1;if(He(r[0])!==u)throw Error("Invalid HTML position");const a={template:i,paths:r,signature:e,expressions:u};return ut.set(t,a),wt[e]=a,a}function R(t,n,e=!1){n._t&&n._t!==t&&n._t.d?.(),n._t=t,n.k=t._k,n.i=t._i,t._h=n,t._m=e,bt(t._a,n.e,t._o)}function be(){E||Vt(Dt);const t=E;return E=t.next,t.next=void 0,t}function Vt(t){let n,e;for(let s=0;s<t;s++){const i={paths:[[],[]],dom:null,ref:{f:null,l:null},_t:null,e:-1,g:"",b:!1,r:!0,st:!1,u:null,v:null,s:void 0,k:void 0,i:void 0,bkn:void 0,next:void 0};e?e.next=i:n=i,e=i}e&&(e.next=E),E=n}function Ae(t){t.next=E,E=t}function Te(t,n,e){t.paths=n.paths,t.g=n.signature,t.dom=n.template.content.cloneNode(!0),t.ref.f=t.dom.firstChild,t.ref.l=t.dom.lastChild,t.e=te(n.expressions),t.b=!1,t.r=!0,t.st=!1,t.u=null,t.v=null,t.s=void 0,t.bkn=void 0,R(e,t)}function Me(t){const n=It(t),e=t._i===void 0?void 0:J.get(t._i);if(e&&e.g!==n.signature)throw Error("shape mismatch");if(e&&e.g===n.signature&&e.r)return gt(e),R(t,e),e;const s=Se(n.signature);if(s)return R(t,s),s;const i=be();return Te(i,n,t),i}function Se(t){const e=U.get(t)?.head;if(e)return gt(e),e}function Pe(t){if(t.st||!t.r)return;t.st=!0;const n=t.g;let e=U.get(n);e||(e={},U.set(n,e)),t.bkn=e.head,e.head=t,t.i!==void 0&&J.set(t.i,t)}function gt(t){if(!t.st)return;const n=U.get(t.g);if(n){let e,s=n.head;for(;s&&s!==t;)e=s,s=s.bkn;s&&(e?e.bkn=s.bkn:n.head=s.bkn,n.head||U.delete(t.g))}t.i!==void 0&&J.get(t.i)===t&&J.delete(t.i),t.st=!1,t.bkn=void 0}function jt(t){const n=this[Y]?.[t.type];if(!n)return;const e=n.c;e.st||!e._t._m||A[n.p]?.(t)}function ke(t){const n=t.v;if(n)for(let e=0;e<n.length;e++){const[s,i]=n[e],r=s[Y];if(r){delete r[i];let u=!1;for(const a in r){u=!0;break}u||delete s[Y]}s.removeEventListener(i,jt)}}function Ee(t){const n=arguments,e=(s=>De(e,s));return e.isT=!0,e._a=n,e._c=Le,e._m=!1,e._o=1,e._s=t,e.key=Be,e.id=Re,e.d=Ne,e}function Le(){let t=this._h;return t||(t=Me(this),this._h=t),t}function Be(t){return this._k=t,this._h&&(this._h.k=t),this}function Re(t){return this._i=t,this._h&&(this._h.i=t),this}function Ne(){this._m=!1,this._h=void 0}function De(t,n){const e=t._c();return t._m?(B(e.ref,e.dom),n?n.appendChild(e.dom):e.dom):(t._m=!0,e.b?n?n.appendChild(e.dom)&&n:e.dom:(bt(t._a,e.e,t._o),Ie(e,n)))}function Ie(t,n){const e=t.e,s=A[e],[i,r]=t.paths,u=D+1;let a=0;rt[0]=t.dom;for(let p=0;p<s;p++){const h=i[a++];let c=i[a++],o=h,f=rt[o];for(;c--;)f=f.childNodes[i[a++]],rt[++o]=f;I[++D]=f,I[++D]=i[a++]}const l=D;for(let p=u,h=e+1;p<l;p++,h++){const c=I[p],o=I[++p];o?je(c,r[o-1],h,t):Ve(c,h,t)}return I.length=u,D=u-1,t.b=!0,n?n.appendChild(t.dom)&&n:t.dom}function Ve(t,n,e){let s;const i=A[n];if(W(i)||M(i)||Array.isArray(i))e.r=!1,s=Ct()(i);else if(typeof i=="function"){let r=null,u=null;const[a,l]=pt(n,p=>{if(!u){if(W(p)||M(p)||Array.isArray(p)){e.r=!1,u=Ct();const c=u(p);return r&&(r.parentNode?.replaceChild(c,r),r=null),c}if(!r)return r=document.createTextNode(P(p)),r;const h=P(p);return r.nodeValue!==h&&(r.nodeValue=h),r}return u(p)});(e.u??=[]).push(l),s=a}else{let r=document.createTextNode(P(i));s=r,Q(n,u=>r.nodeValue=P(u))}if(t===e.ref.f||t===e.ref.l){const r=s.nodeType===11?s.lastChild:s;t===e.ref.f&&(e.ref.f=s.nodeType===11?s.firstChild:s),t===e.ref.l&&(e.ref.l=r)}t.parentNode?.replaceChild(s,t)}function je(t,n,e,s){if(t.nodeType!==1)return;let i=t;const r=A[e];if(n[0]==="@"){const u=n.slice(1),a=i[Y]??={};a[u]={c:s,p:e};const l=[i,u];i.addEventListener(u,jt),i.removeAttribute(n),(s.v??=[]).push(l)}else if(typeof r=="function"&&!M(r)){const[,u]=pt(e,a=>ot(i,n,a));(s.u??=[]).push(u)}else ot(i,n,r),Q(e,u=>ot(i,n,u))}function Ct(t){let n;const e={};let s=null;const i=function(o){if(!n){if(W(o)){const[f,m]=h(o);return n=l(f,m),f}if(M(o)){const f=o();return n=l(f,o._c()),f}if(Array.isArray(o)){const[f,m]=r(o);return n=m,f}return n=document.createTextNode(P(o))}if(Array.isArray(o))if(Array.isArray(n)){let f=0;const m=o.length,_=n.length;let y;const C=[],v=++we;for(m>_&&(s??=document.createDocumentFragment());f<m;f++){let x=o[f];const d=n[f];let g;if(M(x)&&(g=x._k)!==void 0&&g in e){const $=e[g];R(x,$,!0),x=$._t}if(f>_-1){C[f]=a(x,s);continue}const w=u(x,d,y);y=T(w),C[f]=w,Ce(w,v)}for(m?m>_&&y?.after(s):T(n[0]).after(C[0]=document.createTextNode("")),f=0;f<_;f++){const x=n[f];ve(x,v)||(p(x),V(x))}n=C}else{const[f,m]=r(o);T(n).after(f),p(n),V(n),n=m}else n=u(o,n)};i.adopt=(c,o)=>{};function r(c){const o=document.createDocumentFragment();if(!c.length){const m=document.createTextNode("");return o.appendChild(m),[o,[m]]}const f=new Array(c.length);for(let m=0;m<c.length;m++)f[m]=a(c[m],o);return[o,f]}function u(c,o,f){const m=o.nodeType??0;if(W(c)){const y=c.k;if(y!==void 0&&y in e){const d=e[y];if(d.s?.[1]===c.h){if(d.s[0]!==c.p&&(d.s[0]=c.p),d.s[2]!==c.e&&(d.s[2]=c.e),d===o)return o;if(f)B(d.ref,f.parentNode,f.nextSibling);else{const g=T(o,void 0,!0);B(d.ref,g.parentNode,g)}return d}}else if(q(o)&&o.s?.[1]===c.h)return o.s[0]!==c.p&&(o.s[0]=c.p),o.s[2]!==c.e&&(o.s[2]=c.e),o.k!==c.k&&(p(o),o.k=c.k,o.k!==void 0&&(e[o.k]=o)),o;const[C,v]=h(c),x=l(C,v);return T(o,f).after(C),p(o),V(o),v.k!==void 0&&(e[v.k]=v),x}if(!M(c)&&m===3){const y=P(c);return o.data!==y&&(o.data=y),o}if(M(c)){const y=c,C=y._k;if(C!==void 0&&C in e){const w=e[C];if(R(y,w,!0),w===o)return o;if(f)B(w.ref,f.parentNode,f.nextSibling);else{const $=T(o,void 0,!0);B(w.ref,$.parentNode,$)}return w}const v=It(y);if(q(o)&&o.g===v.signature)return R(y,o,!0),o;const x=y._c(),d=c(),g=l(d,x);return T(o,f).after(d),p(o),V(o),x.k!==void 0&&(e[x.k]=x),g}const _=document.createTextNode(P(c));return T(o,f).after(_),p(o),V(o),_}function a(c,o){if(W(c)){const[m,_]=h(c);return o.appendChild(m),_.k!==void 0&&(e[_.k]=_),l(o,_)}if(M(c)){o.appendChild(c());const m=c._c();return m.k!==void 0&&(e[m.k]=m),l(o,m)}const f=document.createTextNode(P(c));return o.appendChild(f),f}function l(c,o){if(o.ref.f||o.ref.l)return o;const f=document.createTextNode("");return c.appendChild(f),f}function p(c){q(c)&&c.k!==void 0&&e[c.k]===c&&delete e[c.k]}function h(c){const[o,f,m]=ye(c.p,c.h,c.e),_=[],y=yt(_);let C,v;try{C=c.h(o,f),v=C()}finally{yt(y)}const x=C._c();return _.length&&(x.u??=[]).push(..._),x.r=!1,x.s=m,x.k=c.k,[v,x]}return i}let z=[];function qe(t){if(t.st&&gt(t),t._t.d?.(),ke(t),t.u){for(let e=0;e<t.u.length;e++)t.u[e]();t.u=null}t.e+1&&(ee(t.e),t.e=-1);let n=t.ref.f;if(n){const e=t.ref.l;if(n===e)n.remove();else for(;n;){const s=n===e?null:n.nextSibling;if(n.remove(),!s)break;n=s}}t.dom.textContent="",t.ref.f=null,t.ref.l=null,t.k=void 0,t.i=void 0,t.s=void 0,t.v=null,t.b=!1,t.r=!0,t.g="",Ae(t)}function Fe(t){B(t.ref,t.dom),t._t.d?.(),Pe(t)}let dt=!1;function qt(t){if(q(t)){t.r?Fe(t):qe(t);return}if(Array.isArray(t)){for(let n=0;n<t.length;n++)qt(t[n]);return}t.remove()}function Oe(){dt=!1;const t=z;z=[];for(let n=0;n<t.length;n++)qt(t[n]);z.length&&Ft()}function Ft(){dt||(dt=!0,queueMicrotask(Oe))}function V(t){t&&(z.push(t),Ft())}function We(t){return!t&&t!==0}function P(t){return We(t)?"":t}function T(t,n,e){return!t&&n?n:q(t)?e?t.ref.f||t.ref.l:t.ref.l||t.ref.f||n:Array.isArray(t)?T(t[e?0:t.length-1],n,e):t}function Ue(t){const n=[],e=[],s=[],i=[],r=l=>{const p=s.length,h=i.length,c=p<h?p:h;let o=0;for(;o<c&&i[o]===s[o];)o++;n.push(o,p-o);for(let f=o;f<p;f++)n.push(s[f]);n.push(l?e.push(l):0),i.length=p;for(let f=0;f<p;f++)i[f]=s[f]},u=l=>{if(l.nodeType===1){const h=l.attributes;for(let c=0;c<h.length;c++){const o=h[c];o.value===Nt&&r(o.name)}}else l.nodeType===8&&r();const p=l.childNodes;for(let h=0;h<p.length;h++)s.push(h),u(p[h]),s.pop()},a=t.childNodes;for(let l=0;l<a.length;l++)s.push(l),u(a[l]),s.pop();return[n,e]}function He(t){let n=0;for(let e=0;e<t.length;){const s=t[e+1]??0;e+=s+3,n++}return n}const ze=globalThis.setInterval,Ke={class:"space-y-6 py-10"},Ze=Ot({__name:"streaming-chart",setup(t){Wt({title:"Arrow.js Streaming Chart Demo",description:"Client-only streaming chart demo using Arrow.js reactivity in a Nuxt 4 + Nuxt UI app."});const n=Zt(null),e={width:760,height:280,padding:24},s=tt({running:!0,samples:120,tickMs:120,points:[],phase:0,baseline:52,amplitude:24,noise:8,ticks:0}),i=(d,g,w)=>Math.min(w,Math.max(g,d)),r=()=>{const d=Math.sin(s.phase/8)*s.amplitude,g=(Math.random()-.5)*s.noise;return s.phase+=1,i(s.baseline+d+g,0,100)},u=()=>{const d=r(),g=[...s.points,d];s.points=g.slice(-s.samples),s.ticks+=1},a=(d,g)=>{const w=e.width-e.padding*2,$=Math.max(g-1,1);return e.padding+d/$*w},l=d=>{const g=e.height-e.padding*2;return e.padding+(100-d)/100*g},p=()=>{const d=s.points;return d.length?d.map((g,w)=>`${w===0?"M":"L"} ${a(w,d.length)} ${l(g)}`).join(" "):""},h=()=>{const d=s.points;if(!d.length)return"";const g=a(0,d.length),w=a(d.length-1,d.length),$=l(0);return`${p()} L ${w} ${$} L ${g} ${$} Z`},c=()=>{const d=s.points.at(-1);return d===void 0?"—":d.toFixed(1)},o=()=>s.points.length?(s.points.reduce((g,w)=>g+w,0)/s.points.length).toFixed(1):"—",f=()=>{s.running=!s.running},m=()=>{s.points=[],s.ticks=0,s.phase=0;for(let d=0;d<24;d+=1)u()};let _,y,C=!1;const v=()=>{_&&clearInterval(_),_=ze(()=>{s.running&&u()},s.tickMs)},x=()=>{if(!n.value||C)return;const d=Ee`
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
          viewBox="${`0 0 ${e.width} ${e.height}`}"
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
          <path d="${h}" fill="currentColor" opacity="0.08" />
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
            @click="${m}"
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
              @input="${g=>{s.tickMs=Number(g.target.value),v()}}"
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
  `;n.value.replaceChildren(),d(n.value),C=!0};return Ut(()=>{m(),v(),y=Ht(n,d=>{d&&(x(),y?.(),y=void 0)},{immediate:!0,flush:"post"})}),zt(()=>{_&&clearInterval(_),y?.()}),(d,g)=>{const w=Xt,$=Gt;return Qt(),Kt("div",Ke,[g[1]||(g[1]=L("div",{class:"space-y-2"},[L("h1",{class:"text-3xl font-bold tracking-tight"},"Arrow.js streaming chart demo"),L("p",{class:"text-muted"},[mt(" A client-rendered example using "),L("code",null,"@arrow-js/core"),mt(" for reactivity and SVG for fast streaming updates in this Nuxt UI app. ")])],-1)),ht($,null,{default:nt(()=>[ht(w,null,{fallback:nt(()=>[...g[0]||(g[0]=[L("div",{class:"py-8 text-sm text-muted"},"Loading client-only chart…",-1)])]),default:nt(()=>[L("div",{ref_key:"mountEl",ref:n},null,512)]),_:1})]),_:1})])}}});export{Ze as default};
