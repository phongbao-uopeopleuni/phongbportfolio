/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Locale = 'vi' | 'en';

export const defaultLocale: Locale = 'vi';

const en = {
  nav: {
    brand: 'Portfolio',
    strengths: 'Strengths',
    projects: 'Projects',
    metrics: 'Metrics',
    timeline: 'Career & education',
  },
  hero: {
    roleLine1: 'Officer for Training Organization and Examination Management',
    roleLine2: 'System Automation & Data Integrity Architect',
    badgeToeic: 'TOEIC 700',
    badgePedagogy: 'Pedagogical practice (TC-CĐ)',
    badgeBs: 'Bachelor of Computer Science',
    badgeExcel: 'Excel',
    badgePython: 'Python',
    badgeJava: 'Java',
    badgeMysql: 'MySQL',
    ctaProjects: 'View Projects',
    ctaCv: 'Download CV',
  },
  metrics: {
    students: 'Students Managed',
    dataPoints: 'Data Points Processed',
    automationTools: 'Automation Tools',
    timeOpt: 'Time Optimization',
  },
  about: {
    kicker: 'A short introduction about me',
    title:
      'Connecting training operations, examinations, and academic data into an efficient system',
    p1: 'I specialize in organizing training, examinations, and academic data management at FPT Education, with hands-on experience on IAPS9, CMS, LMS9, Language Hub, and Fuge. My focus is ensuring training progress, grade accuracy, exam schedules, and the integrity of student records.',
    p2: 'Alongside day-to-day operations, I develop support tools with Excel, Python, and AI-assisted logic to standardize graduation data, monitor CMS progress, optimize grade entry, and reduce manual work across training and examination workflows.',
    cards: [
      {
        title: 'Examination operations',
        desc: 'Managing exam schedules, records, grade distributions, and accurate archival workflows for examination data.',
      },
      {
        title: 'Data standardization',
        desc: 'Graduation data processing, Fuge grade entry, and validation of student data accuracy.',
      },
      {
        title: 'System integration',
        desc: 'End-to-end workflows connecting CMS, LMS9, Language Hub, Fuge, and IAPS9.',
      },
      {
        title: 'Process automation',
        desc: 'CMS check tools, large-scale Excel processing, and Python scripts supporting academic operations.',
      },
    ],
  },
  strengths: {
    kicker: 'Strengths',
    title: 'Core competencies',
    pillars: [
      {
        title: 'Systems & data',
        items: [
          'IAPS9, LMS9, CMS & Language Hub',
          'Fuge integration & grade pipelines',
          'Python, Java, MySQL & Excel',
          'Academic data integrity',
        ],
      },
      {
        title: 'Education operations',
        items: [
          'Training & exam schedules',
          'Exam coordination',
          'CMS administration',
          'Quality assurance',
        ],
      },
      {
        title: 'Growth & innovation',
        items: [
          'AI-assisted tools',
          'Automation & Python',
          'Pedagogical practice',
          'Continuous learning',
        ],
      },
    ],
  },
  workflow: {
    kicker: '',
    title: 'Systems administered and managed',
    nodes: ['CMS', 'LMS9', 'Fuge', 'IAPS9', 'Moodle', 'QA Archive'],
  },
  projects: {
    kicker: 'Featured projects',
    title: 'Case studies & solutions',
    github: 'GitHub repositories',
    impact: 'Impact',
    list: [
      {
        title: 'CMS progress monitoring',
        category: 'Efficiency tool',
        description:
          'Real-time monitoring of student progress on CMS, reducing manual reporting time by ~60%.',
        tags: ['Python', 'CMS API', 'Automation'],
        impact: 'Live synchronized dashboard',
        image:
          '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        title: 'Timetable builder tool',
        category: 'Scheduling',
        description:
          'Checks for overlapping shifts, periods, and instructor assignments.',
        tags: ['Excel', 'Timetabling', 'Conflict checks'],
        impact: 'Detect schedule clashes before release',
        image:
          '/images/projects/schedule/z7694406689202_599389826dde70b80c94b68e5ed08bda.jpg',
      },
    ],
  },
  timeline: {
    kicker: 'The journey',
    title: 'Career & academic milestones',
    workHeading: 'Work experience',
    educationHeading: 'Education',
    work: [
      {
        title:
          'Concurrent officer for training, examination & IT support',
        organization: 'FPT PolySchool Hue',
        period: 'Apr 2024 – Present',
        bullets: [
          'Term-based training planning and management: teaching, faculty assignment, extracurricular activities.',
          'Exams, defenses, and end-of-term assessments organized per training regulations.',
          'Records, academic results, and grade distribution analysis.',
          'Learning systems: IAPS9, LMS9, CMS, Language Hub, Udemy, EOS, FLM.',
          'Academic affairs, graduation review, and student services across cohorts.',
          'Supporting resolution of issues related to software and hardware.',
        ],
      },
      {
        title: 'Concurrent Class Advisor & Supervisor',
        organization: 'FPT PolySchool Hue',
        period: 'Aug 2022 – Mar 2024',
        bullets: [
          'Class advisory planning and delivery.',
          'Tuition follow-up, coordinating departments on academics, conduct, and student integrity.',
          'Bridging parents, students, and the school.',
        ],
      },
      {
        title: 'English Language Instructor',
        organization: 'AMA English Center – Hue',
        period: 'Sep 2020 – May 2022',
        bullets: [
          'English instruction.',
          'Extracurricular activities and interpretation.',
        ],
      },
      {
        title: 'Intern',
        organization: 'Granville Medical Center, North Carolina, USA',
        period: '',
        bullets: [
          'Verification and data entry for medical records.',
        ],
      },
      {
        title: 'Volunteer',
        organization: 'Vidant Medical Center, North Carolina, USA',
        period: '',
        bullets: ['Patient Services department.'],
      },
    ],
    education: [
      {
        school: 'University of the People, USA',
        blocks: [
          {
            period: 'Jun 2025 – Nov 2026',
            description: 'Bachelor of Computer Science',
          },
        ],
      },
      {
        school: 'Pitt Community College, North Carolina, USA',
        blocks: [
          {
            period: 'Aug 2017 – Dec 2019',
            description:
              'Associate of Applied Science — Healthcare Management',
          },
          {
            period: 'Jan 2015 – Dec 2016',
            description: 'Associate in General Education',
          },
        ],
      },
      {
        school: 'East Carolina University, North Carolina, USA',
        blocks: [
          {
            period: 'Jul 2014 – Dec 2014',
            description: 'ESL English program',
          },
        ],
      },
      {
        school: 'Duy Tan University, Da Nang, Vietnam',
        blocks: [
          {
            period: 'Aug 2012 – May 2014',
            description: 'Information technology — Software engineering',
          },
        ],
      },
    ],
  },
  achievements: {
    title: 'Achievements',
    groups: [
      {
        year: '2024',
        items: [
          'Successfully delivered a series of training and student orientation projects.',
        ],
      },
      {
        year: '2023',
        items: [
          'Outstanding employee, PTCĐ Assurance Board (2023)',
          'Staff with outstanding academic performance of the year',
        ],
      },
      {
        year: '2022',
        items: [
          'Outstanding employee, PTCĐ Assurance Board (2022)',
          'Outstanding instructor, AMA English Center Hue',
        ],
      },
      {
        year: '2014 – 2021',
        items: [
          'East Carolina University Honor Scholarship',
          'Pitt Community College Foundation Scholarship',
          "Dean's List — top of program by term, Pitt Community College",
          '4th Winner, Volunteers of the Quarter — Granville Health System',
        ],
      },
    ],
  },
  certs: {
    title: 'Certificates & credentials',
    items: [
      { label: 'TOEIC 700', sub: 'Business English' },
      { label: 'Pedagogy', sub: 'Training Professionalism' },
      { label: 'Excel Specialist', sub: 'Advanced Data Management' },
      { label: 'IT Fundamentals', sub: 'Systems Administration' },
    ],
  },
  footer: {
    quickLinks: 'Quick Links',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/phongbao-uopeopleuni',
      },
      { label: 'LinkedIn', href: '#' },
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/pbao280/',
      },
    ],
    personalTitle: 'Personal information',
    phone: '077 575 3003',
    email: 'baophongcmu@gmail.com',
    facebookUrl: 'https://www.facebook.com/pbao280/',
  },
};

const vi: typeof en = {
  nav: {
    brand: 'Portfolio',
    strengths: 'Thế mạnh',
    projects: 'Dự án',
    metrics: 'Số liệu',
    timeline: 'Quá trình công tác và Học vấn',
  },
  hero: {
    roleLine1: 'Cán bộ Tổ chức và Quản lí Đào tạo, Khảo thí.',
    roleLine2: 'Tự động hóa hệ thống & đảm bảo toàn vẹn dữ liệu',
    badgeToeic: 'TOEIC 700',
    badgePedagogy: 'Nghiệp vụ sư phạm TC-CĐ',
    badgeBs: 'Cử nhân Khoa học máy tính',
    badgeExcel: 'Excel',
    badgePython: 'Python',
    badgeJava: 'Java',
    badgeMysql: 'MySQL',
    ctaProjects: 'Xem dự án',
    ctaCv: 'Tải CV',
  },
  metrics: {
    students: 'Sinh viên đã quản lý',
    dataPoints: 'Điểm dữ liệu xử lý',
    automationTools: 'Công cụ tự động',
    timeOpt: 'Tối ưu thời gian',
  },
  about: {
    kicker: 'Giới thiệu ngắn về bản thân tôi',
    title:
      'Kết nối vận hành đào tạo, khảo thí và dữ liệu học vụ thành hệ thống hiệu quả',
    p1: 'Tôi chuyên sâu trong công tác tổ chức đào tạo, khảo thí và quản lý dữ liệu học vụ tại FPT Education, với kinh nghiệm thực tế trên IAPS9, CMS, LMS9, Language Hub và Fuge. Trọng tâm công việc là đảm bảo tiến độ đào tạo, độ chính xác điểm số, lịch thi và tính toàn vẹn của hồ sơ sinh viên.',
    p2: 'Song song với nghiệp vụ vận hành, tôi phát triển các công cụ hỗ trợ bằng Excel, Python và AI-assisted logic để chuẩn hóa dữ liệu tốt nghiệp, kiểm tra tiến độ CMS, tối ưu nhập điểm và giảm thao tác thủ công.',
    cards: [
      {
        title: 'Vận hành khảo thí',
        desc: 'Quản lý lịch thi, hồ sơ, phổ điểm và quy trình lưu trữ dữ liệu khảo thí chính xác.',
      },
      {
        title: 'Chuẩn hóa dữ liệu',
        desc: 'Xử lý dữ liệu tốt nghiệp, nhập điểm Fuge và kiểm tra tính đúng đắn của dữ liệu sinh viên.',
      },
      {
        title: 'Tích hợp hệ thống',
        desc: 'Kết nối luồng nghiệp vụ giữa CMS, LMS9, Language Hub, Fuge và IAPS9 xuyên suốt.',
      },
      {
        title: 'Tự động hóa quy trình',
        desc: 'Xây dựng tool kiểm tra CMS, xử lý Excel dữ liệu lớn và Python scripts hỗ trợ học vụ.',
      },
    ],
  },
  strengths: {
    kicker: 'Thế mạnh',
    title: 'Các năng lực cốt lõi',
    pillars: [
      {
        title: 'Hệ thống & dữ liệu',
        items: [
          'IAPS9, LMS9, CMS & Language Hub',
          'Tích hợp Fuge & luồng điểm',
          'Python, Java, MySQL & Excel',
          'Toàn vẹn dữ liệu học vụ',
        ],
      },
      {
        title: 'Vận hành giáo dục',
        items: [
          'Lịch đào tạo & khảo thí',
          'Phối hợp khảo thí',
          'Quản trị CMS',
          'Đảm bảo chất lượng',
        ],
      },
      {
        title: 'Phát triển & đổi mới',
        items: [
          'Công cụ hỗ trợ AI',
          'Tự động hóa & Python',
          'Nghiệp vụ sư phạm',
          'Học tập liên tục',
        ],
      },
    ],
  },
  workflow: {
    kicker: '',
    title: 'Các hệ thống đã quản trị và xử lí',
    nodes: ['CMS', 'LMS9', 'Fuge', 'IAPS9', 'Moodle', 'Lưu trữ QA'],
  },
  projects: {
    kicker: 'Dự án nổi bật',
    title: 'Case study & giải pháp',
    github: 'Kho mã GitHub',
    impact: 'Tác động',
    list: [
      {
        title: 'Giám sát tiến độ CMS',
        category: 'Công cụ hiệu quả',
        description:
          'Theo dõi tiến độ sinh viên trên CMS theo thời gian thực, giảm ~60% thời gian báo cáo thủ công.',
        tags: ['Python', 'API CMS', 'Tự động hóa'],
        impact: 'Dashboard đồng bộ trực tiếp',
        image:
          '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        title: 'Tool làm thời khóa biểu',
        category: 'Lập lịch',
        description:
          'Có thể check được nếu trùng ca, trùng tiết, trùng giảng viên.',
        tags: ['Excel', 'Thời khóa biểu', 'Kiểm tra xung đột'],
        impact: 'Phát hiện trùng lịch trước khi ban hành',
        image:
          '/images/projects/schedule/z7694406689202_599389826dde70b80c94b68e5ed08bda.jpg',
      },
    ],
  },
  timeline: {
    kicker: 'Hành trình',
    title: 'Cột mốc nghề nghiệp & học thuật',
    workHeading: 'Quá trình công tác',
    educationHeading: 'Quá trình học tập',
    work: [
      {
        title: 'Kiêm nhiệm Cán bộ TC & QL Đào tạo/Khảo thí/CB IT',
        organization: 'FPT PolySchool Huế',
        period: '01/4/2024 – hiện tại',
        bullets: [
          'Lên kế hoạch Tổ chức & Quản lí Đào tạo hằng kỳ: công tác giảng dạy, phân công giảng viên, hoạt động ngoại khóa;',
          'Tổ chức các hoạt động thi, bảo vệ, đánh giá kiểm tra hằng kỳ theo đúng quy chế đào tạo;',
          'Quản lí hồ sơ, kết quả học tập, phân tích Phổ điểm;',
          'Vận hành, quản lí các hệ thống học tập IAPS9, LMS9, CMS, Language Hub, Udemy, EOS, FLM;',
          'Công tác Giáo vụ, xét tốt nghiệp, xử lí các dịch vụ cho Sinh viên các khóa;',
          'Hỗ trợ xử lí các vấn đề liên quan đến phần mềm, phần cứng.',
        ],
      },
      {
        title: 'Kiêm nhiệm Cán bộ Chủ nhiệm và Giám thị',
        organization: 'FPT PolySchool Huế',
        period: '01/8/2022 – 31/3/2024',
        bullets: [
          'Xây dựng, tổ chức kế hoạch Chủ nhiệm các lớp;',
          'Chăm sóc phí, phối hợp các bộ môn quản lí học tập, kiểm tra nề nếp, tư cách Sinh viên;',
          'Thực hiện duy trì, kết nối thông tin giữa Phụ huynh, Sinh viên và nhà trường.',
        ],
      },
      {
        title: 'Giảng viên ngoại ngữ tiếng Anh',
        organization: 'Trung tâm Anh ngữ AMA – Huế',
        period: '09/2020 – 05/2022',
        bullets: [
          'Giảng dạy tiếng Anh;',
          'Tổ chức các hoạt động ngoại khóa, phiên dịch.',
        ],
      },
      {
        title: 'Thực tập sinh',
        organization: 'Granville Medical Center – tiểu bang North Carolina, Hoa Kỳ',
        period: '',
        bullets: ['Kiểm tra, xử lí nhập liệu hồ sơ bệnh án;'],
      },
      {
        title: 'Tình nguyện viên',
        organization: 'Vidant Medical Center – tiểu bang North Carolina, Hoa Kỳ',
        period: '',
        bullets: ['Các hoạt động tại bộ phận Dịch vụ bệnh nhân.'],
      },
    ],
    education: [
      {
        school: 'Trường Đại học University of the People, Hoa Kỳ',
        blocks: [
          {
            period: '06/2025 – 11/2026',
            description: 'Cử nhân Khoa học máy tính',
          },
        ],
      },
      {
        school:
          'Trường Cao đẳng cộng đồng Pitt Community College – tiểu bang North Carolina, Hoa Kỳ',
        blocks: [
          {
            period: '08/2017 – 12/2019',
            description:
              'Cao đẳng Khoa học Ứng dụng, chuyên ngành Quản lí chăm sóc sức khỏe',
          },
          {
            period: '01/2015 – 12/2016',
            description: 'Cao đẳng Giáo dục Phổ thông',
          },
        ],
      },
      {
        school:
          'Trường Đại học East Carolina University – tiểu bang North Carolina, Hoa Kỳ',
        blocks: [
          {
            period: '07/2014 – 12/2014',
            description: 'Chương trình tiếng Anh ESL',
          },
        ],
      },
      {
        school: 'Trường Đại học Duy Tân – Đà Nẵng, Việt Nam',
        blocks: [
          {
            period: '08/2012 – 05/2014',
            description: 'Công nghệ thông tin – Kĩ thuật phần mềm',
          },
        ],
      },
    ],
  },
  achievements: {
    title: 'Thành tích đạt được',
    groups: [
      {
        year: '2024',
        items: [
          'Triển khai thành công chuỗi dự án Đào tạo, định hướng Sinh viên',
        ],
      },
      {
        year: '2023',
        items: [
          'Nhân viên xuất sắc Ban Đảm bảo PTCĐ năm 2023',
          'Cán bộ có thành tích học tập xuất sắc năm',
        ],
      },
      {
        year: '2022',
        items: [
          'Nhân viên xuất sắc Ban Đảm bảo PTCĐ năm 2022',
          'Giảng viên xuất sắc của trung tâm Anh ngữ AMA Huế',
        ],
      },
      {
        year: '2014 – 2021',
        items: [
          'Học bổng East Carolina University Honor Scholarship',
          'Học bổng Pitt Community College Foundation Scholarship',
          "Thủ khoa ngành các học kỳ tại Pitt Community College Dean's List",
          'The 4th Winner Volunteers of the Quarter of Granville Health System',
        ],
      },
    ],
  },
  certs: {
    title: 'Chứng chỉ & thành tích',
    items: [
      { label: 'TOEIC 700', sub: 'Tiếng Anh thương mại' },
      { label: 'Sư phạm', sub: 'Năng lực đào tạo' },
      { label: 'Chuyên gia Excel', sub: 'Quản lý dữ liệu nâng cao' },
      { label: 'Nền tảng CNTT', sub: 'Quản trị hệ thống' },
    ],
  },
  footer: {
    quickLinks: 'Liên kết nhanh',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/phongbao-uopeopleuni',
      },
      { label: 'LinkedIn', href: '#' },
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/pbao280/',
      },
    ],
    personalTitle: 'Thông tin cá nhân',
    phone: '077 575 3003',
    email: 'baophongcmu@gmail.com',
    facebookUrl: 'https://www.facebook.com/pbao280/',
  },
};

export const messages: Record<Locale, typeof en> = { vi, en };

export type Messages = typeof en;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const t = useMemo(() => messages[locale], [locale]);

  useEffect(() => {
    document.documentElement.lang = locale === 'vi' ? 'vi' : 'en';
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
