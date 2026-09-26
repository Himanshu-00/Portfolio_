export interface SanitizedGithub {
  username: string;
}

export interface SanitizedGitHubProjects {
  display: boolean;
  header: string;
  limit: number;
}

export interface SanitizedSEO {
  title?: string;
  description?: string;
  imageURL?: string;
}

export interface SanitizedSocial {
  linkedin?: string;
  email?: string;
}

export interface SanitizedResume {
  fileUrl?: string;
}

export interface SanitizedCertification {
  body?: string;
  name?: string;
  year?: string;
  link?: string;
}

export interface SanitizedEducation {
  institution?: string;
  degree?: string;
  from: string;
  to: string;
}

export interface SanitizedGoogleAnalytics {
  id?: string;
}

export interface SanitizedHotjar {
  id?: string;
  snippetVersion: number;
}

export interface SanitizedCurrentWork {
  type?: string;
  title: string;
  description?: string;
  tags?: Array<string>;
  progress?: number;
  status?: string;
  link?: string;
  start?: string;
  end?: string;
  terms?: number;
  termLabel?: string;
  now?: string;
  updated?: string;
}

export interface SanitizedConfig {
  github: SanitizedGithub;
  projects: SanitizedGitHubProjects;
  seo: SanitizedSEO;
  social: SanitizedSocial;
  resume: SanitizedResume;
  skills: Array<string>;
  educations: Array<SanitizedEducation>;
  certifications: Array<SanitizedCertification>;
  googleAnalytics: SanitizedGoogleAnalytics;
  hotjar: SanitizedHotjar;
  footer?: string;
  enablePWA: boolean;
  openToInternships: boolean;
  currentlyWorkingOn: Array<SanitizedCurrentWork>;
}
