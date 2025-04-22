// https://github.com/jnjsoftone/jd-environments/blob/main/Apis/github.json

import * as dotenv from 'dotenv';
import fs from 'fs';
import * as Path from 'path';
dotenv.config({ path: '../.env' });

const { ENV_GITHUB_OWNER, ENV_GITHUB_REPO, ENV_GITHUB_TOKEN } = process.env;
const ENV_GITHUB_API_URL = 'https://api.github.com';

// console.log(ENV_GITHUB_OWNER, ENV_GITHUB_REPO, ENV_GITHUB_TOKEN);

const githubConfig = {
  owner: ENV_GITHUB_OWNER,
  repo: ENV_GITHUB_REPO,
  token: ENV_GITHUB_TOKEN,
};

// Base64 인코딩 함수
const encodeContent = (content) => {
  return Buffer.from(content).toString('base64');
};

// Base64 디코딩 함수
const decodeContent = (content) => {
  return Buffer.from(content, 'base64').toString('utf-8');
};

// JSON 파일 업로드/업데이트
const uploadJsonToGithub = async (filePath, content, message = 'Update JSON file') => {
  try {
    // 먼저 파일이 존재하는지 확인 (SHA 값을 얻기 위해)
    let sha;
    try {
      const existingFile = await fetch(
        `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${filePath}`,
        {
          headers: {
            Authorization: `token ${githubConfig.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (existingFile.ok) {
        const data = await existingFile.json();
        sha = data.sha;
      }
    } catch (error) {
      // 파일이 없는 경우 무시
    }

    // 파일 업로드/업데이트
    const response = await fetch(
      `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubConfig.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: encodeContent(JSON.stringify(content, null, 2)),
          sha: sha, // 파일이 존재하는 경우에만 SHA 포함
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    throw error;
  }
};

// JSON 파일 읽기
const readJsonFromGithub = async (filePath) => {
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
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = decodeContent(data.content);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading from GitHub:', error);
    throw error;
  }
};

// 디렉토리 내 파일 목록 조회
const listFilesInDirectory = async (dirPath = '') => {
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

    const data = await response.json();
    return data.filter((item) => item.type === 'file');
  } catch (error) {
    console.error('Error listing files from GitHub:', error);
    throw error;
  }
};

// 파일 삭제
const deleteFileFromGithub = async (filePath, message = 'Delete file') => {
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

    const fileData = await fileResponse.json();

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

    return await response.json();
  } catch (error) {
    console.error('Error deleting file from GitHub:', error);
    throw error;
  }
};

// GitHub 폴더를 로컬로 복사
const copyFolderToLocal = async (srcFolder, dstFolder) => {
  try {
    // 대상 폴더가 없으면 생성
    if (!fs.existsSync(dstFolder)) {
      fs.mkdirSync(dstFolder, { recursive: true });
    }

    const fetchContents = async (currentPath) => {
      console.log(`${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${currentPath}`);

      const response = await fetch(
        `${ENV_GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${currentPath}`,
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

      const items = await response.json();

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

export { uploadJsonToGithub, readJsonFromGithub, listFilesInDirectory, deleteFileFromGithub, copyFolderToLocal };

// readJsonFromGithub('Apis/github.json').then(console.log);

await copyFolderToLocal('Templates/ts-swc-simple', 'repo');
