import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { formatDistance } from 'date-fns';
import {
  CustomError,
  GENERIC_ERROR,
  INVALID_CONFIG_ERROR,
  INVALID_GITHUB_USERNAME_ERROR,
  setTooManyRequestError,
} from '../constants/errors';
import '../assets/index.css';
import { getSanitizedConfig, setupHotjar } from '../utils';
import { SanitizedConfig } from '../interfaces/sanitized-config';
import ErrorPage from './error-page';
import { Profile } from '../interfaces/profile';
import { GithubProject } from '../interfaces/github-project';
import Bento from './bento';

/**
 * Renders the GitProfile component.
 *
 * @param {Object} config - the configuration object
 * @return {JSX.Element} the rendered GitProfile component
 */
const GitProfile = ({ config }: { config: Config }) => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(config),
  );
  const [error, setError] = useState<CustomError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [githubProjects, setGithubProjects] = useState<GithubProject[]>([]);

  /**
   * Your own public repos that you have starred on GitHub,
   * most recently starred first. Star a repo to feature it; unstar to hide it.
   */
  const getStarredProjects = useCallback(async (): Promise<GithubProject[]> => {
    const { username } = sanitizedConfig.github;
    const response = await axios.get<GithubProject[]>(
      `https://api.github.com/users/${username}/starred?per_page=100`,
    );
    const repos = response.data
      .filter(
        (repo) => repo.owner?.login.toLowerCase() === username.toLowerCase(),
      )
      .slice(0, sanitizedConfig.projects.limit);

    // Code size + number of languages drive each card's halftone cover.
    return Promise.all(
      repos.map(async (repo) => {
        try {
          const { data } = await axios.get<Record<string, number>>(
            `https://api.github.com/repos/${username}/${repo.name}/languages`,
          );
          const bytes = Object.values(data);
          return {
            ...repo,
            codeBytes: bytes.reduce((a, b) => a + b, 0),
            languageCount: bytes.length,
          };
        } catch {
          return repo; // cover falls back to the repo size
        }
      }),
    );
  }, [sanitizedConfig.github, sanitizedConfig.projects.limit]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://api.github.com/users/${sanitizedConfig.github.username}`,
      );
      const data = response.data;

      setProfile({
        avatar: data.avatar_url,
        name: data.name || ' ',
        bio: data.bio || '',
        publicRepos: data.public_repos,
      });

      if (sanitizedConfig.projects.display) {
        setGithubProjects(await getStarredProjects());
      }
    } catch (error) {
      handleError(error as AxiosError | Error);
    } finally {
      setLoading(false);
    }
  }, [
    sanitizedConfig.github.username,
    sanitizedConfig.projects.display,
    getStarredProjects,
  ]);

  useEffect(() => {
    if (Object.keys(sanitizedConfig).length === 0) {
      setError(INVALID_CONFIG_ERROR);
    } else {
      setError(null);
      setupHotjar(sanitizedConfig.hotjar);
      loadData();
    }
  }, [sanitizedConfig, loadData]);

  const handleError = (error: AxiosError | Error): void => {
    console.error('Error:', error);

    if (error instanceof AxiosError) {
      try {
        const reset = formatDistance(
          new Date(error.response?.headers?.['x-ratelimit-reset'] * 1000),
          new Date(),
          { addSuffix: true },
        );

        if (typeof error.response?.status === 'number') {
          switch (error.response.status) {
            case 403:
              setError(setTooManyRequestError(reset));
              break;
            case 404:
              setError(INVALID_GITHUB_USERNAME_ERROR);
              break;
            default:
              setError(GENERIC_ERROR);
              break;
          }
        } else {
          setError(GENERIC_ERROR);
        }
      } catch (innerError) {
        setError(GENERIC_ERROR);
      }
    } else {
      setError(GENERIC_ERROR);
    }
  };

  return (
    <>
      {error ? (
        <ErrorPage
          status={error.status}
          title={error.title}
          subTitle={error.subTitle}
        />
      ) : (
        <Bento
          profile={profile}
          loading={loading}
          config={sanitizedConfig as SanitizedConfig}
          githubProjects={githubProjects}
        />
      )}
    </>
  );
};

export default GitProfile;
