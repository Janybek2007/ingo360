import React from 'react';

import { useSession } from '#/shared/session';

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5.18 4.37 2.09 6.54L12 17.77l-6.91 2.91 2.09-6.54L2 9.27l6.91-1.01L12 2z';

const DISPERSE_TRANSFORMS = [
  'translate(-120vw, -80vh) scale(0.3)',
  'translate(120vw, -80vh) scale(0.3)',
  'translate(-120vw, 80vh) scale(0.3)',
  'translate(120vw, 80vh) scale(0.3)',
  'translate(0, -100vh) scale(0.2)',
];

export const WelcomeMessage: React.FC = React.memo(() => {
  const setIsWelcomeShown = useSession(u => u.setIsWelcomeShown);
  const [phase, setPhase] = React.useState<'stars' | 'modal'>('stars');

  React.useEffect(() => {
    const disperseTimer = setTimeout(() => {
      setPhase('modal');
    }, 3000);

    return () => clearTimeout(disperseTimer);
  }, []);

  React.useEffect(() => {
    if (phase !== 'modal') return;

    const closeTimer = setTimeout(() => {
      setIsWelcomeShown(false);
    }, 1500);

    return () => clearTimeout(closeTimer);
  }, [phase, setIsWelcomeShown]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Stars overlay (0-3s) */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-white/95 ${
          phase === 'modal' ? 'pointer-events-none opacity-0' : ''
        }`}
        style={{
          transition: phase === 'modal' ? 'opacity 0.3s ease-out' : undefined,
        }}
      >
        {/* 5 stars in circle, rotating 360° together (2.5s), then disperse (0.5s) */}
        <div className="welcome-star-rotate relative h-40 w-40">
          {[0, 1, 2, 3, 4].map(index => {
            const angle = (index * 360) / 5 - 90;
            const radius = 48;
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <svg
                key={index}
                className="welcome-star-disperse absolute h-10 w-10"
                style={{
                  left: `calc(${x}% - 1.25rem)`,
                  top: `calc(${y}% - 1.25rem)`,
                  ['--disperse-transform' as string]:
                    DISPERSE_TRANSFORMS[index],
                }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d={STAR_PATH} className="text-primary" />
              </svg>
            );
          })}
        </div>
      </div>

      {/* Welcome modal (3s-4.5s) */}
      {phase === 'modal' && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="animate-fade-in relative z-10 flex h-[250px] w-[250px] flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-label="Добро пожаловать"
          >
            <p className="text-center text-lg font-medium text-gray-800">
              Добро пожаловать
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

WelcomeMessage.displayName = '_WelcomeMessage_';
