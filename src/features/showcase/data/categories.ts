import type {L, ShowcaseCategory} from '../types/showcase';

/** Nhan hien thi cho tung danh muc. Danh muc nao khong co du an se khong
 *  xuat hien tren giao dien - bo loc duoc suy ra tu registry, khong phai tu danh sach nay. */
export const CATEGORY_LABEL: Record<ShowcaseCategory, L> = {
  'computer-science': {vi: 'Khoa h?c m�y t�nh', en: 'Computer science'},
  'operating-systems': {vi: 'H? di?u h�nh', en: 'Operating systems'},
  'databases-sql': {vi: 'Co s? d? li?u & SQL', en: 'Databases & SQL'},
  networking: {vi: 'M?ng m�y t�nh', en: 'Networking'},
  cybersecurity: {vi: 'An to�n th�ng tin', en: 'Cybersecurity'},
  'data-analysis': {vi: 'Ph�n t�ch d? li?u', en: 'Data analysis'},
  'ai-learning-tools': {vi: 'H?c t?p tang cu?ng b?i AI', en: 'AI-enhanced learning'},
};

export const STATUS_LABEL = {
  completed: {vi: 'Ho�n thi?n', en: 'Completed'},
  prototype: {vi: 'B?n th?', en: 'Prototype'},
  'in-progress': {vi: 'Dang ph�t tri?n', en: 'In progress'},
} satisfies Record<string, L>;
