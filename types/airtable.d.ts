import { FieldSet } from 'airtable';
interface AirtableConfig {
    apiKey: string;
    baseId: string;
}
interface QueryOptions {
    view?: string;
    maxRecords?: number;
    pageSize?: number;
    sort?: Array<{
        field: string;
        direction?: 'asc' | 'desc';
    }>;
    filterByFormula?: string;
    fields?: string[];
}
interface Record<T extends FieldSet = FieldSet> {
    id?: string;
    fields: T;
}
/**
 * Airtable 클라이언트 초기화
 */
declare const initAirtable: (config: AirtableConfig) => any;
/**
 * Airtable base 가져오기
 */
declare const getBase: () => any;
/**
 * 테이블의 모든 레코드 조회
 */
declare const selectAll: <T extends FieldSet = FieldSet>(tableName: string, options?: QueryOptions) => Promise<Record<T>[]>;
/**
 * 단일 레코드 조회
 */
declare const selectOne: <T extends FieldSet = FieldSet>(tableName: string, recordId: string) => Promise<{
    id: any;
    fields: T;
}>;
/**
 * 레코드 생성
 */
declare const insert: <T extends FieldSet = FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => Promise<Record<T>[]>;
/**
 * 레코드 수정
 */
declare const update: <T extends FieldSet = FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => Promise<Record<T>[]>;
/**
 * 레코드 삭제
 */
declare const remove: <T extends FieldSet = FieldSet>(tableName: string, recordIds: string | string[]) => Promise<Record<T>[]>;
/**
 * 레코드 upsert (insert or update)
 */
declare const upsert: <T extends FieldSet = FieldSet>(tableName: string, records: Record<T> | Record<T>[], keyField: keyof T) => Promise<Record<T>[]>;
/**
 * 레코드 replace (delete and insert)
 */
declare const replace: <T extends FieldSet = FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => Promise<Record<T>[]>;
export { initAirtable, getBase, selectAll, selectOne, insert, update, remove, upsert, replace, type AirtableConfig, type QueryOptions, type Record, };
//# sourceMappingURL=airtable.d.ts.map