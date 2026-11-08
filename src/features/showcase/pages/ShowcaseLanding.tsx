import {useI18n} from '../../../i18n';
import ShowcaseCard from '../components/ShowcaseCard';
import ShowcaseFilters from '../components/ShowcaseFilters';
import ShowcaseHeader from '../components/ShowcaseHeader';
import {PROJECTS} from '../data/registry';
import {useShowcaseFilters} from '../hooks/useShowcaseFilters';
import {S} from '../i18n/strings';
import '../styles/glass.css';

export default function ShowcaseLanding() {
  const {locale} = useI18n();
  const {category, setCategory, status, setStatus, projects} =
    useShowcaseFilters();

  return (
    <div className="min-h-screen">
      <ShowcaseHeader />

      <main className="px-6 pt-28 pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-sm text-accent mb-3">
            <span aria-hidden="true">{'// '}</span>
            {S.kicker[locale]}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
            {S.title[locale]}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed">
            {S.intro[locale]}
          </p>

          <div className="mt-10">
            <ShowcaseFilters
              locale={locale}
              category={category}
              setCategory={setCategory}
              status={status}
              setStatus={setStatus}
              count={projects.length}
            />
          </div>

          {PROJECTS.length === 0 ? (
            <p className="mt-10 font-mono text-sm text-muted">
              {S.emptyRegistry[locale]}
            </p>
          ) : projects.length === 0 ? (
            <p className="mt-10 font-mono text-sm text-muted">
              {S.emptyFilter[locale]}
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ShowcaseCard
                  key={p.slug}
                  project={p}
                  locale={locale}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
