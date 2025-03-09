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
declare const uploadJsonToGithub: <T>(path: string, content: T, githubConfig: GithubConfig, message?: string) => Promise<GithubResponse>;
declare const readJsonFromGithub: <T>(path: string, githubConfig: GithubConfig) => Promise<T>;
declare const listFilesInDirectory: (path: string | undefined, githubConfig: GithubConfig) => Promise<GithubFile[]>;
declare const deleteFileFromGithub: (path: string, githubConfig: GithubConfig, message?: string) => Promise<GithubResponse>;
export { uploadJsonToGithub, readJsonFromGithub, listFilesInDirectory, deleteFileFromGithub, type GithubConfig };
//# sourceMappingURL=github.d.ts.map