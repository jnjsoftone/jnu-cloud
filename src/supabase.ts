import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { loadJson, saveJson } from 'jnu-abc';

// & Types AREA
// &---------------------------------------------------------------------------
interface SupabaseConfig {
  url: string;
  anonKey: string;
  authKey?: string;
}

interface StorageOptions {
  upsert?: boolean;
  cacheControl?: string;
}

interface QueryOptions {
  page?: number;
  limit?: number;
  orderBy?: { column: string; ascending?: boolean };
  filters?: Array<{ column: string; operator: string; value: any }>;
}

interface GitHubAccount {
  id?: string;
  username: string;
  fullName: string;
  email: string;
  token: string;
  expired?: string;
  created_at?: string;
  updated_at?: string;
}

interface ColumnDefinition {
  name: string;
  type: string;
  primaryKey?: boolean;
  unique?: boolean;
  nullable?: boolean;
  defaultValue?: any;
  foreignKey?: {
    table: string;
    column: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION';
  };
  check?: string;
}

interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
  indexes?: {
    name: string;
    columns: string[];
    unique?: boolean;
  }[];
}

interface TablePermissions {
  select?: {
    enabled: boolean;
    roles: string[];
    condition?: string;
  };
  insert?: {
    enabled: boolean;
    roles: string[];
    condition?: string;
  };
  update?: {
    enabled: boolean;
    roles: string[];
    condition?: string;
  };
  delete?: {
    enabled: boolean;
    roles: string[];
    condition?: string;
  };
}

// & Variables AREA
// &---------------------------------------------------------------------------
let supabase: SupabaseClient | null = null;

// & Functions AREA
// &---------------------------------------------------------------------------
/**
 * Supabase 클라이언트 초기화
 */
const initSupabase = (config: SupabaseConfig) => {
  supabase = createClient(config.url, config.anonKey);
  return supabase;
};

/**
 * Supabase 클라이언트 가져오기
 */
const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  return supabase;
};

// * Database
/**
 * 데이터 조회
 */
const select = async (table: string, options: QueryOptions = {}) => {
  const { page = 1, limit = 10, orderBy, filters } = options;
  let query = getSupabase().from(table).select('*');

  // 필터 적용
  if (filters) {
    filters.forEach(({ column, operator, value }) => {
      query = query.filter(column, operator, value);
    });
  }

  // 정렬 적용
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
  }

  // 페이지네이션 적용
  if (page && limit) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    query = query.range(start, end);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * 단일 데이터 조회
 */
const selectOne = async (table: string, id: string | number) => {
  const { data, error } = await getSupabase().from(table).select('*').eq('id', id).single();

  if (error) throw error;
  return data;
};

/**
 * 데이터 삽입
 */
const insert = async (table: string, data: any) => {
  const { data: result, error } = await getSupabase().from(table).insert(data).select();

  if (error) throw error;
  return result;
};

/**
 * 데이터 수정
 */
const update = async (table: string, id: string | number, data: any) => {
  const { data: result, error } = await getSupabase().from(table).update(data).eq('id', id).select();

  if (error) throw error;
  return result;
};

/**
 * 데이터 삭제
 */
const remove = async (table: string, id: string | number) => {
  const { error } = await getSupabase().from(table).delete().eq('id', id);

  if (error) throw error;
  return true;
};

/**
 * 데이터 upsert (insert or update)
 */
const upsert = async (table: string, data: any, uniqueColumns: string[]) => {
  const { data: result, error } = await getSupabase()
    .from(table)
    .upsert(data, { onConflict: uniqueColumns.join(',') })
    .select();

  if (error) throw error;
  return result;
};

// * Authentication
/**
 * 이메일/비밀번호로 회원가입
 */
const signUp = async (email: string, password: string) => {
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * 이메일/비밀번호로 로그인
 */
const signIn = async (email: string, password: string) => {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * 로그아웃
 */
const signOut = async () => {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
  return true;
};

/**
 * 현재 사용자 정보 가져오기
 */
const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await getSupabase().auth.getUser();
  if (error) throw error;
  return user;
};

// * Storage
/**
 * 파일 업로드
 */
const uploadFile = async (bucket: string, path: string, file: File | Blob | Buffer, options: StorageOptions = {}) => {
  const { data, error } = await getSupabase()
    .storage.from(bucket)
    .upload(path, file, {
      upsert: options.upsert ?? false,
      cacheControl: options.cacheControl ?? '3600',
    });

  if (error) throw error;
  return data;
};

/**
 * 파일 다운로드
 */
const downloadFile = async (bucket: string, path: string) => {
  const { data, error } = await getSupabase().storage.from(bucket).download(path);

  if (error) throw error;
  return data;
};

/**
 * 파일 삭제
 */
const deleteFile = async (bucket: string, path: string) => {
  const { error } = await getSupabase().storage.from(bucket).remove([path]);

  if (error) throw error;
  return true;
};

/**
 * 파일 목록 조회
 */
const listFiles = async (bucket: string, path: string = '') => {
  const { data, error } = await getSupabase().storage.from(bucket).list(path);

  if (error) throw error;
  return data;
};

/**
 * JSON 파일 저장
 */
const saveJsonToStorage = async (bucket: string, path: string, data: any) => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  return await uploadFile(bucket, path, blob, { upsert: true });
};

/**
 * JSON 파일 로드
 */
const loadJsonFromStorage = async (bucket: string, path: string) => {
  const data = await downloadFile(bucket, path);
  const text = await data.text();
  return JSON.parse(text);
};

// * Realtime
/**
 * 실시간 구독
 */
const subscribe = (table: string, callback: (payload: any) => void) => {
  const subscription = getSupabase()
    .channel(`${table}-changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => callback(payload))
    .subscribe();

  return subscription;
};

// * GitHub Account Management
/**
 * GitHub 계정 목록 조회
 */
const getGitHubAccounts = async (options: QueryOptions = {}) => {
  return await select('github_accounts', options);
};

/**
 * GitHub 계정 단일 조회
 */
const getGitHubAccount = async (username: string) => {
  const { data, error } = await getSupabase().from('github_accounts').select('*').eq('username', username).single();

  if (error) throw error;
  return data as GitHubAccount;
};

/**
 * GitHub 계정 추가
 */
const createGitHubAccount = async (account: Omit<GitHubAccount, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await getSupabase()
    .from('github_accounts')
    .insert({
      ...account,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as GitHubAccount;
};

/**
 * GitHub 계정 수정
 */
const updateGitHubAccount = async (
  username: string,
  account: Partial<Omit<GitHubAccount, 'id' | 'username' | 'created_at' | 'updated_at'>>
) => {
  const { data, error } = await getSupabase()
    .from('github_accounts')
    .update({
      ...account,
      updated_at: new Date().toISOString(),
    })
    .eq('username', username)
    .select()
    .single();

  if (error) throw error;
  return data as GitHubAccount;
};

/**
 * GitHub 계정 삭제
 */
const deleteGitHubAccount = async (username: string) => {
  const { error } = await getSupabase().from('github_accounts').delete().eq('username', username);

  if (error) throw error;
  return true;
};

/**
 * GitHub 계정 일괄 업데이트
 */
const upsertGitHubAccounts = async (accounts: Omit<GitHubAccount, 'id' | 'created_at' | 'updated_at'>[]) => {
  const now = new Date().toISOString();
  const { data, error } = await getSupabase()
    .from('github_accounts')
    .upsert(
      accounts.map((account) => ({
        ...account,
        updated_at: now,
        created_at: now,
      })),
      {
        onConflict: 'username',
        ignoreDuplicates: false,
      }
    )
    .select();

  if (error) throw error;
  return data as GitHubAccount[];
};

// * Table Management
/**
 * SQL 쿼리 실행
 */
const executeSQL = async (query: string) => {
  const { data, error } = await getSupabase().rpc('execute_sql', { query_string: query });

  if (error) throw error;
  return data;
};

/**
 * 테이블 생성을 위한 SQL 쿼리 문자열 생성
 */
const sqlCreateTable = (schema: TableSchema, permissions?: TablePermissions): string[] => {
  const queries: string[] = [];

  // 테이블 생성 쿼리
  let query = `CREATE TABLE IF NOT EXISTS ${schema.name} (\n`;
  const columnDefinitions = schema.columns.map((column) => {
    let def = `  "${column.name}" ${column.type}`;
    if (column.primaryKey) def += ' PRIMARY KEY';
    if (column.unique) def += ' UNIQUE';
    if (!column.nullable) def += ' NOT NULL';
    if (column.defaultValue !== undefined) def += ` DEFAULT ${column.defaultValue}`;
    if (column.check) def += ` CHECK (${column.check})`;

    if (column.foreignKey) {
      def += ` REFERENCES ${column.foreignKey.table}(${column.foreignKey.column})`;
      if (column.foreignKey.onDelete) def += ` ON DELETE ${column.foreignKey.onDelete}`;
      if (column.foreignKey.onUpdate) def += ` ON UPDATE ${column.foreignKey.onUpdate}`;
    }
    return def;
  });

  query += columnDefinitions.join(',\n');
  query += '\n);';
  queries.push(query);

  // 인덱스 생성 쿼리
  if (schema.indexes) {
    for (const index of schema.indexes) {
      const indexQuery = `CREATE${index.unique ? ' UNIQUE' : ''} INDEX IF NOT EXISTS "${index.name}" ON ${
        schema.name
      } (${index.columns.map((col) => `"${col}"`).join(', ')});`;
      queries.push(indexQuery);
    }
  }

  // 권한 설정 쿼리
  if (permissions) {
    ['select', 'insert', 'update', 'delete'].forEach((action) => {
      const perm = permissions[action as keyof TablePermissions];
      if (perm?.enabled) {
        perm.roles.forEach((role) => {
          let pQuery = `GRANT ${action.toUpperCase()} ON ${schema.name} TO "${role}"`;
          if (perm.condition) {
            pQuery += ` WITH CHECK (${perm.condition})`;
          }
          pQuery += ';';
          queries.push(pQuery);
        });
      }
    });
  }

  return queries;
};

// & Export AREA
// &---------------------------------------------------------------------------
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
  // Storage
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles,
  saveJsonToStorage,
  loadJsonFromStorage,
  // Realtime
  subscribe,
  // GitHub Account Management
  getGitHubAccounts,
  getGitHubAccount,
  createGitHubAccount,
  updateGitHubAccount,
  deleteGitHubAccount,
  upsertGitHubAccounts,
  // Table Management
  sqlCreateTable,
  // Types
  type SupabaseConfig,
  type StorageOptions,
  type QueryOptions,
  type GitHubAccount,
  type TableSchema,
  type ColumnDefinition,
  type TablePermissions,
};
