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
      vi: 'Trình mô phỏng lập lịch CPU',
      en: 'CPU scheduling visualizer',
    },
    summary: {
      vi: 'Nhập bảng tiến trình, chọn thuật toán, xem CPU chia thời gian cho từng tiến trình theo từng nhịp và đối chiếu các chỉ số hiệu năng.',
      en: 'Enter a process table, pick an algorithm, and watch the CPU divide time tick by tick while the performance metrics update alongside.',
    },
    tech: ['React', 'TypeScript', 'SVG'],
    modules: [
      {
        kind: 'overview',
        purpose: {
          vi: 'Lập lịch CPU thường được dạy bằng biểu đồ tĩnh in sẵn trong sách, nên rất khó thấy vì sao hai thuật toán lại cho kết quả khác nhau trên cùng một bộ tiến trình. Công cụ này cho bạn tự đổi số liệu và xem hệ quả ngay lập tức.',
          en: 'CPU scheduling is usually taught with static diagrams printed in a textbook, which makes it hard to see why two algorithms diverge on the same set of processes. This tool lets you change the numbers yourself and watch the consequence immediately.',
        },
        audience: {
          vi: 'Sinh viên đang học môn Hệ điều hành, hoặc người tự học muốn hiểu cách CPU quyết định chạy tiến trình nào trước.',
          en: 'Students taking an operating systems course, or self-learners who want to understand how a CPU decides which process runs next.',
        },
        objectives: [
          {
            vi: 'Vì sao một tiến trình ngắn đến sau vẫn có thể chạy trước tiến trình dài đến trước.',
            en: 'Why a short process that arrives later can still run before a long one that arrived first.',
          },
          {
            vi: 'Sự khác nhau giữa thuật toán có giành quyền và không giành quyền.',
            en: 'The difference between preemptive and non-preemptive algorithms.',
          },
          {
            vi: 'Cách lượng tử thời gian trong Round Robin đánh đổi giữa thời gian đáp ứng và chi phí chuyển ngữ cảnh.',
            en: 'How the Round Robin quantum trades response time against context-switch overhead.',
          },
          {
            vi: 'Vì sao thuật toán theo độ ưu tiên có thể khiến một tiến trình chờ vô hạn.',
            en: 'Why a priority algorithm can leave a process waiting indefinitely.',
          },
        ],
        prerequisites: [
          {
            vi: 'Biết tiến trình là gì và hiểu rằng một CPU đơn lõi chỉ chạy được một tiến trình tại một thời điểm.',
            en: 'Knowing what a process is, and that a single-core CPU runs only one process at a time.',
          },
        ],
      },
      {
        kind: 'concepts',
        items: [
          {
            term: {vi: 'Thời điểm đến', en: 'Arrival time'},
            explain: {
              vi: 'Mốc thời gian tiến trình sẵn sàng chạy. Trước mốc này bộ lập lịch không được phép chọn nó.',
              en: 'The moment a process becomes ready to run. Before it, the scheduler may not choose that process.',
            },
          },
          {
            term: {vi: 'Thời gian chạy', en: 'Burst time'},
            explain: {
              vi: 'Tổng thời gian CPU mà tiến trình cần để hoàn thành.',
              en: 'The total CPU time the process needs in order to finish.',
            },
          },
          {
            term: {vi: 'Thời gian quay vòng', en: 'Turnaround time'},
            explain: {
              vi: 'Thời điểm hoàn thành trừ thời điểm đến — tổng thời gian tiến trình tồn tại trong hệ thống.',
              en: 'Completion time minus arrival time: how long the process existed in the system.',
            },
          },
          {
            term: {vi: 'Thời gian chờ', en: 'Waiting time'},
            explain: {
              vi: 'Thời gian quay vòng trừ thời gian chạy — phần thời gian tiến trình nằm chờ mà không được CPU phục vụ.',
              en: 'Turnaround time minus burst time: the stretch the process spent waiting without the CPU.',
            },
          },
          {
            term: {vi: 'Thời gian đáp ứng', en: 'Response time'},
            explain: {
              vi: 'Khoảng từ lúc đến tới lần đầu tiên được CPU chạy. Đây mới là thứ người dùng cảm nhận, không phải thời gian quay vòng.',
              en: 'From arrival to the first moment the CPU runs it. This, not turnaround, is what a user actually feels.',
            },
          },
          {
            term: {vi: 'Giành quyền', en: 'Preemption'},
            explain: {
              vi: 'Bộ lập lịch dừng tiến trình đang chạy giữa chừng để nhường CPU cho tiến trình khác xứng đáng hơn.',
              en: 'The scheduler stops a running process mid-flight to hand the CPU to a more deserving one.',
            },
          },
          {
            term: {vi: 'Lượng tử thời gian', en: 'Time quantum'},
            explain: {
              vi: 'Lát thời gian tối đa mỗi tiến trình được giữ CPU trong Round Robin trước khi bị xoay vòng.',
              en: 'The maximum slice each process holds the CPU in Round Robin before it is rotated out.',
            },
          },
          {
            term: {vi: 'Đói tài nguyên', en: 'Starvation'},
            explain: {
              vi: 'Tiến trình độ ưu tiên thấp bị các tiến trình ưu tiên cao liên tục chen trước, dẫn tới chờ vô hạn.',
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
              vi: 'FCFS — đến trước chạy trước',
              en: 'FCFS — first come, first served',
            },
            body: {
              vi: 'Xếp hàng thuần theo thời điểm đến, chạy hết tiến trình này mới sang tiến trình khác. Đơn giản nhất, nhưng một tiến trình dài đứng đầu hàng sẽ chặn tất cả phía sau — hiện tượng đoàn xe.',
              en: 'A plain queue ordered by arrival, running each process to completion. The simplest policy, but one long process at the head blocks everything behind it: the convoy effect.',
            },
          },
          {
            title: {vi: 'SJF — ngắn nhất trước', en: 'SJF — shortest job first'},
            body: {
              vi: 'Trong số các tiến trình đã đến, chọn tiến trình có thời gian chạy ngắn nhất. Cho thời gian chờ trung bình tối ưu, nhưng cần biết trước độ dài — điều hiếm khi có trong thực tế.',
              en: 'Among the processes that have arrived, pick the shortest burst. This gives the optimal average waiting time, but it requires knowing burst lengths in advance, which real systems rarely do.',
            },
          },
          {
            title: {
              vi: 'SRTF — thời gian còn lại ngắn nhất',
              en: 'SRTF — shortest remaining time first',
            },
            body: {
              vi: 'Bản có giành quyền của SJF. Mỗi khi có tiến trình mới đến, nếu phần còn lại của nó ngắn hơn phần còn lại của tiến trình đang chạy thì nó chen vào ngay.',
              en: 'The preemptive form of SJF. Whenever a new process arrives, if its remaining time is shorter than the running one, it takes over immediately.',
            },
          },
          {
            title: {vi: 'Round Robin — xoay vòng', en: 'Round Robin'},
            body: {
              vi: 'Mỗi tiến trình được giữ CPU tối đa một lượng tử rồi phải nhường. Thời gian đáp ứng rất đều, nhưng lượng tử càng nhỏ thì số lần chuyển ngữ cảnh càng nhiều.',
              en: 'Each process holds the CPU for at most one quantum, then yields. Response time becomes very even, but the smaller the quantum, the more context switches you pay for.',
            },
          },
          {
            title: {vi: 'Priority — theo độ ưu tiên', en: 'Priority scheduling'},
            body: {
              vi: 'Chọn tiến trình có độ ưu tiên cao nhất trong số đã đến. Rủi ro là tiến trình ưu tiên thấp có thể không bao giờ tới lượt nếu luồng việc ưu tiên cao không dứt.',
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
              vi: 'Đặt ba tiến trình cùng đến ở thời điểm 0 với thời gian chạy 8, 4 và 2. Chạy FCFS rồi chạy SJF. Thời gian chờ trung bình chênh nhau bao nhiêu, và vì sao?',
              en: 'Set three processes all arriving at time 0 with bursts 8, 4 and 2. Run FCFS, then SJF. How far apart are the average waiting times, and why?',
            },
            answer: {
              vi: 'FCFS cho trung bình 6.67, SJF cho 2.67. SJF trả xong các tiến trình ngắn trước nên chúng không phải gánh thời gian chờ của tiến trình dài.',
              en: 'FCFS averages 6.67 and SJF averages 2.67. SJF clears the short processes first, so they never absorb the long one’s waiting time.',
            },
          },
          {
            prompt: {
              vi: 'Giữ nguyên bộ tiến trình, chạy Round Robin với lượng tử 1 rồi với lượng tử 8. Chỉ số nào cải thiện khi lượng tử nhỏ, và bạn phải trả giá bằng gì?',
              en: 'Keep the same processes and run Round Robin with a quantum of 1, then of 8. Which metric improves with the small quantum, and what do you pay for it?',
            },
            answer: {
              vi: 'Thời gian đáp ứng trung bình rơi từ 6.67 xuống 1, vì mọi tiến trình đều được chạm CPU gần như ngay lập tức. Cái giá là số lần chuyển ngữ cảnh tăng từ 2 lên 10, và trong hệ thống thật mỗi lần chuyển đều tốn thời gian.',
              en: 'Average response time falls from 6.67 to 1, because every process touches the CPU almost immediately. The cost is a rise in context switches from 2 to 10, and in a real system each switch costs time.',
            },
          },
          {
            prompt: {
              vi: 'Tạo một tiến trình độ ưu tiên thấp đến ở thời điểm 0, rồi thêm liên tục các tiến trình ưu tiên cao đến sau. Dùng thuật toán Priority và quan sát điều gì xảy ra với tiến trình đầu tiên.',
              en: 'Create one low-priority process arriving at time 0, then keep adding higher-priority processes after it. Run the priority algorithm and watch what happens to the first one.',
            },
            answer: {
              vi: 'Nó bị đẩy lùi vô hạn — đây chính là hiện tượng đói tài nguyên. Hệ thống thật khắc phục bằng cách nâng dần độ ưu tiên theo thời gian đã chờ.',
              en: 'It is pushed back indefinitely: this is starvation. Real systems counter it by ageing, raising a process’s priority the longer it waits.',
            },
          },
        ],
      },
      {
        kind: 'tech',
        stack: ['React 19', 'TypeScript', 'SVG', 'CSS thuần'],
        architecture: {
          vi: 'Toàn bộ thuật toán nằm trong scheduler.ts dưới dạng hàm thuần, không phụ thuộc React: nhận vào danh sách tiến trình và trả về dòng thời gian cùng các chỉ số. Giao diện chỉ vẽ lại kết quả đó. Dữ liệu hoàn toàn do người dùng nhập hoặc sinh tổng hợp, không có backend và không gọi mạng.',
          en: 'Every algorithm lives in scheduler.ts as pure functions with no React dependency: they take a process list and return a timeline plus metrics. The interface only renders that result. All data is user-entered or synthetic, with no backend and no network calls.',
        },
      },
      {
        kind: 'references',
        links: [
          {
            label: 'OSTEP — Scheduling: Introduction',
            href: 'https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf',
          },
          {
            label: 'OSTEP — Multi-level Feedback Queue',
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
