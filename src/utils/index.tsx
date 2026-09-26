import { hotjar } from 'react-hotjar';
import {
  SanitizedConfig,
  SanitizedHotjar,
} from '../interfaces/sanitized-config';

type EventParams = {
  [key: string]: string;
};

export const getSanitizedConfig = (
  config: Config,
): SanitizedConfig | Record<string, never> => {
  try {
    return {
      github: {
        username: config.github.username,
      },
      projects: {
        display: config?.projects?.display ?? true,
        header: config?.projects?.header || 'GitHub Projects',
        limit: config?.projects?.limit || 4,
      },
      seo: {
        title: config?.seo?.title,
        description: config?.seo?.description,
        imageURL: config?.seo?.imageURL,
      },
      social: {
        linkedin: config?.social?.linkedin,
        email: config?.social?.email,
      },
      resume: {
        fileUrl: config?.resume?.fileUrl || '',
      },
      skills: config?.skills || [],
      certifications:
        config?.certifications?.filter(
          (certification) =>
            certification.year || certification.name || certification.body,
        ) || [],
      educations:
        config?.educations?.filter(
          (item) => item.institution || item.degree || item.from || item.to,
        ) || [],
      googleAnalytics: {
        id: config?.googleAnalytics?.id,
      },
      hotjar: {
        id: config?.hotjar?.id,
        snippetVersion: config?.hotjar?.snippetVersion || 6,
      },
      footer: config?.footer,
      enablePWA: config?.enablePWA ?? true,
      openToInternships: config?.openToInternships ?? false,
      currentlyWorkingOn:
        config?.currentlyWorkingOn?.filter((item) => item.title) || [],
    };
  } catch (error) {
    return {};
  }
};

export const setupHotjar = (hotjarConfig: SanitizedHotjar): void => {
  if (hotjarConfig?.id) {
    const snippetVersion = hotjarConfig?.snippetVersion || 6;
    hotjar.initialize({ id: parseInt(hotjarConfig.id), sv: snippetVersion });
  }
};

export const ga = {
  event(action: string, params: EventParams): void {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)?.gtag('event', action, params);
    } catch (error) {
      console.error(error);
    }
  },
};
