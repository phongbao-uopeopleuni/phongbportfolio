import {useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useI18n} from '../../../i18n';
import DetailModule from '../components/DetailModule';
import ShowcaseHeader from '../components/ShowcaseHeader';
import StatusBadge from '../components/StatusBadge';
import {CATEGORY_LABEL} from '../data/categories';
import {findProject} from '../data/registry';
import {S} from '../i18n/strings';
import '../styles/glass.css';
import ShowcaseNotFound from './ShowcaseNotFound';

export default function ShowcaseDetail() {
  const {slug} = useParams<{slug: string}>();
  const {locale} = useI18n();
  const project = slug ? findProject(slug) : undefined;

  /* Vao trang chi tiet thi bat dau tu dau trang, khong giu vi tri cuon cu. */
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'instant'});
  }, [slug]);

  if (!project) return <ShowcaseNotFound />;

  const visibleModules =
    project.slug === 'assessment-data-integrity-lab'
      ? project.modules.filter((module) => module.kind === 'demo')
      : project.modules;

  return (
    <div className="min-h-screen">
      <ShowcaseHeader />

      <main className="px-6 pt-28 pb-24">
        <article className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-accent">
              [{CATEGORY_LABEL[project.category][locale]}]
            </span>
            <StatusBadge status={project.status} locale={locale} />
            <span className="font-mono text-[11px] text-muted">
              {S.updatedOn[locale]} {project.updated}
            </span>
          </div>

          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-ink">
            {project.title[locale]}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed">
            {project.summary[locale]}
          </p>

          {visibleModules.map((mod, i) => (
            <DetailModule key={`${mod.kind}-${i}`} mod={mod} locale={locale} />
          ))}

          <div className="mt-14 border-t border-line pt-6">
            <Link
              to="/showcase"
              className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline underline-offset-4"
            >
              {S.backToList[locale]}
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
