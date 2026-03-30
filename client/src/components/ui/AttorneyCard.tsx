import { cn } from "@/lib/utils"; // if you don’t have this, replace cn(...) with className strings
import { ArrowUpRight } from "lucide-react";

type Attorney = {
  name: string;
  role: string;
  image: string;   // local path or absolute URL
  href: string;
  blurb: string;   // short hover copy
  tags?: string[]; // optional pills (e.g., Spanish, Trial, 20+ yrs)
};

type Props = {
  data: Attorney;
  className?: string;
};

const AttorneyCard = ({ data, className }: Props) => {
  const { name, role, image, href, blurb, tags = [] } = data;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-all duration-300 hover:shadow-divine",
        className
      )}
    >
      {/* Clickable media */}
      <a href={href} target="_blank" rel="noopener noreferrer" className="block relative">
        <img
          src={image}
          alt={`${name} – ${role}`}
          className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="pointer-events-none">
            <h3 className="text-white text-lg font-semibold leading-tight drop-shadow">
              {name}
            </h3>
            <p className="text-white/80 text-sm italic">{role}</p>
            <p className="mt-3 text-white/90 text-sm leading-6 line-clamp-4">
              {blurb}
            </p>

            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-white/90 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </a>

      {/* Base content (visible when not hovering) */}
      <div className="p-4">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-1"
        >
          <h4 className="font-semibold leading-tight">{name}</h4>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
        </a>
        <p className="text-muted-foreground text-sm">{role}</p>
      </div>

      {/* Keyboard accessibility: show overlay on focus */}
      <style>{`
        article:focus-within .overlay,
        article:focus-within .overlay-content {
          opacity: 1;
        }
      `}</style>
    </article>
  );
};

export default AttorneyCard;
export type { Attorney };
