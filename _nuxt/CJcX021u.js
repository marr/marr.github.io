import{d as xe,r as U,o as _e,b as we,I as Ce,c as re,i as oe,e as ze,g as O,Q as q,n as ee,F as Pe,j as Le,f as ae,w as Ne}from"./CQG33X_H.js";import{_ as Ge}from"./D4gES4ee.js";const Ue=`#version 300 es
precision mediump float;

in vec2 a_position;
out vec2 vUv;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`,Fe=`#version 300 es
precision mediump float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_patternScale;
uniform float u_refraction;
uniform float u_edge;
uniform float u_patternBlur;
uniform float u_liquid;


#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846


vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
    m = m*m;
    m = m*m;
    vec3 x = 2. * fract(p * C.www) - 1.;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130. * dot(m, g);
}

vec2 get_img_uv() {
    vec2 img_uv = vUv;
    img_uv -= .5;
    if (u_ratio > u_img_ratio) {
        img_uv.x = img_uv.x * u_ratio / u_img_ratio;
    } else {
        img_uv.y = img_uv.y * u_img_ratio / u_ratio;
    }
    float scale_factor = 1.;
    img_uv *= scale_factor;
    img_uv += .5;

    img_uv.y = 1. - img_uv.y;

    return img_uv;
}
vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
float get_color_channel(float c1, float c2, float stripe_p, vec3 w, float extra_blur, float b) {
    float ch = c2;
    float border = 0.;
    float blur = u_patternBlur + extra_blur;

    ch = mix(ch, c1, smoothstep(.0, blur, stripe_p));

    border = w[0];
    ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));

    b = smoothstep(.2, .8, b);
    border = w[0] + .4 * (1. - b) * w[1];
    ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));

    border = w[0] + .5 * (1. - b) * w[1];
    ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));

    border = w[0] + w[1];
    ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));

    float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
    float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
    ch = mix(ch, gradient, smoothstep(border - blur, border + blur, stripe_p));

    return ch;
}

float get_img_frame_alpha(vec2 uv, float img_frame_width) {
    float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);
    img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);
    return img_frame_alpha;
}

void main() {
    vec2 uv = vUv;
    uv.y = 1. - uv.y;
    uv.x *= u_ratio;

    float diagonal = uv.x - uv.y;

    float t = .001 * u_time;

    vec2 img_uv = get_img_uv();
    vec4 img = texture(u_image_texture, img_uv);

    vec3 color = vec3(0.);
    float opacity = 1.;

    vec3 color1 = vec3(.98, 0.98, 1.);
    vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, uv.x + uv.y));

    float edge = img.r;


    vec2 grad_uv = uv;
    grad_uv -= .5;

    float dist = length(grad_uv + vec2(0., .2 * diagonal));

    grad_uv = rotate(grad_uv, (.25 - .2 * diagonal) * PI);

    float bulge = pow(1.8 * dist, 1.2);
    bulge = 1. - bulge;
    bulge *= pow(uv.y, .3);


    float cycle_width = u_patternScale;
    float thin_strip_1_ratio = .12 / cycle_width * (1. - .4 * bulge);
    float thin_strip_2_ratio = .07 / cycle_width * (1. + .4 * bulge);
    float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

    float thin_strip_1_width = cycle_width * thin_strip_1_ratio;
    float thin_strip_2_width = cycle_width * thin_strip_2_ratio;

    opacity = 1. - smoothstep(.9 - .5 * u_edge, 1. - .5 * u_edge, edge);
    opacity *= get_img_frame_alpha(img_uv, 0.01);


    float noise = snoise(uv - t);

    edge += (1. - edge) * u_liquid * noise;

    float refr = 0.;
    refr += (1. - bulge);
    refr = clamp(refr, 0., 1.);

    float dir = grad_uv.x;


    dir += diagonal;

    dir -= 2. * noise * diagonal * (smoothstep(0., 1., edge) * smoothstep(1., 0., edge));

    bulge *= clamp(pow(uv.y, .1), .3, 1.);
    dir *= (.1 + (1.1 - edge) * bulge);

    dir *= smoothstep(1., .7, edge);

    dir += .18 * (smoothstep(.1, .2, uv.y) * smoothstep(.4, .2, uv.y));
    dir += .03 * (smoothstep(.1, .2, 1. - uv.y) * smoothstep(.4, .2, 1. - uv.y));

    dir *= (.5 + .5 * pow(uv.y, 2.));

    dir *= cycle_width;

    dir -= t;

    float refr_r = refr;
    refr_r += .03 * bulge * noise;
    float refr_b = 1.3 * refr;

    refr_r += 5. * (smoothstep(-.1, .2, uv.y) * smoothstep(.5, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(1., .4, bulge));
    refr_r -= diagonal;

    refr_b += (smoothstep(0., .4, uv.y) * smoothstep(.8, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(.8, .4, bulge));
    refr_b -= .2 * edge;

    refr_r *= u_refraction;
    refr_b *= u_refraction;

    vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
    w[1] -= .02 * smoothstep(.0, 1., edge + bulge);
    float stripe_r = mod(dir + refr_r, 1.);
    float r = get_color_channel(color1.r, color2.r, stripe_r, w, 0.02 + .03 * u_refraction * bulge, bulge);
    float stripe_g = mod(dir, 1.);
    float g = get_color_channel(color1.g, color2.g, stripe_g, w, 0.01 / (1. - diagonal), bulge);
    float stripe_b = mod(dir - refr_b, 1.);
    float b = get_color_channel(color1.b, color2.b, stripe_b, w, .01, bulge);

    color = vec3(r, g, b);

    color *= opacity;

    fragColor = vec4(color, opacity);
}
`;function De(e){const r=document.createElement("canvas"),o=r.getContext("2d");return new Promise((t,a)=>{if(!e||!o){a(new Error("Invalid image URL or context"));return}const p=new Image;p.crossOrigin="anonymous",p.onload=function(){let n=p.naturalWidth,f=p.naturalHeight;(n>1e3||f>1e3||n<500||f<500)&&(n>f?n>1e3?(f=Math.round(f*1e3/n),n=1e3):n<500&&(f=Math.round(f*500/n),n=500):f>1e3?(n=Math.round(n*1e3/f),f=1e3):f<500&&(n=Math.round(n*500/f),f=500)),r.width=n,r.height=f;const S=document.createElement("canvas");S.width=n,S.height=f;const P=S.getContext("2d");P.drawImage(p,0,0,n,f);const A=P.getImageData(0,0,n,f).data,x=new Array(n*f).fill(!1);for(let g=0;g<f;g++)for(let b=0;b<n;b++){const _=(g*n+b)*4,w=A[_],y=A[_+1],E=A[_+2],T=A[_+3];x[g*n+b]=!(w===255&&y===255&&E===255&&T===255||T===0)}function L(g,b){return g<0||g>=n||b<0||b>=f?!1:x[b*n+g]}const D=new Array(n*f).fill(!1);for(let g=0;g<f;g++)for(let b=0;b<n;b++){const _=g*n+b;if(!x[_])continue;let w=!1;for(let y=g-1;y<=g+1&&!w;y++)for(let E=b-1;E<=b+1&&!w;E++)L(E,y)||(w=!0);w&&(D[_]=!0)}const R=new Float32Array(n*f).fill(0),l=new Float32Array(n*f).fill(0),d=.01,k=300;function C(g,b,_){return g<0||g>=n||b<0||b>=f||!x[b*n+g]?0:_[b*n+g]}for(let g=0;g<k;g++){for(let b=0;b<f;b++)for(let _=0;_<n;_++){const w=b*n+_;if(!x[w]||D[w]){l[w]=0;continue}const y=C(_+1,b,R)+C(_-1,b,R)+C(_,b+1,R)+C(_,b-1,R);l[w]=(d+y)/4}R.set(l)}let u=0;for(let g=0;g<n*f;g++)R[g]>u&&(u=R[g]);const I=2,G=o.createImageData(n,f);for(let g=0;g<f;g++)for(let b=0;b<n;b++){const _=g*n+b,w=_*4;if(!x[_])G.data[w]=255,G.data[w+1]=255,G.data[w+2]=255,G.data[w+3]=255;else{const y=R[_]/u,T=255*(1-Math.pow(y,I));G.data[w]=T,G.data[w+1]=T,G.data[w+2]=T,G.data[w+3]=255}}o.putImageData(G,0,0),r.toBlob(g=>{if(!g){a(new Error("Failed to create PNG blob"));return}t({imageData:G,pngBlob:g})},"image/png")},p.onerror=()=>a(new Error("Failed to load image")),p.src=e})}function ye(e){var r,o,t="";if(typeof e=="string"||typeof e=="number")t+=e;else if(typeof e=="object")if(Array.isArray(e)){var a=e.length;for(r=0;r<a;r++)e[r]&&(o=ye(e[r]))&&(t&&(t+=" "),t+=o)}else for(o in e)e[o]&&(t&&(t+=" "),t+=o);return t}function Be(){for(var e,r,o=0,t="",a=arguments.length;o<a;o++)(e=arguments[o])&&(r=ye(e))&&(t&&(t+=" "),t+=r);return t}const de="-",Oe=e=>{const r=Ve(e),{conflictingClassGroups:o,conflictingClassGroupModifiers:t}=e;return{getClassGroupId:c=>{const m=c.split(de);return m[0]===""&&m.length!==1&&m.shift(),Ae(m,r)||Xe(c)},getConflictingClassGroupIds:(c,m)=>{const n=o[c]||[];return m&&t[c]?[...n,...t[c]]:n}}},Ae=(e,r)=>{var c;if(e.length===0)return r.classGroupId;const o=e[0],t=r.nextPart.get(o),a=t?Ae(e.slice(1),t):void 0;if(a)return a;if(r.validators.length===0)return;const p=e.join(de);return(c=r.validators.find(({validator:m})=>m(p)))==null?void 0:c.classGroupId},ge=/^\[(.+)\]$/,Xe=e=>{if(ge.test(e)){const r=ge.exec(e)[1],o=r==null?void 0:r.substring(0,r.indexOf(":"));if(o)return"arbitrary.."+o}},Ve=e=>{const{theme:r,classGroups:o}=e,t={nextPart:new Map,validators:[]};for(const a in o)ie(o[a],t,a,r);return t},ie=(e,r,o,t)=>{e.forEach(a=>{if(typeof a=="string"){const p=a===""?r:be(r,a);p.classGroupId=o;return}if(typeof a=="function"){if(je(a)){ie(a(t),r,o,t);return}r.validators.push({validator:a,classGroupId:o});return}Object.entries(a).forEach(([p,c])=>{ie(c,be(r,p),o,t)})})},be=(e,r)=>{let o=e;return r.split(de).forEach(t=>{o.nextPart.has(t)||o.nextPart.set(t,{nextPart:new Map,validators:[]}),o=o.nextPart.get(t)}),o},je=e=>e.isThemeGetter,Ze=e=>{if(e<1)return{get:()=>{},set:()=>{}};let r=0,o=new Map,t=new Map;const a=(p,c)=>{o.set(p,c),r++,r>e&&(r=0,t=o,o=new Map)};return{get(p){let c=o.get(p);if(c!==void 0)return c;if((c=t.get(p))!==void 0)return a(p,c),c},set(p,c){o.has(p)?o.set(p,c):a(p,c)}}},le="!",ce=":",qe=ce.length,$e=e=>{const{prefix:r,experimentalParseClassName:o}=e;let t=a=>{const p=[];let c=0,m=0,n=0,f;for(let x=0;x<a.length;x++){let L=a[x];if(c===0&&m===0){if(L===ce){p.push(a.slice(n,x)),n=x+qe;continue}if(L==="/"){f=x;continue}}L==="["?c++:L==="]"?c--:L==="("?m++:L===")"&&m--}const S=p.length===0?a:a.substring(n),P=We(S),F=P!==S,A=f&&f>n?f-n:void 0;return{modifiers:p,hasImportantModifier:F,baseClassName:P,maybePostfixModifierPosition:A}};if(r){const a=r+ce,p=t;t=c=>c.startsWith(a)?p(c.substring(a.length)):{isExternal:!0,modifiers:[],hasImportantModifier:!1,baseClassName:c,maybePostfixModifierPosition:void 0}}if(o){const a=t;t=p=>o({className:p,parseClassName:a})}return t},We=e=>e.endsWith(le)?e.substring(0,e.length-1):e.startsWith(le)?e.substring(1):e,He=e=>{const r=Object.fromEntries(e.orderSensitiveModifiers.map(t=>[t,!0]));return t=>{if(t.length<=1)return t;const a=[];let p=[];return t.forEach(c=>{c[0]==="["||r[c]?(a.push(...p.sort(),c),p=[]):p.push(c)}),a.push(...p.sort()),a}},Ye=e=>({cache:Ze(e.cacheSize),parseClassName:$e(e),sortModifiers:He(e),...Oe(e)}),Ke=/\s+/,Je=(e,r)=>{const{parseClassName:o,getClassGroupId:t,getConflictingClassGroupIds:a,sortModifiers:p}=r,c=[],m=e.trim().split(Ke);let n="";for(let f=m.length-1;f>=0;f-=1){const S=m[f],{isExternal:P,modifiers:F,hasImportantModifier:A,baseClassName:x,maybePostfixModifierPosition:L}=o(S);if(P){n=S+(n.length>0?" "+n:n);continue}let D=!!L,R=t(D?x.substring(0,L):x);if(!R){if(!D){n=S+(n.length>0?" "+n:n);continue}if(R=t(x),!R){n=S+(n.length>0?" "+n:n);continue}D=!1}const l=p(F).join(":"),d=A?l+le:l,k=d+R;if(c.includes(k))continue;c.push(k);const C=a(R,D);for(let u=0;u<C.length;++u){const I=C[u];c.push(d+I)}n=S+(n.length>0?" "+n:n)}return n};function Qe(){let e=0,r,o,t="";for(;e<arguments.length;)(r=arguments[e++])&&(o=Se(r))&&(t&&(t+=" "),t+=o);return t}const Se=e=>{if(typeof e=="string")return e;let r,o="";for(let t=0;t<e.length;t++)e[t]&&(r=Se(e[t]))&&(o&&(o+=" "),o+=r);return o};function et(e,...r){let o,t,a,p=c;function c(n){const f=r.reduce((S,P)=>P(S),e());return o=Ye(f),t=o.cache.get,a=o.cache.set,p=m,m(n)}function m(n){const f=t(n);if(f)return f;const S=Je(n,o);return a(n,S),S}return function(){return p(Qe.apply(null,arguments))}}const z=e=>{const r=o=>o[e]||[];return r.isThemeGetter=!0,r},Ee=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Ie=/^\((?:(\w[\w-]*):)?(.+)\)$/i,tt=/^\d+\/\d+$/,rt=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,ot=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,nt=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,at=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,st=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,Z=e=>tt.test(e),h=e=>!!e&&!Number.isNaN(Number(e)),X=e=>!!e&&Number.isInteger(Number(e)),he=e=>e.endsWith("%")&&h(e.slice(0,-1)),B=e=>rt.test(e),it=()=>!0,lt=e=>ot.test(e)&&!nt.test(e),ue=()=>!1,ct=e=>at.test(e),dt=e=>st.test(e),ut=e=>!s(e)&&!i(e),ft=e=>$(e,Re,ue),s=e=>Ee.test(e),V=e=>$(e,ke,lt),se=e=>$(e,At,h),pt=e=>$(e,Te,ue),mt=e=>$(e,Me,dt),gt=e=>$(e,ue,ct),i=e=>Ie.test(e),Q=e=>W(e,ke),bt=e=>W(e,St),ht=e=>W(e,Te),vt=e=>W(e,Re),xt=e=>W(e,Me),_t=e=>W(e,Et,!0),$=(e,r,o)=>{const t=Ee.exec(e);return t?t[1]?r(t[1]):o(t[2]):!1},W=(e,r,o=!1)=>{const t=Ie.exec(e);return t?t[1]?r(t[1]):o:!1},Te=e=>e==="position",wt=new Set(["image","url"]),Me=e=>wt.has(e),yt=new Set(["length","size","percentage"]),Re=e=>yt.has(e),ke=e=>e==="length",At=e=>e==="number",St=e=>e==="family-name",Et=e=>e==="shadow",It=()=>{const e=z("color"),r=z("font"),o=z("text"),t=z("font-weight"),a=z("tracking"),p=z("leading"),c=z("breakpoint"),m=z("container"),n=z("spacing"),f=z("radius"),S=z("shadow"),P=z("inset-shadow"),F=z("drop-shadow"),A=z("blur"),x=z("perspective"),L=z("aspect"),D=z("ease"),R=z("animate"),l=()=>["auto","avoid","all","avoid-page","page","left","right","column"],d=()=>["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top"],k=()=>["auto","hidden","clip","visible","scroll"],C=()=>["auto","contain","none"],u=()=>[i,s,n],I=()=>[Z,"full","auto",...u()],G=()=>[X,"none","subgrid",i,s],g=()=>["auto",{span:["full",X,i,s]},i,s],b=()=>[X,"auto",i,s],_=()=>["auto","min","max","fr",i,s],w=()=>["start","end","center","between","around","evenly","stretch","baseline"],y=()=>["start","end","center","stretch"],E=()=>["auto",...u()],T=()=>[Z,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...u()],v=()=>[e,i,s],j=()=>[he,V],M=()=>["","none","full",f,i,s],N=()=>["",h,Q,V],H=()=>["solid","dashed","dotted","double"],fe=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],pe=()=>["","none",A,i,s],me=()=>["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left",i,s],Y=()=>["none",h,i,s],K=()=>["none",h,i,s],ne=()=>[h,i,s],J=()=>[Z,"full",...u()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[B],breakpoint:[B],color:[it],container:[B],"drop-shadow":[B],ease:["in","out","in-out"],font:[ut],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[B],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[B],shadow:[B],spacing:["px",h],text:[B],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",Z,s,i,L]}],container:["container"],columns:[{columns:[h,s,i,m]}],"break-after":[{"break-after":l()}],"break-before":[{"break-before":l()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:[...d(),s,i]}],overflow:[{overflow:k()}],"overflow-x":[{"overflow-x":k()}],"overflow-y":[{"overflow-y":k()}],overscroll:[{overscroll:C()}],"overscroll-x":[{"overscroll-x":C()}],"overscroll-y":[{"overscroll-y":C()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:I()}],"inset-x":[{"inset-x":I()}],"inset-y":[{"inset-y":I()}],start:[{start:I()}],end:[{end:I()}],top:[{top:I()}],right:[{right:I()}],bottom:[{bottom:I()}],left:[{left:I()}],visibility:["visible","invisible","collapse"],z:[{z:[X,"auto",i,s]}],basis:[{basis:[Z,"full","auto",m,...u()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[h,Z,"auto","initial","none",s]}],grow:[{grow:["",h,i,s]}],shrink:[{shrink:["",h,i,s]}],order:[{order:[X,"first","last","none",i,s]}],"grid-cols":[{"grid-cols":G()}],"col-start-end":[{col:g()}],"col-start":[{"col-start":b()}],"col-end":[{"col-end":b()}],"grid-rows":[{"grid-rows":G()}],"row-start-end":[{row:g()}],"row-start":[{"row-start":b()}],"row-end":[{"row-end":b()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":_()}],"auto-rows":[{"auto-rows":_()}],gap:[{gap:u()}],"gap-x":[{"gap-x":u()}],"gap-y":[{"gap-y":u()}],"justify-content":[{justify:[...w(),"normal"]}],"justify-items":[{"justify-items":[...y(),"normal"]}],"justify-self":[{"justify-self":["auto",...y()]}],"align-content":[{content:["normal",...w()]}],"align-items":[{items:[...y(),"baseline"]}],"align-self":[{self:["auto",...y(),"baseline"]}],"place-content":[{"place-content":w()}],"place-items":[{"place-items":[...y(),"baseline"]}],"place-self":[{"place-self":["auto",...y()]}],p:[{p:u()}],px:[{px:u()}],py:[{py:u()}],ps:[{ps:u()}],pe:[{pe:u()}],pt:[{pt:u()}],pr:[{pr:u()}],pb:[{pb:u()}],pl:[{pl:u()}],m:[{m:E()}],mx:[{mx:E()}],my:[{my:E()}],ms:[{ms:E()}],me:[{me:E()}],mt:[{mt:E()}],mr:[{mr:E()}],mb:[{mb:E()}],ml:[{ml:E()}],"space-x":[{"space-x":u()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":u()}],"space-y-reverse":["space-y-reverse"],size:[{size:T()}],w:[{w:[m,"screen",...T()]}],"min-w":[{"min-w":[m,"screen","none",...T()]}],"max-w":[{"max-w":[m,"screen","none","prose",{screen:[c]},...T()]}],h:[{h:["screen",...T()]}],"min-h":[{"min-h":["screen","none",...T()]}],"max-h":[{"max-h":["screen",...T()]}],"font-size":[{text:["base",o,Q,V]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[t,i,se]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",he,s]}],"font-family":[{font:[bt,s,r]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[a,i,s]}],"line-clamp":[{"line-clamp":[h,"none",i,se]}],leading:[{leading:[p,...u()]}],"list-image":[{"list-image":["none",i,s]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",i,s]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:v()}],"text-color":[{text:v()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...H(),"wavy"]}],"text-decoration-thickness":[{decoration:[h,"from-font","auto",i,V]}],"text-decoration-color":[{decoration:v()}],"underline-offset":[{"underline-offset":[h,"auto",i,s]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:u()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",i,s]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",i,s]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:[...d(),ht,pt]}],"bg-repeat":[{bg:["no-repeat",{repeat:["","x","y","space","round"]}]}],"bg-size":[{bg:["auto","cover","contain",vt,ft]}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},X,i,s],radial:["",i,s],conic:[X,i,s]},xt,mt]}],"bg-color":[{bg:v()}],"gradient-from-pos":[{from:j()}],"gradient-via-pos":[{via:j()}],"gradient-to-pos":[{to:j()}],"gradient-from":[{from:v()}],"gradient-via":[{via:v()}],"gradient-to":[{to:v()}],rounded:[{rounded:M()}],"rounded-s":[{"rounded-s":M()}],"rounded-e":[{"rounded-e":M()}],"rounded-t":[{"rounded-t":M()}],"rounded-r":[{"rounded-r":M()}],"rounded-b":[{"rounded-b":M()}],"rounded-l":[{"rounded-l":M()}],"rounded-ss":[{"rounded-ss":M()}],"rounded-se":[{"rounded-se":M()}],"rounded-ee":[{"rounded-ee":M()}],"rounded-es":[{"rounded-es":M()}],"rounded-tl":[{"rounded-tl":M()}],"rounded-tr":[{"rounded-tr":M()}],"rounded-br":[{"rounded-br":M()}],"rounded-bl":[{"rounded-bl":M()}],"border-w":[{border:N()}],"border-w-x":[{"border-x":N()}],"border-w-y":[{"border-y":N()}],"border-w-s":[{"border-s":N()}],"border-w-e":[{"border-e":N()}],"border-w-t":[{"border-t":N()}],"border-w-r":[{"border-r":N()}],"border-w-b":[{"border-b":N()}],"border-w-l":[{"border-l":N()}],"divide-x":[{"divide-x":N()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":N()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...H(),"hidden","none"]}],"divide-style":[{divide:[...H(),"hidden","none"]}],"border-color":[{border:v()}],"border-color-x":[{"border-x":v()}],"border-color-y":[{"border-y":v()}],"border-color-s":[{"border-s":v()}],"border-color-e":[{"border-e":v()}],"border-color-t":[{"border-t":v()}],"border-color-r":[{"border-r":v()}],"border-color-b":[{"border-b":v()}],"border-color-l":[{"border-l":v()}],"divide-color":[{divide:v()}],"outline-style":[{outline:[...H(),"none","hidden"]}],"outline-offset":[{"outline-offset":[h,i,s]}],"outline-w":[{outline:["",h,Q,V]}],"outline-color":[{outline:[e]}],shadow:[{shadow:["","none",S,_t,gt]}],"shadow-color":[{shadow:v()}],"inset-shadow":[{"inset-shadow":["none",i,s,P]}],"inset-shadow-color":[{"inset-shadow":v()}],"ring-w":[{ring:N()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:v()}],"ring-offset-w":[{"ring-offset":[h,V]}],"ring-offset-color":[{"ring-offset":v()}],"inset-ring-w":[{"inset-ring":N()}],"inset-ring-color":[{"inset-ring":v()}],opacity:[{opacity:[h,i,s]}],"mix-blend":[{"mix-blend":[...fe(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":fe()}],filter:[{filter:["","none",i,s]}],blur:[{blur:pe()}],brightness:[{brightness:[h,i,s]}],contrast:[{contrast:[h,i,s]}],"drop-shadow":[{"drop-shadow":["","none",F,i,s]}],grayscale:[{grayscale:["",h,i,s]}],"hue-rotate":[{"hue-rotate":[h,i,s]}],invert:[{invert:["",h,i,s]}],saturate:[{saturate:[h,i,s]}],sepia:[{sepia:["",h,i,s]}],"backdrop-filter":[{"backdrop-filter":["","none",i,s]}],"backdrop-blur":[{"backdrop-blur":pe()}],"backdrop-brightness":[{"backdrop-brightness":[h,i,s]}],"backdrop-contrast":[{"backdrop-contrast":[h,i,s]}],"backdrop-grayscale":[{"backdrop-grayscale":["",h,i,s]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[h,i,s]}],"backdrop-invert":[{"backdrop-invert":["",h,i,s]}],"backdrop-opacity":[{"backdrop-opacity":[h,i,s]}],"backdrop-saturate":[{"backdrop-saturate":[h,i,s]}],"backdrop-sepia":[{"backdrop-sepia":["",h,i,s]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":u()}],"border-spacing-x":[{"border-spacing-x":u()}],"border-spacing-y":[{"border-spacing-y":u()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",i,s]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[h,"initial",i,s]}],ease:[{ease:["linear","initial",D,i,s]}],delay:[{delay:[h,i,s]}],animate:[{animate:["none",R,i,s]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[x,i,s]}],"perspective-origin":[{"perspective-origin":me()}],rotate:[{rotate:Y()}],"rotate-x":[{"rotate-x":Y()}],"rotate-y":[{"rotate-y":Y()}],"rotate-z":[{"rotate-z":Y()}],scale:[{scale:K()}],"scale-x":[{"scale-x":K()}],"scale-y":[{"scale-y":K()}],"scale-z":[{"scale-z":K()}],"scale-3d":["scale-3d"],skew:[{skew:ne()}],"skew-x":[{"skew-x":ne()}],"skew-y":[{"skew-y":ne()}],transform:[{transform:[i,s,"","none","gpu","cpu"]}],"transform-origin":[{origin:me()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:J()}],"translate-x":[{"translate-x":J()}],"translate-y":[{"translate-y":J()}],"translate-z":[{"translate-z":J()}],"translate-none":["translate-none"],accent:[{accent:v()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:v()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",i,s]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":u()}],"scroll-mx":[{"scroll-mx":u()}],"scroll-my":[{"scroll-my":u()}],"scroll-ms":[{"scroll-ms":u()}],"scroll-me":[{"scroll-me":u()}],"scroll-mt":[{"scroll-mt":u()}],"scroll-mr":[{"scroll-mr":u()}],"scroll-mb":[{"scroll-mb":u()}],"scroll-ml":[{"scroll-ml":u()}],"scroll-p":[{"scroll-p":u()}],"scroll-px":[{"scroll-px":u()}],"scroll-py":[{"scroll-py":u()}],"scroll-ps":[{"scroll-ps":u()}],"scroll-pe":[{"scroll-pe":u()}],"scroll-pt":[{"scroll-pt":u()}],"scroll-pr":[{"scroll-pr":u()}],"scroll-pb":[{"scroll-pb":u()}],"scroll-pl":[{"scroll-pl":u()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",i,s]}],fill:[{fill:["none",...v()]}],"stroke-w":[{stroke:[h,Q,V,se]}],stroke:[{stroke:["none",...v()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["before","after","placeholder","file","marker","selection","first-line","first-letter","backdrop","*","**"]}},Tt=et(It);function te(...e){return Tt(Be(e))}const Mt={key:0,class:"flex size-full items-center justify-center text-2xl font-bold text-primary/50"},Rt=xe({__name:"LiquidLogo",props:{class:{},imageUrl:{},patternScale:{default:2},refraction:{default:.015},edge:{default:.4},patternBlur:{default:.005},liquid:{default:.07},speed:{default:.3}},setup(e){const r=e,o=U(null),t=U(null),a=U({}),p=U(0),c=U(0),m=U(null),n=U(!1);let f,S;_e(async()=>{n.value=!0,await D(),F(),P(),S=await R(),n.value=!1,window.addEventListener("resize",L),L(),x()}),we(()=>{window.removeEventListener("resize",L),cancelAnimationFrame(f),S&&S()});function P(){!t.value||!a.value||(t.value.uniform1f(a.value.u_edge,r.edge),t.value.uniform1f(a.value.u_patternBlur,r.patternBlur),t.value.uniform1f(a.value.u_time,0),t.value.uniform1f(a.value.u_patternScale,r.patternScale),t.value.uniform1f(a.value.u_refraction,r.refraction),t.value.uniform1f(a.value.u_liquid,r.liquid))}function F(){const l=m.value,d=l==null?void 0:l.getContext("webgl2",{antialias:!0,alpha:!0});if(!l||!d)return;d.enable(d.BLEND),d.blendFunc(d.SRC_ALPHA,d.ONE_MINUS_SRC_ALPHA);function k(y,E,T){const v=y.createShader(T);return v?(y.shaderSource(v,E),y.compileShader(v),y.getShaderParameter(v,y.COMPILE_STATUS)?v:(y.deleteShader(v),null)):null}const C=k(d,Ue,d.VERTEX_SHADER),u=k(d,Fe,d.FRAGMENT_SHADER),I=d.createProgram();if(!I||!C||!u)return;if(d.attachShader(I,C),d.attachShader(I,u),d.linkProgram(I),!d.getProgramParameter(I,d.LINK_STATUS))return null;function G(y,E){var j;let T={},v=E.getProgramParameter(y,E.ACTIVE_UNIFORMS);for(let M=0;M<v;M++){let N=(j=E.getActiveUniform(y,M))==null?void 0:j.name;N&&(T[N]=E.getUniformLocation(y,N))}return T}const g=G(I,d);a.value=g;const b=new Float32Array([-1,-1,1,-1,-1,1,1,1]),_=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,_),d.bufferData(d.ARRAY_BUFFER,b,d.STATIC_DRAW),d.useProgram(I);const w=d.getAttribLocation(I,"a_position");d.enableVertexAttribArray(w),d.bindBuffer(d.ARRAY_BUFFER,_),d.vertexAttribPointer(w,2,d.FLOAT,!1,0,0),t.value=d}function A(l){const d=l-c.value;c.value=l,p.value+=d*r.speed,t.value.uniform1f(a.value.u_time,p.value),t.value.drawArrays(t.value.TRIANGLE_STRIP,0,4),f=requestAnimationFrame(A)}function x(){return c.value=performance.now(),f=requestAnimationFrame(A),()=>{cancelAnimationFrame(f)}}function L(){const l=m.value,d=t.value;if(!l||!d||!a.value)return;const k=o.value?o.value.width/o.value.height:1;d.uniform1f(a.value.u_img_ratio,k);const C=1e3;l.width=C*devicePixelRatio,l.height=C*devicePixelRatio,d.viewport(0,0,l.height,l.height),d.uniform1f(a.value.u_ratio,1),d.uniform1f(a.value.u_img_ratio,k)}async function D(){try{const{imageData:l}=await De(r.imageUrl);o.value=l}catch{}}async function R(){const l=t.value;if(!l||!a.value||!o.value)return;const d=l.getParameter(l.TEXTURE_BINDING_2D);d&&l.deleteTexture(d);const k=l.createTexture();l.activeTexture(l.TEXTURE0),l.bindTexture(l.TEXTURE_2D,k),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE),l.pixelStorei(l.UNPACK_ALIGNMENT,1);try{l.texImage2D(l.TEXTURE_2D,0,l.RGBA,o.value.width,o.value.height,0,l.RGBA,l.UNSIGNED_BYTE,o.value.data),l.uniform1i(a.value.u_image_texture,0)}catch{}return()=>{k&&l.deleteTexture(k)}}return Ce(()=>[r.edge,r.patternBlur,r.patternScale,r.refraction,r.liquid],P),(l,d)=>(oe(),re(Pe,null,[q(n)?(oe(),re("div",Mt,d[0]||(d[0]=[O("span",null," Context... ",-1)]))):ze("",!0),O("canvas",{ref_key:"liquidLogoRef",ref:m,class:ee(q(te)("block size-full object-contain",r.class,{hidden:q(n)}))},null,2)],64))}}),kt=Object.assign(Rt,{__name:"LiquidLogo"}),ve="absolute inset-x-0 top-0 m-auto inline-block w-full",Ct=xe({__name:"MorphingText",props:{class:{},texts:{},morphTime:{default:1.5},coolDownTime:{default:.5}},setup(e){const r=e,o=U(0),t=U(0),a=U(0),p=U(new Date),c=U(),m=U();function n(A){if(!c.value||!m.value)return;m.value.style.filter=`blur(${Math.min(8/A-8,100)}px)`,m.value.style.opacity=`${Math.pow(A,.4)*100}%`;const x=1-A;c.value.style.filter=`blur(${Math.min(8/x-8,100)}px)`,c.value.style.opacity=`${Math.pow(x,.4)*100}%`,c.value.textContent=r.texts[o.value%r.texts.length],m.value.textContent=r.texts[(o.value+1)%r.texts.length]}function f(){t.value-=a.value,a.value=0;let A=t.value/r.morphTime;A>1&&(a.value=r.coolDownTime,A=1),n(A),A===1&&o.value++}function S(){t.value=0,c.value&&m.value&&(m.value.style.filter="none",m.value.style.opacity="100%",c.value.style.filter="none",c.value.style.opacity="0%")}let P=0;function F(){P=requestAnimationFrame(F);const A=new Date,x=(A.getTime()-p.value.getTime())/1e3;p.value=A,a.value-=x,a.value<=0?f():S()}return _e(()=>{F()}),we(()=>{cancelAnimationFrame(P)}),(A,x)=>(oe(),re("div",{class:ee(q(te)("relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] md:h-24 lg:text-[6rem]",r.class))},[O("span",{ref_key:"text1Ref",ref:c,class:ee(q(te)(ve))},null,2),O("span",{ref_key:"text2Ref",ref:m,class:ee(q(te)(ve))},null,2),x[0]||(x[0]=O("svg",{id:"filters",class:"fixed size-0",preserveAspectRatio:"xMidYMid slice"},[O("defs",null,[O("filter",{id:"threshold"},[O("feColorMatrix",{in:"SourceGraphic",type:"matrix",values:`1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140`})])])],-1))],2))}}),zt=Object.assign(Ct,{__name:"MorphingText"}),Pt={},Lt={class:"flex flex-col h-72 max-w-[950px] items-center justify-center"};function Nt(e,r){const o=kt,t=zt,a=Ge;return oe(),re("div",Lt,[ae(o,{class:"translate-x-5","image-url":"/cxl-icon.svg"}),ae(a,null,{default:Ne(()=>[ae(t,{texts:["Labs","Context"]})]),_:1})])}const Ft=Le(Pt,[["render",Nt]]);export{Ft as default};
