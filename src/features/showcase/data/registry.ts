import type {ShowcaseProject} from '../types/showcase';

/* Co bat/tat nam o ../enabled.ts de App.tsx doc duoc ma khong phai keo
   toan bo registry vao chunk trang chu. */
export {SHOWCASE_ENABLED} from '../enabled';

/** Chi liet ke du an CO THAT va chay duoc. Khong dua du an du dinh vao day. */
export const PROJECTS: ShowcaseProject[] = [
  {
    slug: 'cpu-scheduling-visualizer',
    category: 'operating-systems',
    status: 'completed',
    updated: '2026-11-08',
    title: {
      vi: 'Tr�nh m� ph?ng l?p l?ch CPU',
      en: 'CPU scheduling visualizer',
    },
    summary: {
      vi: 'Nh?p b?ng ti?n tr�nh, ch?n thu?t to�n, xem CPU chia th?i gian cho t?ng ti?n tr�nh theo t?ng nh?p v� d?i chi?u c�c ch? s? hi?u nang.',
      en: 'Enter a process table, pick an algorithm, and watch the CPU divide time tick by tick while the performance metrics update alongside.',
    },
    tech: ['React', 'TypeScript', 'SVG'],
    modules: [
      {
        kind: 'overview',
        purpose: {
          vi: 'L?p l?ch CPU thu?ng du?c d?y b?ng bi?u d? tinh in s?n trong s�ch, n�n r?t kh� th?y v� sao hai thu?t to�n l?i cho k?t qu? kh�c nhau tr�n c�ng m?t b? ti?n tr�nh. C�ng c? n�y cho b?n t? d?i s? li?u v� xem h? qu? ngay l?p t?c.',
          en: 'CPU scheduling is usually taught with static diagrams printed in a textbook, which makes it hard to see why two algorithms diverge on the same set of processes. This tool lets you change the numbers yourself and watch the consequence immediately.',
        },
        audience: {
          vi: 'Sinh vi�n dang h?c m�n H? di?u h�nh, ho?c ngu?i t? h?c mu?n hi?u c�ch CPU quy?t d?nh ch?y ti?n tr�nh n�o tru?c.',
          en: 'Students taking an operating systems course, or self-learners who want to understand how a CPU decides which process runs next.',
        },
        objectives: [
          {
            vi: 'V� sao m?t ti?n tr�nh ng?n d?n sau v?n c� th? ch?y tru?c ti?n tr�nh d�i d?n tru?c.',
            en: 'Why a short process that arrives later can still run before a long one that arrived first.',
          },
          {
            vi: 'S? kh�c nhau gi?a thu?t to�n c� gi�nh quy?n v� kh�ng gi�nh quy?n.',
            en: 'The difference between preemptive and non-preemptive algorithms.',
          },
          {
            vi: 'C�ch lu?ng t? th?i gian trong Round Robin d�nh d?i gi?a th?i gian d�p ?ng v� chi ph� chuy?n ng? c?nh.',
            en: 'How the Round Robin quantum trades response time against context-switch overhead.',
          },
          {
            vi: 'V� sao thu?t to�n theo d? uu ti�n c� th? khi?n m?t ti?n tr�nh ch? v� h?n.',
            en: 'Why a priority algorithm can leave a process waiting indefinitely.',
          },
        ],
        prerequisites: [
          {
            vi: 'Bi?t ti?n tr�nh l� g� v� hi?u r?ng m?t CPU don loi ch? ch?y du?c m?t ti?n tr�nh t?i m?t th?i di?m.',
            en: 'Knowing what a process is, and that a single-core CPU runs only one process at a time.',
          },
        ],
      },
      {
        kind: 'concepts',
        items: [
          {
            term: {vi: 'Th?i di?m d?n', en: 'Arrival time'},
            explain: {
              vi: 'M?c th?i gian ti?n tr�nh s?n s�ng ch?y. Tru?c m?c n�y b? l?p l?ch kh�ng du?c ph�p ch?n n�.',
              en: 'The moment a process becomes ready to run. Before it, the scheduler may not choose that process.',
            },
          },
          {
            term: {vi: 'Th?i gian ch?y', en: 'Burst time'},
            explain: {
              vi: 'T?ng th?i gian CPU m� ti?n tr�nh c?n d? ho�n th�nh.',
              en: 'The total CPU time the process needs in order to finish.',
            },
          },
          {
            term: {vi: 'Th?i gian quay v�ng', en: 'Turnaround time'},
            explain: {
              vi: 'Th?i di?m ho�n th�nh tr? th?i di?m d?n - t?ng th?i gian ti?n tr�nh t?n t?i trong h? th?ng.',
              en: 'Completion time minus arrival time: how long the process existed in the system.',
            },
          },
          {
            term: {vi: 'Th?i gian ch?', en: 'Waiting time'},
            explain: {
              vi: 'Th?i gian quay v�ng tr? th?i gian ch?y - ph?n th?i gian ti?n tr�nh n?m ch? m� kh�ng du?c CPU ph?c v?.',
              en: 'Turnaround time minus burst time: the stretch the process spent waiting without the CPU.',
            },
          },
          {
            term: {vi: 'Th?i gian d�p ?ng', en: 'Response time'},
            explain: {
              vi: 'Kho?ng t? l�c d?n t?i l?n d?u ti�n du?c CPU ch?y. D�y m?i l� th? ngu?i d�ng c?m nh?n, kh�ng ph?i th?i gian quay v�ng.',
              en: 'From arrival to the first moment the CPU runs it. This, not turnaround, is what a user actually feels.',
            },
          },
          {
            term: {vi: 'Gi�nh quy?n', en: 'Preemption'},
            explain: {
              vi: 'B? l?p l?ch d?ng ti?n tr�nh dang ch?y gi?a ch?ng d? nhu?ng CPU cho ti?n tr�nh kh�c x?ng d�ng hon.',
              en: 'The scheduler stops a running process mid-flight to hand the CPU to a more deserving one.',
            },
          },
          {
            term: {vi: 'Lu?ng t? th?i gian', en: 'Time quantum'},
            explain: {
              vi: 'L�t th?i gian t?i da m?i ti?n tr�nh du?c gi? CPU trong Round Robin tru?c khi b? xoay v�ng.',
              en: 'The maximum slice each process holds the CPU in Round Robin before it is rotated out.',
            },
          },
          {
            term: {vi: 'D�i t�i nguy�n', en: 'Starvation'},
            explain: {
              vi: 'Ti?n tr�nh d? uu ti�n th?p b? c�c ti?n tr�nh uu ti�n cao li�n t?c chen tru?c, d?n t?i ch? v� h?n.',
              en: 'A low-priority process is endlessly overtaken by higher-priority ones and never gets to run.',
            },
          },
        ],
      },
      {kind: 'demo', demoId: 'cpu-scheduling'},
      {
        kind: 'how-it-works',
        steps: [
          {
            title: {
              vi: 'FCFS - d?n tru?c ch?y tru?c',
              en: 'FCFS - first come, first served',
            },
            body: {
              vi: 'X?p h�ng thu?n theo th?i di?m d?n, ch?y h?t ti?n tr�nh n�y m?i sang ti?n tr�nh kh�c. Don gi?n nh?t, nhung m?t ti?n tr�nh d�i d?ng d?u h�ng s? ch?n t?t c? ph�a sau - hi?n tu?ng do�n xe.',
              en: 'A plain queue ordered by arrival, running each process to completion. The simplest policy, but one long process at the head blocks everything behind it: the convoy effect.',
            },
          },
          {
            title: {vi: 'SJF - ng?n nh?t tru?c', en: 'SJF - shortest job first'},
            body: {
              vi: 'Trong s? c�c ti?n tr�nh da d?n, ch?n ti?n tr�nh c� th?i gian ch?y ng?n nh?t. Cho th?i gian ch? trung b�nh t?i uu, nhung c?n bi?t tru?c d? d�i - di?u hi?m khi c� trong th?c t?.',
              en: 'Among the processes that have arrived, pick the shortest burst. This gives the optimal average waiting time, but it requires knowing burst lengths in advance, which real systems rarely do.',
            },
          },
          {
            title: {
              vi: 'SRTF - th?i gian c�n l?i ng?n nh?t',
              en: 'SRTF - shortest remaining time first',
            },
            body: {
              vi: 'B?n c� gi�nh quy?n c?a SJF. M?i khi c� ti?n tr�nh m?i d?n, n?u ph?n c�n l?i c?a n� ng?n hon ph?n c�n l?i c?a ti?n tr�nh dang ch?y th� n� chen v�o ngay.',
              en: 'The preemptive form of SJF. Whenever a new process arrives, if its remaining time is shorter than the running one, it takes over immediately.',
            },
          },
          {
            title: {vi: 'Round Robin - xoay v�ng', en: 'Round Robin'},
            body: {
              vi: 'M?i ti?n tr�nh du?c gi? CPU t?i da m?t lu?ng t? r?i ph?i nhu?ng. Th?i gian d�p ?ng r?t d?u, nhung lu?ng t? c�ng nh? th� s? l?n chuy?n ng? c?nh c�ng nhi?u.',
              en: 'Each process holds the CPU for at most one quantum, then yields. Response time becomes very even, but the smaller the quantum, the more context switches you pay for.',
            },
          },
          {
            title: {vi: 'Priority - theo d? uu ti�n', en: 'Priority scheduling'},
            body: {
              vi: 'Ch?n ti?n tr�nh c� d? uu ti�n cao nh?t trong s? da d?n. R?i ro l� ti?n tr�nh uu ti�n th?p c� th? kh�ng bao gi? t?i lu?t n?u lu?ng vi?c uu ti�n cao kh�ng d?t.',
              en: 'Pick the highest-priority process among those that have arrived. The risk is that a low-priority process may never get its turn if high-priority work keeps coming.',
            },
          },
        ],
      },
      {
        kind: 'practice',
        exercises: [
          {
            prompt: {
              vi: 'D?t ba ti?n tr�nh c�ng d?n ? th?i di?m 0 v?i th?i gian ch?y 8, 4 v� 2. Ch?y FCFS r?i ch?y SJF. Th?i gian ch? trung b�nh ch�nh nhau bao nhi�u, v� v� sao?',
              en: 'Set three processes all arriving at time 0 with bursts 8, 4 and 2. Run FCFS, then SJF. How far apart are the average waiting times, and why?',
            },
            answer: {
              vi: 'FCFS cho trung b�nh 6.67, SJF cho 2.67. SJF tr? xong c�c ti?n tr�nh ng?n tru?c n�n ch�ng kh�ng ph?i g�nh th?i gian ch? c?a ti?n tr�nh d�i.',
              en: 'FCFS averages 6.67 and SJF averages 2.67. SJF clears the short processes first, so they never absorb the long one's waiting time.',
            },
          },
          {
            prompt: {
              vi: 'Gi? nguy�n b? ti?n tr�nh, ch?y Round Robin v?i lu?ng t? 1 r?i v?i lu?ng t? 8. Ch? s? n�o c?i thi?n khi lu?ng t? nh?, v� b?n ph?i tr? gi� b?ng g�?',
              en: 'Keep the same processes and run Round Robin with a quantum of 1, then of 8. Which metric improves with the small quantum, and what do you pay for it?',
            },
            answer: {
              vi: 'Th?i gian d�p ?ng trung b�nh roi t? 6.67 xu?ng 1, v� m?i ti?n tr�nh d?u du?c ch?m CPU g?n nhu ngay l?p t?c. C�i gi� l� s? l?n chuy?n ng? c?nh tang t? 2 l�n 10, v� trong h? th?ng th?t m?i l?n chuy?n d?u t?n th?i gian.',
              en: 'Average response time falls from 6.67 to 1, because every process touches the CPU almost immediately. The cost is a rise in context switches from 2 to 10, and in a real system each switch costs time.',
            },
          },
          {
            prompt: {
              vi: 'T?o m?t ti?n tr�nh d? uu ti�n th?p d?n ? th?i di?m 0, r?i th�m li�n t?c c�c ti?n tr�nh uu ti�n cao d?n sau. D�ng thu?t to�n Priority v� quan s�t di?u g� x?y ra v?i ti?n tr�nh d?u ti�n.',
              en: 'Create one low-priority process arriving at time 0, then keep adding higher-priority processes after it. Run the priority algorithm and watch what happens to the first one.',
            },
            answer: {
              vi: 'N� b? d?y l�i v� h?n - d�y ch�nh l� hi?n tu?ng d�i t�i nguy�n. H? th?ng th?t kh?c ph?c b?ng c�ch n�ng d?n d? uu ti�n theo th?i gian da ch?.',
              en: 'It is pushed back indefinitely: this is starvation. Real systems counter it by ageing, raising a process's priority the longer it waits.',
            },
          },
        ],
      },
      {
        kind: 'tech',
        stack: ['React 19', 'TypeScript', 'SVG', 'CSS thu?n'],
        architecture: {
          vi: 'To�n b? thu?t to�n n?m trong scheduler.ts du?i d?ng h�m thu?n, kh�ng ph? thu?c React: nh?n v�o danh s�ch ti?n tr�nh v� tr? v? d�ng th?i gian c�ng c�c ch? s?. Giao di?n ch? v? l?i k?t qu? d�. D? li?u ho�n to�n do ngu?i d�ng nh?p ho?c sinh t?ng h?p, kh�ng c� backend v� kh�ng g?i m?ng.',
          en: 'Every algorithm lives in scheduler.ts as pure functions with no React dependency: they take a process list and return a timeline plus metrics. The interface only renders that result. All data is user-entered or synthetic, with no backend and no network calls.',
        },
      },
      {
        kind: 'references',
        links: [
          {
            label: 'OSTEP - Scheduling: Introduction',
            href: 'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf',
          },
          {
            label: 'OSTEP - Multi-level Feedback Queue',
            href: 'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf',
          },
        ],
      },
    ],
  },
];

/** Danh muc tren bo loc duoc SUY RA tu registry, nen danh muc khong co du an
 *  se khong bao gio xuat hien. */
export const ACTIVE_CATEGORIES = [...new Set(PROJECTS.map((p) => p.category))];
export const ACTIVE_STATUSES = [...new Set(PROJECTS.map((p) => p.status))];

export const findProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);
