import type {ShowcaseProject} from '../types/showcase';

/* Co bat/tat nam o ../enabled.ts de App.tsx doc duoc ma khong phai keo
   toan bo registry vao chunk trang chu. */
export {SHOWCASE_ENABLED} from '../enabled';

/** Chi liet ke du an CO THAT va chay duoc. Khong dua du an du dinh vao day. */
export const PROJECTS: ShowcaseProject[] = [
  {
    slug: 'assessment-data-integrity-lab',
    category: 'educational-assessment',
    status: 'completed',
    updated: '2026-11-09',
    title: {
      vi: 'Mô phỏng vận hành dữ liệu điểm · Khảo thí Huế',
      en: 'Assessment score operations · Hue, Vietnam',
    },
    summary: {
      vi: 'Mô phỏng cách xử lý lô điểm của 2.000 học sinh: tiếp nhận, chuẩn hóa, kiểm tra toàn bộ dữ liệu, xử lý ngoại lệ, đối soát, báo cáo, khóa và công bố có lưu vết.',
      en: 'A simulation for processing a 2,000-learner score batch: receive, normalize, validate, resolve exceptions, reconcile, report, lock and issue with an audit trail.',
    },
    tech: ['React', 'TypeScript', 'Rule engine', 'Synthetic data'],
    modules: [
      {
        kind: 'overview',
        purpose: {
          vi: 'Biến các quy định đánh giá và Học bạ số thành một quy trình có thể thực hành: từ dữ liệu điểm thô đến kiểm tra, đối soát, khóa, ký và phát hành. Lab ưu tiên tính chính xác nghiệp vụ thay vì mô phỏng một phần mềm chính thức của Bộ GD&ĐT.',
          en: 'Turn assessment and digital-transcript rules into a workflow learners can practise, from raw results to validation, reconciliation, locking, signing and issuance. The lab prioritizes operational accuracy rather than imitating an official MOET application.',
        },
        audience: {
          vi: 'Cán bộ khảo thí, giáo vụ, giáo viên/giảng viên và người học về quản trị dữ liệu giáo dục phổ thông, trung cấp và cao đẳng nghề tại Việt Nam.',
          en: 'Examination officers, academic administrators, educators and learners studying general- and vocational-education data governance in Vietnam.',
        },
        objectives: [
          {
            vi: 'Phân biệt đánh giá tiểu học với cách tính điểm THCS/THPT.',
            en: 'Distinguish primary assessment from lower/upper-secondary calculations.',
          },
          {
            vi: 'Không áp công thức phổ thông cho môn học/mô-đun giáo dục nghề nghiệp.',
            en: 'Keep vocational module calculations separate from general-education formulas.',
          },
          {
            vi: 'Phát hiện điểm thiếu, sai thang điểm, sai công thức và lệch giữa nhiều hệ thống.',
            en: 'Detect missing scores, invalid scales, formula errors and cross-system mismatches.',
          },
          {
            vi: 'Hiểu vì sao dữ liệu đã phát hành không được sửa trực tiếp và mọi thay đổi phải lưu vết.',
            en: 'Understand why issued data cannot be directly edited and why every change needs an audit trail.',
          },
          {
            vi: 'Xử lý Hue-S như lớp tra cứu phụ trợ, không phải nguồn dữ liệu gốc.',
            en: 'Treat Hue-S as an auxiliary viewing layer rather than the source of record.',
          },
        ],
        prerequisites: [
          {
            vi: 'Không yêu cầu kiến thức lập trình; nên biết các khái niệm điểm thường xuyên, giữa kỳ, cuối kỳ và học bạ.',
            en: 'No programming knowledge is required; familiarity with regular, midterm, final results and transcripts is helpful.',
          },
        ],
      },
      {
        kind: 'concepts',
        items: [
          {
            term: {vi: 'Nguồn dữ liệu gốc', en: 'Source of record'},
            explain: {
              vi: 'Dữ liệu nghiệp vụ tại trường được đối chiếu với chứng từ chấm trước khi ký và đồng bộ. Hue-S không được dùng để sửa ngược dữ liệu nguồn.',
              en: 'School operational data is reconciled with marking evidence before signing and synchronization. Hue-S must not write back to the source.',
            },
          },
          {
            term: {vi: 'Lỗi chặn phát hành', en: 'Blocking issue'},
            explain: {
              vi: 'Thiếu điểm bắt buộc, sai thang điểm, sai công thức hoặc lệch nguồn chính khiến lô chưa đủ điều kiện khóa và phát hành.',
              en: 'A missing required score, invalid scale, formula error or authoritative-system mismatch prevents locking and issuance.',
            },
          },
          {
            term: {vi: 'Lưu vết', en: 'Audit trail'},
            explain: {
              vi: 'Ghi ai thực hiện, thời điểm, lý do và giá trị trước/sau cho mỗi lần kiểm tra hoặc chỉnh sửa.',
              en: 'Records who acted, when, why, and the before/after values for every audit or correction.',
            },
          },
          {
            term: {vi: 'Phiên bản quy định', en: 'Policy version'},
            explain: {
              vi: 'Quy tắc được gắn ngày hiệu lực để không áp dụng hồi tố sai cho dữ liệu lịch sử.',
              en: 'Rules are tied to effective dates so historical data is not incorrectly reprocessed.',
            },
          },
        ],
      },
      {kind: 'demo', demoId: 'assessment-integrity'},
      {
        kind: 'how-it-works',
        steps: [
          {
            title: {vi: 'Trước thi · Chuẩn bị lô', en: 'Before exam · Prepare the batch'},
            body: {
              vi: 'Chốt phạm vi Tiểu học–THCS–THPT, lịch, danh sách, điều kiện dự thi, biểu mẫu điểm, người chịu trách nhiệm và mốc khóa dữ liệu.',
              en: 'Finalize the primary–lower secondary–upper secondary scope, schedule, roster, eligibility, score templates, owners and data-lock milestones.',
            },
          },
          {
            title: {vi: 'Trong thi · Kiểm soát và bàn giao', en: 'During exam · Control and handover'},
            body: {
              vi: 'Theo dõi tình trạng dự thi, biên bản phát sinh, sau đó kiểm đếm, niêm phong và bàn giao bài thi/phiếu trả lời cho bộ phận chấm.',
              en: 'Track participation and incidents, then count, seal and hand exam scripts/response sheets to the marking function.',
            },
          },
          {
            title: {vi: 'Sau thi · Xử lý tập điểm', en: 'After exam · Process the score dataset'},
            body: {
              vi: 'Kiểm đếm 2.000 dòng kết quả và 10.000 ô điểm dự kiến, sau đó kiểm tra thang điểm, số đầu điểm, công thức, điều kiện, bản ghi trùng và sai lệch hệ thống.',
              en: 'Count 2,000 result rows and 10,000 expected score cells, then validate scales, required entries, formulas, eligibility, duplicates and system mismatches.',
            },
          },
          {
            title: {vi: 'Hàng đợi ngoại lệ', en: 'Exception queue'},
            body: {
              vi: 'Hệ thống kiểm tra toàn lô nhưng chỉ chuyển học sinh có lỗi vào hàng đợi. Chỉ lỗi có chứng từ đã xác minh mới được sửa; trường hợp cần thẩm quyền vẫn bị chặn.',
              en: 'The system validates the full batch but routes only affected learners to the queue. Only evidence-backed issues can be corrected; authority-dependent cases remain blocked.',
            },
          },
          {
            title: {vi: 'Khóa, ký và phát hành', en: 'Lock, sign and issue'},
            body: {
              vi: 'Lô chỉ được khóa khi không còn lỗi nghiêm trọng. Sau phát hành, sửa đổi phải đi qua thu hồi và tạo lập lại; nhật ký cũ vẫn được giữ.',
              en: 'A batch can be locked only with no blocking issue. After issuance, changes require withdrawal and recreation while retaining history.',
            },
          },
        ],
      },
      {
        kind: 'practice',
        exercises: [
          {
            prompt: {
              vi: 'Chọn tiểu học, chạy audit và tìm bản ghi có điểm thập phân. Vì sao không được làm tròn tự động nếu chưa xem chứng từ?',
              en: 'Select primary, run the audit and find a decimal score. Why should it not be automatically rounded without source evidence?',
            },
            answer: {
              vi: 'Làm tròn có thể thay đổi kết quả thực tế. Quy trình đúng là đối chiếu bài kiểm tra hoặc phiếu điểm gốc, sau đó ghi nhận giá trị đã xác minh và lưu vết thay đổi.',
              en: 'Rounding may alter the actual result. The correct process verifies the marked test or source sheet, records the confirmed value, and retains the change history.',
            },
          },
          {
            prompt: {
              vi: 'Nạp lô đã đối soát, kiểm tra, khóa và phát hành. Sau đó yêu cầu thu hồi để quan sát vòng đời chỉnh sửa bản đã phát hành.',
              en: 'Load the verified batch, audit, lock and issue it. Then request withdrawal to observe the lifecycle for correcting an issued record.',
            },
          },
        ],
      },
      {
        kind: 'tech',
        stack: ['React 19', 'TypeScript', 'Deterministic synthetic data', 'Node test runner'],
        architecture: {
          vi: 'Bộ quy tắc và bộ sinh dữ liệu nằm ngoài React dưới dạng hàm thuần, có kiểm thử độc lập. Giao diện giữ trạng thái trong bộ nhớ trình duyệt; không có backend, tài khoản, dữ liệu thật hay quyết định tự động bằng AI.',
          en: 'The rule engine and data generator are pure functions outside React with independent tests. The interface keeps state in browser memory; there is no backend, account, real data or AI-based decision-making.',
        },
      },
      {
        kind: 'references',
        links: [
          {
            label: 'Thông tư 27/2020/TT-BGDĐT',
            href: 'https://vanban.chinhphu.vn/?docid=201006&pageid=27160',
          },
          {
            label: 'Thông tư 22/2021/TT-BGDĐT',
            href: 'https://vanban.chinhphu.vn/?docid=203926&pageid=27160',
          },
          {
            label: 'Nghị định 88/2026/NĐ-CP',
            href: 'https://vanban.chinhphu.vn/?classid=1&docid=217356&pageid=27160',
          },
          {
            label: 'Thông tư 70/2026/TT-BGDĐT',
            href: 'https://vanban.chinhphu.vn/?docid=219275&orggroupid=4&pageid=27160',
          },
          {
            label: 'Thông tư 04/2022/TT-BLĐTBXH · GDNN đến 09/11/2026',
            href: 'https://vanban.chinhphu.vn/?docid=205592&pageid=27160',
          },
          {
            label: 'Thông tư 79/2026/TT-BGDĐT · GDNN từ 10/11/2026',
            href: 'https://vanban.chinhphu.vn/?docid=219646&orggroupid=4&pageid=27160',
          },
          {
            label: 'Thông tư 89/2026/TT-BGDĐT · hiệu lực 01/12/2026',
            href: 'https://vanban.chinhphu.vn/?docid=220070&pageid=27160&typegroupid=6',
          },
        ],
      },
    ],
  },
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
