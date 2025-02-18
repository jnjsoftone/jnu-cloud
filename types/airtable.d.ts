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
declare const initAirtable: (config: AirtableConfig) => import("airtable/lib/airtable_base").AirtableBase;
/**
 * Airtable base 가져오기
 */
declare const getBase: () => import("airtable/lib/airtable_base").AirtableBase;
/**
 * 테이블의 모든 레코드 조회
 */
declare const selectAll: <T extends import("airtable/lib/field_set").FieldSet = import("airtable/lib/field_set").FieldSet>(tableName: string, options?: QueryOptions) => Promise<Record<T>[]>;
/**
 * 단일 레코드 조회
 */
declare const selectOne: <T extends import("airtable/lib/field_set").FieldSet = import("airtable/lib/field_set").FieldSet>(tableName: string, recordId: string) => Promise<{
    id: string;
    fields: T;
}>;
/**
 * 레코드 생성
 */
declare const insert: <T extends import("airtable/lib/field_set").FieldSet = import("airtable/lib/field_set").FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => Promise<Record<T>[]>;
/**
 * 레코드 수정
 */
declare const update: <T extends import("airtable/lib/field_set").FieldSet = import("airtable/lib/field_set").FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => Promise<Record<T>[]>;
/**
 * 레코드 삭제
 */
declare const remove: <T extends import("airtable/lib/field_set").FieldSet = import("airtable/lib/field_set").FieldSet>(tableName: string, recordIds: string | string[]) => Promise<Record<T>[]>;
/**
 * 레코드 upsert (insert or update)
 */
declare const upsert: <T extends import("airtable/lib/field_set").FieldSet = import("airtable/lib/field_set").FieldSet>(tableName: string, records: Record<T> | Record<T>[], keyField: keyof T) => Promise<Record<T>[]>;
/**
 * 레코드 replace (delete and insert)
 */
declare const replace: <T extends import("airtable/lib/field_set").FieldSet = import("airtable/lib/field_set").FieldSet>(tableName: string, records: Record<T> | Record<T>[]) => Promise<Record<T>[]>;
export { initAirtable, getBase, selectAll, selectOne, insert, update, remove, upsert, replace, type AirtableConfig, type QueryOptions, type Record, };
//# sourceMappingURL=airtable.d.ts.map