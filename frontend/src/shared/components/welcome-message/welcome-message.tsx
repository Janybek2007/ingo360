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
  const { setIsWelcomeShown } = useSession();
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
          phase === 'modal' ? 'opacity-0 pointer-events-none' : ''
        }`}
        style={{
          transition: phase === 'modal' ? 'opacity 0.3s ease-out' : undefined,
        }}
      >
        {/* 5 stars in circle, rotating 360° together (2.5s), then disperse (0.5s) */}
        <div className="relative w-40 h-40 welcome-star-rotate">
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i * 360) / 5 - 90;
            const radius = 48;
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <svg
                key={i}
                className="absolute w-10 h-10 welcome-star-disperse"
                style={{
                  left: `calc(${x}% - 1.25rem)`,
                  top: `calc(${y}% - 1.25rem)`,
                  ['--disperse-transform' as string]: DISPERSE_TRANSFORMS[i],
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
        <div className="fixed inset-0 flex items-center justify-center z-[10001]">
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative z-10 w-[250px] h-[250px] bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl animate-fade-in"
            role="dialog"
            aria-label="Добро пожаловать"
          >
            <p className="text-gray-800 text-center text-lg font-medium">
              Добро пожаловать
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

WelcomeMessage.displayName = 'WelcomeMessage';
