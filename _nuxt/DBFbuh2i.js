import{c as B}from"./jAU0Cazi.js";import{a as O,c as h,o as G,e as H,J as W,f as P,k,g as Y,i as C,R as D,n as X,F as j,a3 as K,h as z,w as J}from"./DMX8xsdO.js";import{_ as Q}from"./DlAUqK2U.js";const ee=`#version 300 es
precision mediump float;

in vec2 a_position;
out vec2 vUv;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`,te=`#version 300 es
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
`;function ae(S){const i=document.createElement("canvas"),f=i.getContext("2d");return new Promise((u,l)=>{if(!S||!f){l(new Error("Invalid image URL or context"));return}const d=new Image;d.crossOrigin="anonymous",d.onload=function(){let t=d.naturalWidth,r=d.naturalHeight;(t>1e3||r>1e3||t<500||r<500)&&(t>r?t>1e3?(r=Math.round(r*1e3/t),t=1e3):t<500&&(r=Math.round(r*500/t),t=500):r>1e3?(t=Math.round(t*1e3/r),r=1e3):r<500&&(t=Math.round(t*500/r),r=500)),i.width=t,i.height=r;const A=document.createElement("canvas");A.width=t,A.height=r;const R=A.getContext("2d");R.drawImage(d,0,0,t,r);const _=R.getImageData(0,0,t,r).data,v=new Array(t*r).fill(!1);for(let o=0;o<r;o++)for(let n=0;n<t;n++){const c=(o*t+n)*4,s=_[c],m=_[c+1],x=_[c+2],E=_[c+3];v[o*t+n]=!(s===255&&m===255&&x===255&&E===255||E===0)}function L(o,n){return o<0||o>=t||n<0||n>=r?!1:v[n*t+o]}const F=new Array(t*r).fill(!1);for(let o=0;o<r;o++)for(let n=0;n<t;n++){const c=o*t+n;if(!v[c])continue;let s=!1;for(let m=o-1;m<=o+1&&!s;m++)for(let x=n-1;x<=n+1&&!s;x++)L(x,m)||(s=!0);s&&(F[c]=!0)}const T=new Float32Array(t*r).fill(0),e=new Float32Array(t*r).fill(0),a=.01,w=300;function y(o,n,c){return o<0||o>=t||n<0||n>=r||!v[n*t+o]?0:c[n*t+o]}for(let o=0;o<w;o++){for(let n=0;n<r;n++)for(let c=0;c<t;c++){const s=n*t+c;if(!v[s]||F[s]){e[s]=0;continue}const m=y(c+1,n,T)+y(c-1,n,T)+y(c,n+1,T)+y(c,n-1,T);e[s]=(a+m)/4}T.set(e)}let U=0;for(let o=0;o<t*r;o++)T[o]>U&&(U=T[o]);const I=2,b=f.createImageData(t,r);for(let o=0;o<r;o++)for(let n=0;n<t;n++){const c=o*t+n,s=c*4;if(!v[c])b.data[s]=255,b.data[s+1]=255,b.data[s+2]=255,b.data[s+3]=255;else{const m=T[c]/U,E=255*(1-Math.pow(m,I));b.data[s]=E,b.data[s+1]=E,b.data[s+2]=E,b.data[s+3]=255}}f.putImageData(b,0,0),i.toBlob(o=>{if(!o){l(new Error("Failed to create PNG blob"));return}u({imageData:b,pngBlob:o})},"image/png")},d.onerror=()=>l(new Error("Failed to load image")),d.src=S})}const re={key:0,class:"flex size-full items-center justify-center text-2xl font-bold text-primary/50"},oe=O({__name:"LiquidLogo",props:{class:{},imageUrl:{},patternScale:{default:2},refraction:{default:.015},edge:{default:.4},patternBlur:{default:.005},liquid:{default:.07},speed:{default:.3}},setup(S){const i=S,f=h(null),u=h(null),l=h({}),d=h(0),g=h(0),p=h(null),t=h(!1);let r,A;G(async()=>{t.value=!0,await F(),N(),R(),A=await T(),t.value=!1,window.addEventListener("resize",L),L(),v()}),H(()=>{window.removeEventListener("resize",L),cancelAnimationFrame(r),A&&A()});function R(){!u.value||!l.value||(u.value.uniform1f(l.value.u_edge,i.edge),u.value.uniform1f(l.value.u_patternBlur,i.patternBlur),u.value.uniform1f(l.value.u_time,0),u.value.uniform1f(l.value.u_patternScale,i.patternScale),u.value.uniform1f(l.value.u_refraction,i.refraction),u.value.uniform1f(l.value.u_liquid,i.liquid))}function N(){const e=p.value,a=e==null?void 0:e.getContext("webgl2",{antialias:!0,alpha:!0});if(!e||!a)return;a.enable(a.BLEND),a.blendFunc(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA);function w(m,x,E){const M=m.createShader(E);return M?(m.shaderSource(M,x),m.compileShader(M),m.getShaderParameter(M,m.COMPILE_STATUS)?M:(m.deleteShader(M),null)):null}const y=w(a,ee,a.VERTEX_SHADER),U=w(a,te,a.FRAGMENT_SHADER),I=a.createProgram();if(!I||!y||!U)return;if(a.attachShader(I,y),a.attachShader(I,U),a.linkProgram(I),!a.getProgramParameter(I,a.LINK_STATUS))return null;function b(m,x){var V;let E={},M=x.getProgramParameter(m,x.ACTIVE_UNIFORMS);for(let Z=0;Z<M;Z++){let q=(V=x.getActiveUniform(m,Z))==null?void 0:V.name;q&&(E[q]=x.getUniformLocation(m,q))}return E}const o=b(I,a);l.value=o;const n=new Float32Array([-1,-1,1,-1,-1,1,1,1]),c=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,c),a.bufferData(a.ARRAY_BUFFER,n,a.STATIC_DRAW),a.useProgram(I);const s=a.getAttribLocation(I,"a_position");a.enableVertexAttribArray(s),a.bindBuffer(a.ARRAY_BUFFER,c),a.vertexAttribPointer(s,2,a.FLOAT,!1,0,0),u.value=a}function _(e){const a=e-g.value;g.value=e,d.value+=a*i.speed,u.value.uniform1f(l.value.u_time,d.value),u.value.drawArrays(u.value.TRIANGLE_STRIP,0,4),r=requestAnimationFrame(_)}function v(){return g.value=performance.now(),r=requestAnimationFrame(_),()=>{cancelAnimationFrame(r)}}function L(){const e=p.value,a=u.value;if(!e||!a||!l.value)return;const w=f.value?f.value.width/f.value.height:1;a.uniform1f(l.value.u_img_ratio,w);const y=1e3;e.width=y*devicePixelRatio,e.height=y*devicePixelRatio,a.viewport(0,0,e.height,e.height),a.uniform1f(l.value.u_ratio,1),a.uniform1f(l.value.u_img_ratio,w)}async function F(){try{const{imageData:e}=await ae(i.imageUrl);f.value=e}catch{}}async function T(){const e=u.value;if(!e||!l.value||!f.value)return;const a=e.getParameter(e.TEXTURE_BINDING_2D);a&&e.deleteTexture(a);const w=e.createTexture();e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,w),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_ALIGNMENT,1);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,f.value.width,f.value.height,0,e.RGBA,e.UNSIGNED_BYTE,f.value.data),e.uniform1i(l.value.u_image_texture,0)}catch{}return()=>{w&&e.deleteTexture(w)}}return W(()=>[i.edge,i.patternBlur,i.patternScale,i.refraction,i.liquid],R),(e,a)=>(k(),P(j,null,[D(t)?(k(),P("div",re,a[0]||(a[0]=[C("span",null," Context... ",-1)]))):Y("",!0),C("canvas",{ref_key:"liquidLogoRef",ref:p,class:X(D(B)("block size-full object-contain",i.class,{hidden:D(t)}))},null,2)],64))}}),ie=Object.assign(oe,{__name:"LiquidLogo"}),$="absolute inset-x-0 top-0 m-auto inline-block w-full",ne=O({__name:"MorphingText",props:{class:{},texts:{},morphTime:{default:1.5},coolDownTime:{default:.5}},setup(S){const i=S,f=h(0),u=h(0),l=h(0),d=h(new Date),g=h(),p=h();function t(_){if(!g.value||!p.value)return;p.value.style.filter=`blur(${Math.min(8/_-8,100)}px)`,p.value.style.opacity=`${Math.pow(_,.4)*100}%`;const v=1-_;g.value.style.filter=`blur(${Math.min(8/v-8,100)}px)`,g.value.style.opacity=`${Math.pow(v,.4)*100}%`,g.value.textContent=i.texts[f.value%i.texts.length],p.value.textContent=i.texts[(f.value+1)%i.texts.length]}function r(){u.value-=l.value,l.value=0;let _=u.value/i.morphTime;_>1&&(l.value=i.coolDownTime,_=1),t(_),_===1&&f.value++}function A(){u.value=0,g.value&&p.value&&(p.value.style.filter="none",p.value.style.opacity="100%",g.value.style.filter="none",g.value.style.opacity="0%")}let R=0;function N(){R=requestAnimationFrame(N);const _=new Date,v=(_.getTime()-d.value.getTime())/1e3;d.value=_,l.value-=v,l.value<=0?r():A()}return G(()=>{N()}),H(()=>{cancelAnimationFrame(R)}),(_,v)=>(k(),P("div",{class:X(D(B)("relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] md:h-24 lg:text-[6rem]",i.class))},[C("span",{ref_key:"text1Ref",ref:g,class:X(D(B)($))},null,2),C("span",{ref_key:"text2Ref",ref:p,class:X(D(B)($))},null,2),v[0]||(v[0]=C("svg",{id:"filters",class:"fixed size-0",preserveAspectRatio:"xMidYMid slice"},[C("defs",null,[C("filter",{id:"threshold"},[C("feColorMatrix",{in:"SourceGraphic",type:"matrix",values:`1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140`})])])],-1))],2))}}),le=Object.assign(ne,{__name:"MorphingText"}),ue=Symbol.for("nuxt:client-only"),ce=O({name:"ClientOnly",inheritAttrs:!1,props:["fallback","placeholder","placeholderTag","fallbackTag"],setup(S,{slots:i,attrs:f}){const u=h(!1);return G(()=>{u.value=!0}),K(ue,!0),l=>{var t;if(u.value)return(t=i.default)==null?void 0:t.call(i);const d=i.fallback||i.placeholder;if(d)return d();const g=l.fallback||l.placeholder||"",p=l.fallbackTag||l.placeholderTag||"span";return P(p,f,g)}}}),se={},fe={class:"flex flex-col h-72 max-w-[950px] items-center justify-center"};function _e(S,i){const f=ie,u=le,l=ce;return k(),P("div",fe,[z(f,{class:"translate-x-5","image-url":"/cxl-icon.svg"}),z(l,null,{default:J(()=>[z(u,{texts:["Labs","Context"]})]),_:1})])}const ge=Q(se,[["render",_e]]);export{ge as default};
