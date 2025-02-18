import Airtable, { FieldSet } from 'airtable';

// & Types AREA
// &---------------------------------------------------------------------------
interface AirtableConfig {
  apiKey: string;
  baseId: string;
}

interface QueryOptions {
  view?: string;
  maxRecords?: number;
  pageSize?: number;
  sort?: Array<{ field: string; direction?: 'asc' | 'desc' }>;
  filterByFormula?: string;
  fields?: string[];
}

interface Record<T extends FieldSet = FieldSet> {
  id?: string;
  fields: T;
}

// & Variables AREA
// &---------------------------------------------------------------------------
let base: Airtable.Base | null = null;

// & Functions AREA
// &---------------------------------------------------------------------------
/**
 * Airtable 클라이언트 초기화
 */
const initAirtable = (config: AirtableConfig) => {
  const airtable = new Airtable({ apiKey: config.apiKey });
  base = airtable.base(config.baseId);
  return base;
};

/**
 * Airtable base 가져오기
 */
const getBase = () => {
  if (!base) {
    throw new Error('Airtable base is not initialized');
  }
  return base;
};

/**
 * 테이블의 모든 레코드 조회
 */
const selectAll = async <T extends FieldSet = FieldSet>(tableName: string, options: QueryOptions = {}) => {
  const records: Record<T>[] = [];
  const table = getBase()(tableName);

  await table
    .select({
      view: options.view,
      maxRecords: options.maxRecords,
      pageSize: options.pageSize,
      sort: options.sort,
      filterByFormula: options.filterByFormula,
      fields: options.fields,
    })
    .eachPage((pageRecords, fetchNextPage) => {
      records.push(
        ...pageRecords.map((record) => ({
          id: record.id,
          fields: record.fields as T,
        }))
      );
      fetchNextPage();
    });

  return records;
};

/**
 * 단일 레코드 조회
 */
const selectOne = async <T extends FieldSet = FieldSet>(tableName: string, recordId: string) => {
  const record = await getBase()(tableName).find(recordId);
  return {
    id: record.id,
    fields: record.fields as T,
  };
};

/**
 * 레코드 생성
 */
const insert = async <T extends FieldSet = FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => {
  const table = getBase()(tableName);
  const recordsArray = Array.isArray(records) ? records : [records];

  // 한 번에 최대 10개의 레코드만 생성 가능
  const chunks: Record<T>[][] = [];
  for (let i = 0; i < recordsArray.length; i += 10) {
    chunks.push(recordsArray.slice(i, i + 10));
  }

  const results: Record<T>[] = [];
  for (const chunk of chunks) {
    const created = await table.create(chunk.map(r => ({ fields: r.fields })));
    results.push(...created.map(record => ({
      id: record.id,
      fields: record.fields as T,
    })));
  }

  return results;
};

/**
 * 레코드 수정
 */
const update = async <T extends FieldSet = FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => {
  const table = getBase()(tableName);
  const recordsArray = Array.isArray(records) ? records : [records];

  // 한 번에 최대 10개의 레코드만 수정 가능
  const chunks: Record<T>[][] = [];
  for (let i = 0; i < recordsArray.length; i += 10) {
    chunks.push(recordsArray.slice(i, i + 10));
  }

  const results: Record<T>[] = [];
  for (const chunk of chunks) {
    const updateData = chunk.map(r => ({
      id: r.id!,  // id가 반드시 있어야 함
      fields: r.fields,
    }));
    
    const updated = await table.update(updateData);
    results.push(...updated.map(record => ({
      id: record.id,
      fields: record.fields as T,
    })));
  }

  return results;
};

/**
 * 레코드 삭제
 */
const remove = async <T extends FieldSet = FieldSet>(tableName: string, recordIds: string | string[]) => {
  const table = getBase()(tableName);
  const ids = Array.isArray(recordIds) ? recordIds : [recordIds];

  // 한 번에 최대 10개의 레코드만 삭제 가능
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 10) {
    chunks.push(ids.slice(i, i + 10));
  }

  const results: Record<T>[] = [];
  for (const chunk of chunks) {
    const deleted = await table.destroy(chunk);
    results.push(...deleted.map(record => ({
      id: record.id,
      fields: record.fields as T,
    })));
  }

  return results;
};

/**
 * 레코드 upsert (insert or update)
 */
const upsert = async <T extends FieldSet = FieldSet>(
  tableName: string,
  records: Record<T> | Record<T>[],
  keyField: keyof T
) => {
  const recordsArray = Array.isArray(records) ? records : [records];
  
  // 기존 레코드 조회를 위한 필터 생성
  const filterFormulas = recordsArray.map(r => `{${String(keyField)}} = '${r.fields[keyField]}'`);
  const filterByFormula = `OR(${filterFormulas.join(',')})`;
  
  // 기존 레코드 조회
  const existingRecords = await selectAll<T>(tableName, { filterByFormula });
  const existingMap = new Map(existingRecords.map(r => [r.fields[keyField], r]));
  
  // 업데이트할 레코드와 새로 생성할 레코드 분류
  const toUpdate: Record<T>[] = [];
  const toCreate: Record<T>[] = [];
  
  for (const record of recordsArray) {
    const existing = existingMap.get(record.fields[keyField]);
    if (existing) {
      toUpdate.push({
        id: existing.id,
        fields: { ...record.fields },
      });
    } else {
      toCreate.push({
        fields: record.fields,
      });
    }
  }
  
  // 업데이트와 생성 실행
  const updateResults = toUpdate.length > 0 ? await update(tableName, toUpdate) : [];
  const createResults = toCreate.length > 0 ? await insert(tableName, toCreate) : [];
  
  return [...updateResults, ...createResults];
};

/**
 * 레코드 replace (delete and insert)
 */
const replace = async <T extends FieldSet = FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => {
  const table = getBase()(tableName);
  const recordsArray = Array.isArray(records) ? records : [records];

  // 기존 레코드 모두 삭제
  const existingRecords = await selectAll<T>(tableName);
  if (existingRecords.length > 0) {
    await remove(tableName, existingRecords.map(r => r.id!));
  }

  // 새 레코드 생성
  return await insert(tableName, recordsArray);
};

// & Export AREA
// &---------------------------------------------------------------------------
export {
  initAirtable,
  getBase,
  selectAll,
  selectOne,
  insert,
  update,
  remove,
  upsert,
  replace,
  // Types
  type AirtableConfig,
  type QueryOptions,
  type Record,
};
