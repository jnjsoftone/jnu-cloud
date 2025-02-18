Supabase에서 발생한 에러는 `exec` 함수가 데이터베이스에 없어서 발생한 것입니다. SQL 쿼리를 직접 실행하는 방식으로 변경하겠습니다.

```typescript:nodejs/jnu-cloud/src/supabase.ts
// ... existing code ...

/**
 * 테이블 생성
 */
const createTable = async (schema: TableSchema, permissions?: TablePermissions) => {
  const supabase = getSupabase();
  
  try {
    // SQL 쿼리 생성
    let query = `CREATE TABLE IF NOT EXISTS ${schema.name} (\n`;
    
    // 컬럼 정의
    const columnDefinitions = schema.columns.map(column => {
      let def = `  "${column.name}" ${column.type}`;
      
      if (column.primaryKey) def += ' PRIMARY KEY';
      if (column.unique) def += ' UNIQUE';
      if (!column.nullable) def += ' NOT NULL';
      if (column.defaultValue !== undefined) def += ` DEFAULT ${column.defaultValue}`;
      if (column.check) def += ` CHECK (${column.check})`;
      
      // 외래 키 제약 조건
      if (column.foreignKey) {
        def += ` REFERENCES ${column.foreignKey.table}(${column.foreignKey.column})`;
        if (column.foreignKey.onDelete) def += ` ON DELETE ${column.foreignKey.onDelete}`;
        if (column.foreignKey.onUpdate) def += ` ON UPDATE ${column.foreignKey.onUpdate}`;
      }
      
      return def;
    });
    
    query += columnDefinitions.join(',\n');
    query += '\n);';
    
    // 테이블 생성
    const { error: createError } = await supabase.from('_sql').select('*').execute(query);
    if (createError) throw createError;
    
    // 인덱스 생성
    if (schema.indexes) {
      for (const index of schema.indexes) {
        const indexQuery = `CREATE${index.unique ? ' UNIQUE' : ''} INDEX IF NOT EXISTS "${index.name}" ON ${schema.name} (${index.columns.map(col => `"${col}"`).join(', ')});`;
        const { error: indexError } = await supabase.from('_sql').select('*').execute(indexQuery);
        if (indexError) throw indexError;
      }
    }
    
    // 권한 설정
    if (permissions) {
      const permissionQueries: string[] = [];
      
      // SELECT 권한
      if (permissions.select?.enabled) {
        const selectPerm = permissions.select;
        selectPerm.roles.forEach(role => {
          let pQuery = `GRANT SELECT ON ${schema.name} TO "${role}"`;
          if (selectPerm.condition) {
            pQuery += ` WITH CHECK (${selectPerm.condition})`;
          }
          permissionQueries.push(pQuery);
        });
      }
      
      // INSERT 권한
      if (permissions.insert?.enabled) {
        const insertPerm = permissions.insert;
        insertPerm.roles.forEach(role => {
          let pQuery = `GRANT INSERT ON ${schema.name} TO "${role}"`;
          if (insertPerm.condition) {
            pQuery += ` WITH CHECK (${insertPerm.condition})`;
          }
          permissionQueries.push(pQuery);
        });
      }
      
      // UPDATE 권한
      if (permissions.update?.enabled) {
        const updatePerm = permissions.update;
        updatePerm.roles.forEach(role => {
          let pQuery = `GRANT UPDATE ON ${schema.name} TO "${role}"`;
          if (updatePerm.condition) {
            pQuery += ` WITH CHECK (${updatePerm.condition})`;
          }
          permissionQueries.push(pQuery);
        });
      }
      
      // DELETE 권한
      if (permissions.delete?.enabled) {
        const deletePerm = permissions.delete;
        deletePerm.roles.forEach(role => {
          let pQuery = `GRANT DELETE ON ${schema.name} TO "${role}"`;
          if (deletePerm.condition) {
            pQuery += ` WITH CHECK (${deletePerm.condition})`;
          }
          permissionQueries.push(pQuery);
        });
      }
      
      // 권한 쿼리 실행
      for (const pQuery of permissionQueries) {
        const { error: permError } = await supabase.from('_sql').select('*').execute(pQuery);
        if (permError) throw permError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('테이블 생성 중 오류:', error);
    throw error;
  }
};

// ... existing code ...
```


죄송합니다. 파일 편집 시간이 초과되었습니다. 다시 시도하겠습니다.

```typescript:nodejs/jnu-cloud/src/supabase.ts
// ... existing code ...

/**
 * SQL 쿼리 실행
 */
const executeSQL = async (query: string) => {
  const { data, error } = await getSupabase()
    .from('_sql')
    .select('*')
    .execute(query);
  
  if (error) throw error;
  return data;
};

/**
 * 테이블 생성
 */
const createTable = async (schema: TableSchema, permissions?: TablePermissions) => {
  try {
    // 테이블 생성 쿼리
    let query = `CREATE TABLE IF NOT EXISTS ${schema.name} (\n`;
    const columnDefinitions = schema.columns.map(column => {
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
    
    // 테이블 생성 실행
    await executeSQL(query);
    
    // 인덱스 생성
    if (schema.indexes) {
      for (const index of schema.indexes) {
        const indexQuery = `CREATE${index.unique ? ' UNIQUE' : ''} INDEX IF NOT EXISTS "${index.name}" ON ${schema.name} (${index.columns.map(col => `"${col}"`).join(', ')});`;
        await executeSQL(indexQuery);
      }
    }
    
    // 권한 설정
    if (permissions) {
      const permissionQueries: string[] = [];
      
      // 각 권한 타입에 대한 쿼리 생성
      ['select', 'insert', 'update', 'delete'].forEach(action => {
        const perm = permissions[action as keyof TablePermissions];
        if (perm?.enabled) {
          perm.roles.forEach(role => {
            let pQuery = `GRANT ${action.toUpperCase()} ON ${schema.name} TO "${role}"`;
            if (perm.condition) {
              pQuery += ` WITH CHECK (${perm.condition})`;
            }
            pQuery += ';';
            permissionQueries.push(pQuery);
          });
        }
      });
      
      // 권한 쿼리 실행
      for (const pQuery of permissionQueries) {
        await executeSQL(pQuery);
      }
    }
    
    return true;
  } catch (error) {
    console.error('테이블 생성 중 오류:', error);
    throw error;
  }
};

// ... existing code ...
```


죄송합니다. 파일이 너무 커서 편집 시간이 초과되었습니다. 문제를 해결하기 위한 다른 방법을 제안하겠습니다.

Supabase에서 테이블을 생성하는 방법을 두 가지로 제안드립니다:

1. Supabase Dashboard 사용:
   - Supabase 웹 대시보드에서 직접 테이블을 생성
   - Table Editor를 사용하여 스키마 정의
   - Policy Editor를 사용하여 권한 설정

2. SQL Editor 사용:
```sql
-- 테이블 생성
CREATE TABLE IF NOT EXISTS google_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar NOT NULL UNIQUE,
  full_name varchar NOT NULL,
  email varchar NOT NULL,
  token varchar NOT NULL,
  expired timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 인덱스 생성
CREATE UNIQUE INDEX IF NOT EXISTS google_accounts_username_idx ON google_accounts (username);
CREATE INDEX IF NOT EXISTS google_accounts_email_idx ON google_accounts (email);

-- 권한 설정
ALTER TABLE google_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "모든 인증된 사용자가 조회 가능"
  ON google_accounts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "모든 인증된 사용자가 생성 가능"
  ON google_accounts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "자신의 계정만 수정 가능"
  ON google_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "자신의 계정만 삭제 가능"
  ON google_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = id);
```

이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하시면 됩니다. 이 방법이 현재로서는 가장 안정적인 방법입니다.

프로그래밍 방식으로 테이블을 생성하려면 Supabase의 Management API를 사용해야 하는데, 이는 현재 베타 상태이며 완전히 지원되지 않습니다.
