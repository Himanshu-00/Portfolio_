export interface GithubProject {
  name: string;
  html_url: string;
  description: string;
  stargazers_count: string;
  forks_count: string;
  language: string;
  owner?: { login: string };
  topics?: string[];
  pushed_at?: string;
  /** repo size on GitHub, in KB (fallback for codeBytes) */
  size?: number;
  /** total bytes of source code, from the languages API */
  codeBytes?: number;
  /** how many languages the repo uses */
  languageCount?: number;
}
