const schema = {
  name: 'google_accounts',
  columns: [
    {
      name: 'id',
      type: 'uuid',
      primaryKey: true,
      defaultValue: 'gen_random_uuid()',
    },
    {
      name: 'username',
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    {
      name: 'full_name',
      type: 'varchar',
      nullable: false,
    },
    {
      name: 'email',
      type: 'varchar',
      nullable: false,
    },
    {
      name: 'token',
      type: 'varchar',
      nullable: false,
    },
    {
      name: 'expired',
      type: 'timestamp',
    },
    {
      name: 'created_at',
      type: 'timestamp',
      defaultValue: 'now()',
    },
    {
      name: 'updated_at',
      type: 'timestamp',
      defaultValue: 'now()',
    },
  ],
  indexes: [
    {
      name: 'google_accounts_username_idx',
      columns: ['username'],
      unique: true,
    },
    {
      name: 'google_accounts_email_idx',
      columns: ['email'],
    },
  ],
};

// 테이블 권한 설정
const permissions = {
  select: {
    enabled: true,
    roles: ['authenticated'],
    condition: 'true',
  },
  insert: {
    enabled: true,
    roles: ['authenticated'],
    condition: 'true',
  },
  update: {
    enabled: true,
    roles: ['authenticated'],
    condition: 'auth.uid() = id',
  },
  delete: {
    enabled: true,
    roles: ['authenticated'],
    condition: 'auth.uid() = id',
  },
};

export { schema, permissions };
