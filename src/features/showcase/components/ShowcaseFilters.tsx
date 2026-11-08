import {ACTIVE_CATEGORIES, ACTIVE_STATUSES} from '../data/registry';
import {CATEGORY_LABEL, STATUS_LABEL} from '../data/categories';
import {S} from '../i18n/strings';
import type {CategoryFilter, StatusFilter} from '../hooks/useShowcaseFilters';

const pill = (active: boolean) =>
  `rounded border px-3 py-1 font-mono text-xs transition-colors ${
    active
      ? 'border-accent text-accent'
      : 'border-line text-muted hover:text-ink hover:border-ink/40'
  }`;

export default function ShowcaseFilters({
  locale,
  category,
  setCategory,
  status,
  setStatus,
  count,
}: {
  locale: 'vi' | 'en';
  category: CategoryFilter;
  setCategory: (c: CategoryFilter) => void;
  status: StatusFilter;
  setStatus: (s: StatusFilter) => void;
  count: number;
}) {
  /* Chi hien nhom loc khi co tu 2 lua chon tro len - mot nhom chi co mot nut
     thi khong loc duoc gi, chi lam chat giao dien. */
  const showCategory = ACTIVE_CATEGORIES.length > 1;
  const showStatus = ACTIVE_STATUSES.length > 1;

  if (!showCategory && !showStatus) {
    return (
      <p className="font-mono text-xs text-muted">
        {count} {count === 1 ? S.countOne[locale] : S.countMany[locale]}
      </p>
    );
  }

  return (
    <div className="glass-bar sticky top-16 z-30 -mx-6 px-6 py-4 border-b border-line">
      <div className="flex flex-col gap-3">
        {showCategory && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted w-20 shrink-0">
              {S.filterCategory[locale]}
            </span>
            <button
              type="button"
              className={pill(category === 'all')}
              aria-pressed={category === 'all'}
              onClick={() => setCategory('all')}
            >
              {S.filterAll[locale]}
            </button>
            {ACTIVE_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={pill(category === c)}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {CATEGORY_LABEL[c][locale]}
              </button>
            ))}
          </div>
        )}

        {showStatus && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted w-20 shrink-0">
              {S.filterStatus[locale]}
            </span>
            <button
              type="button"
              className={pill(status === 'all')}
              aria-pressed={status === 'all'}
              onClick={() => setStatus('all')}
            >
              {S.filterAll[locale]}
            </button>
            {ACTIVE_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={pill(status === s)}
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
              >
                {STATUS_LABEL[s][locale]}
              </button>
            ))}
          </div>
        )}

        <p className="font-mono text-xs text-muted" aria-live="polite">
          {count} {count === 1 ? S.countOne[locale] : S.countMany[locale]}
        </p>
      </div>
    </div>
  );
}
