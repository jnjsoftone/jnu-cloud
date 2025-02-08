import{Client as e}from"@notionhq/client";let a=a=>new e(a),t=async(e,a)=>{try{return await e.databases.create(a)}catch(e){throw console.error("데이터베이스 생성 실패:",e),e}},r=async(e,a,t="normal")=>{try{let r=await e.databases.retrieve({database_id:a.replace(/^\//,"")});if("flatten"===t){let e={id:r.id,...b(r.properties,!0)};return"title"in r&&(e.title=r.title?.[0]?.plain_text||""),"created_time"in r&&(e.created_time=r.created_time),"last_edited_time"in r&&(e.last_edited_time=r.last_edited_time),"url"in r&&(e.url=r.url),"parent"in r&&r.parent&&("page_id"in r.parent&&(e.parent_id=r.parent.page_id),e.parent_type=r.parent.type),"created_by"in r&&r.created_by&&(e.created_by=r.created_by.id),"last_edited_by"in r&&r.last_edited_by&&(e.last_edited_by=r.last_edited_by.id),e}return r}catch(e){throw console.error("데이터베이스 조회 실패:",e),e}},i=async(e,a)=>{try{return await e.databases.update(a)}catch(e){throw console.error("데이터베이스 업데이트 실패:",e),e}},c=async(e,a)=>{try{return await e.pages.create(a)}catch(e){throw console.error("페이지 생성 실패:",e),e}},l=async(e,a)=>{try{return await e.pages.retrieve({page_id:a})}catch(e){throw console.error("페이지 조회 실패:",e),e}},s=async(e,a)=>{try{return await e.pages.update(a)}catch(e){throw console.error("페이지 업데이트 실패:",e),e}},n=async(e,a)=>{try{return await e.blocks.retrieve({block_id:a})}catch(e){throw console.error("블록 조회 실패:",e),e}},o=async(e,a)=>{try{return await e.blocks.update(a)}catch(e){throw console.error("블록 업데이트 실패:",e),e}},d=async(e,a)=>{try{return await e.blocks.delete({block_id:a})}catch(e){throw console.error("블록 삭제 실패:",e),e}},b=(e,a=!1)=>{let t={};return Object.entries(e).forEach(([e,r])=>{if(!r||!r.type){t[e]="";return}if(a){switch(r.type){case"select":t[e]=r.select?.options?.[0]?.name||"";break;case"multi_select":t[e]=r.multi_select?.options?.map(e=>e.name).join(", ")||"";break;case"relation":t[e]=r.relation?.database_id||"";break;case"rollup":t[e]=r.rollup?.function||"";break;case"formula":t[e]=r.formula?.expression||"";break;default:t[e]=r.type||""}return}switch(r.type){case"rich_text":t[e]=r.rich_text?.[0]?.plain_text||"";break;case"title":t[e]=r.title?.[0]?.plain_text||"";break;case"select":t[e]=r.select?.name||"";break;case"multi_select":t[e]=r.multi_select?.map(e=>e.name).join(", ")||"";break;case"number":t[e]=r.number??0;break;case"checkbox":t[e]=r.checkbox??!1;break;case"date":t[e]=r.date?.start||"";break;case"email":t[e]=r.email||"";break;case"phone_number":t[e]=r.phone_number||"";break;case"url":t[e]=r.url||"";break;case"files":t[e]=Array.isArray(r.files)?r.files.map(e=>e.name).join(", "):"";break;case"relation":t[e]=Array.isArray(r.relation)?r.relation.map(e=>e.id).join(", "):r.relation?.id||"";break;case"formula":t[e]=r.formula?.string||r.formula?.number?.toString()||r.formula?.boolean?.toString()||"";break;case"rollup":t[e]=Array.isArray(r.rollup?.array)?r.rollup.array.map(e=>e.title?.[0]?.plain_text||"").join(", "):"";break;case"people":t[e]=Array.isArray(r.people)?r.people.map(e=>e.name||e.id).join(", "):"";break;case"status":t[e]=r.status?.name||"";break;case"created_time":t[e]=r.created_time||"";break;case"created_by":t[e]=r.created_by?.name||r.created_by?.id||"";break;case"last_edited_time":t[e]=r.last_edited_time||"";break;case"last_edited_by":t[e]=r.last_edited_by?.name||r.last_edited_by?.id||"";break;default:t[e]=""}}),t};export{a as createNotionClient,t as createDatabase,r as retrieveDatabase,i as updateDatabase,c as createPage,l as retrievePage,s as updatePage,n as retrieveBlock,o as updateBlock,d as deleteBlock,b as flatten};