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
declare const uploadJsonToGithub: <T>(filePath: string, content: T, githubConfig: GithubConfig, message?: string) => Promise<GithubResponse>;
declare const readJsonFromGithub: <T>(filePath: string, githubConfig: GithubConfig) => Promise<T | null>;
declare const listFilesInDirectory: (dirPath: string | undefined, githubConfig: GithubConfig) => Promise<GithubFile[]>;
declare const deleteFileFromGithub: (filePath: string, githubConfig: GithubConfig, message?: string) => Promise<GithubResponse>;
declare const copyFolderToLocal: (srcFolder: string, dstFolder: string, githubConfig: GithubConfig) => Promise<void>;
declare const loadJsonFromGithub: <T>(filePath: string, githubConfig: GithubConfig, message?: string) => Promise<T | null>;
declare const saveJsonToGithub: <T>(filePath: string, content: T, githubConfig: GithubConfig, message?: string) => Promise<GithubResponse>;
export { uploadJsonToGithub, readJsonFromGithub, listFilesInDirectory, deleteFileFromGithub, copyFolderToLocal, loadJsonFromGithub, saveJsonToGithub, type GithubConfig, };
//# sourceMappingURL=github.d.ts.map