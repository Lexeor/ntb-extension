interface Props {
  variant: 'weather' | 'football';
  className?: string;
}

const VARIANTS = {
  weather: {
    href: 'https://home.openweathermap.org/users/sign_up',
    configKey: 'weatherApiKey',
  },
  football: {
    href: 'https://www.football-data.org/client/register',
    configKey: 'footballApiKey',
  },
} as const;

function NoApiKey({ variant, className }: Props) {
  const { href, configKey } = VARIANTS[variant];
  return (
    <div
      className={`flex flex-col gap-0 text-white font-thin w-full h-full justify-center items-center ${className}`}>
      No API key{' '}
      <a href={href} target="_blank" rel="noreferrer" className="text-blue-500 underline">
        register for free
      </a>
      {' '}and set <code>{configKey}</code> in config.json{' '}
      <p>at the widget folder</p>
    </div>
  );
}

export default NoApiKey;
