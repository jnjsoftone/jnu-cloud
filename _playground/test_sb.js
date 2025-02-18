import { initSupabase, createTable } from '../esm/supabase.js';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

// console.log(supabaseUrl, supabaseKey);

const main = async () => {
  // Supabase 초기화
  initSupabase({
    url: supabaseUrl,
    anonKey: supabaseKey
  });

  // Google 계정 테이블 스키마 정의
  const schema = {
    name: 'google_accounts',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        primaryKey: true,
        defaultValue: 'gen_random_uuid()'
      },
      {
        name: 'username',
        type: 'varchar',
        unique: true,
        nullable: false
      },
      {
        name: 'full_name',
        type: 'varchar',
        nullable: false
      },
      {
        name: 'email',
        type: 'varchar',
        nullable: false
      },
      {
        name: 'token',
        type: 'varchar',
        nullable: false
      },
      {
        name: 'expired',
        type: 'timestamp'
      },
      {
        name: 'created_at',
        type: 'timestamp',
        defaultValue: 'now()'
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        defaultValue: 'now()'
      }
    ],
    indexes: [
      {
        name: 'google_accounts_username_idx',
        columns: ['username'],
        unique: true
      },
      {
        name: 'google_accounts_email_idx',
        columns: ['email']
      }
    ]
  };

  // 테이블 권한 설정
  const permissions = {
    select: {
      enabled: true,
      roles: ['authenticated'],
      condition: 'true'
    },
    insert: {
      enabled: true,
      roles: ['authenticated'],
      condition: 'true'
    },
    update: {
      enabled: true,
      roles: ['authenticated'],
      condition: 'auth.uid() = id'
    },
    delete: {
      enabled: true,
      roles: ['authenticated'],
      condition: 'auth.uid() = id'
    }
  };

  try {
    // 테이블 생성
    await createTable(schema, permissions);
    console.log('Google 계정 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('테이블 생성 중 오류가 발생했습니다:', error);
  }
};

main();