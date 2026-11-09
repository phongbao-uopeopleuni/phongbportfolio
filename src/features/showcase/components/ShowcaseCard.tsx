import {ArrowUpRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import {CATEGORY_LABEL} from '../data/categories';
import {S} from '../i18n/strings';
import type {ShowcaseProject} from '../types/showcase';
import StatusBadge from './StatusBadge';

/** The du an. Anh xem truoc nam o khoi RIENG phia tren, chu nam o khoi rieng
 *  phia duoi — khong bao gio de chu noi tren anh, vi panel trong suot dat tren
 *  nen sang chi con 3.37:1 cho chu chinh va 1.54:1 cho chu phu. */
export default function ShowcaseCard({
  project,
  locale,
  index,
}: {
  project: ShowcaseProject;
  locale: 'vi' | 'en';
  index: number;
}) {
  const hasDemo = project.modules.some((m) => m.kind === 'demo');

  return (
    <article className="glass-card flex min-w-0 flex-col overflow-hidden rounded-lg border border-line hover:border-accent/60">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted">
            {String(index + 1).padStart(2, '0')} ·
          </span>
          <span className="font-mono text-xs text-accent">
            [{CATEGORY_LABEL[project.category][locale]}]
          </span>
          <StatusBadge status={project.status} locale={locale} />
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">
          <Link
            to={`/showcase/${project.slug}`}
            className="hover:text-accent transition-colors focus-visible:text-accent"
          >
            {project.title[locale]}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed">
          {project.summary[locale]}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((item) => (
            <span
              key={item}
              className="rounded border border-line px-2 py-0.5 font-mono text-[11px]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            to={`/showcase/${project.slug}`}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline underline-offset-4"
          >
            {hasDemo ? S.launchDemo[locale] : S.openDetail[locale]}
            <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
          </Link>
          <span className="font-mono text-[11px] text-muted">
            {S.updatedOn[locale]} {project.updated}
          </span>
        </div>
      </div>
    </article>
  );
}
