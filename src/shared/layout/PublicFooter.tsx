import {
  OSM_COPYRIGHT_URL,
  PRIVACY_URL,
  SUPPORT_EMAIL,
  TERMS_URL,
} from "@/shared/site";

const linkClass =
  "underline decoration-[#2b241f]/20 underline-offset-2 hover:opacity-100";

export default function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-[#2b241f]/10 pt-5 text-xs leading-6 opacity-55 sm:text-sm">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold opacity-80">Bobadex</span>
        <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className={linkClass}>
          Privacy
        </a>
        <a href={TERMS_URL} target="_blank" rel="noreferrer" className={linkClass}>
          Terms
        </a>
        <a
          href={OSM_COPYRIGHT_URL}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          © OpenStreetMap
        </a>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Bobadex feedback")}`}
          className={linkClass}
        >
          {SUPPORT_EMAIL}
        </a>
      </p>
    </footer>
  );
}
