interface Version {
  name: string;
  timestamp: string;
  description: string;
  features: string[];
}

interface VersionConfig {
  [key: string]: Version;
}

export const getCurrentVersion = (): string => 'giovani';

export const getVersionInfo = async (): Promise<Version> => {
  const versions: VersionConfig = await import('./versions.json');
  return versions[getCurrentVersion()];
};

export const setVersion = (version: string): void => {
  // This function would be implemented when we add version switching functionality
  console.log(`Switching to version: ${version}`);
};