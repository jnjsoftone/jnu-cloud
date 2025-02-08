import { Client } from '@notionhq/client';
import { CreateDatabaseParameters, UpdateDatabaseParameters, CreatePageParameters, UpdatePageParameters, UpdateBlockParameters } from '@notionhq/client/build/src/api-endpoints';
type NotionClientConfig = {
    auth: string;
};
type OutputType = 'normal' | 'flatten';
/**
 * Notion 클라이언트 인스턴스를 생성합니다
 * @param config Notion API 설정
 * @returns Notion 클라이언트 인스턴스
 */
declare const createNotionClient: (config: NotionClientConfig) => Client;
/**
 * 데이터베이스를 생성합니다
 * @param client Notion 클라이언트
 * @param params 데이터베이스 생성 파라미터
 */
declare const createDatabase: (client: Client, params: CreateDatabaseParameters) => Promise<import("@notionhq/client/build/src/api-endpoints").CreateDatabaseResponse>;
/**
 * 데이터베이스를 조회합니다
 * @param client Notion 클라이언트
 * @param databaseId 데이터베이스 ID (UUID 형식의 문자열)
 * @param outType 출력 형식 ('normal' | 'flatten', 기본값: 'normal')
 */
declare const retrieveDatabase: (client: Client, databaseId: string, outType?: OutputType) => Promise<Record<string, any>>;
/**
 * 데이터베이스를 업데이트합니다
 * @param client Notion 클라이언트
 * @param params 데이터베이스 업데이트 파라미터
 */
declare const updateDatabase: (client: Client, params: UpdateDatabaseParameters) => Promise<import("@notionhq/client/build/src/api-endpoints").UpdateDatabaseResponse>;
/**
 * 페이지를 생성합니다
 * @param client Notion 클라이언트
 * @param params 페이지 생성 파라미터
 */
declare const createPage: (client: Client, params: CreatePageParameters) => Promise<import("@notionhq/client/build/src/api-endpoints").CreatePageResponse>;
/**
 * 페이지를 조회합니다
 * @param client Notion 클라이언트
 * @param pageId 페이지 ID
 */
declare const retrievePage: (client: Client, pageId: string) => Promise<import("@notionhq/client/build/src/api-endpoints").GetPageResponse>;
/**
 * 페이지를 업데이트합니다
 * @param client Notion 클라이언트
 * @param params 페이지 업데이트 파라미터
 */
declare const updatePage: (client: Client, params: UpdatePageParameters) => Promise<import("@notionhq/client/build/src/api-endpoints").UpdatePageResponse>;
/**
 * 블록을 조회합니다
 * @param client Notion 클라이언트
 * @param blockId 블록 ID
 */
declare const retrieveBlock: (client: Client, blockId: string) => Promise<import("@notionhq/client/build/src/api-endpoints").GetBlockResponse>;
/**
 * 블록을 업데이트합니다
 * @param client Notion 클라이언트
 * @param params 블록 업데이트 파라미터
 */
declare const updateBlock: (client: Client, params: UpdateBlockParameters) => Promise<import("@notionhq/client/build/src/api-endpoints").UpdateBlockResponse>;
/**
 * 블록을 삭제합니다
 * @param client Notion 클라이언트
 * @param blockId 블록 ID
 */
declare const deleteBlock: (client: Client, blockId: string) => Promise<import("@notionhq/client/build/src/api-endpoints").DeleteBlockResponse>;
/**
 * Notion 페이지의 properties를 평탄화된 객체로 변환합니다
 * @param properties Notion 페이지의 properties 객체
 * @param isDatabase 데이터베이스 properties 여부
 * @returns 평탄화된 key-value 객체
 */
declare const flatten: (properties: any, isDatabase?: boolean) => Record<string, any>;
export { createNotionClient, createDatabase, retrieveDatabase, updateDatabase, createPage, retrievePage, updatePage, retrieveBlock, updateBlock, deleteBlock, flatten };
//# sourceMappingURL=notion.d.ts.map