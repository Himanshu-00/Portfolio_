interface Github {
  /**
   * GitHub user name
   */
  username: string;
}

interface GitHubProjects {
  /**
   * Show the GitHub projects tile?
   */
  display?: boolean;

  /**
   * Tile title
   */
  header?: string;

  /**
   * How many projects to show (4 fills the 2x2 tile)
   */
  limit?: number;
}

interface SEO {
  title?: string;
  description?: string;
  imageURL?: string;
}

interface Social {
  /**
   * LinkedIn username
   */
  linkedin?: string;

  /**
   * Email address
   */
  email?: string;
}

interface Resume {
  /**
   * Resume file url
   */
  fileUrl?: string;
}

interface Certification {
  body?: string;
  name?: string;
  year?: string;
  link?: string;
}

interface Education {
  institution?: string;
  degree?: string;
  from: string;
  to: string;
}

interface GoogleAnalytics {
  /**
   * GA4 tag id G-XXXXXXXXXX
   */
  id?: string;
}

interface Hotjar {
  id?: string;
  snippetVersion?: number;
}

interface CurrentWork {
  /**
   * Small label above the title, e.g. 'Project' | 'Study' | 'Learning'
   */
  type?: string;
  title: string;
  description?: string;
  tags?: Array<string>;
  /**
   * 0 - 100, shown as a progress ring
   */
  progress?: number;
  /**
   * Short note next to the ring, e.g. 'Semester 2 of 4'
   */
  status?: string;
  link?: string;
  /**
   * Optional date range (YYYY-MM-DD). When set, the progress ring and the
   * "Semester X of N" note are worked out automatically from today's date.
   */
  start?: string;
  end?: string;
  /**
   * How many terms the range is split into (e.g. 4 semesters)
   */
  terms?: number;
  /**
   * Word for one term, default 'Semester'
   */
  termLabel?: string;
  /**
   * What you're doing right now, e.g. 'Tuning the ranking model'
   */
  now?: string;
  /**
   * When you last changed `now` (YYYY-MM-DD), shown as "Updated 3 days ago"
   */
  updated?: string;
}

interface Config {
  github: Github;

  /**
   * Vite's base url
   */
  base?: string;

  /**
   * GitHub projects tile: shows your own repos that you have starred
   */
  projects?: GitHubProjects;

  seo?: SEO;
  social?: Social;
  skills?: Array<string>;
  certifications?: Array<Certification>;
  educations?: Array<Education>;
  resume?: Resume;
  googleAnalytics?: GoogleAnalytics;
  hotjar?: Hotjar;

  /**
   * Custom footer (HTML)
   */
  footer?: string;

  enablePWA?: boolean;

  /**
   * Show the "Open to internships" pill on the profile tile
   */
  openToInternships?: boolean;

  /**
   * "Currently working on" tile (up to 3 items look best)
   */
  currentlyWorkingOn?: Array<CurrentWork>;
}

declare const CONFIG: Config;
