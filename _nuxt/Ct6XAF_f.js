import{C as Ne,r as Z,o as Le,c as Ue,J as Ge,d as be,i as he,e as Fe,g as ve,R as ae,n as Be,F as De}from"./DShtQb_L.js";const Xe=`#version 300 es
precision mediump float;

in vec2 a_position;
out vec2 vUv;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`,Oe=`#version 300 es
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
`;function Ve(e){const a=document.createElement("canvas"),o=a.getContext("2d");return new Promise((t,n)=>{if(!e||!o){n(new Error("Invalid image URL or context"));return}const f=new Image;f.crossOrigin="anonymous",f.onload=function(){let r=f.naturalWidth,m=f.naturalHeight;(r>1e3||m>1e3||r<500||m<500)&&(r>m?r>1e3?(m=Math.round(m*1e3/r),r=1e3):r<500&&(m=Math.round(m*500/r),r=500):m>1e3?(r=Math.round(r*1e3/m),m=1e3):m<500&&(r=Math.round(r*500/m),m=500)),a.width=r,a.height=m;const _=document.createElement("canvas");_.width=r,_.height=m;const L=_.getContext("2d");L.drawImage(f,0,0,r,m);const G=L.getImageData(0,0,r,m).data,k=new Array(r*m).fill(!1);for(let g=0;g<m;g++)for(let h=0;h<r;h++){const w=(g*r+h)*4,x=G[w],y=G[w+1],C=G[w+2],R=G[w+3];k[g*r+h]=!(x===255&&y===255&&C===255&&R===255||R===0)}function z(g,h){return g<0||g>=r||h<0||h>=m?!1:k[h*r+g]}const B=new Array(r*m).fill(!1);for(let g=0;g<m;g++)for(let h=0;h<r;h++){const w=g*r+h;if(!k[w])continue;let x=!1;for(let y=g-1;y<=g+1&&!x;y++)for(let C=h-1;C<=h+1&&!x;C++)z(C,y)||(x=!0);x&&(B[w]=!0)}const E=new Float32Array(r*m).fill(0),l=new Float32Array(r*m).fill(0),d=.01,I=300;function S(g,h,w){return g<0||g>=r||h<0||h>=m||!k[h*r+g]?0:w[h*r+g]}for(let g=0;g<I;g++){for(let h=0;h<m;h++)for(let w=0;w<r;w++){const x=h*r+w;if(!k[x]||B[x]){l[x]=0;continue}const y=S(w+1,h,E)+S(w-1,h,E)+S(w,h+1,E)+S(w,h-1,E);l[x]=(d+y)/4}E.set(l)}let U=0;for(let g=0;g<r*m;g++)E[g]>U&&(U=E[g]);const P=2,c=o.createImageData(r,m);for(let g=0;g<m;g++)for(let h=0;h<r;h++){const w=g*r+h,x=w*4;if(!k[w])c.data[x]=255,c.data[x+1]=255,c.data[x+2]=255,c.data[x+3]=255;else{const y=E[w]/U,R=255*(1-Math.pow(y,P));c.data[x]=R,c.data[x+1]=R,c.data[x+2]=R,c.data[x+3]=255}}o.putImageData(c,0,0),a.toBlob(g=>{if(!g){n(new Error("Failed to create PNG blob"));return}t({imageData:c,pngBlob:g})},"image/png")},f.onerror=()=>n(new Error("Failed to load image")),f.src=e})}function ke(e){var a,o,t="";if(typeof e=="string"||typeof e=="number")t+=e;else if(typeof e=="object")if(Array.isArray(e)){var n=e.length;for(a=0;a<n;a++)e[a]&&(o=ke(e[a]))&&(t&&(t+=" "),t+=o)}else for(o in e)e[o]&&(t&&(t+=" "),t+=o);return t}function Ze(){for(var e,a,o=0,t="",n=arguments.length;o<n;o++)(e=arguments[o])&&(a=ke(e))&&(t&&(t+=" "),t+=a);return t}const de="-",qe=e=>{const a=We(e),{conflictingClassGroups:o,conflictingClassGroupModifiers:t}=e;return{getClassGroupId:p=>{const v=p.split(de);return v[0]===""&&v.length!==1&&v.shift(),Ae(v,a)||je(p)},getConflictingClassGroupIds:(p,v)=>{const r=o[p]||[];return v&&t[p]?[...r,...t[p]]:r}}},Ae=(e,a)=>{if(e.length===0)return a.classGroupId;const o=e[0],t=a.nextPart.get(o),n=t?Ae(e.slice(1),t):void 0;if(n)return n;if(a.validators.length===0)return;const f=e.join(de);return a.validators.find(({validator:p})=>p(f))?.classGroupId},xe=/^\[(.+)\]$/,je=e=>{if(xe.test(e)){const a=xe.exec(e)[1],o=a?.substring(0,a.indexOf(":"));if(o)return"arbitrary.."+o}},We=e=>{const{theme:a,classGroups:o}=e,t={nextPart:new Map,validators:[]};for(const n in o)ie(o[n],t,n,a);return t},ie=(e,a,o,t)=>{e.forEach(n=>{if(typeof n=="string"){const f=n===""?a:we(a,n);f.classGroupId=o;return}if(typeof n=="function"){if($e(n)){ie(n(t),a,o,t);return}a.validators.push({validator:n,classGroupId:o});return}Object.entries(n).forEach(([f,p])=>{ie(p,we(a,f),o,t)})})},we=(e,a)=>{let o=e;return a.split(de).forEach(t=>{o.nextPart.has(t)||o.nextPart.set(t,{nextPart:new Map,validators:[]}),o=o.nextPart.get(t)}),o},$e=e=>e.isThemeGetter,He=e=>{if(e<1)return{get:()=>{},set:()=>{}};let a=0,o=new Map,t=new Map;const n=(f,p)=>{o.set(f,p),a++,a>e&&(a=0,t=o,o=new Map)};return{get(f){let p=o.get(f);if(p!==void 0)return p;if((p=t.get(f))!==void 0)return n(f,p),p},set(f,p){o.has(f)?o.set(f,p):n(f,p)}}},le="!",ce=":",Ye=ce.length,Je=e=>{const{prefix:a,experimentalParseClassName:o}=e;let t=n=>{const f=[];let p=0,v=0,r=0,m;for(let k=0;k<n.length;k++){let z=n[k];if(p===0&&v===0){if(z===ce){f.push(n.slice(r,k)),r=k+Ye;continue}if(z==="/"){m=k;continue}}z==="["?p++:z==="]"?p--:z==="("?v++:z===")"&&v--}const _=f.length===0?n:n.substring(r),L=Ke(_),O=L!==_,G=m&&m>r?m-r:void 0;return{modifiers:f,hasImportantModifier:O,baseClassName:L,maybePostfixModifierPosition:G}};if(a){const n=a+ce,f=t;t=p=>p.startsWith(n)?f(p.substring(n.length)):{isExternal:!0,modifiers:[],hasImportantModifier:!1,baseClassName:p,maybePostfixModifierPosition:void 0}}if(o){const n=t;t=f=>o({className:f,parseClassName:n})}return t},Ke=e=>e.endsWith(le)?e.substring(0,e.length-1):e.startsWith(le)?e.substring(1):e,Qe=e=>{const a=Object.fromEntries(e.orderSensitiveModifiers.map(t=>[t,!0]));return t=>{if(t.length<=1)return t;const n=[];let f=[];return t.forEach(p=>{p[0]==="["||a[p]?(n.push(...f.sort(),p),f=[]):f.push(p)}),n.push(...f.sort()),n}},et=e=>({cache:He(e.cacheSize),parseClassName:Je(e),sortModifiers:Qe(e),...qe(e)}),tt=/\s+/,rt=(e,a)=>{const{parseClassName:o,getClassGroupId:t,getConflictingClassGroupIds:n,sortModifiers:f}=a,p=[],v=e.trim().split(tt);let r="";for(let m=v.length-1;m>=0;m-=1){const _=v[m],{isExternal:L,modifiers:O,hasImportantModifier:G,baseClassName:k,maybePostfixModifierPosition:z}=o(_);if(L){r=_+(r.length>0?" "+r:r);continue}let B=!!z,E=t(B?k.substring(0,z):k);if(!E){if(!B){r=_+(r.length>0?" "+r:r);continue}if(E=t(k),!E){r=_+(r.length>0?" "+r:r);continue}B=!1}const l=f(O).join(":"),d=G?l+le:l,I=d+E;if(p.includes(I))continue;p.push(I);const S=n(E,B);for(let U=0;U<S.length;++U){const P=S[U];p.push(d+P)}r=_+(r.length>0?" "+r:r)}return r};function ot(){let e=0,a,o,t="";for(;e<arguments.length;)(a=arguments[e++])&&(o=Ee(a))&&(t&&(t+=" "),t+=o);return t}const Ee=e=>{if(typeof e=="string")return e;let a,o="";for(let t=0;t<e.length;t++)e[t]&&(a=Ee(e[t]))&&(o&&(o+=" "),o+=a);return o};function at(e,...a){let o,t,n,f=p;function p(r){const m=a.reduce((_,L)=>L(_),e());return o=et(m),t=o.cache.get,n=o.cache.set,f=v,v(r)}function v(r){const m=t(r);if(m)return m;const _=rt(r,o);return n(r,_),_}return function(){return f(ot.apply(null,arguments))}}const A=e=>{const a=o=>o[e]||[];return a.isThemeGetter=!0,a},Ie=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Se=/^\((?:(\w[\w-]*):)?(.+)\)$/i,nt=/^\d+\/\d+$/,st=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,it=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,lt=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,ct=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,dt=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,j=e=>nt.test(e),b=e=>!!e&&!Number.isNaN(Number(e)),V=e=>!!e&&Number.isInteger(Number(e)),ne=e=>e.endsWith("%")&&b(e.slice(0,-1)),X=e=>st.test(e),ut=()=>!0,mt=e=>it.test(e)&&!lt.test(e),Re=()=>!1,ft=e=>ct.test(e),pt=e=>dt.test(e),gt=e=>!s(e)&&!i(e),bt=e=>W(e,ze,Re),s=e=>Ie.test(e),q=e=>W(e,Ce,mt),se=e=>W(e,_t,b),_e=e=>W(e,Te,Re),ht=e=>W(e,Me,pt),ee=e=>W(e,Pe,ft),i=e=>Se.test(e),H=e=>$(e,Ce),vt=e=>$(e,yt),ye=e=>$(e,Te),xt=e=>$(e,ze),wt=e=>$(e,Me),te=e=>$(e,Pe,!0),W=(e,a,o)=>{const t=Ie.exec(e);return t?t[1]?a(t[1]):o(t[2]):!1},$=(e,a,o=!1)=>{const t=Se.exec(e);return t?t[1]?a(t[1]):o:!1},Te=e=>e==="position"||e==="percentage",Me=e=>e==="image"||e==="url",ze=e=>e==="length"||e==="size"||e==="bg-size",Ce=e=>e==="length",_t=e=>e==="number",yt=e=>e==="family-name",Pe=e=>e==="shadow",kt=()=>{const e=A("color"),a=A("font"),o=A("text"),t=A("font-weight"),n=A("tracking"),f=A("leading"),p=A("breakpoint"),v=A("container"),r=A("spacing"),m=A("radius"),_=A("shadow"),L=A("inset-shadow"),O=A("text-shadow"),G=A("drop-shadow"),k=A("blur"),z=A("perspective"),B=A("aspect"),E=A("ease"),l=A("animate"),d=()=>["auto","avoid","all","avoid-page","page","left","right","column"],I=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],S=()=>[...I(),i,s],U=()=>["auto","hidden","clip","visible","scroll"],P=()=>["auto","contain","none"],c=()=>[i,s,r],g=()=>[j,"full","auto",...c()],h=()=>[V,"none","subgrid",i,s],w=()=>["auto",{span:["full",V,i,s]},V,i,s],x=()=>[V,"auto",i,s],y=()=>["auto","min","max","fr",i,s],C=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],R=()=>["start","end","center","stretch","center-safe","end-safe"],T=()=>["auto",...c()],D=()=>[j,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...c()],u=()=>[e,i,s],ue=()=>[...I(),ye,_e,{position:[i,s]}],me=()=>["no-repeat",{repeat:["","x","y","space","round"]}],fe=()=>["auto","cover","contain",xt,bt,{size:[i,s]}],re=()=>[ne,H,q],N=()=>["","none","full",m,i,s],F=()=>["",b,H,q],Y=()=>["solid","dashed","dotted","double"],pe=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],M=()=>[b,ne,ye,_e],ge=()=>["","none",k,i,s],J=()=>["none",b,i,s],K=()=>["none",b,i,s],oe=()=>[b,i,s],Q=()=>[j,"full",...c()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[X],breakpoint:[X],color:[ut],container:[X],"drop-shadow":[X],ease:["in","out","in-out"],font:[gt],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[X],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[X],shadow:[X],spacing:["px",b],text:[X],"text-shadow":[X],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",j,s,i,B]}],container:["container"],columns:[{columns:[b,s,i,v]}],"break-after":[{"break-after":d()}],"break-before":[{"break-before":d()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:S()}],overflow:[{overflow:U()}],"overflow-x":[{"overflow-x":U()}],"overflow-y":[{"overflow-y":U()}],overscroll:[{overscroll:P()}],"overscroll-x":[{"overscroll-x":P()}],"overscroll-y":[{"overscroll-y":P()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:g()}],"inset-x":[{"inset-x":g()}],"inset-y":[{"inset-y":g()}],start:[{start:g()}],end:[{end:g()}],top:[{top:g()}],right:[{right:g()}],bottom:[{bottom:g()}],left:[{left:g()}],visibility:["visible","invisible","collapse"],z:[{z:[V,"auto",i,s]}],basis:[{basis:[j,"full","auto",v,...c()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[b,j,"auto","initial","none",s]}],grow:[{grow:["",b,i,s]}],shrink:[{shrink:["",b,i,s]}],order:[{order:[V,"first","last","none",i,s]}],"grid-cols":[{"grid-cols":h()}],"col-start-end":[{col:w()}],"col-start":[{"col-start":x()}],"col-end":[{"col-end":x()}],"grid-rows":[{"grid-rows":h()}],"row-start-end":[{row:w()}],"row-start":[{"row-start":x()}],"row-end":[{"row-end":x()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":y()}],"auto-rows":[{"auto-rows":y()}],gap:[{gap:c()}],"gap-x":[{"gap-x":c()}],"gap-y":[{"gap-y":c()}],"justify-content":[{justify:[...C(),"normal"]}],"justify-items":[{"justify-items":[...R(),"normal"]}],"justify-self":[{"justify-self":["auto",...R()]}],"align-content":[{content:["normal",...C()]}],"align-items":[{items:[...R(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...R(),{baseline:["","last"]}]}],"place-content":[{"place-content":C()}],"place-items":[{"place-items":[...R(),"baseline"]}],"place-self":[{"place-self":["auto",...R()]}],p:[{p:c()}],px:[{px:c()}],py:[{py:c()}],ps:[{ps:c()}],pe:[{pe:c()}],pt:[{pt:c()}],pr:[{pr:c()}],pb:[{pb:c()}],pl:[{pl:c()}],m:[{m:T()}],mx:[{mx:T()}],my:[{my:T()}],ms:[{ms:T()}],me:[{me:T()}],mt:[{mt:T()}],mr:[{mr:T()}],mb:[{mb:T()}],ml:[{ml:T()}],"space-x":[{"space-x":c()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":c()}],"space-y-reverse":["space-y-reverse"],size:[{size:D()}],w:[{w:[v,"screen",...D()]}],"min-w":[{"min-w":[v,"screen","none",...D()]}],"max-w":[{"max-w":[v,"screen","none","prose",{screen:[p]},...D()]}],h:[{h:["screen","lh",...D()]}],"min-h":[{"min-h":["screen","lh","none",...D()]}],"max-h":[{"max-h":["screen","lh",...D()]}],"font-size":[{text:["base",o,H,q]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[t,i,se]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",ne,s]}],"font-family":[{font:[vt,s,a]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[n,i,s]}],"line-clamp":[{"line-clamp":[b,"none",i,se]}],leading:[{leading:[f,...c()]}],"list-image":[{"list-image":["none",i,s]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",i,s]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:u()}],"text-color":[{text:u()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...Y(),"wavy"]}],"text-decoration-thickness":[{decoration:[b,"from-font","auto",i,q]}],"text-decoration-color":[{decoration:u()}],"underline-offset":[{"underline-offset":[b,"auto",i,s]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:c()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",i,s]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",i,s]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:ue()}],"bg-repeat":[{bg:me()}],"bg-size":[{bg:fe()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},V,i,s],radial:["",i,s],conic:[V,i,s]},wt,ht]}],"bg-color":[{bg:u()}],"gradient-from-pos":[{from:re()}],"gradient-via-pos":[{via:re()}],"gradient-to-pos":[{to:re()}],"gradient-from":[{from:u()}],"gradient-via":[{via:u()}],"gradient-to":[{to:u()}],rounded:[{rounded:N()}],"rounded-s":[{"rounded-s":N()}],"rounded-e":[{"rounded-e":N()}],"rounded-t":[{"rounded-t":N()}],"rounded-r":[{"rounded-r":N()}],"rounded-b":[{"rounded-b":N()}],"rounded-l":[{"rounded-l":N()}],"rounded-ss":[{"rounded-ss":N()}],"rounded-se":[{"rounded-se":N()}],"rounded-ee":[{"rounded-ee":N()}],"rounded-es":[{"rounded-es":N()}],"rounded-tl":[{"rounded-tl":N()}],"rounded-tr":[{"rounded-tr":N()}],"rounded-br":[{"rounded-br":N()}],"rounded-bl":[{"rounded-bl":N()}],"border-w":[{border:F()}],"border-w-x":[{"border-x":F()}],"border-w-y":[{"border-y":F()}],"border-w-s":[{"border-s":F()}],"border-w-e":[{"border-e":F()}],"border-w-t":[{"border-t":F()}],"border-w-r":[{"border-r":F()}],"border-w-b":[{"border-b":F()}],"border-w-l":[{"border-l":F()}],"divide-x":[{"divide-x":F()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":F()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...Y(),"hidden","none"]}],"divide-style":[{divide:[...Y(),"hidden","none"]}],"border-color":[{border:u()}],"border-color-x":[{"border-x":u()}],"border-color-y":[{"border-y":u()}],"border-color-s":[{"border-s":u()}],"border-color-e":[{"border-e":u()}],"border-color-t":[{"border-t":u()}],"border-color-r":[{"border-r":u()}],"border-color-b":[{"border-b":u()}],"border-color-l":[{"border-l":u()}],"divide-color":[{divide:u()}],"outline-style":[{outline:[...Y(),"none","hidden"]}],"outline-offset":[{"outline-offset":[b,i,s]}],"outline-w":[{outline:["",b,H,q]}],"outline-color":[{outline:u()}],shadow:[{shadow:["","none",_,te,ee]}],"shadow-color":[{shadow:u()}],"inset-shadow":[{"inset-shadow":["none",L,te,ee]}],"inset-shadow-color":[{"inset-shadow":u()}],"ring-w":[{ring:F()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:u()}],"ring-offset-w":[{"ring-offset":[b,q]}],"ring-offset-color":[{"ring-offset":u()}],"inset-ring-w":[{"inset-ring":F()}],"inset-ring-color":[{"inset-ring":u()}],"text-shadow":[{"text-shadow":["none",O,te,ee]}],"text-shadow-color":[{"text-shadow":u()}],opacity:[{opacity:[b,i,s]}],"mix-blend":[{"mix-blend":[...pe(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":pe()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[b]}],"mask-image-linear-from-pos":[{"mask-linear-from":M()}],"mask-image-linear-to-pos":[{"mask-linear-to":M()}],"mask-image-linear-from-color":[{"mask-linear-from":u()}],"mask-image-linear-to-color":[{"mask-linear-to":u()}],"mask-image-t-from-pos":[{"mask-t-from":M()}],"mask-image-t-to-pos":[{"mask-t-to":M()}],"mask-image-t-from-color":[{"mask-t-from":u()}],"mask-image-t-to-color":[{"mask-t-to":u()}],"mask-image-r-from-pos":[{"mask-r-from":M()}],"mask-image-r-to-pos":[{"mask-r-to":M()}],"mask-image-r-from-color":[{"mask-r-from":u()}],"mask-image-r-to-color":[{"mask-r-to":u()}],"mask-image-b-from-pos":[{"mask-b-from":M()}],"mask-image-b-to-pos":[{"mask-b-to":M()}],"mask-image-b-from-color":[{"mask-b-from":u()}],"mask-image-b-to-color":[{"mask-b-to":u()}],"mask-image-l-from-pos":[{"mask-l-from":M()}],"mask-image-l-to-pos":[{"mask-l-to":M()}],"mask-image-l-from-color":[{"mask-l-from":u()}],"mask-image-l-to-color":[{"mask-l-to":u()}],"mask-image-x-from-pos":[{"mask-x-from":M()}],"mask-image-x-to-pos":[{"mask-x-to":M()}],"mask-image-x-from-color":[{"mask-x-from":u()}],"mask-image-x-to-color":[{"mask-x-to":u()}],"mask-image-y-from-pos":[{"mask-y-from":M()}],"mask-image-y-to-pos":[{"mask-y-to":M()}],"mask-image-y-from-color":[{"mask-y-from":u()}],"mask-image-y-to-color":[{"mask-y-to":u()}],"mask-image-radial":[{"mask-radial":[i,s]}],"mask-image-radial-from-pos":[{"mask-radial-from":M()}],"mask-image-radial-to-pos":[{"mask-radial-to":M()}],"mask-image-radial-from-color":[{"mask-radial-from":u()}],"mask-image-radial-to-color":[{"mask-radial-to":u()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":I()}],"mask-image-conic-pos":[{"mask-conic":[b]}],"mask-image-conic-from-pos":[{"mask-conic-from":M()}],"mask-image-conic-to-pos":[{"mask-conic-to":M()}],"mask-image-conic-from-color":[{"mask-conic-from":u()}],"mask-image-conic-to-color":[{"mask-conic-to":u()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:ue()}],"mask-repeat":[{mask:me()}],"mask-size":[{mask:fe()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",i,s]}],filter:[{filter:["","none",i,s]}],blur:[{blur:ge()}],brightness:[{brightness:[b,i,s]}],contrast:[{contrast:[b,i,s]}],"drop-shadow":[{"drop-shadow":["","none",G,te,ee]}],"drop-shadow-color":[{"drop-shadow":u()}],grayscale:[{grayscale:["",b,i,s]}],"hue-rotate":[{"hue-rotate":[b,i,s]}],invert:[{invert:["",b,i,s]}],saturate:[{saturate:[b,i,s]}],sepia:[{sepia:["",b,i,s]}],"backdrop-filter":[{"backdrop-filter":["","none",i,s]}],"backdrop-blur":[{"backdrop-blur":ge()}],"backdrop-brightness":[{"backdrop-brightness":[b,i,s]}],"backdrop-contrast":[{"backdrop-contrast":[b,i,s]}],"backdrop-grayscale":[{"backdrop-grayscale":["",b,i,s]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[b,i,s]}],"backdrop-invert":[{"backdrop-invert":["",b,i,s]}],"backdrop-opacity":[{"backdrop-opacity":[b,i,s]}],"backdrop-saturate":[{"backdrop-saturate":[b,i,s]}],"backdrop-sepia":[{"backdrop-sepia":["",b,i,s]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":c()}],"border-spacing-x":[{"border-spacing-x":c()}],"border-spacing-y":[{"border-spacing-y":c()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",i,s]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[b,"initial",i,s]}],ease:[{ease:["linear","initial",E,i,s]}],delay:[{delay:[b,i,s]}],animate:[{animate:["none",l,i,s]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[z,i,s]}],"perspective-origin":[{"perspective-origin":S()}],rotate:[{rotate:J()}],"rotate-x":[{"rotate-x":J()}],"rotate-y":[{"rotate-y":J()}],"rotate-z":[{"rotate-z":J()}],scale:[{scale:K()}],"scale-x":[{"scale-x":K()}],"scale-y":[{"scale-y":K()}],"scale-z":[{"scale-z":K()}],"scale-3d":["scale-3d"],skew:[{skew:oe()}],"skew-x":[{"skew-x":oe()}],"skew-y":[{"skew-y":oe()}],transform:[{transform:[i,s,"","none","gpu","cpu"]}],"transform-origin":[{origin:S()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:Q()}],"translate-x":[{"translate-x":Q()}],"translate-y":[{"translate-y":Q()}],"translate-z":[{"translate-z":Q()}],"translate-none":["translate-none"],accent:[{accent:u()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:u()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",i,s]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":c()}],"scroll-mx":[{"scroll-mx":c()}],"scroll-my":[{"scroll-my":c()}],"scroll-ms":[{"scroll-ms":c()}],"scroll-me":[{"scroll-me":c()}],"scroll-mt":[{"scroll-mt":c()}],"scroll-mr":[{"scroll-mr":c()}],"scroll-mb":[{"scroll-mb":c()}],"scroll-ml":[{"scroll-ml":c()}],"scroll-p":[{"scroll-p":c()}],"scroll-px":[{"scroll-px":c()}],"scroll-py":[{"scroll-py":c()}],"scroll-ps":[{"scroll-ps":c()}],"scroll-pe":[{"scroll-pe":c()}],"scroll-pt":[{"scroll-pt":c()}],"scroll-pr":[{"scroll-pr":c()}],"scroll-pb":[{"scroll-pb":c()}],"scroll-pl":[{"scroll-pl":c()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",i,s]}],fill:[{fill:["none",...u()]}],"stroke-w":[{stroke:[b,H,q,se]}],stroke:[{stroke:["none",...u()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}},At=at(kt);function Et(...e){return At(Ze(e))}const It={key:0,class:"flex size-full items-center justify-center text-2xl font-bold text-primary/50"},St=Ne({__name:"LiquidLogo",props:{class:{},imageUrl:{},patternScale:{default:2},refraction:{default:.015},edge:{default:.4},patternBlur:{default:.005},liquid:{default:.07},speed:{default:.3}},setup(e){const a=e,o=Z(null),t=Z(null),n=Z({}),f=Z(0),p=Z(0),v=Z(null),r=Z(!1);let m,_;Le(async()=>{r.value=!0,await B(),O(),L(),_=await E(),r.value=!1,window.addEventListener("resize",z),z(),k()}),Ue(()=>{window.removeEventListener("resize",z),cancelAnimationFrame(m),_&&_()});function L(){!t.value||!n.value||(t.value.uniform1f(n.value.u_edge,a.edge),t.value.uniform1f(n.value.u_patternBlur,a.patternBlur),t.value.uniform1f(n.value.u_time,0),t.value.uniform1f(n.value.u_patternScale,a.patternScale),t.value.uniform1f(n.value.u_refraction,a.refraction),t.value.uniform1f(n.value.u_liquid,a.liquid))}function O(){const l=v.value,d=l?.getContext("webgl2",{antialias:!0,alpha:!0});if(!l||!d)return;d.enable(d.BLEND),d.blendFunc(d.SRC_ALPHA,d.ONE_MINUS_SRC_ALPHA);function I(y,C,R){const T=y.createShader(R);return T?(y.shaderSource(T,C),y.compileShader(T),y.getShaderParameter(T,y.COMPILE_STATUS)?T:(y.deleteShader(T),null)):null}const S=I(d,Xe,d.VERTEX_SHADER),U=I(d,Oe,d.FRAGMENT_SHADER),P=d.createProgram();if(!P||!S||!U)return;if(d.attachShader(P,S),d.attachShader(P,U),d.linkProgram(P),!d.getProgramParameter(P,d.LINK_STATUS))return null;function c(y,C){let R={},T=C.getProgramParameter(y,C.ACTIVE_UNIFORMS);for(let D=0;D<T;D++){let u=C.getActiveUniform(y,D)?.name;u&&(R[u]=C.getUniformLocation(y,u))}return R}const g=c(P,d);n.value=g;const h=new Float32Array([-1,-1,1,-1,-1,1,1,1]),w=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,w),d.bufferData(d.ARRAY_BUFFER,h,d.STATIC_DRAW),d.useProgram(P);const x=d.getAttribLocation(P,"a_position");d.enableVertexAttribArray(x),d.bindBuffer(d.ARRAY_BUFFER,w),d.vertexAttribPointer(x,2,d.FLOAT,!1,0,0),t.value=d}function G(l){const d=l-p.value;p.value=l,f.value+=d*a.speed,t.value.uniform1f(n.value.u_time,f.value),t.value.drawArrays(t.value.TRIANGLE_STRIP,0,4),m=requestAnimationFrame(G)}function k(){return p.value=performance.now(),m=requestAnimationFrame(G),()=>{cancelAnimationFrame(m)}}function z(){const l=v.value,d=t.value;if(!l||!d||!n.value)return;const I=o.value?o.value.width/o.value.height:1;d.uniform1f(n.value.u_img_ratio,I);const S=1e3;l.width=S*devicePixelRatio,l.height=S*devicePixelRatio,d.viewport(0,0,l.height,l.height),d.uniform1f(n.value.u_ratio,1),d.uniform1f(n.value.u_img_ratio,I)}async function B(){try{const{imageData:l}=await Ve(a.imageUrl);o.value=l}catch{}}async function E(){const l=t.value;if(!l||!n.value||!o.value)return;const d=l.getParameter(l.TEXTURE_BINDING_2D);d&&l.deleteTexture(d);const I=l.createTexture();l.activeTexture(l.TEXTURE0),l.bindTexture(l.TEXTURE_2D,I),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE),l.pixelStorei(l.UNPACK_ALIGNMENT,1);try{l.texImage2D(l.TEXTURE_2D,0,l.RGBA,o.value.width,o.value.height,0,l.RGBA,l.UNSIGNED_BYTE,o.value.data),l.uniform1i(n.value.u_image_texture,0)}catch{}return()=>{I&&l.deleteTexture(I)}}return Ge(()=>[a.edge,a.patternBlur,a.patternScale,a.refraction,a.liquid],L),(l,d)=>(he(),be(De,null,[ae(r)?(he(),be("div",It,[...d[0]||(d[0]=[ve("span",null," loading... ",-1)])])):Fe("",!0),ve("canvas",{ref_key:"liquidLogoRef",ref:v,class:Be(ae(Et)("block size-full object-contain",a.class,{hidden:ae(r)}))},null,2)],64))}}),Tt=Object.assign(St,{__name:"LiquidLogo"});export{Tt as default};
