import type {L} from '../types/showcase';

/** Chuoi rieng cua showcase. Tach khoi src/i18n.tsx theo yeu cau
 *  "giu du lieu showcase tach biet voi du lieu nghe nghiep". */
export const S = {
  navLabel: {vi: 'Dự án giáo dục', en: 'Educational showcases'},
  backToPortfolio: {vi: 'Về portfolio', en: 'Back to portfolio'},
  kicker: {vi: 'Dự án giáo dục tương tác', en: 'Educational showcases'},
  title: {
    vi: 'Học công nghệ bằng cách tương tác với nó',
    en: 'Learning technology by interacting with it',
  },
  intro: {
    vi: 'Khu vực này tập hợp các công cụ học tập và thử nghiệm kỹ thuật tôi tự xây dựng. Mục tiêu là biến những khái niệm trừu tượng thành thứ có thể bấm vào, chạy thử và quan sát trực tiếp. Phần này tách riêng khỏi hồ sơ nghề nghiệp ở trang chủ.',
    en: 'This area collects the learning tools and technical experiments I build. The goal is to turn abstract concepts into something you can click, run and watch directly. It is kept separate from the professional profile on the home page.',
  },
  filterAll: {vi: 'Tất cả', en: 'All'},
  filterCategory: {vi: 'Lĩnh vực', en: 'Subject'},
  filterStatus: {vi: 'Trạng thái', en: 'Status'},
  countOne: {vi: 'dự án', en: 'project'},
  countMany: {vi: 'dự án', en: 'projects'},
  emptyFilter: {
    vi: 'Không có dự án nào khớp bộ lọc hiện tại.',
    en: 'No project matches the current filters.',
  },
  emptyRegistry: {
    vi: 'Chưa có dự án nào được công bố ở đây.',
    en: 'No project has been published here yet.',
  },
  openDetail: {vi: 'Xem chi tiết', en: 'View details'},
  launchDemo: {vi: 'Chạy thử', en: 'Launch demo'},
  updatedOn: {vi: 'Cập nhật', en: 'Updated'},
  notFoundTitle: {vi: 'Không tìm thấy dự án', en: 'Project not found'},
  notFoundBody: {
    vi: 'Đường dẫn này không trỏ tới dự án nào. Có thể nó đã đổi tên hoặc chưa được công bố.',
    en: 'This address does not point to any project. It may have been renamed or not published yet.',
  },
  backToList: {vi: 'Về danh sách dự án', en: 'Back to the project list'},
  moduleTitle: {
    overview: {vi: 'Tổng quan', en: 'Overview'},
    concepts: {vi: 'Khái niệm cốt lõi', en: 'Core concepts'},
    demo: {vi: 'Thử trực tiếp', en: 'Interactive demo'},
    'how-it-works': {vi: 'Cách hoạt động', en: 'How it works'},
    practice: {vi: 'Luyện tập', en: 'Practice'},
    tech: {vi: 'Thông tin kỹ thuật', en: 'Technical information'},
    references: {vi: 'Nguồn tham khảo', en: 'References'},
  } satisfies Record<string, L>,
  purpose: {vi: 'Mục đích', en: 'Purpose'},
  audience: {vi: 'Dành cho', en: 'Audience'},
  objectives: {vi: 'Sau khi dùng, bạn sẽ hiểu', en: 'What you will understand'},
  prerequisites: {vi: 'Cần biết trước', en: 'Prerequisites'},
};
