/// <reference types="node" />
/// <reference types="node" />
import { SupabaseClient } from '@supabase/supabase-js';
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
    orderBy?: {
        column: string;
        ascending?: boolean;
    };
    filters?: Array<{
        column: string;
        operator: string;
        value: any;
    }>;
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
/**
 * Supabase 클라이언트 초기화
 */
declare const initSupabase: (config: SupabaseConfig) => SupabaseClient<any, "public", any>;
/**
 * Supabase 클라이언트 가져오기
 */
declare const getSupabase: () => SupabaseClient<any, "public", any>;
/**
 * 데이터 조회
 */
declare const select: (table: string, options?: QueryOptions) => Promise<any[]>;
/**
 * 단일 데이터 조회
 */
declare const selectOne: (table: string, id: string | number) => Promise<any>;
/**
 * 데이터 삽입
 */
declare const insert: (table: string, data: any) => Promise<any[]>;
/**
 * 데이터 수정
 */
declare const update: (table: string, id: string | number, data: any) => Promise<any[]>;
/**
 * 데이터 삭제
 */
declare const remove: (table: string, id: string | number) => Promise<boolean>;
/**
 * 데이터 upsert (insert or update)
 */
declare const upsert: (table: string, data: any, uniqueColumns: string[]) => Promise<any[]>;
/**
 * 이메일/비밀번호로 회원가입
 */
declare const signUp: (email: string, password: string) => Promise<{
    user: import("@supabase/supabase-js").AuthUser | null;
    session: import("@supabase/supabase-js").AuthSession | null;
}>;
/**
 * 이메일/비밀번호로 로그인
 */
declare const signIn: (email: string, password: string) => Promise<{
    user: import("@supabase/supabase-js").AuthUser;
    session: import("@supabase/supabase-js").AuthSession;
    weakPassword?: import("@supabase/supabase-js").WeakPassword | undefined;
}>;
/**
 * 로그아웃
 */
declare const signOut: () => Promise<boolean>;
/**
 * 현재 사용자 정보 가져오기
 */
declare const getCurrentUser: () => Promise<import("@supabase/supabase-js").AuthUser | null>;
/**
 * 파일 업로드
 */
declare const uploadFile: (bucket: string, path: string, file: File | Blob | Buffer, options?: StorageOptions) => Promise<{
    id: string;
    path: string;
    fullPath: string;
}>;
/**
 * 파일 다운로드
 */
declare const downloadFile: (bucket: string, path: string) => Promise<Blob>;
/**
 * 파일 삭제
 */
declare const deleteFile: (bucket: string, path: string) => Promise<boolean>;
/**
 * 파일 목록 조회
 */
declare const listFiles: (bucket: string, path?: string) => Promise<import("@supabase/storage-js").FileObject[]>;
/**
 * JSON 파일 저장
 */
declare const saveJsonToStorage: (bucket: string, path: string, data: any) => Promise<{
    id: string;
    path: string;
    fullPath: string;
}>;
/**
 * JSON 파일 로드
 */
declare const loadJsonFromStorage: (bucket: string, path: string) => Promise<any>;
/**
 * 실시간 구독
 */
declare const subscribe: (table: string, callback: (payload: any) => void) => import("@supabase/supabase-js").RealtimeChannel;
/**
 * GitHub 계정 목록 조회
 */
declare const getGitHubAccounts: (options?: QueryOptions) => Promise<any[]>;
/**
 * GitHub 계정 단일 조회
 */
declare const getGitHubAccount: (username: string) => Promise<GitHubAccount>;
/**
 * GitHub 계정 추가
 */
declare const createGitHubAccount: (account: Omit<GitHubAccount, 'id' | 'created_at' | 'updated_at'>) => Promise<GitHubAccount>;
/**
 * GitHub 계정 수정
 */
declare const updateGitHubAccount: (username: string, account: Partial<Omit<GitHubAccount, 'id' | 'username' | 'created_at' | 'updated_at'>>) => Promise<GitHubAccount>;
/**
 * GitHub 계정 삭제
 */
declare const deleteGitHubAccount: (username: string) => Promise<boolean>;
/**
 * GitHub 계정 일괄 업데이트
 */
declare const upsertGitHubAccounts: (accounts: Omit<GitHubAccount, 'id' | 'created_at' | 'updated_at'>[]) => Promise<GitHubAccount[]>;
/**
 * 테이블 생성
 */
declare const createTable: (schema: TableSchema, permissions?: TablePermissions) => Promise<boolean>;
export { initSupabase, getSupabase, select, selectOne, insert, update, remove, upsert, signUp, signIn, signOut, getCurrentUser, uploadFile, downloadFile, deleteFile, listFiles, saveJsonToStorage, loadJsonFromStorage, subscribe, getGitHubAccounts, getGitHubAccount, createGitHubAccount, updateGitHubAccount, deleteGitHubAccount, upsertGitHubAccounts, createTable, type SupabaseConfig, type StorageOptions, type QueryOptions, type GitHubAccount, type TableSchema, type ColumnDefinition, type TablePermissions, };
//# sourceMappingURL=supabase.d.ts.map