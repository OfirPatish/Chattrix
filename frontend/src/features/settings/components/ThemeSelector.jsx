import { THEMES } from "../../../shared/settings/themes";

const ThemeSelector = ({ theme, setTheme }) => (
  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-8">
    {THEMES.map((t) => (
      <button
        key={t}
        className={`
          flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
          ${theme === t ? "bg-base-200 ring-2 ring-primary ring-offset-2 ring-offset-base-100" : "hover:bg-base-200/50"}
        `}
        onClick={() => setTheme(t)}
      >
        <div className="relative h-10 w-full rounded-md overflow-hidden" data-theme={t}>
          <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
            <div className="rounded bg-primary"></div>
            <div className="rounded bg-secondary"></div>
            <div className="rounded bg-accent"></div>
            <div className="rounded bg-neutral"></div>
          </div>
        </div>
        <span className="text-[11px] font-medium truncate w-full text-center">
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </span>
      </button>
    ))}
  </div>
);

export default ThemeSelector;
