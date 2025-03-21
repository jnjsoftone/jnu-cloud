import*as t from"dotenv";import o from"fs";import*as r from"path";t.config();let e="https://api.github.com",n=t=>Buffer.from(t).toString("base64"),i=t=>Buffer.from(t,"base64").toString("utf-8"),a=async(t,o,r,i="Update JSON file")=>{let a=`${e}/repos/${r.owner}/${r.repo}/contents/${t}`;console.log(`@@@@ uploadJsonToGithub srcUrl: ${a}`);try{let t;try{let o=await fetch(a,{headers:{Authorization:`token ${r.token}`,"Content-Type":"application/json"}});o.ok&&(t=(await o.json()).sha)}catch(t){}let e=await fetch(a,{method:"PUT",headers:{Authorization:`token ${r.token}`,"Content-Type":"application/json"},body:JSON.stringify({message:i,content:n(JSON.stringify(o,null,2)),sha:t})});if(!e.ok)throw Error(`GitHub API error: ${e.statusText}`);return await e.json()}catch(t){throw console.error("Error uploading to GitHub:",t),t}},s=async(t,o)=>{try{let r=await fetch(`${e}/repos/${o.owner}/${o.repo}/contents/${t}`,{headers:{Authorization:`token ${o.token}`,"Content-Type":"application/json"}});if(!r.ok)throw Error(`GitHub API error: ${r.statusText}`);let n=await r.json(),a=i(n.content);return JSON.parse(a)}catch(t){throw console.error("Error reading from GitHub:",t),t}},l=async(t="",o)=>{try{let r=await fetch(`${e}/repos/${o.owner}/${o.repo}/contents/${t}`,{headers:{Authorization:`token ${o.token}`,"Content-Type":"application/json"}});if(!r.ok)throw Error(`GitHub API error: ${r.statusText}`);return(await r.json()).filter(t=>"file"===t.type)}catch(t){throw console.error("Error listing files from GitHub:",t),t}},c=async(t,o,r="Delete file")=>{try{let n=await fetch(`${e}/repos/${o.owner}/${o.repo}/contents/${t}`,{headers:{Authorization:`token ${o.token}`,"Content-Type":"application/json"}});if(!n.ok)throw Error(`GitHub API error: ${n.statusText}`);let i=await n.json(),a=await fetch(`${e}/repos/${o.owner}/${o.repo}/contents/${t}`,{method:"DELETE",headers:{Authorization:`token ${o.token}`,"Content-Type":"application/json"},body:JSON.stringify({message:r,sha:i.sha})});if(!a.ok)throw Error(`GitHub API error: ${a.statusText}`);return await a.json()}catch(t){throw console.error("Error deleting file from GitHub:",t),t}},p=async(t,n,i)=>{try{o.existsSync(n)||o.mkdirSync(n,{recursive:!0});let a=async s=>{let l=`${e}/repos/${i.owner}/${i.repo}/contents/${s}`;console.log(`copyFolderToLocal srcUrl: ${l}`);let c=await fetch(l,{headers:{Authorization:`token ${i.token}`,"Content-Type":"application/json"}});if(!c.ok)throw Error(`GitHub API error: ${c.statusText}`);for(let e of(await c.json())){let i=r.join(n,e.path.replace(t,""));if("dir"===e.type)o.existsSync(i)||o.mkdirSync(i,{recursive:!0}),await a(e.path);else if("file"===e.type){let t=await fetch(e.download_url);if(!t.ok)throw Error(`Failed to download file: ${e.path}`);let r=await t.arrayBuffer();o.writeFileSync(i,Buffer.from(r))}}};await a(t),console.log(`Successfully copied GitHub folder '${t}' to local folder '${n}'`)}catch(t){throw console.error("Error copying folder from GitHub:",t),t}};export{a as uploadJsonToGithub,s as readJsonFromGithub,l as listFilesInDirectory,c as deleteFileFromGithub,p as copyFolderToLocal};