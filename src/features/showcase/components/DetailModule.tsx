import {Suspense, lazy} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {S} from '../i18n/strings';
import type {DetailModule as Mod} from '../types/showcase';

/* Demo nap rieng mot lan nua: vao trang chi tiet cua du an khong co demo
   thi khong tai code cua no. */
const CpuSchedulingLab = lazy(
  () => import('../demos/cpu-scheduling/CpuSchedulingLab'),
);

const DEMOS = {'cpu-scheduling': CpuSchedulingLab} as const;

export default function DetailModule({
  mod,
  locale,
}: {
  mod: Mod;
  locale: 'vi' | 'en';
}) {
  const heading = S.moduleTitle[mod.kind][locale];

  return (
    <section className="mt-12">
      <h2 className="font-mono text-sm text-accent">
        <span aria-hidden="true">{'// '}</span>
        {heading}
      </h2>

      <div className="mt-4">
        {mod.kind === 'overview' && (
          <div className="glass-panel rounded-lg border border-line p-5 space-y-4 text-sm leading-relaxed">
            <div>
              <p className="font-mono text-xs text-ink mb-1.5">
                <span className="text-accent" aria-hidden="true">{'> '}</span>
                {S.purpose[locale]}
              </p>
              <p>{mod.purpose[locale]}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-ink mb-1.5">
                <span className="text-accent" aria-hidden="true">{'> '}</span>
                {S.audience[locale]}
              </p>
              <p>{mod.audience[locale]}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-ink mb-1.5">
                <span className="text-accent" aria-hidden="true">{'> '}</span>
                {S.objectives[locale]}
              </p>
              <ul className="space-y-1.5">
                {mod.objectives.map((o, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent font-mono" aria-hidden="true">-</span>
                    <span>{o[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>
            {mod.prerequisites && (
              <div>
                <p className="font-mono text-xs text-ink mb-1.5">
                  <span className="text-accent" aria-hidden="true">{'> '}</span>
                  {S.prerequisites[locale]}
                </p>
                <ul className="space-y-1.5">
                  {mod.prerequisites.map((o, i) => (
                    <li key={i}>{o[locale]}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {mod.kind === 'concepts' && (
          <dl className="grid gap-3 sm:grid-cols-2">
            {mod.items.map((it, i) => (
              <div key={i} className="glass-panel rounded-lg border border-line p-4">
                <dt className="font-mono text-xs text-accent">{it.term[locale]}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed">{it.explain[locale]}</dd>
              </div>
            ))}
          </dl>
        )}

        {mod.kind === 'demo' && (
          <Suspense
            fallback={
              <p className="font-mono text-sm text-muted">loading demo.</p>
            }
          >
            {(() => {
              const Demo = DEMOS[mod.demoId];
              return <Demo />;
            })()}
          </Suspense>
        )}

        {mod.kind === 'how-it-works' && (
          <ol className="space-y-3">
            {mod.steps.map((st, i) => (
              <li key={i} className="glass-panel rounded-lg border border-line p-4">
                <p className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, '0')} � {st.title[locale]}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{st.body[locale]}</p>
              </li>
            ))}
          </ol>
        )}

        {mod.kind === 'practice' && (
          <div className="space-y-3">
            {mod.exercises.map((ex, i) => (
              <div key={i} className="glass-panel rounded-lg border border-line p-4">
                <p className="text-sm leading-relaxed">
                  <span className="font-mono text-accent mr-2" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {ex.prompt[locale]}
                </p>
                {ex.answer && (
                  <details className="mt-3">
                    <summary className="cursor-pointer font-mono text-xs text-muted hover:text-accent">
                      {locale === 'vi' ? 'Xem d�p �n' : 'Show the answer'}
                    </summary>
                    <p className="mt-2 border-l-2 border-accent pl-4 text-sm leading-relaxed">
                      {ex.answer[locale]}
                    </p>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {mod.kind === 'tech' && (
          <div className="glass-panel rounded-lg border border-line p-5">
            <div className="flex flex-wrap gap-1.5">
              {mod.stack.map((s) => (
                <span
                  key={s}
                  className="rounded border border-line px-2 py-0.5 font-mono text-[11px]"
                >
                  {s}
                </span>
              ))}
            </div>
            {mod.architecture && (
              <p className="mt-4 text-sm leading-relaxed">
                {mod.architecture[locale]}
              </p>
            )}
          </div>
        )}

        {mod.kind === 'references' && (
          <ul className="space-y-2">
            {mod.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline underline-offset-4"
                >
                  {l.label}
                  <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
