import{b as a}from"./index.6dcf94a8.js";var c={install:o=>{o.config.globalProperties.$copyText=t=>{if(!navigator.clipboard){const e=document.createElement("textarea");e.value=t,e.style.top="0",e.style.left="0",e.style.position="fixed",document.body.appendChild(e),e.focus(),e.select();try{return document.execCommand("copy"),document.body.removeChild(e),Promise.resolve()}catch(r){return document.body.removeChild(e),Promise.reject(r)}}return navigator.clipboard.writeText(t)}}},l=a(async({app:o})=>{o.use(c)});export{l as default};
