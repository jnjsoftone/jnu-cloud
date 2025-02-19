import { saveFile, loadFile } from 'jnu-abc';
import { select, initSupabase, sqlCreateTable } from '../esm/supabase.js';
import {
  schema as googleAccountsSchema,
  permissions as googleAccountsPermissions,
} from '../data/tables/google_accounts.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// console.log(supabaseUrl, supabaseKey);

// const main = async () => {
//   // Supabase 초기화
//   initSupabase({
//     url: supabaseUrl,
//     anonKey: supabaseKey,
//   });

//   try {
//     // 테이블 생성
//     const sql = sqlCreateTable(googleAccountsSchema, googleAccountsPermissions);
//     console.log(sql);
//     saveFile('../data/tables/google_accounts.sql', sql.join('\n'));
//     // console.log('Google 계정 테이블이 성공적으로 생성되었습니다.');
//   } catch (error) {
//     console.error('테이블 생성 중 오류가 발생했습니다:', error);
//   }
// };

const main = async () => {
  initSupabase({
    url: supabaseUrl,
    anonKey: supabaseKey,
  });

  const data = await select('github_accounts');
  console.log(data);
};

main();
