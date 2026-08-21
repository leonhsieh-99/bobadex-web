const QUOTE = "I'm not just a drink, but a lifestyle.";

const TEA_PATH =
  "M64 104 h112 l-11 168 a16 16 0 0 1 -16 14 h-58 a16 16 0 0 1 -16 -14 z";

export default function MilkTeaCup() {
  return (
    <button
      type="button"
      className="group relative aspect-[240/340] h-[82%] max-h-[40rem] w-auto max-w-full cursor-pointer border-0 bg-transparent p-0 outline-none"
      aria-label={QUOTE}
    >
      <svg
        viewBox="0 0 240 340"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="about-tea-clip">
            <path d={TEA_PATH} />
          </clipPath>
        </defs>

        <ellipse
          cx="120"
          cy="322"
          rx="62"
          ry="10"
          fill="#2b241f"
          opacity="0.1"
          className="cup-joint motion-safe:animate-milk-tea-pearl [animation-duration:3.4s]"
        />

        <g className="cup-body motion-safe:animate-milk-tea-idle motion-safe:group-hover:[animation-play-state:paused]">
          <g className="cup-joint origin-[139px_45px] motion-safe:animate-milk-tea-straw">
            <rect x="132" y="6" width="14" height="78" rx="5" fill="#ef5b46" />
            <rect x="132" y="18" width="14" height="10" fill="#ffc84a" />
            <rect x="132" y="42" width="14" height="10" fill="#ffc84a" />
          </g>

          <path
            d="M58 86 C58 62, 182 62, 182 86"
            fill="#fff8e8"
            stroke="#2b241f"
            strokeWidth="4"
          />
          <ellipse
            cx="120"
            cy="86"
            rx="62"
            ry="14"
            fill="#fff3d6"
            stroke="#2b241f"
            strokeWidth="4"
          />

          <path
            d="M52 88 h136 l-14 196 a24 24 0 0 1 -24 20 h-60 a24 24 0 0 1 -24 -20 z"
            fill="#fff8e8"
            stroke="#2b241f"
            strokeWidth="4"
          />

          <text
            x="120"
            y="252"
            textAnchor="middle"
            stroke="#2b241f"
            strokeWidth="0.7"
            strokeLinejoin="round"
            paintOrder="stroke"
            className="pointer-events-none fill-[#fff8e8] font-sans text-[8.5px] font-black tracking-[-0.04em] opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <tspan x="120" dy="0">
              I&apos;m not just
            </tspan>
            <tspan x="120" dy="11">
              a drink, but
            </tspan>
            <tspan x="120" dy="11">
              a lifestyle.
            </tspan>
          </text>

          <g clipPath="url(#about-tea-clip)">
            <g className="cup-tea transition-transform duration-700 ease-in group-hover:translate-y-full group-focus-visible:translate-y-full">
              <path d={TEA_PATH} fill="#f3c27a" />
              <circle
                cx="92"
                cy="232"
                r="11"
                fill="#5b3a1e"
                className="cup-joint motion-safe:animate-milk-tea-pearl"
              />
              <circle
                cx="128"
                cy="248"
                r="10"
                fill="#5b3a1e"
                className="cup-joint motion-safe:animate-milk-tea-pearl [animation-delay:-0.35s]"
              />
              <circle
                cx="150"
                cy="226"
                r="9"
                fill="#5b3a1e"
                className="cup-joint motion-safe:animate-milk-tea-pearl [animation-delay:-0.7s]"
              />
              <circle
                cx="110"
                cy="262"
                r="8.5"
                fill="#5b3a1e"
                className="cup-joint motion-safe:animate-milk-tea-pearl [animation-delay:-1.1s]"
              />
              <circle
                cx="86"
                cy="258"
                r="7"
                fill="#4a2e18"
                opacity="0.7"
                className="cup-joint motion-safe:animate-milk-tea-pearl [animation-delay:-0.5s]"
              />
            </g>
          </g>

          <circle cx="94" cy="148" r="9" fill="#2b241f" />
          <circle cx="146" cy="148" r="9" fill="#2b241f" />
          <circle cx="91" cy="145" r="3" fill="#fff8e8" />
          <circle cx="143" cy="145" r="3" fill="#fff8e8" />
          <circle cx="82" cy="168" r="8" fill="#ef5b46" opacity="0.28" />
          <circle cx="158" cy="168" r="8" fill="#ef5b46" opacity="0.28" />
          <path
            d="M104 180 q16 11 32 0"
            fill="none"
            stroke="#2b241f"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </button>
  );
}
