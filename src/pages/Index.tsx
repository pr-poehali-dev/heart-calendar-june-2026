const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const JUNE_2026_START = 0;
const TOTAL_DAYS = 30;

export default function Index() {
  const cells: (number | null)[] = [];
  for (let i = 0; i < JUNE_2026_START; i++) cells.push(null);
  for (let d = 1; d <= TOTAL_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="calendar-page">
      <div className="calendar-card">
        <div className="calendar-header">
          <span className="calendar-year">2026</span>
          <h1 className="calendar-month">Июнь</h1>
          <div className="header-line" />
        </div>

        <div className="calendar-grid">
          {DAYS.map((d, i) => (
            <div key={d} className={`day-name ${i >= 5 ? "weekend-name" : ""}`}>
              {d}
            </div>
          ))}

          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="day-cell empty" />;
            const isHeart = day === 12;
            const colIndex = (JUNE_2026_START + day - 1) % 7;
            const isWeekend = colIndex >= 5;

            return (
              <div
                key={day}
                className={`day-cell ${isHeart ? "heart-day" : ""} ${isWeekend ? "weekend-day" : ""}`}
                style={{ animationDelay: `${day * 30}ms` }}
              >
                {isHeart ? (
                  <div className="heart-wrapper">
                    <svg className="heart-svg" viewBox="0 0 32 30" fill="none">
                      <path
                        d="M16 28C16 28 2 19.5 2 10C2 5.58172 5.58172 2 10 2C12.3678 2 14.4958 3.0361 16 4.68533C17.5042 3.0361 19.6322 2 22 2C26.4183 2 30 5.58172 30 10C30 19.5 16 28 16 28Z"
                        fill="var(--heart-fill)"
                        stroke="var(--heart-stroke)"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="heart-number">{day}</span>
                  </div>
                ) : (
                  <span className="day-number" style={{ color: isWeekend ? "var(--peach-dark)" : undefined }}>
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendar-footer">
          <div className="footer-dots">
            <span className="dot dot-peach" />
            <span className="dot dot-lavender" />
            <span className="dot dot-mint" />
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --peach: #FFDAC1;
          --peach-light: #FFF0E8;
          --peach-dark: #C97C50;
          --lavender: #E8DAFF;
          --lavender-light: #F4EEFF;
          --lavender-dark: #8B6BAE;
          --mint: #C7F2E4;
          --mint-light: #EDFAF5;
          --mint-dark: #4AA885;
          --heart-fill: #FFBCBC;
          --heart-stroke: #F07878;
          --text-main: #4A3F52;
          --text-soft: #B0A0BC;
          --bg-page: transparent;
          --card-bg: transparent;
          --card-shadow: none;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: transparent;
          font-family: 'Montserrat', sans-serif;
        }

        .calendar-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: transparent;
        }

        .calendar-card {
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          padding: 48px 52px 40px;
          width: 100%;
          max-width: 460px;
          animation: fadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .calendar-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .calendar-year {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.45em;
          color: var(--text-soft);
          text-transform: uppercase;
        }

        .calendar-month {
          font-family: 'Cormorant', serif;
          font-weight: 300;
          font-size: 56px;
          color: var(--text-main);
          line-height: 1;
          margin-top: 2px;
          letter-spacing: 0.02em;
        }

        .header-line {
          width: 48px;
          height: 1.5px;
          background: linear-gradient(90deg, var(--peach), var(--lavender), var(--mint));
          margin: 14px auto 0;
          border-radius: 2px;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .day-name {
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-soft);
          text-align: center;
          padding-bottom: 12px;
        }

        .weekend-name {
          color: var(--peach-dark);
          opacity: 0.8;
        }

        .day-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          animation: cellIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
          transition: transform 0.18s ease, background 0.18s ease;
          cursor: default;
        }

        .day-cell:not(.empty):hover {
          background: var(--lavender-light);
          transform: scale(1.1);
        }

        .heart-day:hover {
          background: transparent !important;
        }

        @keyframes cellIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }

        .day-number {
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: var(--text-main);
        }

        .weekend-day .day-number {
          color: var(--peach-dark);
        }

        .heart-day {
          background: transparent;
        }

        .heart-wrapper {
          position: relative;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .heart-svg {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: heartPulse 2.4s ease-in-out infinite;
          filter: drop-shadow(0 3px 10px rgba(240, 120, 120, 0.4));
        }

        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.1); }
          55% { transform: scale(1.05); }
        }

        .heart-number {
          position: relative;
          z-index: 1;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: #fff;
          letter-spacing: 0;
          margin-top: -1px;
        }

        .calendar-footer {
          margin-top: 32px;
          display: flex;
          justify-content: center;
        }

        .footer-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .dot {
          display: block;
          border-radius: 50%;
        }

        .dot-peach { width: 10px; height: 10px; background: var(--peach); }
        .dot-lavender { width: 8px; height: 8px; background: var(--lavender); }
        .dot-mint { width: 10px; height: 10px; background: var(--mint); }
      `}</style>
    </div>
  );
}