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

/**
 * Dự án web ở tầng 2 của mục "Dự án": chỉ text + link, không cần ảnh,
 * nên thêm một dự án mới chỉ tốn thêm một object.
 */
export type ProjectWork = {
  name: string;
  /** Nhãn ngắn trong ngoặc vuông, ví dụ "Nhà hàng · Greenville, NC". */
  type: string;
  role: string;
  stack: string[];
  url: string;
  /** Cho card chiếm 2 cột — dành cho dự án đáng chú ý nhất. */
  highlight?: boolean;
  /** Đang xây dựng: đổi nhãn link và thêm badge. */
  wip?: boolean;
};

const en = {
  nav: {
    brand: 'Portfolio',
    about: 'About',
    metrics: 'Metrics',
    strengths: 'Strengths',
    workflow: 'EdTech systems',
    projects: 'Solutions',
    showcase: 'EdTech lab',
    timeline: 'Journey',
    album: 'Album',
    canva: 'Designs',
    achievements: 'Achievements',
    certs: 'Certificates',
    contact: 'Contact',
  },
  hero: {
    roleLine1: 'Training & Examination Officer | Educational Technology & Assessment',
    roleLine2:
      'With more than five years in education, I have grown through teaching, homeroom management, and training and examination operations. My B.S. in Computer Science helps me connect education practice with systems, data, and AI to standardize workflows, strengthen the integrity of assessment data, and improve the learner experience. My development direction is Educational Technology & Assessment, advancing toward practical and responsible AI-Enhanced Education.',
    badgeTrainingOps: 'Educational technology',
    badgeDataIntegrity: 'Assessment & learning data',
    badgeAutomation: 'AI-enhanced workflows',
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
    students: 'Learners Supported',
    dataPoints: 'Academic Data Points Processed',
    automationTools: 'Operational Tools Developed',
    timeOpt: 'Manual Time Reduced',
  },
  about: {
    kicker: 'Professional foundation & direction',
    title:
      'Connecting educational technology, assessment, and learning data for better decisions',
    p1: 'My professional foundation is in training organization, examination operations, and academic data management at FPT Education. Through hands-on work with IAPS9, CMS, LMS9, Language Hub, and Fuge, I focus on training progress, grade accuracy, assessment schedules, and the integrity of learner records.',
    p2: 'I translate operational needs into practical digital tools using Excel, Python, and AI-assisted workflows. This work supports data standardization, progress monitoring, grade processing, and more consistent training and assessment operations—forming my pathway from Educational Technology & Assessment toward AI-Enhanced Education.',
    cards: [
      {
        title: 'Assessment operations',
        desc: 'Coordinating assessment schedules, records, grade distributions, and reliable examination-data workflows.',
      },
      {
        title: 'Learning data integrity',
        desc: 'Standardizing graduation data, grade pipelines, and validation rules for accurate learner records.',
      },
      {
        title: 'Educational technology systems',
        desc: 'Operating connected workflows across CMS, LMS9, Language Hub, Fuge, and IAPS9.',
      },
      {
        title: 'AI-enhanced workflows',
        desc: 'Developing practical tools with AI, Excel, and Python to support training and assessment teams.',
      },
    ],
  },
  strengths: {
    kicker: 'Strengths',
    title: 'Core competencies',
    pillars: [
      {
        title: 'Educational systems & data',
        items: [
          'IAPS9, LMS9, CMS & Language Hub',
          'Learning progress & grade pipelines',
          'Python, Java, MySQL & Excel',
          'Academic data quality & integrity',
        ],
      },
      {
        title: 'Assessment & training operations',
        items: [
          'Assessment schedules & coordination',
          'Academic records & grade distributions',
          'Cross-functional coordination',
          'Quality assurance & compliance',
        ],
      },
      {
        title: 'Pathway to AI-Enhanced Education',
        items: [
          'AI-assisted workflow design',
          'Educational tool prototyping',
          'Automation with Python & Excel',
          'Responsible, learner-centered adoption',
        ],
      },
    ],
  },
  workflow: {
    kicker: '',
    title: 'Educational technology and assessment systems operated',
    nodes: ['CMS', 'LMS9', 'Fuge', 'IAPS9', 'Moodle', 'QA Archive'],
  },
  projects: {
    kicker: 'Educational technology & assessment',
    title: 'Practical solutions grounded in real education operations',
    github: 'GitHub repositories',
    githubUrl: 'https://github.com/phongbao-uopeopleuni',
    problem: 'Problem',
    solution: 'Solution',
    technology: 'Technology',
    impact: 'Result / Impact',
    screenshotSlot: 'Photo from the actual project',
    watchVideo: 'Watch demo video',
    list: [
      {
        title: 'CMS progress monitoring',
        category: 'Learning progress & data',
        problem:
          'Manual CMS progress checks took significant time and made it easy to miss delayed learners.',
        solution:
          'Automated progress synchronization and dashboard views for completion status, exceptions, and follow-up.',
        tags: ['Python', 'CMS API', 'Learning data'],
        impact: 'Reduced manual reporting time by ~60% while making delayed learners easier to identify.',
        image:
          '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        title: 'Timetable builder tool',
        category: 'Academic planning',
        problem:
          'Overlapping shifts, periods, and instructor assignments were difficult to catch before publishing schedules.',
        solution:
          'Excel-based validation rules detect conflicts early and flag rows that need review.',
        tags: ['Excel', 'Timetabling', 'Conflict checks'],
        impact: 'Detected schedule clashes before release and reduced repeated manual checking.',
        image:
          '/images/projects/schedule/z7694406689202_599389826dde70b80c94b68e5ed08bda.jpg',
      },
      {
        title: 'Timetable tool demo',
        category: 'Knowledge transfer & training',
        problem:
          'Training teams needed a concrete walkthrough to understand how the timetable checks work.',
        solution:
          'Prepared a demo video and screenshot flow showing conflict checks for shifts, periods, and instructors.',
        tags: ['YouTube', 'Excel', 'Timetabling'],
        impact: 'Made the solution easier to review, present, and hand off to training teams.',
        image:
          '/images/projects/tkb/z7810881838440_d98bbeac46cafd98bc5709fbba40760d.jpg',
        gallery: [
          '/images/projects/tkb/z7810883920207_da66c312fea21a5118dd3d4b50dcde06.jpg',
          '/images/projects/tkb/z7810881404285_f179659f2b70a07a5585e29ddb0ef59e.jpg',
        ],
        videoUrl: 'https://youtu.be/zRkD5tdxXh4',
      },
    ],
    worksKicker: 'Other work',
    worksTitle: 'Websites & products shipped',
    worksNote:
      'Projects built outside of work — from a custom genealogy web app to local business websites in Vietnam and the United States.',
    worksLive: 'Visit site',
    worksWip: 'Preview build',
    worksWipBadge: 'In progress',
    works: [
      {
        name: 'Phòng Tuy Biên Quận Công online genealogy',
        type: 'Web app · Nguyễn Phước clan',
        role:
          'Designed and built the whole platform: an interactive family tree across 8 generations, member search, PDF export, statistics, gravesite lookup, member registration, and a clan news and album section. Ancestral anniversary dates are counted down from the lunar calendar, and the lookup flow is reworked for phone-first use.',
        stack: ['Web app', 'Interactive family tree', 'PDF export', 'Cloudflare'],
        url: 'https://www.phongtuybienquancong.info/',
        highlight: true,
      },
      {
        name: 'EC Phở Vietnamese Noodle House',
        type: 'Restaurant · Greenville, NC',
        role:
          'Menu and storytelling site with Gallery, Blog, and Contact pages, plus schema.org Restaurant structured data for local search.',
        stack: ['React', 'Vite', 'Vercel', 'schema.org SEO'],
        url: 'https://www.ecphonoodlehousenc.com/home-page',
      },
      {
        name: "Fairy's House Huế",
        type: 'Homestay · Huế, Vietnam',
        role:
          'Bilingual Vietnamese–English homestay site with a live Huế weather bar, a local travel guide section, and one-tap Zalo, hotline, and directions actions.',
        stack: ['React', 'Vite', 'VI–EN bilingual', 'Local SEO'],
        url: 'https://www.fairyshousehue.com/',
      },
      {
        name: 'Dr. Nguyen Dac Nguyen Clinic',
        type: 'Fertility & OB-GYN clinic · Hue, Vietnam',
        role:
          'Patient-facing clinic website with a doctor profile, care categories, appointment flow, health resources, FAQs, a consultation form, and one-tap Zalo, phone, and Google Maps actions. Currently being finalized on a temporary Vercel domain.',
        stack: ['React', 'Vite', 'Vercel', 'Local SEO'],
        url: 'https://drnguyenclinic.vercel.app/',
        wip: true,
      },
      {
        name: 'North Carolina Phở',
        type: 'Restaurant · Washington, NC',
        role:
          'Bilingual English–Vietnamese restaurant site. Still being finished on a temporary Vercel domain before the official domain goes live.',
        stack: ['React', 'Vite', 'Vercel', 'EN–VI bilingual'],
        url: 'https://ncpho-ten.vercel.app/',
        wip: true,
      },
      {
        name: 'EC Star Nails & Spa',
        type: 'Nail salon · Greenville & Washington, NC',
        role:
          'Redesigned and rebuilt a multi-page website for three salon locations in Greenville and Washington, North Carolina. Structured the Home, Services, Gallery, About, and Contact content, with click-to-call, directions, and Google review links for each location.',
        stack: ['Responsive web', 'Content & IA', 'Local SEO'],
        url: 'https://www.ecstarnailsandspagreenvillenc.com/',
      },
    ] as ProjectWork[],
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
        period: 'Apr 1, 2024 – Apr 30, 2026',
        bullets: [
          'Planned and delivered teaching, training, and examination activities in compliance with institutional regulations, including faculty assignments, assessment schedules, and multi-cohort records coordination.',
          'Managed learning data, academic results, grade distributions, and periodic reports while safeguarding the accuracy and integrity of student records.',
          'Operated training and examination systems including IAPS9, LMS9, CMS, Udemy, EOS, FLM, Language Hub, and Fuge.',
          'Coordinated with instructors and departments to maintain training quality.',
          'Used Claude, ChatGPT, Codex, and NotebookLM to build tools and applications for training and examination operations; combined Excel/Python tools to reduce manual reporting and grade-processing work.',
        ],
      },
      {
        title: 'Concurrent Class Advisor & Supervisor',
        organization: 'FPT PolySchool Hue',
        period: 'Aug 2022 – Mar 2024',
        bullets: [
          'Planned class advisory workflows and coordinated academic, conduct, and tuition follow-up.',
          'Connected parents, students, and departments for timely student-service resolution.',
        ],
      },
      {
        title: 'English Language Instructor',
        organization: 'AMA English Center – Hue',
        period: 'Sep 2020 – May 2022',
        bullets: [
          'Delivered English instruction and learner support.',
          'Supported extracurricular activities and interpretation.',
        ],
      },
      {
        title: 'Intern',
        organization: 'Granville Medical Center, North Carolina, USA',
        period: 'Jun 2019 – Dec 2019',
        bullets: [
          'Verification and data entry for medical records.',
        ],
      },
      {
        title: 'Volunteer',
        organization: 'Vidant Medical Center, North Carolina, USA',
        period: 'Dec 5, 2017 – Feb 2018; Aug 2018 – Nov 2018',
        bullets: ['Patient Services department.'],
      },
    ],
    education: [
      {
        school: 'University of the People, USA',
        blocks: [
          {
            period: 'Jun 2025 – Nov 2026',
            description: 'Bachelor of Science in Computer Science (B.S.)',
          },
        ],
      },
      {
        school: 'Pitt Community College, USA',
        blocks: [
          {
            period: 'Aug 2017 – Dec 2019',
            description:
              'Associate in Applied Science (AAS) — Healthcare Management',
          },
          {
            period: 'Jan 2015 – Dec 2016',
            description: 'Associate in General Education (AGE)',
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
    ],
  },
  achievements: {
    title: 'Achievements',
    groups: [
      {
        year: '2025',
        items: [
          'Department Award for Excellence in Operations',
        ],
      },
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
          'Staff recognition for outstanding academic performance',
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
          "Dean's List and top program ranking across multiple terms, Pitt Community College",
          'Fourth place, Volunteers of the Quarter — Granville Health System',
        ],
      },
    ],
  },
  album: {
    kicker: 'Work moments',
    title: 'Album — moments at work',
    note: 'A collection of photos from training operations, examinations, and team activities. Click a photo to enlarge.',
    empty: 'Photos are being updated.',
    closeLabel: 'Close',
    prevLabel: 'Previous photo',
    nextLabel: 'Next photo',
    photoAlt: 'Work moment',
    photosLabel: 'photos',
    tags: ['Dedicated', 'Passionate', 'Always learning'],
    photos: [
      { src: '/images/album/images_1.webp', caption: '' },
      { src: '/images/album/images_2.webp', caption: '' },
      { src: '/images/album/images_3.webp', caption: '' },
      { src: '/images/album/images_4.webp', caption: '' },
      { src: '/images/album/images_5.webp', caption: '' },
      { src: '/images/album/images_6.webp', caption: '' },
      { src: '/images/album/images_7.webp', caption: '' },
      { src: '/images/album/images_8.webp', caption: '' },
      { src: '/images/album/images_9.webp', caption: '' },
      { src: '/images/album/images_10.webp', caption: '' },
      { src: '/images/album/images_11.webp', caption: '' },
      { src: '/images/album/images_12.webp', caption: '' },
      { src: '/images/album/images_13.webp', caption: '' },
      { src: '/images/album/images_14.webp', caption: '' },
      { src: '/images/album/images_15.webp', caption: '' },
      { src: '/images/album/images_16.webp', caption: '' },
      { src: '/images/album/images_17.webp', caption: '' },
      { src: '/images/album/images_18.webp', caption: '' },
      { src: '/images/album/images_19.webp', caption: '' },
      { src: '/images/album/images_20.webp', caption: '' },
      { src: '/images/album/images_21.webp', caption: '' },
      { src: '/images/album/images_22.webp', caption: '' },
      { src: '/images/album/images_23.webp', caption: '' },
      { src: '/images/album/images_24.webp', caption: '' },
      { src: '/images/album/images_25.webp', caption: '' },
      { src: '/images/album/images_26.webp', caption: '' },
      { src: '/images/album/images_27.webp', caption: '' },
      { src: '/images/album/images_28.webp', caption: '' },
      { src: '/images/album/images_29.webp', caption: '' },
      { src: '/images/album/images_30.webp', caption: '' },
    ],
  },
  canvaAlbum: {
    kicker: 'Creative work',
    title: 'Album — Canva publications designed by me',
    note:
      'A selection of PC Express internal publications that I planned and designed in Canva for communication, events, and student activities.',
    designAlt: 'PC Express publication designed in Canva',
    closeLabel: 'Close design preview',
    prevLabel: 'Previous design',
    nextLabel: 'Next design',
    itemsLabel: 'self-designed publications',
  },
  certs: {
    title: 'Certificates & credentials',
    items: [
      { label: 'TOEIC 700', sub: 'Business English' },
      { label: 'Pedagogical training (Vocational–College)', sub: 'Training Professionalism' },
      { label: 'Excel Specialist', sub: 'Advanced Data Management' },
      { label: 'IT Fundamentals', sub: 'Systems Administration' },
    ],
  },
  contact: {
    kicker: 'Contact',
    title: 'Let’s connect about educational technology, assessment, learning data, and AI.',
    description:
      'I welcome conversations about educational technology, assessment operations, learning-data quality, and practical, responsible uses of AI in education.',
    emailLabel: 'Email',
    email: 'baophongcmu@gmail.com',
    phoneLabel: 'Phone',
    phone: '077 575 3003',
    cta: 'Connect with me',
  },
  footer: {
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/phongbao-uopeopleuni',
      },
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/pbao280/',
      },
    ],
  },
};

const vi: typeof en = {
  nav: {
    brand: 'Portfolio',
    about: 'Giới thiệu',
    metrics: 'Số liệu',
    strengths: 'Thế mạnh',
    workflow: 'Hệ thống EdTech',
    projects: 'Giải pháp',
    showcase: 'Phòng lab EdTech',
    timeline: 'Hành trình',
    album: 'Album',
    canva: 'Thiết kế',
    achievements: 'Thành tích',
    certs: 'Chứng chỉ',
    contact: 'Liên hệ',
  },
  hero: {
    roleLine1: 'Cán bộ Tổ chức & Quản lý Đào tạo, Khảo thí | Educational Technology & Assessment',
    roleLine2:
      'Hơn 5 năm trong lĩnh vực giáo dục qua các vai trò giảng dạy, chủ nhiệm và vận hành đào tạo – khảo thí. Nền tảng Cử nhân Khoa học Máy tính giúp tôi kết nối nghiệp vụ giáo dục với hệ thống, dữ liệu và AI để chuẩn hóa quy trình, củng cố tính toàn vẹn của dữ liệu đánh giá và cải thiện trải nghiệm người học. Định hướng phát triển của tôi là Educational Technology & Assessment, tiến tới các giải pháp AI-Enhanced Education thiết thực và có trách nhiệm.',
    badgeTrainingOps: 'Công nghệ giáo dục',
    badgeDataIntegrity: 'Đánh giá & dữ liệu học tập',
    badgeAutomation: 'Quy trình tăng cường bởi AI',
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
    students: 'Người học đã hỗ trợ',
    dataPoints: 'Điểm dữ liệu học vụ đã xử lý',
    automationTools: 'Công cụ vận hành đã phát triển',
    timeOpt: 'Thời gian thủ công được giảm',
  },
  about: {
    kicker: 'Nền tảng chuyên môn & định hướng',
    title:
      'Kết nối công nghệ giáo dục, đánh giá và dữ liệu học tập để hỗ trợ quyết định tốt hơn',
    p1: 'Nền tảng chuyên môn của tôi là tổ chức đào tạo, vận hành khảo thí và quản lý dữ liệu học vụ tại FPT Education. Qua kinh nghiệm thực tế trên IAPS9, CMS, LMS9, Language Hub và Fuge, tôi tập trung vào tiến độ đào tạo, độ chính xác điểm số, lịch đánh giá và tính toàn vẹn của hồ sơ người học.',
    p2: 'Tôi chuyển các nhu cầu vận hành thành công cụ số thiết thực bằng Excel, Python và quy trình hỗ trợ bởi AI. Công việc này phục vụ chuẩn hóa dữ liệu, theo dõi tiến độ, xử lý điểm và tăng tính nhất quán trong đào tạo – đánh giá; đồng thời tạo nền tảng để tôi phát triển từ Educational Technology & Assessment đến AI-Enhanced Education.',
    cards: [
      {
        title: 'Vận hành đánh giá',
        desc: 'Điều phối lịch đánh giá, hồ sơ, phổ điểm và các luồng dữ liệu khảo thí đáng tin cậy.',
      },
      {
        title: 'Toàn vẹn dữ liệu học tập',
        desc: 'Chuẩn hóa dữ liệu tốt nghiệp, luồng điểm và quy tắc kiểm tra hồ sơ người học.',
      },
      {
        title: 'Hệ thống công nghệ giáo dục',
        desc: 'Vận hành các luồng kết nối giữa CMS, LMS9, Language Hub, Fuge và IAPS9.',
      },
      {
        title: 'Quy trình tăng cường bởi AI',
        desc: 'Phát triển công cụ thiết thực bằng AI, Excel và Python để hỗ trợ đội ngũ đào tạo – khảo thí.',
      },
    ],
  },
  strengths: {
    kicker: 'Thế mạnh',
    title: 'Các năng lực cốt lõi',
    pillars: [
      {
        title: 'Hệ thống & dữ liệu giáo dục',
        items: [
          'IAPS9, LMS9, CMS & Language Hub',
          'Tiến độ học tập & luồng điểm',
          'Python, Java, MySQL & Excel',
          'Chất lượng & toàn vẹn dữ liệu học vụ',
        ],
      },
      {
        title: 'Đánh giá & vận hành đào tạo',
        items: [
          'Lịch đánh giá & điều phối khảo thí',
          'Hồ sơ học vụ & phổ điểm',
          'Phối hợp liên phòng ban',
          'Đảm bảo chất lượng & tuân thủ',
        ],
      },
      {
        title: 'Định hướng AI-Enhanced Education',
        items: [
          'Thiết kế quy trình hỗ trợ bởi AI',
          'Tạo mẫu công cụ giáo dục',
          'Tự động hóa với Python & Excel',
          'Ứng dụng có trách nhiệm, lấy người học làm trung tâm',
        ],
      },
    ],
  },
  workflow: {
    kicker: '',
    title: 'Các hệ thống công nghệ giáo dục và đánh giá đã vận hành',
    nodes: ['CMS', 'LMS9', 'Fuge', 'IAPS9', 'Moodle', 'Lưu trữ QA'],
  },
  projects: {
    kicker: 'Công nghệ giáo dục & đánh giá',
    title: 'Giải pháp thiết thực từ bài toán vận hành giáo dục',
    github: 'Kho mã GitHub',
    githubUrl: 'https://github.com/phongbao-uopeopleuni',
    problem: 'Vấn đề',
    solution: 'Giải pháp',
    technology: 'Công nghệ',
    impact: 'Kết quả / Tác động',
    screenshotSlot: 'Ảnh từ dự án thực tế',
    watchVideo: 'Xem video demo',
    list: [
      {
        title: 'Giám sát tiến độ CMS',
        category: 'Tiến độ học tập & dữ liệu',
        problem:
          'Việc kiểm tra tiến độ CMS thủ công tốn nhiều thời gian và dễ bỏ sót sinh viên cần theo dõi.',
        solution:
          'Tự động đồng bộ dữ liệu tiến độ và dựng dashboard để theo dõi trạng thái hoàn thành, ngoại lệ và nhắc việc.',
        tags: ['Python', 'API CMS', 'Dữ liệu học tập'],
        impact: 'Giảm khoảng 60% thời gian báo cáo thủ công và giúp nhận diện người học chậm tiến độ rõ hơn.',
        image:
          '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        title: 'Tool làm thời khóa biểu',
        category: 'Lập kế hoạch học vụ',
        problem:
          'Trùng ca, trùng tiết và trùng giảng viên khó phát hiện đầy đủ trước khi ban hành thời khóa biểu.',
        solution:
          'Thiết lập bộ quy tắc kiểm tra trên Excel để phát hiện xung đột sớm và đánh dấu dòng cần rà soát.',
        tags: ['Excel', 'Thời khóa biểu', 'Kiểm tra xung đột'],
        impact: 'Phát hiện trùng lịch trước khi ban hành và giảm vòng kiểm tra thủ công lặp lại.',
        image:
          '/images/projects/schedule/z7694406689202_599389826dde70b80c94b68e5ed08bda.jpg',
      },
      {
        title: 'Demo tool thời khóa biểu',
        category: 'Chuyển giao & hướng dẫn sử dụng',
        problem:
          'Đội ngũ đào tạo cần một bản minh họa cụ thể để hiểu quy trình kiểm tra của công cụ TKB.',
        solution:
          'Chuẩn bị video demo và luồng ảnh minh họa quy trình kiểm tra xung đột ca, tiết, giảng viên.',
        tags: ['YouTube', 'Excel', 'TKB'],
        impact: 'Giúp giải pháp dễ đánh giá, dễ trình bày và dễ bàn giao cho đội ngũ đào tạo.',
        image:
          '/images/projects/tkb/z7810881838440_d98bbeac46cafd98bc5709fbba40760d.jpg',
        gallery: [
          '/images/projects/tkb/z7810883920207_da66c312fea21a5118dd3d4b50dcde06.jpg',
          '/images/projects/tkb/z7810881404285_f179659f2b70a07a5585e29ddb0ef59e.jpg',
        ],
        videoUrl: 'https://youtu.be/zRkD5tdxXh4',
      },
    ],
    worksKicker: 'Sản phẩm khác',
    worksTitle: 'Website & sản phẩm đã hoàn thiện',
    worksNote:
      'Các dự án làm ngoài công việc chính — từ web app gia phả tự phát triển đến website cho doanh nghiệp địa phương tại Việt Nam và Hoa Kỳ.',
    worksLive: 'Xem site',
    worksWip: 'Xem bản dựng',
    worksWipBadge: 'Đang xây dựng',
    works: [
      {
        name: 'Gia phả online Phòng Tuy Biên Quận Công',
        type: 'Web app · Nguyễn Phước Tộc',
        role:
          'Thiết kế và phát triển toàn bộ hệ thống: cây gia phả tương tác 8 đời, tìm kiếm thành viên, xuất PDF, thống kê, tra cứu mộ phần, đăng ký tài khoản và mục tin tức – album dòng họ. Ngày giỗ được đếm ngược theo lịch âm, luồng tra cứu tối ưu riêng cho điện thoại.',
        stack: ['Web app', 'Cây gia phả tương tác', 'Xuất PDF', 'Cloudflare'],
        url: 'https://www.phongtuybienquancong.info/',
        highlight: true,
      },
      {
        name: 'EC Phở Vietnamese Noodle House',
        type: 'Nhà hàng · Greenville, NC',
        role:
          'Website giới thiệu và thực đơn với các trang Gallery, Blog, Contact; gắn dữ liệu có cấu trúc schema.org Restaurant phục vụ tìm kiếm địa phương.',
        stack: ['React', 'Vite', 'Vercel', 'SEO schema.org'],
        url: 'https://www.ecphonoodlehousenc.com/home-page',
      },
      {
        name: "Fairy's House Huế",
        type: 'Homestay · Huế',
        role:
          'Website homestay song ngữ Việt – Anh, có thanh thời tiết Huế cập nhật trực tiếp, chuyên mục cẩm nang du lịch và các nút liên hệ nhanh Zalo, hotline, chỉ đường.',
        stack: ['React', 'Vite', 'Song ngữ VI–EN', 'SEO local'],
        url: 'https://www.fairyshousehue.com/',
      },
      {
        name: 'Phòng khám TS.BS. Đắc Nguyên',
        type: 'Hiếm muộn & Sản Phụ khoa · Huế',
        role:
          'Website giới thiệu phòng khám với hồ sơ bác sĩ, nhóm dịch vụ, quy trình đặt lịch, nội dung sức khỏe, FAQ, biểu mẫu tư vấn và các hành động nhanh qua Zalo, điện thoại, Google Maps. Đang hoàn thiện trên tên miền tạm của Vercel.',
        stack: ['React', 'Vite', 'Vercel', 'SEO local'],
        url: 'https://drnguyenclinic.vercel.app/',
        wip: true,
      },
      {
        name: 'North Carolina Phở',
        type: 'Nhà hàng · Washington, NC',
        role:
          'Website nhà hàng song ngữ Anh – Việt. Đang hoàn thiện trên tên miền tạm của Vercel trước khi trỏ về tên miền chính thức.',
        stack: ['React', 'Vite', 'Vercel', 'Song ngữ EN–VI'],
        url: 'https://ncpho-ten.vercel.app/',
        wip: true,
      },
      {
        name: 'EC Star Nails & Spa',
        type: 'Tiệm nail · Greenville & Washington, NC',
        role:
          'Thiết kế lại và xây dựng website đa trang cho ba cơ sở tại Greenville và Washington, North Carolina. Tổ chức nội dung Home, Services, Gallery, About, Contact; tích hợp gọi điện, chỉ đường và liên kết Google Reviews riêng cho từng cơ sở.',
        stack: ['Web responsive', 'Nội dung & IA', 'SEO local'],
        url: 'https://www.ecstarnailsandspagreenvillenc.com/',
      },
    ] as ProjectWork[],
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
        period: '01/4/2024 – 30/4/2026',
        bullets: [
          'Lập kế hoạch và triển khai hoạt động giảng dạy, đào tạo, khảo thí theo đúng quy chế; phân công giảng viên, xây dựng lịch đánh giá và điều phối hồ sơ nhiều khóa.',
          'Quản lý dữ liệu học tập, kết quả học tập, phổ điểm và báo cáo định kỳ, bảo đảm tính chính xác và toàn vẹn của hồ sơ sinh viên.',
          'Vận hành các hệ thống đào tạo và thi gồm IAPS9, LMS9, CMS, Udemy, EOS, FLM, Language Hub và Fuge.',
          'Phối hợp với giảng viên và các phòng ban nhằm bảo đảm chất lượng đào tạo.',
          'Sử dụng thành thạo Claude, ChatGPT, Codex và NotebookLM để xây dựng công cụ, ứng dụng phục vụ vận hành đào tạo và khảo thí; kết hợp Excel/Python nhằm giảm thao tác báo cáo và xử lý điểm thủ công.',
        ],
      },
      {
        title: 'Kiêm nhiệm Cán bộ Chủ nhiệm và Giám thị',
        organization: 'FPT PolySchool Huế',
        period: '01/8/2022 – 31/3/2024',
        bullets: [
          'Xây dựng kế hoạch chủ nhiệm và phối hợp theo dõi học tập, nề nếp, học phí cho sinh viên.',
          'Duy trì kết nối giữa phụ huynh, sinh viên và các bộ phận để xử lí vấn đề kịp thời.',
        ],
      },
      {
        title: 'Giảng viên ngoại ngữ tiếng Anh',
        organization: 'Trung tâm Anh ngữ AMA – Huế',
        period: '09/2020 – 05/2022',
        bullets: [
          'Giảng dạy tiếng Anh và hỗ trợ tiến bộ học viên.',
          'Hỗ trợ hoạt động ngoại khóa và phiên dịch.',
        ],
      },
      {
        title: 'Thực tập sinh',
        organization: 'Granville Medical Center – tiểu bang North Carolina, Hoa Kỳ',
        period: '06/2019 – 12/2019',
        bullets: ['Kiểm tra, xử lí nhập liệu hồ sơ bệnh án;'],
      },
      {
        title: 'Tình nguyện viên',
        organization: 'Vidant Medical Center – tiểu bang North Carolina, Hoa Kỳ',
        period: '05/12/2017 – 02/2018; 08/2018 – 11/2018',
        bullets: ['Các hoạt động tại bộ phận Dịch vụ bệnh nhân.'],
      },
    ],
    education: [
      {
        school: 'University of the People, Hoa Kỳ',
        blocks: [
          {
            period: '06/2025 – 11/2026',
            description: 'Cử nhân Khoa học Máy tính (B.S.)',
          },
        ],
      },
      {
        school: 'Pitt Community College, Hoa Kỳ',
        blocks: [
          {
            period: '08/2017 – 12/2019',
            description:
              'Cao đẳng Khoa học Ứng dụng (AAS) – Quản lý Chăm sóc Sức khỏe',
          },
          {
            period: '01/2015 – 12/2016',
            description: 'Cao đẳng Giáo dục Đại cương (AGE)',
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
    ],
  },
  achievements: {
    title: 'Thành tích đạt được',
    groups: [
      {
        year: '2025',
        items: [
          'Giải Bộ phận hoàn thành xuất sắc công tác vận hành',
        ],
      },
      {
        year: '2024',
        items: [
          'Triển khai thành công chuỗi dự án đào tạo và định hướng sinh viên',
        ],
      },
      {
        year: '2023',
        items: [
          'Nhân viên xuất sắc Ban Đảm bảo PTCĐ năm 2023',
          'Cán bộ có thành tích học tập xuất sắc',
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
          "Đạt Dean's List và đứng đầu ngành qua nhiều học kỳ tại Pitt Community College",
          'Hạng 4 giải Volunteers of the Quarter — Granville Health System',
        ],
      },
    ],
  },
  album: {
    kicker: 'Khoảnh khắc công tác',
    title: 'Album — khoảnh khắc công tác',
    note: 'Tập hợp hình ảnh trong quá trình vận hành đào tạo, khảo thí và các hoạt động cùng đồng nghiệp. Nhấp vào ảnh để xem lớn.',
    empty: 'Hình ảnh đang được cập nhật.',
    closeLabel: 'Đóng',
    prevLabel: 'Ảnh trước',
    nextLabel: 'Ảnh sau',
    photoAlt: 'Khoảnh khắc công tác',
    photosLabel: 'ảnh',
    tags: ['Tận tâm', 'Nhiệt huyết', 'Không ngừng học'],
    photos: [
      { src: '/images/album/images_1.webp', caption: '' },
      { src: '/images/album/images_2.webp', caption: '' },
      { src: '/images/album/images_3.webp', caption: '' },
      { src: '/images/album/images_4.webp', caption: '' },
      { src: '/images/album/images_5.webp', caption: '' },
      { src: '/images/album/images_6.webp', caption: '' },
      { src: '/images/album/images_7.webp', caption: '' },
      { src: '/images/album/images_8.webp', caption: '' },
      { src: '/images/album/images_9.webp', caption: '' },
      { src: '/images/album/images_10.webp', caption: '' },
      { src: '/images/album/images_11.webp', caption: '' },
      { src: '/images/album/images_12.webp', caption: '' },
      { src: '/images/album/images_13.webp', caption: '' },
      { src: '/images/album/images_14.webp', caption: '' },
      { src: '/images/album/images_15.webp', caption: '' },
      { src: '/images/album/images_16.webp', caption: '' },
      { src: '/images/album/images_17.webp', caption: '' },
      { src: '/images/album/images_18.webp', caption: '' },
      { src: '/images/album/images_19.webp', caption: '' },
      { src: '/images/album/images_20.webp', caption: '' },
      { src: '/images/album/images_21.webp', caption: '' },
      { src: '/images/album/images_22.webp', caption: '' },
      { src: '/images/album/images_23.webp', caption: '' },
      { src: '/images/album/images_24.webp', caption: '' },
      { src: '/images/album/images_25.webp', caption: '' },
      { src: '/images/album/images_26.webp', caption: '' },
      { src: '/images/album/images_27.webp', caption: '' },
      { src: '/images/album/images_28.webp', caption: '' },
      { src: '/images/album/images_29.webp', caption: '' },
      { src: '/images/album/images_30.webp', caption: '' },
    ],
  },
  canvaAlbum: {
    kicker: 'Sản phẩm sáng tạo',
    title: 'Album — Các ấn phẩm tự thiết kế bằng Canva',
    note:
      'Tuyển chọn các ấn phẩm nội bộ PC Express do tôi lên ý tưởng và trực tiếp thiết kế trên Canva, phục vụ truyền thông, sự kiện và hoạt động sinh viên.',
    designAlt: 'Ấn phẩm PC Express tự thiết kế bằng Canva',
    closeLabel: 'Đóng bản xem thiết kế',
    prevLabel: 'Thiết kế trước',
    nextLabel: 'Thiết kế tiếp theo',
    itemsLabel: 'ấn phẩm tự thiết kế',
  },
  certs: {
    title: 'Chứng chỉ & thành tích',
    items: [
      { label: 'TOEIC 700', sub: 'Tiếng Anh thương mại' },
      { label: 'NVSP Trung cấp - Cao đẳng', sub: 'Năng lực đào tạo' },
      { label: 'Thành thạo Excel', sub: 'Quản lý dữ liệu nâng cao' },
      { label: 'Nền tảng CNTT', sub: 'Quản trị hệ thống' },
    ],
  },
  contact: {
    kicker: 'Liên hệ',
    title: 'Kết nối để trao đổi về công nghệ giáo dục, đánh giá, dữ liệu học tập và AI.',
    description:
      'Tôi sẵn sàng trao đổi về công nghệ giáo dục, vận hành đánh giá, chất lượng dữ liệu học tập và cách ứng dụng AI thiết thực, có trách nhiệm trong giáo dục.',
    emailLabel: 'Email',
    email: 'baophongcmu@gmail.com',
    phoneLabel: 'Số điện thoại',
    phone: '077 575 3003',
    cta: 'Kết nối với tôi',
  },
  footer: {
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/phongbao-uopeopleuni',
      },
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/pbao280/',
      },
    ],
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
