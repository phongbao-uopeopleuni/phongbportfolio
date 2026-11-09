import type {L} from '../types/showcase';

/** Chuoi rieng cua showcase. Tach khoi src/i18n.tsx theo yeu cau
 *  "giu du lieu showcase tach biet voi du lieu nghe nghiep". */
export const S = {
  navLabel: {vi: 'Phòng lab EdTech', en: 'EdTech lab'},
  backToPortfolio: {vi: 'Về portfolio', en: 'Back to portfolio'},
  kicker: {vi: 'Phòng lab công nghệ giáo dục', en: 'Educational technology lab'},
  title: {
    vi: 'Từ khái niệm kỹ thuật đến trải nghiệm học tập tương tác',
    en: 'From technical concepts to interactive learning experiences',
  },
  intro: {
    vi: 'Khu vực này ghi lại cách tôi chuyển các khái niệm khoa học máy tính thành công cụ học tập có thể tương tác, kết nối thiết kế phần mềm với sư phạm và đánh giá. Đây là nền tảng thực hành cho định hướng Educational Technology & Assessment, tiến tới AI-Enhanced Education; mỗi dự án đều nêu rõ trạng thái và phạm vi thực tế.',
    en: 'This area documents how I turn computer science concepts into interactive learning tools, connecting software design with pedagogy and assessment. It is the practical foundation for my direction in Educational Technology & Assessment and, over time, AI-Enhanced Education; each project clearly states its actual status and scope.',
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
