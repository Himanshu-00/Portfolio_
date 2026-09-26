import { useEffect, useRef, useState } from 'react';
import './bento.css';
import { Profile } from '../../interfaces/profile';
import { GithubProject } from '../../interfaces/github-project';
import {
  SanitizedConfig,
  SanitizedCurrentWork,
} from '../../interfaces/sanitized-config';
import { formatDistanceToNow } from 'date-fns';
import { ga } from '../../utils';

/* ------------------------------------------------------------------ */
/* Small inline icons (monochrome, inherit currentColor)               */
/* ------------------------------------------------------------------ */
const ArrowUpRight = () => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M4 10 10 4M5 4h5v5" />
  </svg>
);
const ArrowDown = () => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M7 2v9M3 7l4 4 4-4" />
  </svg>
);
const GithubMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
const CapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinejoin="round"
  >
    <path d="m2 9 10-5 10 5-10 5z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
  </svg>
);
const BadgeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const Skel = ({ w, h, r }: { w: string; h: number; r?: number }) => (
  <div className="hv-skel" style={{ width: w, height: h, borderRadius: r }} />
);

const RING = 113.1; // circumference for r=18

const ProgressRing = ({ value }: { value: number }) => {
  const [offset, setOffset] = useState(RING);
  useEffect(() => {
    const t = setTimeout(
      () => setOffset(RING * (1 - Math.max(0, Math.min(100, value)) / 100)),
      450,
    );
    return () => clearTimeout(t);
  }, [value]);
  return (
    <svg className="hv-ring" viewBox="0 0 46 46" aria-hidden="true">
      <circle className="trk" cx="23" cy="23" r="18" />
      <circle
        className="val"
        cx="23"
        cy="23"
        r="18"
        style={{ strokeDashoffset: offset }}
      />
      <text x="23" y="23">
        {Math.round(value)}%
      </text>
    </svg>
  );
};

/** Spotlight that follows the cursor + a gentle 3D tilt (desktop only). */
const useTileEffects = (
  root: React.RefObject<HTMLDivElement | null>,
  deps: unknown[],
) => {
  useEffect(() => {
    const el = root.current;
    if (!el || typeof window === 'undefined') return;
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    const tiles = Array.from(el.querySelectorAll<HTMLElement>('.hv-t'));
    tiles.forEach((t, i) => t.style.setProperty('--i', String(i)));
    if (!fine) return;

    const cleanups = tiles.map((t) => {
      const move = (e: PointerEvent) => {
        const r = t.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        t.style.setProperty('--mx', `${x}px`);
        t.style.setProperty('--my', `${y}px`);
        if (!calm) {
          const rx = (y / r.height - 0.5) * -4;
          const ry = (x / r.width - 0.5) * 4;
          t.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
        }
      };
      const leave = () => {
        t.style.transform = '';
      };
      t.addEventListener('pointermove', move);
      t.addEventListener('pointerleave', leave);
      return () => {
        t.removeEventListener('pointermove', move);
        t.removeEventListener('pointerleave', leave);
      };
    });
    return () => cleanups.forEach((c) => c());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

const trackClick = (gaId: string | undefined, label: string) => {
  if (!gaId) return;
  try {
    ga.event('Click project', { project: label });
  } catch {
    /* analytics is optional */
  }
};

/* ------------------------------------------------------------------ */
/* Tiles                                                               */
/* ------------------------------------------------------------------ */
const ProfileTile = ({
  profile,
  loading,
  status,
}: {
  profile: Profile | null;
  loading: boolean;
  status?: string;
}) => {
  const [first, ...rest] = (profile?.name || '').trim().split(/\s+/);
  return (
    <section className="hv-t hv-s22">
      <div className="hv-avatar-wrap">
        <svg className="hv-avatar-ring" viewBox="0 0 92 92" aria-hidden="true">
          <rect
            x="1"
            y="1"
            width="90"
            height="90"
            rx="27"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="hv-avatar">
          {loading || !profile ? (
            <Skel w="100%" h={110} r={30} />
          ) : (
            <img src={profile.avatar} alt={profile.name} />
          )}
        </div>
      </div>
      <div className="hv-hello">Hi there, I&apos;m</div>
      {loading || !profile ? (
        <div style={{ display: 'grid', gap: 10, margin: '8px 0 12px' }}>
          <Skel w="70%" h={36} />
          <Skel w="55%" h={36} />
          <Skel w="85%" h={14} />
        </div>
      ) : (
        <>
          <h1 className="hv-name">
            {first}
            {rest.length > 0 && (
              <>
                <br />
                <span>{rest.join(' ')}</span>
              </>
            )}
          </h1>
          {profile.bio && <div className="hv-role">{profile.bio}</div>}
        </>
      )}
      {status && (
        <div className="hv-push" style={{ paddingTop: 16 }}>
          <span className="hv-pill">
            <span className="hv-dot" />
            {status}
          </span>
        </div>
      )}
    </section>
  );
};

type NowItem = SanitizedCurrentWork & {
  /** 0-based index of the current term, when start/end/terms are set */
  term?: number;
  /** months until `end` */
  monthsLeft?: number;
  done?: boolean;
};

/**
 * If an item has start/end dates, work out where you are from today's date:
 * current term, percentage and months to go. Otherwise keep the config values.
 */
const withLiveProgress = (
  item: SanitizedCurrentWork,
  now = new Date(),
): NowItem => {
  if (!item.start || !item.end) return item;
  const start = new Date(item.start);
  const end = new Date(item.end);
  if (Number.isNaN(+start) || Number.isNaN(+end) || +end <= +start) return item;

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
  if (+now < +start) {
    return { ...item, progress: 0, status: `Starts ${fmt(start)}` };
  }
  if (+now >= +end) {
    return { ...item, progress: 100, status: 'Completed', done: true };
  }

  const fraction = (+now - +start) / (+end - +start);
  const terms = item.terms && item.terms > 0 ? item.terms : undefined;
  const monthsLeft = Math.max(
    1,
    (end.getFullYear() - now.getFullYear()) * 12 +
      end.getMonth() -
      now.getMonth(),
  );
  const term = terms
    ? Math.min(terms - 1, Math.floor(fraction * terms))
    : undefined;
  return {
    ...item,
    progress: Math.round(fraction * 100),
    term,
    monthsLeft,
    status: terms
      ? `${item.termLabel || 'Semester'} ${(term ?? 0) + 1} of ${terms}`
      : `Until ${fmt(end)}`,
  };
};

/** Four (or N) pills: done = filled, current = pulsing, upcoming = hollow. */
const TermPills = ({ item }: { item: NowItem }) => (
  <div className="hv-terms">
    <span className="hv-nowlabel">
      <span className="hv-dot" />
      Progress
    </span>
    <div className="hv-pills" aria-hidden="true">
      {Array.from({ length: item.terms ?? 0 }).map((_, i) => (
        <span
          key={i}
          className={
            item.done || i < (item.term ?? -1)
              ? 'done'
              : i === item.term
                ? 'now'
                : undefined
          }
        />
      ))}
    </div>
    <small>
      {item.status}
      {item.monthsLeft !== undefined &&
        ` · ${item.monthsLeft} month${item.monthsLeft === 1 ? '' : 's'} to go`}
    </small>
  </div>
);

/** "Now: …" line with how long ago you updated it. */
const NowLine = ({ item }: { item: NowItem }) => (
  <div className="hv-nowline">
    <span className="hv-nowlabel">
      <span className="hv-dot" />
      Now
    </span>
    <p>{item.now}</p>
    {item.updated && !Number.isNaN(+new Date(item.updated)) && (
      <small>
        Updated{' '}
        {formatDistanceToNow(new Date(item.updated), { addSuffix: true })}
      </small>
    )}
  </div>
);

const NowTile = ({ items }: { items: SanitizedCurrentWork[] }) => (
  <section className="hv-t hv-s42">
    <div className="hv-head">
      <h2 className="hv-title">Currently working on</h2>
      <span className="hv-pill" style={{ marginLeft: 'auto' }}>
        <span className="hv-dot" />
        Live
      </span>
    </div>
    <div
      className="hv-now-grid"
      style={{ '--n': Math.min(items.length, 4) } as React.CSSProperties}
    >
      {items
        .map((it) => withLiveProgress(it))
        .map((item, i) => {
          const inner = (
            <>
              {(item.now || (item.terms && item.start && item.end)) && (
                <div className="hv-now-art">
                  <HalftoneCover
                    project={{ name: item.title } as GithubProject}
                  />
                </div>
              )}
              <div className="hv-txt">
                {item.type && <span className="hv-k">{item.type}</span>}
                <b>{item.title}</b>
                {item.description && <p>{item.description}</p>}
                {item.tags && item.tags.length > 0 && (
                  <div className="hv-tags">
                    {item.tags.map((tag) => (
                      <span className="hv-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {item.terms && item.start && item.end ? (
                <TermPills item={item} />
              ) : item.now ? (
                <NowLine item={item} />
              ) : (
                (typeof item.progress === 'number' || item.status) && (
                  <div className="hv-ringrow">
                    {typeof item.progress === 'number' && (
                      <ProgressRing value={item.progress} />
                    )}
                    {item.status && <small>{item.status}</small>}
                  </div>
                )
              )}
            </>
          );
          return item.link ? (
            <a
              key={i}
              className="hv-now-item"
              href={item.link}
              target="_blank"
              rel="noreferrer"
            >
              {inner}
            </a>
          ) : (
            <div key={i} className="hv-now-item">
              {inner}
            </div>
          );
        })}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Deterministic random numbers seeded by a string (the repo name).    */
/* ------------------------------------------------------------------ */
const seeded = (text: string) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Halftone cover. Dots bloom from one or more centres:
 *  - bigger projects (more code) -> larger, denser blooms
 *  - more languages (complexity) -> more blooms (1-3)
 *  - where the blooms sit comes from the repo name, so every repo differs
 */
const HalftoneCover = ({ project }: { project: GithubProject }) => {
  const rand = seeded(project.name.toLowerCase());
  const bytes = project.codeBytes ?? (project.size ?? 50) * 1024;
  // ~5 KB of code -> 0, ~1 MB+ -> 1 (log scale)
  const scale = Math.min(
    1,
    Math.max(0, (Math.log10(Math.max(bytes, 1)) - 3.7) / 2.3),
  );
  const blooms = Math.min(3, Math.max(1, project.languageCount ?? 1));
  const W = 400;
  const H = 220;
  const step = 13;
  const maxR = 3.2 + scale * 3; // largest dot radius
  const reach = 90 + scale * 170; // how far each bloom spreads
  const centres = Array.from({ length: blooms }, (_, i) => ({
    x: i === 0 ? 220 + rand() * 170 : 30 + rand() * 340,
    y: i === 0 ? 110 + rand() * 110 : rand() * H,
    w: i === 0 ? 1 : 0.55 + rand() * 0.3,
  }));

  const dots: React.ReactNode[] = [];
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      let v = 0;
      for (const c of centres) {
        v = Math.max(v, c.w * (1 - Math.hypot(x - c.x, y - c.y) / reach));
      }
      const lit = v > 0.08;
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={(v > 0 ? 0.7 + v * maxR : 0.7).toFixed(2)}
          className={lit ? 'on' : undefined}
          style={lit ? { opacity: 0.35 + v * 0.65 } : undefined}
        />,
      );
    }
  }

  return (
    <>
      <svg
        className="hv-halftone"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {dots}
      </svg>
      <span className="hv-glass" aria-hidden="true" />
    </>
  );
};

const ProjectsTile = ({
  header,
  username,
  projects,
  loading,
  limit,
  gaId,
}: {
  header: string;
  username: string;
  projects: GithubProject[];
  loading: boolean;
  limit: number;
  gaId?: string;
}) => {
  const count = loading ? Math.min(limit, 2) : projects.length;
  return (
    <section className="hv-t hv-s42">
      <div className="hv-head">
        <h2 className="hv-title">{header}</h2>
        <span className="hv-sub">
          <span className="hv-dot" />
          Starred on GitHub
        </span>
        <a
          className="hv-see-all"
          href={`https://github.com/${username}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
        >
          See all <span>→</span>
        </a>
      </div>
      <div
        className={`hv-pgrid${count > 2 ? ' dense' : ''}`}
        style={
          { '--pc': Math.min(Math.max(count, 1), 2) } as React.CSSProperties
        }
      >
        {loading ? (
          Array.from({ length: count }).map((_, i) => (
            <div className="hv-pcard" key={i}>
              <div className="hv-pbody" style={{ gap: 10 }}>
                <Skel w="60%" h={18} />
                <Skel w="85%" h={12} />
              </div>
            </div>
          ))
        ) : projects.length === 0 ? (
          <p className="hv-sub">
            Star one of your repos on GitHub and it will show up here.
          </p>
        ) : (
          projects.map((p) => (
            <a
              key={p.html_url}
              className="hv-pcard"
              href={p.html_url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick(gaId, p.name)}
            >
              <div className="hv-pbg" aria-hidden="true">
                <HalftoneCover project={p} />
              </div>
              <div className="hv-ptop">
                {p.language && <span className="hv-plang">{p.language}</span>}
                <span className="hv-btn-round">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="hv-pbody">
                <div className="hv-pname">{p.name}</div>
                <p className={p.description ? undefined : 'empty'}>
                  {p.description || 'No description on GitHub yet'}
                </p>
              </div>
              <div className="hv-pinfo">
                <div className="hv-meta">
                  <span>★ {p.stargazers_count}</span>
                  <span>Forks {p.forks_count}</span>
                  {p.pushed_at && (
                    <span>
                      Updated{' '}
                      {formatDistanceToNow(new Date(p.pushed_at), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </section>
  );
};

const ContactTile = ({
  href,
  label,
  value,
  icon,
  iconClass,
  download,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
  download?: boolean;
}) => (
  <a
    className="hv-t hv-flat"
    href={href}
    target={href.startsWith('mailto:') ? undefined : '_blank'}
    rel="noreferrer"
  >
    <div className={`hv-icon ${iconClass}`}>{icon}</div>
    <div className="hv-who">
      <span className="hv-label">{label}</span>
      <span className="hv-handle">{value}</span>
    </div>
    <span className="hv-btn-round">
      {download ? <ArrowDown /> : <ArrowUpRight />}
    </span>
  </a>
);

const SKILLS_SHOWN = 15;

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
const Bento = ({
  profile,
  loading,
  config,
  githubProjects,
}: {
  profile: Profile | null;
  loading: boolean;
  config: SanitizedConfig;
  githubProjects: GithubProject[];
}) => {
  const root = useRef<HTMLDivElement>(null);
  useTileEffects(root, [loading, githubProjects.length]);

  const { social, skills, educations, certifications } = config;
  const shownSkills = skills.slice(0, SKILLS_SHOWN);
  const hiddenSkills = skills.slice(SKILLS_SHOWN);

  const glanceTile = (
    <section className="hv-t hv-flat hv-glance">
      <div className="hv-stats">
        <div>
          <div className="hv-big">
            {loading || !profile ? '–' : (profile.publicRepos ?? 0)}
          </div>
          <div className="hv-label">Repos</div>
        </div>
        <div>
          <div className="hv-big">{certifications.length}</div>
          <div className="hv-label">Certs</div>
        </div>
        <div>
          <div className="hv-big">{skills.length}</div>
          <div className="hv-label">Skills</div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="hv-root" ref={root}>
      <main className="hv-wrap">
        <header className="hv-topbar">
          <span className="hv-brand">
            {profile?.name?.trim() || config.github.username}
          </span>
        </header>

        <div className="hv-bento">
          <ProfileTile
            profile={profile}
            loading={loading}
            status={
              config.openToInternships ? 'Open to internships' : undefined
            }
          />

          {config.currentlyWorkingOn.length > 0 && (
            <NowTile items={config.currentlyWorkingOn} />
          )}

          {config.projects.display && (
            <ProjectsTile
              header={config.projects.header}
              username={config.github.username}
              projects={githubProjects}
              loading={loading}
              limit={config.projects.limit}
              gaId={config.googleAnalytics.id}
            />
          )}

          {/* contact column */}
          <ContactTile
            href={`https://github.com/${config.github.username}`}
            label="GitHub"
            value={config.github.username}
            icon={<GithubMark />}
            iconClass="ink"
          />
          {social.linkedin && (
            <ContactTile
              href={`https://www.linkedin.com/in/${social.linkedin}`}
              label="LinkedIn"
              // hide LinkedIn's auto-generated ID suffix (e.g. -9b414322b) in the label
              value={social.linkedin.replace(/-(?=[a-z]*\d)[a-z\d]{6,}$/i, '')}
              icon={<span className="hv-in">in</span>}
              iconClass="ink"
            />
          )}
          {social.email && (
            <ContactTile
              href={`mailto:${social.email}`}
              label="Email"
              value="Say hello"
              icon={<MailIcon />}
              iconClass="acc"
            />
          )}
          {config.resume.fileUrl && (
            <ContactTile
              href={config.resume.fileUrl}
              label="Resume"
              value="Download CV"
              icon={<DocIcon />}
              iconClass="acc"
              download
            />
          )}

          {skills.length > 0 && (
            <section className="hv-t hv-s22">
              <div className="hv-label">Tech stack</div>
              <div className="hv-chips">
                {shownSkills.map((s) => (
                  <span className="hv-chip" key={s}>
                    {s}
                  </span>
                ))}
                {hiddenSkills.length > 0 && (
                  <span
                    className="hv-chip more"
                    title={hiddenSkills.join(', ')}
                  >
                    +{hiddenSkills.length}
                  </span>
                )}
              </div>
            </section>
          )}

          {educations.length > 0 && (
            <section className="hv-t hv-s22">
              <div className="hv-label">Education</div>
              <div className="hv-list">
                {educations.map((e, i) => (
                  <div className="hv-row" key={i}>
                    <div className="hv-icon">
                      <CapIcon />
                    </div>
                    <div>
                      <b>{e.degree}</b>
                      <span>
                        {[
                          e.institution,
                          [e.from, e.to].filter(Boolean).join(' – '),
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section className="hv-t hv-s23 hv-cert">
              <div className="hv-label">Certifications</div>
              <div className="hv-list">
                {certifications.map((c, i) => {
                  const body = (
                    <>
                      <div className="hv-icon">
                        <BadgeIcon />
                      </div>
                      <div>
                        <b>{c.name}</b>
                        <span>
                          {[c.body, c.year].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    </>
                  );
                  return c.link ? (
                    <a
                      className="hv-row"
                      key={i}
                      href={c.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="hv-row" key={i}>
                      {body}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {glanceTile}
        </div>

        {config.footer && (
          <footer
            className="hv-foot"
            dangerouslySetInnerHTML={{ __html: config.footer }}
          />
        )}
      </main>
    </div>
  );
};

export default Bento;
