import { loadJson } from 'jnu-abc';
import { createNotionClient, retrieveDatabase } from '../esm/notion.js';
const devRoot = process.env.DEV_ROOT || './config';
const settingFile = devRoot + '/jd-environments/Apis/notion/monblue_0.json';

const setting = loadJson(settingFile);

console.log(setting);

const client = createNotionClient({ auth: setting.token });

// 데이터베이스 생성 예시
// const database = await createDatabase(client, {
//   parent: { page_id: 'your-page-id' },
//   title: [{ text: { content: '새로운 데이터베이스' } }],
//   properties: {
//     Name: { title: {} }
//   }
// })

// 기본 형식으로 조회
// const normalData = await retrieveDatabase(client, 'a71157c311c441e5bf1950d54a5f724f');

// 평탄화된 형식으로 조회
const flattenData = await retrieveDatabase(client, 'a71157c311c441e5bf1950d54a5f724f', 'flatten');

console.log('Flatten Data:', flattenData);
