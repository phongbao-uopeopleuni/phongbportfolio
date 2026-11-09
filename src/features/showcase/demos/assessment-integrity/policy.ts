import type {EducationLevel, PolicyProfile} from './types';

export const POLICY_PROFILES: PolicyProfile[] = [
  {
    id: 'current-2026-11-08',
    label: {
      vi: 'Quy định đang áp dụng · 08/11/2026',
      en: 'Rules in force · 8 Nov 2026',
    },
    effective: '2026-11-08',
    status: {vi: 'Đang hiệu lực', en: 'In force'},
    notes: [
      {
        vi: 'Tiểu học áp dụng Thông tư 27/2020; THCS và THPT áp dụng Thông tư 22/2021.',
        en: 'Primary follows Circular 27/2020; lower and upper secondary follow Circular 22/2021.',
      },
      {
        vi: 'Học bạ số áp dụng Thông tư 70/2026: phải kiểm tra, ký số, phát hành và lưu vết.',
        en: 'Digital transcripts follow Circular 70/2026: validate, digitally sign, issue and retain an audit trail.',
      },
      {
        vi: 'Trung cấp/cao đẳng nghề còn áp dụng Thông tư 04/2022 đến hết 09/11/2026.',
        en: 'Vocational intermediate/college programs remain under Circular 04/2022 through 9 Nov 2026.',
      },
    ],
  },
  {
    id: 'effective-2026-12-01',
    label: {
      vi: 'Quy định từ 01/12/2026',
      en: 'Rules from 1 Dec 2026',
    },
    effective: '2026-12-01',
    status: {vi: 'Sắp có hiệu lực', en: 'Upcoming'},
    notes: [
      {
        vi: 'Bổ sung Thông tư 89/2026 về học bạ số, đề kiểm tra chung lớp 5, 9, 12 và kiểm tra trên máy tính.',
        en: 'Adds Circular 89/2026 provisions for digital transcripts, common tests in grades 5, 9 and 12, and computer-based assessment.',
      },
      {
        vi: 'Không thay đổi công thức trung bình THCS/THPT và không tạo điểm trung bình chung cho tiểu học.',
        en: 'Does not change secondary averages and does not create an overall numeric average for primary school.',
      },
      {
        vi: 'Giáo dục nghề nghiệp áp dụng Thông tư 79/2026 từ 10/11/2026; lab dùng trọng số kiểm tra 0,4 và thi kết thúc 0,6.',
        en: 'Vocational education follows Circular 79/2026 from 10 Nov 2026; the lab uses 0.4 coursework and 0.6 final-exam weights.',
      },
    ],
  },
];

export const LEVEL_LABEL: Record<EducationLevel, {vi: string; en: string}> = {
  primary: {vi: 'Tiểu học · lớp 1–5', en: 'Primary · grades 1–5'},
  'lower-secondary': {vi: 'THCS · lớp 6–9', en: 'Lower secondary · grades 6–9'},
  'upper-secondary': {vi: 'THPT · lớp 10–12', en: 'Upper secondary · grades 10–12'},
  vocational: {
    vi: 'Trung cấp/Cao đẳng nghề',
    en: 'Vocational intermediate/college',
  },
};

export const POLICY_SOURCES = [
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
    label: 'Thông tư 79/2026/TT-BGDĐT',
    href: 'https://vanban.chinhphu.vn/?docid=219646&orggroupid=4&pageid=27160',
  },
  {
    label: 'Thông tư 89/2026/TT-BGDĐT',
    href: 'https://vanban.chinhphu.vn/?docid=220070&pageid=27160&typegroupid=6',
  },
];
