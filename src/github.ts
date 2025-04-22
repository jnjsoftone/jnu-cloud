import * as dotenv from 'dotenv';
import fs from 'fs';
import * as Path from 'path';
dotenv.config();

interface GithubConfig {
  owner: string;
  repo: string;
  token: string;
}

interface GithubResponse {
  sha: string;
  content: string;
  [key: string]: any;
}

interface GithubFile {
  type: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  [key: string]: any;
}

const ENV_GITHUB_API_URL = 'https://api.github.com';

// Base64 인코딩 함수
const encodeContent = (content: string): string => {
  return Buffer.from(content).toString('base64');
};

// Base64 디코딩 함수
const decodeContent = (content: string): string => {
  return Buffer.from(content, 'base64').toString('utf-8');
};

// JSON 파일 업로드/업데이트
const uploadJsonToGithub = async <T>(
  filePath: string,
  content: T,
  githubConfig: GithubConfig,
  message: string = 'Update JSON file'
): Promise<GithubResponse> => {
  const srcUrl = `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${filePath}`;
  console.log(`@@@@ uploadJsonToGithub srcUrl: ${srcUrl}`);

  try {
    // 먼저 파일이 존재하는지 확인 (SHA 값을 얻기 위해)
    let sha: string | undefined;
    try {
      const existingFile = await fetch(
        srcUrl,
        {
          headers: {
            Authorization: `token ${githubConfig.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (existingFile.ok) {
        const data = (await existingFile.json()) as GithubResponse;
        sha = data.sha;
      }
    } catch (error) {
      // 파일이 없는 경우 무시
    }

    // 파일 업로드/업데이트
    const response = await fetch(
      srcUrl,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubConfig.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: encodeContent(JSON.stringify(content, null, 2)),
          sha, // 파일이 존재하는 경우에만 SHA 포함
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return (await response.json()) as GithubResponse;
  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    throw error;
  }
};

// JSON 파일 읽기
const readJsonFromGithub = async <T>(filePath: string, githubConfig: GithubConfig): Promise<T | null> => {
  try {
    const response = await fetch(
      `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${githubConfig.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // throw new Error(`GitHub API error: ${response.statusText}`);
      return null
    }

    const data = (await response.json()) as GithubResponse;
    const content = decodeContent(data.content);
    return JSON.parse(content);
  } catch (error) {
    // console.error('Error reading from GitHub:', error);
    // throw error;
    return null
  }
};

// 디렉토리 내 파일 목록 조회
const listFilesInDirectory = async (dirPath: string = '', githubConfig: GithubConfig): Promise<GithubFile[]> => {
  try {
    const response = await fetch(
      `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${dirPath}`,
      {
        headers: {
          Authorization: `token ${githubConfig.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = (await response.json()) as GithubFile[];
    return data.filter((item) => item.type === 'file');
  } catch (error) {
    console.error('Error listing files from GitHub:', error);
    throw error;
  }
};

// 파일 삭제
const deleteFileFromGithub = async (
  filePath: string,
  githubConfig: GithubConfig,
  message: string = 'Delete file'
): Promise<GithubResponse> => {
  try {
    // 먼저 파일의 SHA 값을 얻음
    const fileResponse = await fetch(
      `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${githubConfig.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!fileResponse.ok) {
      throw new Error(`GitHub API error: ${fileResponse.statusText}`);
    }

    const fileData = (await fileResponse.json()) as GithubResponse;

    // 파일 삭제 요청
    const response = await fetch(
      `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `token ${githubConfig.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sha: fileData.sha,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return (await response.json()) as GithubResponse;
  } catch (error) {
    console.error('Error deleting file from GitHub:', error);
    throw error;
  }
};

// GitHub 폴더를 로컬로 복사
const copyFolderToLocal = async (srcFolder: string, dstFolder: string, githubConfig: GithubConfig): Promise<void> => {
  try {
    // 대상 폴더가 없으면 생성
    if (!fs.existsSync(dstFolder)) {
      fs.mkdirSync(dstFolder, { recursive: true });
    }

    const fetchContents = async (currentPath: string) => {
      const srcUrl = `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${currentPath}`
      console.log(`copyFolderToLocal srcUrl: ${srcUrl}`)
      const response = await fetch(
        srcUrl,
        {
          headers: {
            Authorization: `token ${githubConfig.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const items = (await response.json()) as GithubFile[];

      for (const item of items) {
        const localPath = Path.join(dstFolder, item.path.replace(srcFolder, ''));

        if (item.type === 'dir') {
          // 디렉토리인 경우 재귀적으로 처리
          if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath, { recursive: true });
          }
          await fetchContents(item.path);
        } else if (item.type === 'file') {
          // 파일인 경우 다운로드
          const fileResponse = await fetch(item.download_url);
          if (!fileResponse.ok) {
            throw new Error(`Failed to download file: ${item.path}`);
          }
          const content = await fileResponse.arrayBuffer();
          fs.writeFileSync(localPath, Buffer.from(content));
        }
      }
    };

    await fetchContents(srcFolder);
    console.log(`Successfully copied GitHub folder '${srcFolder}' to local folder '${dstFolder}'`);
  } catch (error) {
    console.error('Error copying folder from GitHub:', error);
    throw error;
  }
};

// GitHub의 json 파일 로딩
const loadJsonFromGithub = async <T>(
  filePath: string,
  githubConfig: GithubConfig,
  message: string = 'Load JSON file'
): Promise<T | null> => {
  return readJsonFromGithub(filePath, githubConfig)
};

// GitHub에 JSON 파일 저장
const saveJsonToGithub = async <T>(
  filePath: string,
  content: T,
  githubConfig: GithubConfig,
  message: string = 'Save JSON file'
): Promise<GithubResponse> => {
  return uploadJsonToGithub(filePath, content, githubConfig, message)
};

export {
  uploadJsonToGithub,
  readJsonFromGithub,
  listFilesInDirectory,
  deleteFileFromGithub,
  copyFolderToLocal,
  loadJsonFromGithub,
  saveJsonToGithub,
  type GithubConfig,
};
