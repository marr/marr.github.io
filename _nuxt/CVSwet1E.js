import{d as n,G as o,O as c,Q as a,a2 as h,i as m,v as p,a3 as g,p as l,m as u}from"./CQG33X_H.js";const d="img",f=n({__name:"ProseImg",props:{src:{type:String,default:""},alt:{type:String,default:""},width:{type:[String,Number],default:void 0},height:{type:[String,Number],default:void 0}},setup(r){const t=r,i=o(()=>{var s;if((s=t.src)!=null&&s.startsWith("/")&&!t.src.startsWith("//")){const e=p(g(l().app.baseURL));if(e!=="/"&&!t.src.startsWith(e))return u(e,t.src)}return t.src});return(s,e)=>(m(),c(h(a(d)),{src:a(i),alt:t.alt,width:t.width,height:t.height},null,8,["src","alt","width","height"]))}}),S=Object.assign(f,{__name:"ProseImg"});export{S as default};
