import {STATUS_LABEL} from '../data/categories';
import type {ShowcaseStatus} from '../types/showcase';

const TONE: Record<ShowcaseStatus, string> = {
  completed: 'border-accent/60 text-accent',
  prototype: 'border-line text-ink',
  'in-progress': 'border-line text-muted',
};

export default function StatusBadge({
  status,
  locale,
}: {
  status: ShowcaseStatus;
  locale: 'vi' | 'en';
}) {
  return (
    <span
      className={`rounded border px-2 py-0.5 font-mono text-[11px] ${TONE[status]}`}
    >
      {STATUS_LABEL[status][locale]}
    </span>
  );
}
