import type {L} from '../types/showcase';

/** Chuoi rieng cua showcase. Tach khoi src/i18n.tsx theo yeu cau
 *  "giu du lieu showcase tach biet voi du lieu nghe nghiep". */
export const S = {
  navLabel: {vi: 'Ph�ng lab EdTech', en: 'EdTech lab'},
  backToPortfolio: {vi: 'V? portfolio', en: 'Back to portfolio'},
  kicker: {vi: 'Ph�ng lab c�ng ngh? gi�o d?c', en: 'Educational technology lab'},
  title: {
    vi: 'T? kh�i ni?m k? thu?t d?n tr?i nghi?m h?c t?p tuong t�c',
    en: 'From technical concepts to interactive learning experiences',
  },
  intro: {
    vi: 'Khu v?c n�y ghi l?i c�ch t�i chuy?n c�c kh�i ni?m khoa h?c m�y t�nh th�nh c�ng c? h?c t?p c� th? tuong t�c, k?t n?i thi?t k? ph?n m?m v?i su ph?m v� d�nh gi�. D�y l� n?n t?ng th?c h�nh cho d?nh hu?ng Educational Technology & Assessment, ti?n t?i AI-Enhanced Education; m?i d? �n d?u n�u ro tr?ng th�i v� ph?m vi th?c t?.',
    en: 'This area documents how I turn computer science concepts into interactive learning tools, connecting software design with pedagogy and assessment. It is the practical foundation for my direction in Educational Technology & Assessment and, over time, AI-Enhanced Education; each project clearly states its actual status and scope.',
  },
  filterAll: {vi: 'T?t c?', en: 'All'},
  filterCategory: {vi: 'Linh v?c', en: 'Subject'},
  filterStatus: {vi: 'Tr?ng th�i', en: 'Status'},
  countOne: {vi: 'd? �n', en: 'project'},
  countMany: {vi: 'd? �n', en: 'projects'},
  emptyFilter: {
    vi: 'Kh�ng c� d? �n n�o kh?p b? l?c hi?n t?i.',
    en: 'No project matches the current filters.',
  },
  emptyRegistry: {
    vi: 'Chua c� d? �n n�o du?c c�ng b? ? d�y.',
    en: 'No project has been published here yet.',
  },
  openDetail: {vi: 'Xem chi ti?t', en: 'View details'},
  launchDemo: {vi: 'Ch?y th?', en: 'Launch demo'},
  updatedOn: {vi: 'C?p nh?t', en: 'Updated'},
  notFoundTitle: {vi: 'Kh�ng t�m th?y d? �n', en: 'Project not found'},
  notFoundBody: {
    vi: 'Du?ng d?n n�y kh�ng tr? t?i d? �n n�o. C� th? n� da d?i t�n ho?c chua du?c c�ng b?.',
    en: 'This address does not point to any project. It may have been renamed or not published yet.',
  },
  backToList: {vi: 'V? danh s�ch d? �n', en: 'Back to the project list'},
  moduleTitle: {
    overview: {vi: 'T?ng quan', en: 'Overview'},
    concepts: {vi: 'Kh�i ni?m c?t loi', en: 'Core concepts'},
    demo: {vi: 'Th? tr?c ti?p', en: 'Interactive demo'},
    'how-it-works': {vi: 'C�ch ho?t d?ng', en: 'How it works'},
    practice: {vi: 'Luy?n t?p', en: 'Practice'},
    tech: {vi: 'Th�ng tin k? thu?t', en: 'Technical information'},
    references: {vi: 'Ngu?n tham kh?o', en: 'References'},
  } satisfies Record<string, L>,
  purpose: {vi: 'M?c d�ch', en: 'Purpose'},
  audience: {vi: 'D�nh cho', en: 'Audience'},
  objectives: {vi: 'Sau khi d�ng, b?n s? hi?u', en: 'What you will understand'},
  prerequisites: {vi: 'C?n bi?t tru?c', en: 'Prerequisites'},
};
