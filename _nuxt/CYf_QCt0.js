import{c as z}from"./BGeKnM1B.js";import{d as G,r as A,o as O,b as k,I as V,c as X,i as Z,e as H,g as q,Q as D,n as W,F as Y}from"./B9AvWg9F.js";const K=`#version 300 es
precision mediump float;

in vec2 a_position;
out vec2 vUv;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`,j=`#version 300 es
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
`;function Q(U){const s=document.createElement("canvas"),m=s.getContext("2d");return new Promise((_,c)=>{if(!U||!m){c(new Error("Invalid image URL or context"));return}const h=new Image;h.crossOrigin="anonymous",h.onload=function(){let r=h.naturalWidth,a=h.naturalHeight;(r>1e3||a>1e3||r<500||a<500)&&(r>a?r>1e3?(a=Math.round(a*1e3/r),r=1e3):r<500&&(a=Math.round(a*500/r),r=500):a>1e3?(r=Math.round(r*1e3/a),a=1e3):a<500&&(r=Math.round(r*500/a),a=500)),s.width=r,s.height=a;const y=document.createElement("canvas");y.width=r,y.height=a;const S=y.getContext("2d");S.drawImage(h,0,0,r,a);const I=S.getImageData(0,0,r,a).data,E=new Array(r*a).fill(!1);for(let o=0;o<a;o++)for(let i=0;i<r;i++){const n=(o*r+i)*4,u=I[n],l=I[n+1],f=I[n+2],p=I[n+3];E[o*r+i]=!(u===255&&l===255&&f===255&&p===255||p===0)}function R(o,i){return o<0||o>=r||i<0||i>=a?!1:E[i*r+o]}const P=new Array(r*a).fill(!1);for(let o=0;o<a;o++)for(let i=0;i<r;i++){const n=o*r+i;if(!E[n])continue;let u=!1;for(let l=o-1;l<=o+1&&!u;l++)for(let f=i-1;f<=i+1&&!u;f++)R(f,l)||(u=!0);u&&(P[n]=!0)}const x=new Float32Array(r*a).fill(0),e=new Float32Array(r*a).fill(0),t=.01,v=300;function g(o,i,n){return o<0||o>=r||i<0||i>=a||!E[i*r+o]?0:n[i*r+o]}for(let o=0;o<v;o++){for(let i=0;i<a;i++)for(let n=0;n<r;n++){const u=i*r+n;if(!E[u]||P[u]){e[u]=0;continue}const l=g(n+1,i,x)+g(n-1,i,x)+g(n,i+1,x)+g(n,i-1,x);e[u]=(t+l)/4}x.set(e)}let T=0;for(let o=0;o<r*a;o++)x[o]>T&&(T=x[o]);const b=2,d=m.createImageData(r,a);for(let o=0;o<a;o++)for(let i=0;i<r;i++){const n=o*r+i,u=n*4;if(!E[n])d.data[u]=255,d.data[u+1]=255,d.data[u+2]=255,d.data[u+3]=255;else{const l=x[n]/T,p=255*(1-Math.pow(l,b));d.data[u]=p,d.data[u+1]=p,d.data[u+2]=p,d.data[u+3]=255}}m.putImageData(d,0,0),s.toBlob(o=>{if(!o){c(new Error("Failed to create PNG blob"));return}_({imageData:d,pngBlob:o})},"image/png")},h.onerror=()=>c(new Error("Failed to load image")),h.src=U})}const J={key:0,class:"flex size-full items-center justify-center text-2xl font-bold text-primary/50"},$=G({__name:"LiquidLogo",props:{class:{},imageUrl:{},patternScale:{default:2},refraction:{default:.015},edge:{default:.4},patternBlur:{default:.005},liquid:{default:.07},speed:{default:.3}},setup(U){const s=U,m=A(null),_=A(null),c=A({}),h=A(0),M=A(0),N=A(null),r=A(!1);let a,y;O(async()=>{r.value=!0,await P(),B(),S(),y=await x(),r.value=!1,window.addEventListener("resize",R),R(),E()}),k(()=>{window.removeEventListener("resize",R),cancelAnimationFrame(a),y&&y()});function S(){!_.value||!c.value||(_.value.uniform1f(c.value.u_edge,s.edge),_.value.uniform1f(c.value.u_patternBlur,s.patternBlur),_.value.uniform1f(c.value.u_time,0),_.value.uniform1f(c.value.u_patternScale,s.patternScale),_.value.uniform1f(c.value.u_refraction,s.refraction),_.value.uniform1f(c.value.u_liquid,s.liquid))}function B(){const e=N.value,t=e==null?void 0:e.getContext("webgl2",{antialias:!0,alpha:!0});if(!e||!t)return;t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA);function v(l,f,p){const w=l.createShader(p);return w?(l.shaderSource(w,f),l.compileShader(w),l.getShaderParameter(w,l.COMPILE_STATUS)?w:(l.deleteShader(w),null)):null}const g=v(t,K,t.VERTEX_SHADER),T=v(t,j,t.FRAGMENT_SHADER),b=t.createProgram();if(!b||!g||!T)return;if(t.attachShader(b,g),t.attachShader(b,T),t.linkProgram(b),!t.getProgramParameter(b,t.LINK_STATUS))return null;function d(l,f){var F;let p={},w=f.getProgramParameter(l,f.ACTIVE_UNIFORMS);for(let L=0;L<w;L++){let C=(F=f.getActiveUniform(l,L))==null?void 0:F.name;C&&(p[C]=f.getUniformLocation(l,C))}return p}const o=d(b,t);c.value=o;const i=new Float32Array([-1,-1,1,-1,-1,1,1,1]),n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW),t.useProgram(b);const u=t.getAttribLocation(b,"a_position");t.enableVertexAttribArray(u),t.bindBuffer(t.ARRAY_BUFFER,n),t.vertexAttribPointer(u,2,t.FLOAT,!1,0,0),_.value=t}function I(e){const t=e-M.value;M.value=e,h.value+=t*s.speed,_.value.uniform1f(c.value.u_time,h.value),_.value.drawArrays(_.value.TRIANGLE_STRIP,0,4),a=requestAnimationFrame(I)}function E(){return M.value=performance.now(),a=requestAnimationFrame(I),()=>{cancelAnimationFrame(a)}}function R(){const e=N.value,t=_.value;if(!e||!t||!c.value)return;const v=m.value?m.value.width/m.value.height:1;t.uniform1f(c.value.u_img_ratio,v);const g=1e3;e.width=g*devicePixelRatio,e.height=g*devicePixelRatio,t.viewport(0,0,e.height,e.height),t.uniform1f(c.value.u_ratio,1),t.uniform1f(c.value.u_img_ratio,v)}async function P(){try{const{imageData:e}=await Q(s.imageUrl);m.value=e}catch{}}async function x(){const e=_.value;if(!e||!c.value||!m.value)return;const t=e.getParameter(e.TEXTURE_BINDING_2D);t&&e.deleteTexture(t);const v=e.createTexture();e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,v),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_ALIGNMENT,1);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,m.value.width,m.value.height,0,e.RGBA,e.UNSIGNED_BYTE,m.value.data),e.uniform1i(c.value.u_image_texture,0)}catch{}return()=>{v&&e.deleteTexture(v)}}return V(()=>[s.edge,s.patternBlur,s.patternScale,s.refraction,s.liquid],S),(e,t)=>(Z(),X(Y,null,[D(r)?(Z(),X("div",J,t[0]||(t[0]=[q("span",null," Context... ",-1)]))):H("",!0),q("canvas",{ref_key:"liquidLogoRef",ref:N,class:W(D(z)("block size-full object-contain",s.class,{hidden:D(r)}))},null,2)],64))}}),re=Object.assign($,{__name:"LiquidLogo"});export{re as default};
