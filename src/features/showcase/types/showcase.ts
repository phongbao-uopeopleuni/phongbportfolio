/** Chuoi song ngu. Du lieu showcase tu chua ban dich, khong dung src/i18n.tsx,
 *  vi i18n chinh rang buoc `const vi: typeof en` buoc hai mang phai song song
 *  dung thu tu — rat de lech khi them du an moi. */
export type L = { vi: string; en: string };

export type ShowcaseCategory =
  | 'educational-assessment'
  | 'computer-science'
  | 'operating-systems'
  | 'databases-sql'
  | 'networking'
  | 'cybersecurity'
  | 'data-analysis'
  | 'ai-learning-tools';

/** Trang thai that cua du an. Khong bao gio gan 'completed' cho thu chua chay duoc. */
export type ShowcaseStatus = 'completed' | 'prototype' | 'in-progress';

/** Id cua demo tuong tac duoc nhung vao trang chi tiet. */
export type DemoId = 'cpu-scheduling' | 'assessment-integrity';

/** Cac khoi noi dung o trang chi tiet. Union co nhan: trang chi dung
 *  nhung khoi ma du an that su co, khong ep du an nao phai co du moi muc. */
export type DetailModule =
  | {
      kind: 'overview';
      purpose: L;
      audience: L;
      objectives: L[];
      prerequisites?: L[];
    }
  | { kind: 'concepts'; items: { term: L; explain: L }[] }
  | { kind: 'demo'; demoId: DemoId }
  | { kind: 'how-it-works'; steps: { title: L; body: L }[] }
  | { kind: 'practice'; exercises: { prompt: L; answer?: L }[] }
  | { kind: 'tech'; stack: string[]; architecture?: L }
  | { kind: 'references'; links: { label: string; href: string }[] };

export type ShowcaseProject = {
  slug: string;
  category: ShowcaseCategory;
  status: ShowcaseStatus;
  title: L;
  summary: L;
  tech: string[];
  /** ISO yyyy-mm-dd */
  updated: string;
  preview?: { src: string; alt: L };
  repo?: string;
  modules: DetailModule[];
};
