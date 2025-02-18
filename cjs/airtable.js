"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(exports,{getBase:function(){return a},initAirtable:function(){return i},insert:function(){return n},remove:function(){return d},replace:function(){return o},selectAll:function(){return l},selectOne:function(){return s},update:function(){return f},upsert:function(){return u}});const t=(e=require("airtable"))&&e.__esModule?e:{default:e};let r=null;const i=e=>r=new t.default({apiKey:e.apiKey}).base(e.baseId),a=()=>{if(!r)throw Error("Airtable base is not initialized");return r},l=async(e,t={})=>{let r=[],i=a()(e);return await i.select({view:t.view,maxRecords:t.maxRecords,pageSize:t.pageSize,sort:t.sort,filterByFormula:t.filterByFormula,fields:t.fields}).eachPage((e,t)=>{r.push(...e.map(e=>({id:e.id,fields:e.fields}))),t()}),r},s=async(e,t)=>{let r=await a()(e).find(t);return{id:r.id,fields:r.fields}},n=async(e,t)=>{let r=a()(e),i=Array.isArray(t)?t:[t],l=[];for(let e=0;e<i.length;e+=10)l.push(i.slice(e,e+10));let s=[];for(let e of l){let t=await r.create(e.map(e=>({fields:e.fields})));s.push(...t.map(e=>({id:e.id,fields:e.fields})))}return s},f=async(e,t)=>{let r=a()(e),i=Array.isArray(t)?t:[t],l=[];for(let e=0;e<i.length;e+=10)l.push(i.slice(e,e+10));let s=[];for(let e of l){let t=e.map(e=>({id:e.id,fields:e.fields})),i=await r.update(t);s.push(...i.map(e=>({id:e.id,fields:e.fields})))}return s},d=async(e,t)=>{let r=a()(e),i=Array.isArray(t)?t:[t],l=[];for(let e=0;e<i.length;e+=10)l.push(i.slice(e,e+10));let s=[];for(let e of l){let t=await r.destroy(e);s.push(...t.map(e=>({id:e.id,fields:e.fields})))}return s},u=async(e,t,r)=>{let i=Array.isArray(t)?t:[t],a=i.map(e=>`{${String(r)}} = '${e.fields[r]}'`),s=`OR(${a.join(",")})`,d=new Map((await l(e,{filterByFormula:s})).map(e=>[e.fields[r],e])),u=[],o=[];for(let e of i){let t=d.get(e.fields[r]);t?u.push({id:t.id,fields:{...e.fields}}):o.push({fields:e.fields})}return[...u.length>0?await f(e,u):[],...o.length>0?await n(e,o):[]]},o=async(e,t)=>{a()(e);let r=Array.isArray(t)?t:[t],i=await l(e);return i.length>0&&await d(e,i.map(e=>e.id)),await n(e,r)};