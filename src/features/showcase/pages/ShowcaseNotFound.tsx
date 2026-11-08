import {Link} from 'react-router-dom';
import {useI18n} from '../../../i18n';
import ShowcaseHeader from '../components/ShowcaseHeader';
import {S} from '../i18n/strings';
import '../styles/glass.css';

export default function ShowcaseNotFound() {
  const {locale} = useI18n();

  return (
    <div className="min-h-screen">
      <ShowcaseHeader />
      <main className="px-6 pt-28 pb-24">
        <div className="max-w-2xl mx-auto glass-panel-strong rounded-lg border border-line p-8">
          <p className="font-mono text-sm text-accent mb-3">
            <span aria-hidden="true">{'// '}</span>404
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
            {S.notFoundTitle[locale]}
          </h1>
          <p className="mt-4 text-sm leading-relaxed">
            {S.notFoundBody[locale]}
          </p>
          <Link
            to="/showcase"
            className="mt-7 inline-flex items-center gap-2 rounded-md border border-line px-5 py-2.5 font-mono text-sm text-accent transition-colors hover:border-accent"
          >
            {S.backToList[locale]}
          </Link>
        </div>
      </main>
    </div>
  );
}
