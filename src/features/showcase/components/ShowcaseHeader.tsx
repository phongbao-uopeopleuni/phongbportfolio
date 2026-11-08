import {ArrowLeft} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useI18n} from '../../../i18n';
import {S} from '../i18n/strings';

/** Header rieng cua showcase. Khong tai dung Navbar cua portfolio vi Navbar
 *  chay bang anchor #about, #projects — nhung muc khong ton tai ngoai trang chu. */
export default function ShowcaseHeader() {
  const {locale, setLocale} = useI18n();

  const langBtn = (active: boolean) =>
    `px-2.5 py-1.5 font-mono text-xs transition-colors ${
      active
        ? 'text-accent underline underline-offset-4 decoration-2'
        : 'text-muted hover:text-ink'
    }`;

  return (
    <header className="glass-chrome fixed top-0 left-0 right-0 z-50 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-ink hover:text-accent transition-colors min-w-0"
        >
          <ArrowLeft size={15} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{S.backToPortfolio[locale]}</span>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/showcase"
            className="hidden sm:inline font-mono text-xs text-accent hover:underline underline-offset-4"
          >
            /showcase
          </Link>
          <div className="flex items-center border border-line rounded-md px-1">
            <button
              type="button"
              className={langBtn(locale === 'vi')}
              onClick={() => setLocale('vi')}
              aria-pressed={locale === 'vi'}
            >
              vi
            </button>
            <span className="text-line" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              className={langBtn(locale === 'en')}
              onClick={() => setLocale('en')}
              aria-pressed={locale === 'en'}
            >
              en
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
