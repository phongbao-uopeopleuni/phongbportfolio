import {useEffect, useMemo, useRef, useState} from 'react';
import {Pause, Play, Plus, RotateCcw, SkipForward, Trash2} from 'lucide-react';
import {useI18n} from '../../../../i18n';
import {colorFor, ON_PROC} from './palette';
import {
  ALGORITHMS,
  SAMPLE_PROCESSES,
  schedule,
  type Algorithm,
  type Proc,
} from './scheduler';

const TXT = {
  processes: {vi: 'B?ng ti?n tr�nh', en: 'Process table'},
  algorithm: {vi: 'Thu?t to�n', en: 'Algorithm'},
  quantum: {vi: 'Lu?ng t?', en: 'Quantum'},
  id: {vi: 'Ma', en: 'ID'},
  arrival: {vi: 'D?n', en: 'Arrival'},
  burst: {vi: 'Ch?y', en: 'Burst'},
  priority: {vi: 'Uu ti�n', en: 'Priority'},
  remove: {vi: 'Xo� ti?n tr�nh', en: 'Remove process'},
  add: {vi: 'Th�m ti?n tr�nh', en: 'Add process'},
  reset: {vi: 'Kh�i ph?c m?u', en: 'Reset to sample'},
  timeline: {vi: 'D�ng th?i gian', en: 'Timeline'},
  timelineTable: {
    vi: 'Xem d�ng th?i gian d?ng b?ng',
    en: 'View the timeline as a table',
  },
  idle: {vi: 'CPU r?nh', en: 'CPU idle'},
  play: {vi: 'Ch?y', en: 'Play'},
  pause: {vi: 'D?ng', en: 'Pause'},
  step: {vi: 'M?t nh?p', en: 'Step'},
  restart: {vi: 'V? d?u', en: 'Restart'},
  metrics: {vi: 'Ch? s? t?ng ti?n tr�nh', en: 'Per-process metrics'},
  completion: {vi: 'Ho�n th�nh', en: 'Completion'},
  turnaround: {vi: 'Quay v�ng', en: 'Turnaround'},
  waiting: {vi: 'Ch?', en: 'Waiting'},
  response: {vi: 'D�p ?ng', en: 'Response'},
  average: {vi: 'Trung b�nh', en: 'Average'},
  ctxSwitch: {vi: 'L?n chuy?n ng? c?nh', en: 'Context switches'},
  atTime: {vi: 'Th?i di?m', en: 'Time'},
  noEvent: {
    vi: 'B?m Ch?y ho?c M?t nh?p d? theo doi di?n bi?n.',
    en: 'Press Play or Step to follow what happens.',
  },
  needProcess: {
    vi: 'Th�m �t nh?t m?t ti?n tr�nh c� th?i gian ch?y l?n hon 0.',
    en: 'Add at least one process with a burst above 0.',
  },
  ganttLabel: {
    vi: 'Bi?u d? Gantt c?a l?ch CPU. To�n b? d? li?u c� trong b?ng b�n du?i.',
    en: 'Gantt chart of the CPU schedule. The full data is in the table below.',
  },
};

const MAX_PROCS = 6;
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

export default function CpuSchedulingLab() {
  const {locale} = useI18n();
  const t = (k: keyof typeof TXT) => TXT[k][locale];

  const [procs, setProcs] = useState<Proc[]>(SAMPLE_PROCESSES);
  const [algorithm, setAlgorithm] = useState<Algorithm>('srtf');
  const [quantum, setQuantum] = useState(2);
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);

  const result = useMemo(
    () => schedule(procs, algorithm, quantum),
    [procs, algorithm, quantum],
  );
  const ids = useMemo(() => procs.map((p) => p.id), [procs]);
  const total = result.totalTime;

  /* Doi tham so thi chay lai tu dau, de nguoi dung khong nhin vao trang thai cu. */
  useEffect(() => {
    setTick(0);
    setPlaying(false);
  }, [algorithm, quantum, procs]);

  const timerRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      setTick((v) => {
        if (v >= total) {
          setPlaying(false);
          return total;
        }
        return v + 1;
      });
    }, 420);
    return () => window.clearInterval(timerRef.current);
  }, [playing, total]);

  const update = (
    i: number,
    key: 'arrival' | 'burst' | 'priority',
    raw: string,
  ) => {
    const v = Number(raw);
    const safe = Number.isFinite(v) ? v : 0;
    setProcs((list) =>
      list.map((p, idx) =>
        idx === i
          ? {
              ...p,
              [key]: key === 'burst' ? clamp(safe, 0, 20) : clamp(safe, 0, 30),
            }
          : p,
      ),
    );
  };

  const addProc = () =>
    setProcs((list) =>
      list.length >= MAX_PROCS
        ? list
        : [
            ...list,
            {
              id: `P${list.length + 1}`,
              arrival: 0,
              burst: 3,
              priority: list.length + 1,
            },
          ],
    );

  const removeProc = (i: number) =>
    setProcs((list) => list.filter((_, idx) => idx !== i));

  /* Su kien gan nhat khong vuot qua nhip hien tai - phan giai thich co dan dat. */
  const currentEvent = [...result.events].filter((e) => e.t <= tick).pop();
  const unit = 100 / Math.max(1, total);

  return (
    <div className="space-y-6">
      <div className="glass-panel-strong rounded-lg border border-line p-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-muted">
              {t('algorithm')}
            </span>
            <select
              className="rounded border border-line bg-surface px-3 py-2 font-mono text-sm text-ink"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            >
              {ALGORITHMS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label[locale]}
                </option>
              ))}
            </select>
          </label>

          {algorithm === 'rr' && (
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-muted">
                {t('quantum')}
              </span>
              <input
                type="number"
                min={1}
                max={10}
                value={quantum}
                onChange={(e) =>
                  setQuantum(clamp(Number(e.target.value) || 1, 1, 10))
                }
                className="w-24 rounded border border-line bg-surface px-3 py-2 font-mono text-sm text-ink"
              />
            </label>
          )}

          <button
            type="button"
            onClick={() => setProcs(SAMPLE_PROCESSES)}
            className="rounded border border-line px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {t('reset')}
          </button>
        </div>

        <h4 className="mt-6 font-mono text-xs text-muted">{t('processes')}</h4>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-sm">
            <thead>
              <tr className="text-left font-mono text-xs text-muted">
                <th scope="col" className="py-2 pr-3 font-normal">
                  {t('id')}
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  {t('arrival')}
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  {t('burst')}
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  {t('priority')}
                </th>
                <th scope="col" className="py-2">
                  <span className="sr-only">{t('remove')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {procs.map((p, i) => (
                <tr key={p.id} className="border-t border-line">
                  <th
                    scope="row"
                    className="py-2 pr-3 text-left font-mono text-sm font-normal"
                  >
                    <span
                      className="mr-2 inline-block h-2.5 w-2.5 rounded-sm align-middle"
                      style={{background: colorFor(ids, p.id)}}
                      aria-hidden="true"
                    />
                    {p.id}
                  </th>
                  {(['arrival', 'burst', 'priority'] as const).map((key) => (
                    <td key={key} className="py-2 pr-3">
                      <input
                        type="number"
                        min={0}
                        value={p[key]}
                        aria-label={`${p.id} ${TXT[key][locale]}`}
                        onChange={(e) => update(i, key, e.target.value)}
                        className="w-20 rounded border border-line bg-surface px-2 py-1 font-mono text-sm text-ink"
                      />
                    </td>
                  ))}
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeProc(i)}
                      disabled={procs.length <= 1}
                      aria-label={`${t('remove')} ${p.id}`}
                      className="rounded border border-line p-1.5 text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addProc}
          disabled={procs.length >= MAX_PROCS}
          className="mt-3 inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:border-accent disabled:opacity-40"
        >
          <Plus size={14} aria-hidden="true" />
          {t('add')}
        </button>
      </div>

      {result.metrics.length === 0 ? (
        <p className="font-mono text-sm text-muted">{t('needProcess')}</p>
      ) : (
        <>
          <div className="glass-panel-strong rounded-lg border border-line p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-mono text-xs text-muted">{t('timeline')}</h4>
              <span className="font-mono text-xs text-muted">
                {t('atTime')} t={tick} / {total}
              </span>
            </div>

            <div
              className="mt-3 flex h-12 w-full overflow-hidden rounded border border-line"
              role="img"
              aria-label={TXT.ganttLabel[locale]}
            >
              {result.timeline.map((s, i) => (
                <div
                  key={i}
                  style={{
                    width: `${(s.end - s.start) * unit}%`,
                    background: s.id ? colorFor(ids, s.id) : 'transparent',
                    opacity: s.start < tick ? 1 : 0.28,
                    color: ON_PROC,
                  }}
                  className={`flex items-center justify-center border-r border-surface/40 font-mono text-[11px] ${
                    s.id ? '' : 'bg-panel'
                  }`}
                >
                  {s.id ?? ''}
                </div>
              ))}
            </div>

            <div className="mt-1 flex w-full font-mono text-[10px] text-muted">
              {result.timeline.map((s, i) => (
                <div key={i} style={{width: `${(s.end - s.start) * unit}%`}}>
                  {s.start}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:border-accent"
              >
                {playing ? (
                  <Pause size={14} aria-hidden="true" />
                ) : (
                  <Play size={14} aria-hidden="true" />
                )}
                {playing ? t('pause') : t('play')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setTick((v) => Math.min(total, v + 1));
                }}
                className="inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <SkipForward size={14} aria-hidden="true" />
                {t('step')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setTick(0);
                }}
                className="inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <RotateCcw size={14} aria-hidden="true" />
                {t('restart')}
              </button>
            </div>

            <p
              className="mt-4 border-l-2 border-accent pl-4 font-mono text-xs leading-relaxed text-ink"
              aria-live="polite"
            >
              {currentEvent ? currentEvent[locale] : t('noEvent')}
            </p>

            <details className="mt-4">
              <summary className="cursor-pointer font-mono text-xs text-muted hover:text-accent">
                {t('timelineTable')}
              </summary>
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="text-left font-mono text-xs text-muted">
                    <th scope="col" className="py-1.5 pr-3 font-normal">
                      t
                    </th>
                    <th scope="col" className="py-1.5 font-normal">
                      {t('id')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.timeline.map((s, i) => (
                    <tr
                      key={i}
                      className="border-t border-line font-mono text-xs"
                    >
                      <td className="py-1.5 pr-3">
                        {s.start}-{s.end}
                      </td>
                      <td className="py-1.5">{s.id ?? t('idle')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>

          <div className="glass-panel-strong rounded-lg border border-line p-5">
            <h4 className="font-mono text-xs text-muted">{t('metrics')}</h4>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[34rem] text-sm">
                <thead>
                  <tr className="text-left font-mono text-xs text-muted">
                    <th scope="col" className="py-2 pr-3 font-normal">
                      {t('id')}
                    </th>
                    <th scope="col" className="py-2 pr-3 font-normal">
                      {t('completion')}
                    </th>
                    <th scope="col" className="py-2 pr-3 font-normal">
                      {t('turnaround')}
                    </th>
                    <th scope="col" className="py-2 pr-3 font-normal">
                      {t('waiting')}
                    </th>
                    <th scope="col" className="py-2 font-normal">
                      {t('response')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.metrics.map((m) => (
                    <tr
                      key={m.id}
                      className="border-t border-line font-mono text-sm"
                    >
                      <th
                        scope="row"
                        className="py-2 pr-3 text-left font-normal"
                      >
                        {m.id}
                      </th>
                      <td className="py-2 pr-3">{m.completion}</td>
                      <td className="py-2 pr-3">{m.turnaround}</td>
                      <td className="py-2 pr-3">{m.waiting}</td>
                      <td className="py-2">{m.response}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-line font-mono text-sm text-accent">
                    <th scope="row" className="py-2 pr-3 text-left font-normal">
                      {t('average')}
                    </th>
                    <td className="py-2 pr-3">-</td>
                    <td className="py-2 pr-3">{result.averages.turnaround}</td>
                    <td className="py-2 pr-3">{result.averages.waiting}</td>
                    <td className="py-2">{result.averages.response}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-xs text-muted">
              {t('ctxSwitch')}: {result.contextSwitches}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
