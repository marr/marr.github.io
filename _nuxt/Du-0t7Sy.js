//# allFunctionsCalledOnLoad
import{An as e,ln as t}from"#entry";function n(e){return(e.endsWith(`/`)&&e.length>1?e.slice(0,-1):e)||`/`}function r(){let r=t();return e(()=>n(r.path))}export{r as t};