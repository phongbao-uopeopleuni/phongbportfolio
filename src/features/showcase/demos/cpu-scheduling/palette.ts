/** Mau cho tung tien trinh tren bieu do Gantt.
 *  Khong dua thong tin nao CHI bang mau: moi thanh deu in kem ma tien trinh,
 *  va bang so lieu ben duoi lap lai toan bo du lieu. */
export const PROC_COLORS = [
  '#4ade80',
  '#38bdf8',
  '#c084fc',
  '#fbbf24',
  '#fb7185',
  '#2dd4bf',
];

/** Chu dat tren thanh mau sang: dung mau nen toi de tuong phan cao. */
export const ON_PROC = '#06130b';

export const colorFor = (ids: string[], id: string) =>
  PROC_COLORS[Math.max(0, ids.indexOf(id)) % PROC_COLORS.length];
