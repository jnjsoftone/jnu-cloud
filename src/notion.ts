// Import AREA
import { Client } from '@notionhq/client'
import { 
  CreateDatabaseParameters,
  UpdateDatabaseParameters,
  CreatePageParameters,
  UpdatePageParameters,
  UpdateBlockParameters,
  GetDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints'

// Types AREA
type NotionClientConfig = {
  auth: string
}

type OutputType = 'normal' | 'flatten'

interface FlattenDatabase {
  id: string
  title: string
  created_time: string
  last_edited_time: string
  url: string
  properties: Record<string, {
    id: string
    name: string
    type: string
    [key: string]: any
  }>
  [key: string]: any
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
 * @param databaseId 데이터베이스 ID (UUID 형식의 문자열)
 * @param outType 출력 형식 ('normal' | 'flatten', 기본값: 'normal')
 */
const retrieveDatabase = async (
  client: Client, 
  databaseId: string, 
  outType: OutputType = 'normal'
) => {
  try {
    const response = await client.databases.retrieve({ 
      database_id: databaseId.replace(/^\//, '')
    }) as GetDatabaseResponse

    if (outType === 'flatten') {
      const flatData: Record<string, any> = {
        id: response.id,
        ...flatten(response.properties, true)
      }

      // 기본 메타데이터 추가
      if ('title' in response) {
        flatData.title = response.title?.[0]?.plain_text || ''
      }
      if ('created_time' in response) {
        flatData.created_time = response.created_time
      }
      if ('last_edited_time' in response) {
        flatData.last_edited_time = response.last_edited_time
      }
      if ('url' in response) {
        flatData.url = response.url
      }

      // 부모 정보 추가
      if ('parent' in response && response.parent) {
        if ('page_id' in response.parent) {
          flatData.parent_id = response.parent.page_id
        }
        flatData.parent_type = response.parent.type
      }

      // 생성자/수정자 정보 추가
      if ('created_by' in response && response.created_by) {
        flatData.created_by = response.created_by.id
      }
      if ('last_edited_by' in response && response.last_edited_by) {
        flatData.last_edited_by = response.last_edited_by.id
      }

      return flatData
    }

    return response
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

/**
 * Notion 페이지의 properties를 평탄화된 객체로 변환합니다
 * @param properties Notion 페이지의 properties 객체
 * @param isDatabase 데이터베이스 properties 여부
 * @returns 평탄화된 key-value 객체
 */
const flatten = (properties: any, isDatabase: boolean = false): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.entries(properties).forEach(([key, value]: [string, any]) => {
    if (!value || !value.type) {
      result[key] = '';
      return;
    }

    // 데이터베이스의 properties인 경우
    if (isDatabase) {
      switch (value.type) {
        case 'select':
          result[key] = value.select?.options?.[0]?.name || '';
          break;
        case 'multi_select':
          result[key] = value.multi_select?.options?.map((opt: any) => opt.name).join(', ') || '';
          break;
        case 'relation':
          result[key] = value.relation?.database_id || '';
          break;
        case 'rollup':
          result[key] = value.rollup?.function || '';
          break;
        case 'formula':
          result[key] = value.formula?.expression || '';
          break;
        default:
          // 기본적으로 해당 필드의 타입을 저장
          result[key] = value.type || '';
      }
      return;
    }

    // 페이지의 properties인 경우
    switch (value.type) {
      case 'rich_text':
        result[key] = value.rich_text?.[0]?.plain_text || '';
        break;
      case 'title':
        result[key] = value.title?.[0]?.plain_text || '';
        break;
      case 'select':
        result[key] = value.select?.name || '';
        break;
      case 'multi_select':
        result[key] = value.multi_select?.map((item: any) => item.name).join(', ') || '';
        break;
      case 'number':
        result[key] = value.number ?? 0;
        break;
      case 'checkbox':
        result[key] = value.checkbox ?? false;
        break;
      case 'date':
        result[key] = value.date?.start || '';
        break;
      case 'email':
        result[key] = value.email || '';
        break;
      case 'phone_number':
        result[key] = value.phone_number || '';
        break;
      case 'url':
        result[key] = value.url || '';
        break;
      case 'files':
        result[key] = Array.isArray(value.files) 
          ? value.files.map((file: any) => file.name).join(', ') 
          : '';
        break;
      case 'relation':
        result[key] = Array.isArray(value.relation) 
          ? value.relation.map((rel: any) => rel.id).join(', ') 
          : (value.relation?.id || '');
        break;
      case 'formula':
        result[key] = value.formula?.string || value.formula?.number?.toString() || value.formula?.boolean?.toString() || '';
        break;
      case 'rollup':
        result[key] = Array.isArray(value.rollup?.array)
          ? value.rollup.array.map((item: any) => item.title?.[0]?.plain_text || '').join(', ')
          : '';
        break;
      case 'people':
        result[key] = Array.isArray(value.people)
          ? value.people.map((person: any) => person.name || person.id).join(', ')
          : '';
        break;
      case 'status':
        result[key] = value.status?.name || '';
        break;
      case 'created_time':
        result[key] = value.created_time || '';
        break;
      case 'created_by':
        result[key] = value.created_by?.name || value.created_by?.id || '';
        break;
      case 'last_edited_time':
        result[key] = value.last_edited_time || '';
        break;
      case 'last_edited_by':
        result[key] = value.last_edited_by?.name || value.last_edited_by?.id || '';
        break;
      default:
        result[key] = '';
    }
  });

  return result;
};

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
  deleteBlock,
  flatten
}
