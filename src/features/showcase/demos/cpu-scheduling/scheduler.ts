/**
 * Thuat toan lap lich CPU - ham thuan, khong phu thuoc React.
 * Mo phong theo tung nhip thoi gian nguyen (tick): mot vong lap duy nhat phuc vu
 * ca nam thuat toan, va tu no sinh ra dong thoi gian lan cac su kien giai thich.
 */

export type Algorithm = 'fcfs' | 'sjf' | 'srtf' | 'rr' | 'priority';

export type Proc = {
  id: string;
  arrival: number;
  burst: number;
  /** So nho hon = uu tien cao hon. Chi dung cho thuat toan 'priority'. */
  priority: number;
};

/** Mot lat thoi gian tren dong thoi gian. id = null nghia la CPU ranh. */
export type Slice = {id: string | null; start: number; end: number};

export type Metric = {
  id: string;
  arrival: number;
  burst: number;
  completion: number;
  turnaround: number;
  waiting: number;
  response: number;
};

export type SchedEvent = {t: number; vi: string; en: string};

export type ScheduleResult = {
  timeline: Slice[];
  metrics: Metric[];
  averages: {turnaround: number; waiting: number; response: number};
  contextSwitches: number;
  events: SchedEvent[];
  totalTime: number;
};

export const ALGORITHMS: {id: Algorithm; label: {vi: string; en: string}}[] = [
  {id: 'fcfs', label: {vi: 'FCFS - d?n tru?c ch?y tru?c', en: 'FCFS'}},
  {id: 'sjf', label: {vi: 'SJF - ng?n nh?t tru?c', en: 'SJF'}},
  {id: 'srtf', label: {vi: 'SRTF - c�n l?i ng?n nh?t', en: 'SRTF'}},
  {id: 'rr', label: {vi: 'Round Robin - xoay v�ng', en: 'Round Robin'}},
  {id: 'priority', label: {vi: 'Priority - theo d? uu ti�n', en: 'Priority'}},
];

export const isPreemptive = (a: Algorithm) => a === 'srtf' || a === 'rr';

/** Bo tien trinh mau, dung lam trang thai khoi dau cua demo. */
export const SAMPLE_PROCESSES: Proc[] = [
  {id: 'P1', arrival: 0, burst: 8, priority: 3},
  {id: 'P2', arrival: 1, burst: 4, priority: 1},
  {id: 'P3', arrival: 2, burst: 2, priority: 4},
  {id: 'P4', arrival: 3, burst: 5, priority: 2},
];

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Chay mo phong. Tra ve dong thoi gian, chi so tung tien trinh va cac su kien
 * giai thich gan theo moc thoi gian.
 */
export function schedule(
  input: Proc[],
  algorithm: Algorithm,
  quantum = 2,
): ScheduleResult {
  const procs = input
    .filter((p) => p.burst > 0)
    .map((p) => ({...p}))
    .sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));

  const n = procs.length;
  if (n === 0) {
    return {
      timeline: [],
      metrics: [],
      averages: {turnaround: 0, waiting: 0, response: 0},
      contextSwitches: 0,
      events: [],
      totalTime: 0,
    };
  }

  const byId = new Map(procs.map((p) => [p.id, p]));
  const rem = new Map(procs.map((p) => [p.id, p.burst]));
  const firstRun = new Map<string, number>();
  const completion = new Map<string, number>();

  const timeline: Slice[] = [];
  const events: SchedEvent[] = [];
  const queue: string[] = []; // chi dung cho Round Robin

  const q = Math.max(1, Math.floor(quantum));
  let t = 0;
  let done = 0;
  let current: string | null = null;
  let quantumLeft = 0;
  let pendingRequeue: string | null = null;

  /** Chan vong lap vo han neu du lieu vao bat thuong. */
  const guard =
    procs.reduce((s, p) => s + p.burst, 0) +
    Math.max(...procs.map((p) => p.arrival)) +
    2;

  const addSlice = (id: string | null) => {
    const last = timeline[timeline.length - 1];
    if (last && last.id === id && last.end === t) last.end = t + 1;
    else timeline.push({id, start: t, end: t + 1});
  };

  /** Chon tien trinh tot nhat trong so da den va chua xong. */
  const pick = (): string | null => {
    const ready = procs.filter(
      (p) => p.arrival <= t && (rem.get(p.id) ?? 0) > 0,
    );
    if (ready.length === 0) return null;
    return [...ready].sort((a, b) => {
      switch (algorithm) {
        case 'sjf':
          return (
            a.burst - b.burst || a.arrival - b.arrival || a.id.localeCompare(b.id)
          );
        case 'srtf':
          return (
            (rem.get(a.id) ?? 0) - (rem.get(b.id) ?? 0) ||
            a.arrival - b.arrival ||
            a.id.localeCompare(b.id)
          );
        case 'priority':
          return (
            a.priority - b.priority ||
            a.arrival - b.arrival ||
            a.id.localeCompare(b.id)
          );
        default:
          return a.arrival - b.arrival || a.id.localeCompare(b.id);
      }
    })[0].id;
  };

  while (done < n && t <= guard) {
    // Tien trinh den tai thoi diem t vao hang doi truoc...
    for (const p of procs) if (p.arrival === t) queue.push(p.id);
    // ...roi moi den tien trinh vua het luong tu, dung quy uoc Round Robin thong thuong
    if (pendingRequeue) {
      queue.push(pendingRequeue);
      pendingRequeue = null;
    }

    const previous = current;

    if (algorithm === 'rr') {
      if (!current) {
        while (queue.length > 0) {
          const candidate = queue.shift()!;
          if ((rem.get(candidate) ?? 0) > 0) {
            current = candidate;
            quantumLeft = q;
            break;
          }
        }
      }
    } else if (algorithm === 'srtf') {
      current = pick();
    } else if (!current) {
      current = pick();
    }

    if (current && current !== previous) {
      const p = byId.get(current)!;
      if (!firstRun.has(current)) {
        firstRun.set(current, t);
        events.push({
          t,
          vi: `t=${t}: ${current} ch?y l?n d?u, sau ${t - p.arrival} don v? ch?.`,
          en: `t=${t}: ${current} runs for the first time, after waiting ${t - p.arrival}.`,
        });
      } else if (previous) {
        events.push({
          t,
          vi:
            algorithm === 'srtf'
              ? `t=${t}: ${current} gi�nh CPU v� c�n ${rem.get(current)} �t hon ${rem.get(previous)} c?a ${previous}.`
              : `t=${t}: CPU chuy?n sang ${current}.`,
          en:
            algorithm === 'srtf'
              ? `t=${t}: ${current} preempts - ${rem.get(current)} left versus ${rem.get(previous)} for ${previous}.`
              : `t=${t}: the CPU switches to ${current}.`,
        });
      } else {
        events.push({
          t,
          vi: `t=${t}: ${current} ch?y ti?p, c�n ${rem.get(current)}.`,
          en: `t=${t}: ${current} resumes with ${rem.get(current)} left.`,
        });
      }
    }

    if (current) {
      rem.set(current, (rem.get(current) ?? 0) - 1);
      quantumLeft -= 1;
      addSlice(current);

      if ((rem.get(current) ?? 0) === 0) {
        completion.set(current, t + 1);
        done += 1;
        events.push({
          t: t + 1,
          vi: `t=${t + 1}: ${current} ho�n th�nh.`,
          en: `t=${t + 1}: ${current} completes.`,
        });
        current = null;
        quantumLeft = 0;
      } else if (algorithm === 'rr' && quantumLeft === 0) {
        events.push({
          t: t + 1,
          vi: `t=${t + 1}: ${current} h?t lu?ng t?, xu?ng cu?i h�ng, c�n ${rem.get(current)}.`,
          en: `t=${t + 1}: ${current} exhausts its quantum and moves to the back of the queue with ${rem.get(current)} left.`,
        });
        pendingRequeue = current;
        current = null;
      }
    } else {
      addSlice(null);
    }

    t += 1;
  }

  const metrics: Metric[] = procs.map((p) => {
    const comp = completion.get(p.id) ?? 0;
    const turnaround = comp - p.arrival;
    return {
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      completion: comp,
      turnaround,
      waiting: turnaround - p.burst,
      response: (firstRun.get(p.id) ?? 0) - p.arrival,
    };
  });

  const avg = (key: 'turnaround' | 'waiting' | 'response') =>
    round2(metrics.reduce((s, m) => s + m[key], 0) / metrics.length);

  // Chuyen ngu canh: so lan CPU doi tu tien trinh nay sang tien trinh khac
  const running = timeline.filter((s) => s.id !== null);
  let contextSwitches = 0;
  for (let i = 1; i < running.length; i += 1) {
    if (running[i].id !== running[i - 1].id) contextSwitches += 1;
  }

  return {
    timeline,
    metrics,
    averages: {
      turnaround: avg('turnaround'),
      waiting: avg('waiting'),
      response: avg('response'),
    },
    contextSwitches,
    events,
    totalTime: timeline.length > 0 ? timeline[timeline.length - 1].end : 0,
  };
}
