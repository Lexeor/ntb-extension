interface AppConfig {
  weatherApiKey: string;
  footballApiKey: string;
}

let _config: AppConfig | null = null;

export async function loadConfig(): Promise<void> {
  if (import.meta.env.DEV) {
    _config = {
      weatherApiKey: import.meta.env.VITE_WEATHER_API_KEY ?? '',
      footballApiKey: import.meta.env.VITE_FOOTBALL_API_KEY ?? '',
    };
    return;
  }

  const res = await fetch('config.json');
  if (!res.ok) throw new Error(`Failed to load config.json: ${res.status}`);
  _config = await res.json() as AppConfig;
}

export function getConfig(): AppConfig {
  if (!_config) throw new Error('Config not loaded — call loadConfig() first');
  return _config;
}
