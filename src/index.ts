export {
  readJsonFromGithub,
  uploadJsonToGithub,
  listFilesInDirectory,
  deleteFileFromGithub,
  copyFolderToLocal,
} from './github.js';

export {
  createNotionClient,
  createDatabase,
  retrieveDatabase,
  updateDatabase,
  createPage,
  retrievePage,
  updatePage,
  retrieveBlock,
  updateBlock,
  deleteBlock,
  flatten,
  listDatabases,
} from './notion.js';

export {
  initSupabase,
  getSupabase,
  // Database
  select,
  selectOne,
  insert,
  update,
  remove,
  upsert,
  // Authentication
  signUp,
  signIn,
  signOut,
  getCurrentUser,
} from './supabase.js';

// export {
//     initAirtable,
//     getBase,
//     selectAll,
//     selectOne,
//     insert,
//     update,
//     remove,
//     upsert,
//     replace,
// } from './airtable.js';
