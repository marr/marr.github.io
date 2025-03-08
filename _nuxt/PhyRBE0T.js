import{S as ge,u as je,c as Me,f as Ee,O as me,v as Le,d as Fe,_ as Ae}from"./PWZfv1BG.js";import{a as T,P as L,k as F,w,Q as R,ae as De,af as Be,R as m,I as ye,h as _,ag as X,E as te,ah as $e,i as Ne,z as q}from"./CtKZ936m.js";import{c as be}from"./jAU0Cazi.js";const Re=T({__name:"DropdownMenu",props:{defaultOpen:{type:Boolean},open:{type:Boolean},dir:{},modal:{type:Boolean}},emits:["update:open"],setup(e,{emit:n}){const t=ge(e,n);return(r,i)=>(F(),L(m(je),De(Be(m(t))),{default:w(()=>[R(r.$slots,"default")]),_:3},16))}}),ze=T({__name:"DropdownMenuContent",props:{forceMount:{type:Boolean},loop:{type:Boolean},side:{},sideOffset:{default:4},align:{},alignOffset:{},avoidCollisions:{type:Boolean},collisionBoundary:{},collisionPadding:{},arrowPadding:{},sticky:{},hideWhenDetached:{type:Boolean},updatePositionStrategy:{},prioritizePosition:{type:Boolean},asChild:{type:Boolean},as:{},class:{}},emits:["escapeKeyDown","pointerDownOutside","focusOutside","interactOutside","closeAutoFocus"],setup(e,{emit:n}){const s=e,o=n,t=ye(()=>{const{class:i,...c}=s;return c}),r=ge(t,o);return(i,c)=>(F(),L(m(Me),null,{default:w(()=>[_(m(Ee),X(m(r),{class:m(be)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",s.class)}),{default:w(()=>[R(i.$slots,"default")]),_:3},16,["class"])]),_:3}))}}),Ve=T({__name:"DropdownMenuItem",props:{disabled:{type:Boolean},textValue:{},asChild:{type:Boolean},as:{},class:{},inset:{type:Boolean}},setup(e){const n=e,s=ye(()=>{const{class:t,...r}=n;return r}),o=me(s);return(t,r)=>(F(),L(m(Le),X(m(o),{class:m(be)("relative flex cursor-default select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50  [&>svg]:size-4 [&>svg]:shrink-0",t.inset&&"pl-8",n.class)}),{default:w(()=>[R(t.$slots,"default")]),_:3},16,["class"]))}}),Qe=T({__name:"DropdownMenuTrigger",props:{disabled:{type:Boolean},asChild:{type:Boolean},as:{}},setup(e){const s=me(e);return(o,t)=>(F(),L(m(Fe),X({class:"outline-none"},m(s)),{default:w(()=>[R(o.$slots,"default")]),_:3},16))}}),xe=/^[a-z0-9]+(-[a-z0-9]+)*$/,z=(e,n,s,o="")=>{const t=e.split(":");if(e.slice(0,1)==="@"){if(t.length<2||t.length>3)return null;o=t.shift().slice(1)}if(t.length>3||!t.length)return null;if(t.length>1){const c=t.pop(),l=t.pop(),a={provider:t.length>0?t[0]:o,prefix:l,name:c};return n&&!D(a)?null:a}const r=t[0],i=r.split("-");if(i.length>1){const c={provider:o,prefix:i.shift(),name:i.join("-")};return n&&!D(c)?null:c}if(s&&o===""){const c={provider:o,prefix:"",name:r};return n&&!D(c,s)?null:c}return null},D=(e,n)=>e?!!((n&&e.prefix===""||e.prefix)&&e.name):!1,we=Object.freeze({left:0,top:0,width:16,height:16}),N=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),V=Object.freeze({...we,...N}),G=Object.freeze({...V,body:"",hidden:!1});function qe(e,n){const s={};!e.hFlip!=!n.hFlip&&(s.hFlip=!0),!e.vFlip!=!n.vFlip&&(s.vFlip=!0);const o=((e.rotate||0)+(n.rotate||0))%4;return o&&(s.rotate=o),s}function ne(e,n){const s=qe(e,n);for(const o in G)o in N?o in e&&!(o in s)&&(s[o]=N[o]):o in n?s[o]=n[o]:o in e&&(s[o]=e[o]);return s}function Ue(e,n){const s=e.icons,o=e.aliases||Object.create(null),t=Object.create(null);function r(i){if(s[i])return t[i]=[];if(!(i in t)){t[i]=null;const c=o[i]&&o[i].parent,l=c&&r(c);l&&(t[i]=[c].concat(l))}return t[i]}return Object.keys(s).concat(Object.keys(o)).forEach(r),t}function He(e,n,s){const o=e.icons,t=e.aliases||Object.create(null);let r={};function i(c){r=ne(o[c]||t[c],r)}return i(n),s.forEach(i),ne(e,r)}function Ie(e,n){const s=[];if(typeof e!="object"||typeof e.icons!="object")return s;e.not_found instanceof Array&&e.not_found.forEach(t=>{n(t,null),s.push(t)});const o=Ue(e);for(const t in o){const r=o[t];r&&(n(t,He(e,t,r)),s.push(t))}return s}const Ge={provider:"",aliases:{},not_found:{},...we};function U(e,n){for(const s in n)if(s in e&&typeof e[s]!=typeof n[s])return!1;return!0}function ve(e){if(typeof e!="object"||e===null)return null;const n=e;if(typeof n.prefix!="string"||!e.icons||typeof e.icons!="object"||!U(e,Ge))return null;const s=n.icons;for(const t in s){const r=s[t];if(!t||typeof r.body!="string"||!U(r,G))return null}const o=n.aliases||Object.create(null);for(const t in o){const r=o[t],i=r.parent;if(!t||typeof i!="string"||!s[i]&&!o[i]||!U(r,G))return null}return n}const oe=Object.create(null);function Ke(e,n){return{provider:e,prefix:n,icons:Object.create(null),missing:new Set}}function P(e,n){const s=oe[e]||(oe[e]=Object.create(null));return s[n]||(s[n]=Ke(e,n))}function _e(e,n){return ve(n)?Ie(n,(s,o)=>{o?e.icons[s]=o:e.missing.add(s)}):[]}function We(e,n,s){try{if(typeof s.body=="string")return e.icons[n]={...s},!0}catch{}return!1}let E=!1;function ke(e){return typeof e=="boolean"&&(E=e),E}function Je(e){const n=typeof e=="string"?z(e,!0,E):e;if(n){const s=P(n.provider,n.prefix),o=n.name;return s.icons[o]||(s.missing.has(o)?null:void 0)}}function Xe(e,n){const s=z(e,!0,E);if(!s)return!1;const o=P(s.provider,s.prefix);return n?We(o,s.name,n):(o.missing.add(s.name),!0)}function Ye(e,n){if(typeof e!="object")return!1;if(typeof n!="string"&&(n=e.provider||""),E&&!n&&!e.prefix){let t=!1;return ve(e)&&(e.prefix="",Ie(e,(r,i)=>{Xe(r,i)&&(t=!0)})),t}const s=e.prefix;if(!D({prefix:s,name:"a"}))return!1;const o=P(n,s);return!!_e(o,e)}const Se=Object.freeze({width:null,height:null}),Ce=Object.freeze({...Se,...N}),Ze=/(-?[0-9.]*[0-9]+[0-9.]*)/g,et=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function se(e,n,s){if(n===1)return e;if(s=s||100,typeof e=="number")return Math.ceil(e*n*s)/s;if(typeof e!="string")return e;const o=e.split(Ze);if(o===null||!o.length)return e;const t=[];let r=o.shift(),i=et.test(r);for(;;){if(i){const c=parseFloat(r);isNaN(c)?t.push(r):t.push(Math.ceil(c*n*s)/s)}else t.push(r);if(r=o.shift(),r===void 0)return t.join("");i=!i}}function tt(e,n="defs"){let s="";const o=e.indexOf("<"+n);for(;o>=0;){const t=e.indexOf(">",o),r=e.indexOf("</"+n);if(t===-1||r===-1)break;const i=e.indexOf(">",r);if(i===-1)break;s+=e.slice(t+1,r).trim(),e=e.slice(0,o).trim()+e.slice(i+1)}return{defs:s,content:e}}function nt(e,n){return e?"<defs>"+e+"</defs>"+n:n}function ot(e,n,s){const o=tt(e);return nt(o.defs,n+o.content+s)}const st=e=>e==="unset"||e==="undefined"||e==="none";function rt(e,n){const s={...V,...e},o={...Ce,...n},t={left:s.left,top:s.top,width:s.width,height:s.height};let r=s.body;[s,o].forEach(g=>{const u=[],C=g.hFlip,k=g.vFlip;let I=g.rotate;C?k?I+=2:(u.push("translate("+(t.width+t.left).toString()+" "+(0-t.top).toString()+")"),u.push("scale(-1 1)"),t.top=t.left=0):k&&(u.push("translate("+(0-t.left).toString()+" "+(t.height+t.top).toString()+")"),u.push("scale(1 -1)"),t.top=t.left=0);let b;switch(I<0&&(I-=Math.floor(I/4)*4),I=I%4,I){case 1:b=t.height/2+t.top,u.unshift("rotate(90 "+b.toString()+" "+b.toString()+")");break;case 2:u.unshift("rotate(180 "+(t.width/2+t.left).toString()+" "+(t.height/2+t.top).toString()+")");break;case 3:b=t.width/2+t.left,u.unshift("rotate(-90 "+b.toString()+" "+b.toString()+")");break}I%2===1&&(t.left!==t.top&&(b=t.left,t.left=t.top,t.top=b),t.width!==t.height&&(b=t.width,t.width=t.height,t.height=b)),u.length&&(r=ot(r,'<g transform="'+u.join(" ")+'">',"</g>"))});const i=o.width,c=o.height,l=t.width,a=t.height;let f,d;i===null?(d=c===null?"1em":c==="auto"?a:c,f=se(d,l/a)):(f=i==="auto"?l:i,d=c===null?se(f,a/l):c==="auto"?a:c);const h={},y=(g,u)=>{st(u)||(h[g]=u.toString())};y("width",f),y("height",d);const v=[t.left,t.top,l,a];return h.viewBox=v.join(" "),{attributes:h,viewBox:v,body:r}}const it=/\sid="(\S+)"/g,ct="IconifyId"+Date.now().toString(16)+(Math.random()*16777216|0).toString(16);let lt=0;function at(e,n=ct){const s=[];let o;for(;o=it.exec(e);)s.push(o[1]);if(!s.length)return e;const t="suffix"+(Math.random()*16777216|Date.now()).toString(16);return s.forEach(r=>{const i=typeof n=="function"?n(r):n+(lt++).toString(),c=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");e=e.replace(new RegExp('([#;"])('+c+')([")]|\\.[a-z])',"g"),"$1"+i+t+"$3")}),e=e.replace(new RegExp(t,"g"),""),e}const K=Object.create(null);function ut(e,n){K[e]=n}function W(e){return K[e]||K[""]}function Y(e){let n;if(typeof e.resources=="string")n=[e.resources];else if(n=e.resources,!(n instanceof Array)||!n.length)return null;return{resources:n,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const Z=Object.create(null),j=["https://api.simplesvg.com","https://api.unisvg.com"],B=[];for(;j.length>0;)j.length===1||Math.random()>.5?B.push(j.shift()):B.push(j.pop());Z[""]=Y({resources:["https://api.iconify.design"].concat(B)});function ft(e,n){const s=Y(n);return s===null?!1:(Z[e]=s,!0)}function ee(e){return Z[e]}const dt=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let re=dt();function pt(e,n){const s=ee(e);if(!s)return 0;let o;if(!s.maxURL)o=0;else{let t=0;s.resources.forEach(i=>{t=Math.max(t,i.length)});const r=n+".json?icons=";o=s.maxURL-t-s.path.length-r.length}return o}function ht(e){return e===404}const gt=(e,n,s)=>{const o=[],t=pt(e,n),r="icons";let i={type:r,provider:e,prefix:n,icons:[]},c=0;return s.forEach((l,a)=>{c+=l.length+1,c>=t&&a>0&&(o.push(i),i={type:r,provider:e,prefix:n,icons:[]},c=l.length),i.icons.push(l)}),o.push(i),o};function mt(e){if(typeof e=="string"){const n=ee(e);if(n)return n.path}return"/"}const yt=(e,n,s)=>{if(!re){s("abort",424);return}let o=mt(n.provider);switch(n.type){case"icons":{const r=n.prefix,c=n.icons.join(","),l=new URLSearchParams({icons:c});o+=r+".json?"+l.toString();break}case"custom":{const r=n.uri;o+=r.slice(0,1)==="/"?r.slice(1):r;break}default:s("abort",400);return}let t=503;re(e+o).then(r=>{const i=r.status;if(i!==200){setTimeout(()=>{s(ht(i)?"abort":"next",i)});return}return t=501,r.json()}).then(r=>{if(typeof r!="object"||r===null){setTimeout(()=>{r===404?s("abort",r):s("next",t)});return}setTimeout(()=>{s("success",r)})}).catch(()=>{s("next",t)})},bt={prepare:gt,send:yt};function xt(e){const n={loaded:[],missing:[],pending:[]},s=Object.create(null);e.sort((t,r)=>t.provider!==r.provider?t.provider.localeCompare(r.provider):t.prefix!==r.prefix?t.prefix.localeCompare(r.prefix):t.name.localeCompare(r.name));let o={provider:"",prefix:"",name:""};return e.forEach(t=>{if(o.name===t.name&&o.prefix===t.prefix&&o.provider===t.provider)return;o=t;const r=t.provider,i=t.prefix,c=t.name,l=s[r]||(s[r]=Object.create(null)),a=l[i]||(l[i]=P(r,i));let f;c in a.icons?f=n.loaded:i===""||a.missing.has(c)?f=n.missing:f=n.pending;const d={provider:r,prefix:i,name:c};f.push(d)}),n}function Pe(e,n){e.forEach(s=>{const o=s.loaderCallbacks;o&&(s.loaderCallbacks=o.filter(t=>t.id!==n))})}function wt(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const n=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!n.length)return;let s=!1;const o=e.provider,t=e.prefix;n.forEach(r=>{const i=r.icons,c=i.pending.length;i.pending=i.pending.filter(l=>{if(l.prefix!==t)return!0;const a=l.name;if(e.icons[a])i.loaded.push({provider:o,prefix:t,name:a});else if(e.missing.has(a))i.missing.push({provider:o,prefix:t,name:a});else return s=!0,!0;return!1}),i.pending.length!==c&&(s||Pe([e],r.id),r.callback(i.loaded.slice(0),i.missing.slice(0),i.pending.slice(0),r.abort))})}))}let It=0;function vt(e,n,s){const o=It++,t=Pe.bind(null,s,o);if(!n.pending.length)return t;const r={id:o,icons:n,callback:e,abort:t};return s.forEach(i=>{(i.loaderCallbacks||(i.loaderCallbacks=[])).push(r)}),t}function _t(e,n=!0,s=!1){const o=[];return e.forEach(t=>{const r=typeof t=="string"?z(t,n,s):t;r&&o.push(r)}),o}var kt={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function St(e,n,s,o){const t=e.resources.length,r=e.random?Math.floor(Math.random()*t):e.index;let i;if(e.random){let p=e.resources.slice(0);for(i=[];p.length>1;){const x=Math.floor(Math.random()*p.length);i.push(p[x]),p=p.slice(0,x).concat(p.slice(x+1))}i=i.concat(p)}else i=e.resources.slice(r).concat(e.resources.slice(0,r));const c=Date.now();let l="pending",a=0,f,d=null,h=[],y=[];typeof o=="function"&&y.push(o);function v(){d&&(clearTimeout(d),d=null)}function g(){l==="pending"&&(l="aborted"),v(),h.forEach(p=>{p.status==="pending"&&(p.status="aborted")}),h=[]}function u(p,x){x&&(y=[]),typeof p=="function"&&y.push(p)}function C(){return{startTime:c,payload:n,status:l,queriesSent:a,queriesPending:h.length,subscribe:u,abort:g}}function k(){l="failed",y.forEach(p=>{p(void 0,f)})}function I(){h.forEach(p=>{p.status==="pending"&&(p.status="aborted")}),h=[]}function b(p,x,O){const A=x!=="success";switch(h=h.filter(S=>S!==p),l){case"pending":break;case"failed":if(A||!e.dataAfterTimeout)return;break;default:return}if(x==="abort"){f=O,k();return}if(A){f=O,h.length||(i.length?Q():k());return}if(v(),I(),!e.random){const S=e.resources.indexOf(p.resource);S!==-1&&S!==e.index&&(e.index=S)}l="completed",y.forEach(S=>{S(O)})}function Q(){if(l!=="pending")return;v();const p=i.shift();if(p===void 0){if(h.length){d=setTimeout(()=>{v(),l==="pending"&&(I(),k())},e.timeout);return}k();return}const x={status:"pending",resource:p,callback:(O,A)=>{b(x,O,A)}};h.push(x),a++,d=setTimeout(Q,e.rotate),s(p,n,x.callback)}return setTimeout(Q),C}function Te(e){const n={...kt,...e};let s=[];function o(){s=s.filter(c=>c().status==="pending")}function t(c,l,a){const f=St(n,c,l,(d,h)=>{o(),a&&a(d,h)});return s.push(f),f}function r(c){return s.find(l=>c(l))||null}return{query:t,find:r,setIndex:c=>{n.index=c},getIndex:()=>n.index,cleanup:o}}function ie(){}const H=Object.create(null);function Ct(e){if(!H[e]){const n=ee(e);if(!n)return;const s=Te(n),o={config:n,redundancy:s};H[e]=o}return H[e]}function Pt(e,n,s){let o,t;if(typeof e=="string"){const r=W(e);if(!r)return s(void 0,424),ie;t=r.send;const i=Ct(e);i&&(o=i.redundancy)}else{const r=Y(e);if(r){o=Te(r);const i=e.resources?e.resources[0]:"",c=W(i);c&&(t=c.send)}}return!o||!t?(s(void 0,424),ie):o.query(n,t,s)().abort}function ce(){}function Tt(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,wt(e)}))}function Ot(e){const n=[],s=[];return e.forEach(o=>{(o.match(xe)?n:s).push(o)}),{valid:n,invalid:s}}function M(e,n,s){function o(){const t=e.pendingIcons;n.forEach(r=>{t&&t.delete(r),e.icons[r]||e.missing.add(r)})}if(s&&typeof s=="object")try{if(!_e(e,s).length){o();return}}catch(t){console.error(t)}o(),Tt(e)}function le(e,n){e instanceof Promise?e.then(s=>{n(s)}).catch(()=>{n(null)}):n(e)}function jt(e,n){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(n).sort():e.iconsToLoad=n,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:s,prefix:o}=e,t=e.iconsToLoad;if(delete e.iconsToLoad,!t||!t.length)return;const r=e.loadIcon;if(e.loadIcons&&(t.length>1||!r)){le(e.loadIcons(t,o,s),f=>{M(e,t,f)});return}if(r){t.forEach(f=>{const d=r(f,o,s);le(d,h=>{const y=h?{prefix:o,icons:{[f]:h}}:null;M(e,[f],y)})});return}const{valid:i,invalid:c}=Ot(t);if(c.length&&M(e,c,null),!i.length)return;const l=o.match(xe)?W(s):null;if(!l){M(e,i,null);return}l.prepare(s,o,i).forEach(f=>{Pt(s,f,d=>{M(e,f.icons,d)})})}))}const Mt=(e,n)=>{const s=_t(e,!0,ke()),o=xt(s);if(!o.pending.length){let l=!0;return n&&setTimeout(()=>{l&&n(o.loaded,o.missing,o.pending,ce)}),()=>{l=!1}}const t=Object.create(null),r=[];let i,c;return o.pending.forEach(l=>{const{provider:a,prefix:f}=l;if(f===c&&a===i)return;i=a,c=f,r.push(P(a,f));const d=t[a]||(t[a]=Object.create(null));d[f]||(d[f]=[])}),o.pending.forEach(l=>{const{provider:a,prefix:f,name:d}=l,h=P(a,f),y=h.pendingIcons||(h.pendingIcons=new Set);y.has(d)||(y.add(d),t[a][f].push(d))}),r.forEach(l=>{const a=t[l.provider][l.prefix];a.length&&jt(l,a)}),n?vt(n,o,r):ce};function Et(e,n){const s={...e};for(const o in n){const t=n[o],r=typeof t;o in Se?(t===null||t&&(r==="string"||r==="number"))&&(s[o]=t):r===typeof s[o]&&(s[o]=o==="rotate"?t%4:t)}return s}const Lt=/[\s,]+/;function Ft(e,n){n.split(Lt).forEach(s=>{switch(s.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}function At(e,n=0){const s=e.replace(/^-?[0-9.]*/,"");function o(t){for(;t<0;)t+=4;return t%4}if(s===""){const t=parseInt(e);return isNaN(t)?0:o(t)}else if(s!==e){let t=0;switch(s){case"%":t=25;break;case"deg":t=90}if(t){let r=parseFloat(e.slice(0,e.length-s.length));return isNaN(r)?0:(r=r/t,r%1===0?o(r):0)}}return n}function Dt(e,n){let s=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const o in n)s+=" "+o+'="'+n[o]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+s+">"+e+"</svg>"}function Bt(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function $t(e){return"data:image/svg+xml,"+Bt(e)}function Nt(e){return'url("'+$t(e)+'")'}const ae={...Ce,inline:!1},Rt={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","aria-hidden":!0,role:"img"},zt={display:"inline-block"},J={backgroundColor:"currentColor"},Oe={backgroundColor:"transparent"},ue={Image:"var(--svg)",Repeat:"no-repeat",Size:"100% 100%"},fe={webkitMask:J,mask:J,background:Oe};for(const e in fe){const n=fe[e];for(const s in ue)n[e+s]=ue[s]}const $={};["horizontal","vertical"].forEach(e=>{const n=e.slice(0,1)+"Flip";$[e+"-flip"]=n,$[e.slice(0,1)+"-flip"]=n,$[e+"Flip"]=n});function de(e){return e+(e.match(/^[-0-9.]+$/)?"px":"")}const pe=(e,n)=>{const s=Et(ae,n),o={...Rt},t=n.mode||"svg",r={},i=n.style,c=typeof i=="object"&&!(i instanceof Array)?i:{};for(let g in n){const u=n[g];if(u!==void 0)switch(g){case"icon":case"style":case"onLoad":case"mode":case"ssr":break;case"inline":case"hFlip":case"vFlip":s[g]=u===!0||u==="true"||u===1;break;case"flip":typeof u=="string"&&Ft(s,u);break;case"color":r.color=u;break;case"rotate":typeof u=="string"?s[g]=At(u):typeof u=="number"&&(s[g]=u);break;case"ariaHidden":case"aria-hidden":u!==!0&&u!=="true"&&delete o["aria-hidden"];break;default:{const C=$[g];C?(u===!0||u==="true"||u===1)&&(s[C]=!0):ae[g]===void 0&&(o[g]=u)}}}const l=rt(e,s),a=l.attributes;if(s.inline&&(r.verticalAlign="-0.125em"),t==="svg"){o.style={...r,...c},Object.assign(o,a);let g=0,u=n.id;return typeof u=="string"&&(u=u.replace(/-/g,"_")),o.innerHTML=at(l.body,u?()=>u+"ID"+g++:"iconifyVue"),te("svg",o)}const{body:f,width:d,height:h}=e,y=t==="mask"||(t==="bg"?!1:f.indexOf("currentColor")!==-1),v=Dt(f,{...a,width:d+"",height:h+""});return o.style={...r,"--svg":Nt(v),width:de(a.width),height:de(a.height),...zt,...y?J:Oe,...c},te("span",o)};ke(!0);ut("",bt);if(typeof document<"u"&&typeof window<"u"){const e=window;if(e.IconifyPreload!==void 0){const n=e.IconifyPreload,s="Invalid IconifyPreload syntax.";typeof n=="object"&&n!==null&&(n instanceof Array?n:[n]).forEach(o=>{try{(typeof o!="object"||o===null||o instanceof Array||typeof o.icons!="object"||typeof o.prefix!="string"||!Ye(o))&&console.error(s)}catch{console.error(s)}})}if(e.IconifyProviders!==void 0){const n=e.IconifyProviders;if(typeof n=="object"&&n!==null)for(let s in n){const o="IconifyProviders["+s+"] is invalid.";try{const t=n[s];if(typeof t!="object"||!t||t.resources===void 0)continue;ft(s,t)||console.error(o)}catch{console.error(o)}}}}const Vt={...V,body:""},he=T({inheritAttrs:!1,data(){return{_name:"",_loadingIcon:null,iconMounted:!1,counter:0}},mounted(){this.iconMounted=!0},unmounted(){this.abortLoading()},methods:{abortLoading(){this._loadingIcon&&(this._loadingIcon.abort(),this._loadingIcon=null)},getIcon(e,n,s){if(typeof e=="object"&&e!==null&&typeof e.body=="string")return this._name="",this.abortLoading(),{data:e};let o;if(typeof e!="string"||(o=z(e,!1,!0))===null)return this.abortLoading(),null;let t=Je(o);if(!t)return(!this._loadingIcon||this._loadingIcon.name!==e)&&(this.abortLoading(),this._name="",t!==null&&(this._loadingIcon={name:e,abort:Mt([o],()=>{this.counter++})})),null;if(this.abortLoading(),this._name!==e&&(this._name=e,n&&n(e)),s){t=Object.assign({},t);const i=s(t.body,o.name,o.prefix,o.provider);typeof i=="string"&&(t.body=i)}const r=["iconify"];return o.prefix!==""&&r.push("iconify--"+o.prefix),o.provider!==""&&r.push("iconify--"+o.provider),{data:t,classes:r}}},render(){this.counter;const e=this.$attrs,n=this.iconMounted||e.ssr?this.getIcon(e.icon,e.onLoad,e.customise):null;if(!n)return pe(Vt,e);let s=e;return n.classes&&(s={...e,class:(typeof e.class=="string"?e.class+" ":"")+n.classes.join(" ")}),pe({...V,...n.data},s)}}),Qt=()=>$e("color-mode").value,qt=T({__name:"ColorMode",setup(e){const n=Qt();return(s,o)=>{const t=Ae,r=Qe,i=Ve,c=ze,l=Re;return F(),L(l,null,{default:w(()=>[_(r,{"as-child":""},{default:w(()=>[_(t,{variant:"outline"},{default:w(()=>[_(m(he),{icon:"radix-icons:moon",class:"h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"}),_(m(he),{icon:"radix-icons:sun",class:"absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"}),o[3]||(o[3]=Ne("span",{class:"sr-only"},"Toggle theme",-1))]),_:1})]),_:1}),_(c,{align:"end"},{default:w(()=>[_(i,{onClick:o[0]||(o[0]=a=>m(n).preference="light")},{default:w(()=>o[4]||(o[4]=[q(" Light ")])),_:1}),_(i,{onClick:o[1]||(o[1]=a=>m(n).preference="dark")},{default:w(()=>o[5]||(o[5]=[q(" Dark ")])),_:1}),_(i,{onClick:o[2]||(o[2]=a=>m(n).preference="system")},{default:w(()=>o[6]||(o[6]=[q(" System ")])),_:1})]),_:1})]),_:1})}}}),Kt=Object.assign(qt,{__name:"ColorMode"});export{Kt as default};
