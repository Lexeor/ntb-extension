import { cn } from '@/lib/utils.ts';
import NoApiKey from '../NoApiKey';
import { EPL_TEAMS, TEAM_COLORS } from './constants';
import type { EPLMatch } from './types';
import { useEPLWidget } from './useEPLWidget';
import { formatMatchDate } from './utils';

function EPLWidget() {
  const {
    teamId,
    match,
    countdown,
    error,
    loading,
    isMatchday,
    selectingTeam,
    selectedTeam,
    setSelectingTeam,
    handleTeamChange,
  } = useEPLWidget();

  return (
    <div
      className={cn('relative overflow-hidden font-[\'Exo_2\',sans-serif] bg-[var(--clr-gadget-bg)] rounded-[20px] w-full max-w-[400px] min-h-[200px] p-3 pb-12 text-[whitesmoke] flex flex-col gap-2 mt-3 backdrop-blur-sm', isMatchday && 'pb-16')}>

      {/* Header */}
      <div className="flex justify-between items-center h-8">
        <div className="absolute left-1/2 -translate-x-1/2 top-2 opacity-60">
          <img
            src={match?.competition.emblem ?? '/images/epl-logo.svg'}
            alt="competition_logo"
            className="w-12 h-12 brightness-0 invert"
          />
        </div>

        {selectingTeam ? (
          <select
            className="bg-black/60 text-[whitesmoke] border border-white/20 rounded-md px-2 py-0.5 text-[0.8rem] font-['Exo_2',sans-serif] outline-none cursor-pointer"
            value={teamId}
            onChange={handleTeamChange}
            onBlur={() => setSelectingTeam(false)}
            autoFocus
          >
            {EPL_TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.shortName}
              </option>
            ))}
          </select>
        ) : (
          <button
            className="[all:unset] ml-auto flex items-center justify-center text-base opacity-30 cursor-pointer p-1 rounded-md transition-[opacity,background-color] duration-200 hover:opacity-80 hover:bg-white/10"
            onClick={() => setSelectingTeam(true)}
            title={selectedTeam?.shortName ?? 'Select team'}
          >
            <i className="ri-settings-3-line" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center">
        {error === 'no_key' ? (
          <NoApiKey variant="football" className="text-white/45 text-sm py-2" />
        ) : error ? (
          <div className="text-white/45 text-sm py-2">{error}</div>
        ) : loading || !match ? (
          <div className="text-white/45 text-sm py-2">Loading…</div>
        ) : (
          <MatchContent match={match} teamId={teamId} countdown={countdown} isMatchday={isMatchday} />
        )}
      </div>

      {/* Footer */}
      {match && (
        <div
          className={cn('absolute bottom-3 left-0 right-0 px-3 flex flex-col items-center gap-0', isMatchday && 'bottom-10')}>
          <div className="text-[0.8rem] opacity-60">{formatMatchDate(match.utcDate)}</div>
          <div className="text-[0.65rem] opacity-35 uppercase tracking-[0.05em]">{match.competition.name}</div>
        </div>
      )}
    </div>
  );
}

interface MatchContentProps {
  match: EPLMatch;
  teamId: number;
  countdown: { days: number; hours: number; minutes: number };
  isMatchday: boolean;
}

function MatchContent({ match, teamId, countdown, isMatchday }: MatchContentProps) {
  const isHome = match.homeTeam.id === teamId;

  return (
    <>
      {/* Coloured glow */}
      <div
        className={`absolute w-[55%] aspect-square rounded-full blur-[50px] opacity-30 pointer-events-none bottom-[-20%] ${isHome ? 'left-[-10%]' : 'right-[-10%]'}`}
        style={{ backgroundColor: TEAM_COLORS[teamId] ?? '#ffffff' }}
      />

      {/* HOME / AWAY watermark */}
      {isHome ? (
        <p className="absolute bottom-10 -rotate-90 -left-11 opacity-10 text-[40px]">HOME</p>
      ) : (
        <p className="absolute bottom-10 -rotate-90 -right-9 opacity-10 text-[40px]">AWAY</p>
      )}

      {/* Teams + countdown */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center py-1 w-full">
        <TeamCard crest={match.homeTeam.crest} name={match.homeTeam.shortName} />

        <div className="flex flex-row items-center gap-1">
          {[
            { value: countdown.days, label: 'DAYS' },
            { value: countdown.hours, label: 'HOURS' },
            { value: countdown.minutes, label: 'MINS' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-[0.1em]">
              <span className="text-base font-semibold tracking-[0.08em] opacity-45">{label}</span>
              <span
                className="font-['Exo',sans-serif] text-[1.6rem] font-bold leading-none bg-gradient-to-b from-[#eee] to-[#c2c2c2] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {String(value).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        <TeamCard crest={match.awayTeam.crest} name={match.awayTeam.shortName} />
      </div>

      {isMatchday && (
        <p
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-60 text-[48px] font-bold tracking-wide pointer-events-none select-none whitespace-nowrap">
          MATCHDAY
        </p>
      )}
    </>
  );
}

function TeamCard({ crest, name }: { crest: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <img className="w-16 h-16 object-contain" src={crest} alt={name} />
      <span className="text-xs text-center opacity-85 max-w-[90px]">{name}</span>
    </div>
  );
}

export default EPLWidget;
