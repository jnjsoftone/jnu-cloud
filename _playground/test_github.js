// https://github.com/jnjsoftone/jd-environments/blob/main/Apis/github.json

import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const { GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_TOKEN } = process.env;
const GITHUB_API_URL = 'https://api.github.com';

// console.log(GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_TOKEN);

const githubConfig = {
  owner: GITHUB_REPO_OWNER,
  repo: GITHUB_REPO_NAME,
  token: GITHUB_TOKEN
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
const uploadJsonToGithub = async (path, content, message = 'Update JSON file') => {
  try {
    // 먼저 파일이 존재하는지 확인 (SHA 값을 얻기 위해)
    let sha;
    try {
      const existingFile = await fetch(
        `${GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`,
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
      `${GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`,
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
const readJsonFromGithub = async (path) => {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`,
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
const listFilesInDirectory = async (path = '') => {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`,
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
    return data.filter(item => item.type === 'file');
  } catch (error) {
    console.error('Error listing files from GitHub:', error);
    throw error;
  }
};

// 파일 삭제
const deleteFileFromGithub = async (path, message = 'Delete file') => {
  try {
    // 먼저 파일의 SHA 값을 얻음
    const fileResponse = await fetch(
      `${GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`,
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
      `${GITHUB_API_URL}/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`,
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

export {
  uploadJsonToGithub,
  readJsonFromGithub,
  listFilesInDirectory,
  deleteFileFromGithub
};


readJsonFromGithub('Apis/github.json').then(console.log);