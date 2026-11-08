import type {L, ShowcaseCategory} from '../types/showcase';

/** Nhan hien thi cho tung danh muc. Danh muc nao khong co du an se khong
 *  xuat hien tren giao dien — bo loc duoc suy ra tu registry, khong phai tu danh sach nay. */
export const CATEGORY_LABEL: Record<ShowcaseCategory, L> = {
  'computer-science': {vi: 'Khoa học máy tính', en: 'Computer science'},
  'operating-systems': {vi: 'Hệ điều hành', en: 'Operating systems'},
  'databases-sql': {vi: 'Cơ sở dữ liệu & SQL', en: 'Databases & SQL'},
  networking: {vi: 'Mạng máy tính', en: 'Networking'},
  cybersecurity: {vi: 'An toàn thông tin', en: 'Cybersecurity'},
  'data-analysis': {vi: 'Phân tích dữ liệu', en: 'Data analysis'},
  'ai-learning-tools': {vi: 'Công cụ học tập AI', en: 'AI-assisted learning tools'},
};

export const STATUS_LABEL = {
  completed: {vi: 'Hoàn thiện', en: 'Completed'},
  prototype: {vi: 'Bản thử', en: 'Prototype'},
  'in-progress': {vi: 'Đang phát triển', en: 'In progress'},
} satisfies Record<string, L>;
