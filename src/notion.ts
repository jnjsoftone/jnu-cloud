// Import AREA
import { Client } from '@notionhq/client'
import { 
  CreateDatabaseParameters,
  UpdateDatabaseParameters,
  CreatePageParameters,
  UpdatePageParameters,
  UpdateBlockParameters
} from '@notionhq/client/build/src/api-endpoints'

// Types AREA
type NotionClientConfig = {
  auth: string
}

// Functions AREA

/**
 * Notion 클라이언트 인스턴스를 생성합니다
 * @param config Notion API 설정
 * @returns Notion 클라이언트 인스턴스
 */
const createNotionClient = (config: NotionClientConfig) => {
  return new Client(config)
}

// Database 관련 함수들
/**
 * 데이터베이스를 생성합니다
 * @param client Notion 클라이언트
 * @param params 데이터베이스 생성 파라미터
 */
const createDatabase = async (client: Client, params: CreateDatabaseParameters) => {
  try {
    return await client.databases.create(params)
  } catch (error) {
    console.error('데이터베이스 생성 실패:', error)
    throw error
  }
}

/**
 * 데이터베이스를 조회합니다
 * @param client Notion 클라이언트
 * @param databaseId 데이터베이스 ID
 */
const retrieveDatabase = async (client: Client, databaseId: string) => {
  try {
    return await client.databases.retrieve({ database_id: databaseId })
  } catch (error) {
    console.error('데이터베이스 조회 실패:', error)
    throw error
  }
}

/**
 * 데이터베이스를 업데이트합니다
 * @param client Notion 클라이언트
 * @param params 데이터베이스 업데이트 파라미터
 */
const updateDatabase = async (client: Client, params: UpdateDatabaseParameters) => {
  try {
    return await client.databases.update(params)
  } catch (error) {
    console.error('데이터베이스 업데이트 실패:', error)
    throw error
  }
}

// Page 관련 함수들
/**
 * 페이지를 생성합니다
 * @param client Notion 클라이언트
 * @param params 페이지 생성 파라미터
 */
const createPage = async (client: Client, params: CreatePageParameters) => {
  try {
    return await client.pages.create(params)
  } catch (error) {
    console.error('페이지 생성 실패:', error)
    throw error
  }
}

/**
 * 페이지를 조회합니다
 * @param client Notion 클라이언트
 * @param pageId 페이지 ID
 */
const retrievePage = async (client: Client, pageId: string) => {
  try {
    return await client.pages.retrieve({ page_id: pageId })
  } catch (error) {
    console.error('페이지 조회 실패:', error)
    throw error
  }
}

/**
 * 페이지를 업데이트합니다
 * @param client Notion 클라이언트
 * @param params 페이지 업데이트 파라미터
 */
const updatePage = async (client: Client, params: UpdatePageParameters) => {
  try {
    return await client.pages.update(params)
  } catch (error) {
    console.error('페이지 업데이트 실패:', error)
    throw error
  }
}

// Block 관련 함수들
/**
 * 블록을 조회합니다
 * @param client Notion 클라이언트
 * @param blockId 블록 ID
 */
const retrieveBlock = async (client: Client, blockId: string) => {
  try {
    return await client.blocks.retrieve({ block_id: blockId })
  } catch (error) {
    console.error('블록 조회 실패:', error)
    throw error
  }
}

/**
 * 블록을 업데이트합니다
 * @param client Notion 클라이언트
 * @param params 블록 업데이트 파라미터
 */
const updateBlock = async (client: Client, params: UpdateBlockParameters) => {
  try {
    return await client.blocks.update(params)
  } catch (error) {
    console.error('블록 업데이트 실패:', error)
    throw error
  }
}

/**
 * 블록을 삭제합니다
 * @param client Notion 클라이언트
 * @param blockId 블록 ID
 */
const deleteBlock = async (client: Client, blockId: string) => {
  try {
    return await client.blocks.delete({ block_id: blockId })
  } catch (error) {
    console.error('블록 삭제 실패:', error)
    throw error
  }
}

// Export AREA
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
  deleteBlock
}
