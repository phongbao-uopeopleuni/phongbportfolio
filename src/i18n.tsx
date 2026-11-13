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
    brand: 'Bảo Phong',
    brandLabel: 'EdTech & Assessment',
    album: 'Album',
    projects: 'Projects',
    works: 'Websites',
    timeline: 'Experience',
    contact: 'Contact',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    backHome: 'Back to home',
  },
  hero: {
    eyebrow: 'Educational Technology & Assessment · Huế, Vietnam',
    h1: "Hi, I'm Bảo Phong",
    lead: 'Five-plus years in teaching and in training and examination operations. I connect education practice with systems, data and AI to standardize workflows and keep assessment data accurate.',
    ctaProjects: 'View projects →',
    ctaCv: 'Download CV',
    portraitAlt: 'Portrait of Bảo Phong',
    statStudents: '300+',
    statData: '5,000+',
    statTime: '70%',
  },
  metrics: {
    students: 'Learners Supported',
    dataPoints: 'Academic Data Points Processed',
    timeOpt: 'Manual Time Reduced',
  },
  projects: {
    index: '01',
    label: '// Projects',
    title: 'Practical solutions from real education operations',
    desc: 'Tools I built for real training and examination work, plus two interactive labs that recreate those workflows.',
    pill: 'GitHub repositories ↗',
    githubUrl: 'https://github.com/phongbao-uopeopleuni',
    resultLabel: 'Result',
    cards: [
      {
        category: 'Efficiency tool',
        title: 'CMS progress monitoring',
        desc: 'Manual progress checks took time and missed delayed learners. The tool syncs progress data and builds a dashboard for completion, exceptions and follow-ups.',
        result: 'Cut manual reporting time by about 70%.',
        tags: ['Python', 'CMS API', 'Learning data'],
        image: '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        category: 'Academic planning',
        title: 'Timetable builder tool',
        desc: 'Excel validation rules catch clashing shifts, periods and instructors before a timetable is published, with a demo video for handing it over to training teams.',
        result: 'Catches schedule clashes before release and removes repeated manual checks.',
        tags: ['Excel', 'Conflict checks'],
        image: '/images/projects/tkb/z7810881838440_d98bbeac46cafd98bc5709fbba40760d.jpg',
        link: 'Watch demo video ↗',
        href: 'https://youtu.be/zRkD5tdxXh4',
      },
      {
        category: 'Interactive lab · Assessment',
        title: 'Assessment score operations',
        desc: 'Process a 2,000-learner score batch: receive, normalize, validate, resolve exceptions, reconcile, lock and issue with an audit trail.',
        tags: ['React', 'TypeScript', 'Rule engine'],
        image: '/images/projects/labs/assessment-data-integrity-lab.webp',
        link: 'Try the lab →',
        to: '/showcase/assessment-data-integrity-lab',
      },
      {
        category: 'Interactive lab · Operating systems',
        title: 'CPU scheduling visualizer',
        desc: 'Enter a process table, pick FCFS, SJF, SRTF, Round Robin or Priority, and watch the CPU divide time tick by tick alongside the performance metrics.',
        tags: ['React', 'TypeScript', 'SVG'],
        image: '/images/projects/labs/cpu-scheduling-visualizer.webp',
        link: 'Try the lab →',
        to: '/showcase/cpu-scheduling-visualizer',
      },
    ],
    canvaCategory: 'Design · Canva',
    canvaTitle: '13 PC Express publications',
    canvaDesc: 'Internal publications for communications, events and student activities, which I planned and designed myself.',
    canvaLink: 'View the collection',
    worksIndex: '02',
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
    index: '03',
    label: '// Journey',
    title: 'Experience & education',
    desc: 'From teaching English to running training and examination operations, alongside a degree in Computer Science.',
    pill: 'Work album →',
    educationHeading: 'Education',
    awardsHeading: 'Achievements & certificates',
    work: [
      {
        period: 'Apr 2024 – Apr 2026',
        title: 'Training & Examination Officer, with IT support',
        organization: 'FPT PolySchool Hue',
        bullets: [
          'Built assessment schedules, assigned instructors and coordinated multi-cohort records in line with regulations.',
          'Managed learning data, grade distributions and periodic reports, safeguarding the integrity of student records.',
          'Operated IAPS9, LMS9, CMS, Udemy, EOS, FLM, Language Hub and Fuge; built tools with Claude, ChatGPT, Codex and NotebookLM alongside Excel/Python.',
        ],
      },
      {
        period: 'Aug 2022 – Mar 2024',
        title: 'Class Advisor & Supervisor',
        organization: 'FPT PolySchool Hue',
        bullets: [
          'Followed up on academics, conduct and tuition; connected parents, students and departments.',
        ],
      },
      {
        period: 'Sep 2020 – May 2022',
        title: 'English Language Instructor',
        organization: 'AMA English Center – Hue',
        bullets: [
          'Taught English and supported extracurricular activities and interpretation.',
        ],
      },
      {
        period: '2017 – 2019',
        title: 'Healthcare intern & volunteer',
        organization: 'Granville Medical Center, Vidant Medical Center · North Carolina, USA',
        bullets: [],
      },
    ],
    education: [
      {
        period: '2025 – 2026',
        title: 'Bachelor of Science in Computer Science',
        organization: 'University of the People, USA',
      },
      {
        period: '2015 – 2019',
        title: 'AAS in Healthcare Management; Associate in General Education',
        organization: 'Pitt Community College, USA',
      },
    ],
    awards: [
      {label: '2025', text: 'Department Award for Excellence in Operations'},
      {label: '2022, 2023', text: 'Outstanding employee, PTCĐ Assurance Board'},
      {label: '2022', text: 'Outstanding instructor, AMA English Center Hue'},
      {
        label: '2014 – 2021',
        text: "ECU Honor and Pitt CC Foundation scholarships; Dean's List across multiple terms",
      },
      {
        label: 'Certificates',
        text: 'TOEIC 700 · Pedagogical training (vocational–college) · Office computing',
      },
    ],
  },
  album: {
    backHome: 'Back to home',
    pageLabel: '// Work album',
    pageTitle: 'Moments at work',
    tileLabel: 'View photo {n} of {total}',
    photosCount: '30 photos',
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
  contact: {
    index: '04',
    label: '// Contact',
    title: "Let's connect",
    description:
      'You can reach me directly by email or phone — I am glad to talk about training operations, academic data and automation.',
    cards: [
      {
        label: 'Job opportunities',
        title: 'Need your training and assessment data in order?',
        text: 'I run assessment schedules, grade pipelines and LMS platforms, and build AI-assisted tools that cut manual work.',
      },
      {
        label: 'Project collaboration',
        title: 'Need a website or a small tool?',
        text: 'I have built bilingual, locally searchable websites for restaurants, a homestay and a clinic in Vietnam and the United States.',
      },
    ],
    emailBtn: 'Send an email',
    email: 'baophongcmu@gmail.com',
    phone: '077 575 3003',
    github: 'GitHub ↗',
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
    brand: 'Bảo Phong',
    brandLabel: 'EdTech & Assessment',
    album: 'Album',
    projects: 'Dự án',
    works: 'Website',
    timeline: 'Kinh nghiệm',
    contact: 'Liên hệ',
    menuOpen: 'Mở menu',
    menuClose: 'Đóng menu',
    themeToDark: 'Chuyển sang giao diện tối',
    themeToLight: 'Chuyển sang giao diện sáng',
    backHome: 'Về trang chủ',
  },
  hero: {
    eyebrow: 'Educational Technology & Assessment · Huế',
    h1: 'Xin chào, tôi là Bảo Phong',
    lead: 'Hơn 5 năm giảng dạy và vận hành đào tạo – khảo thí. Tôi kết nối nghiệp vụ giáo dục với hệ thống, dữ liệu và AI để chuẩn hóa quy trình và giữ dữ liệu đánh giá chính xác.',
    ctaProjects: 'Xem dự án →',
    ctaCv: 'Tải CV',
    portraitAlt: 'Chân dung Bảo Phong',
    statStudents: '300+',
    statData: '5.000+',
    statTime: '70%',
  },
  metrics: {
    students: 'Người học đã hỗ trợ',
    dataPoints: 'Điểm dữ liệu học vụ đã xử lý',
    timeOpt: 'Thời gian thủ công được giảm',
  },
  projects: {
    index: '01',
    label: '// Dự án',
    title: 'Giải pháp từ bài toán vận hành giáo dục',
    desc: 'Công cụ tôi xây cho công việc đào tạo – khảo thí thực tế, và hai lab tương tác mô phỏng lại quy trình đó.',
    pill: 'Kho mã GitHub ↗',
    githubUrl: 'https://github.com/phongbao-uopeopleuni',
    resultLabel: 'Kết quả',
    cards: [
      {
        category: 'Công cụ hiệu quả',
        title: 'Giám sát tiến độ CMS',
        desc: 'Kiểm tra tiến độ thủ công tốn thời gian và dễ bỏ sót sinh viên. Công cụ tự đồng bộ dữ liệu và dựng dashboard theo dõi hoàn thành, ngoại lệ, nhắc việc.',
        result: 'Giảm khoảng 70% thời gian báo cáo thủ công.',
        tags: ['Python', 'API CMS', 'Dữ liệu học tập'],
        image: '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        category: 'Lập kế hoạch học vụ',
        title: 'Công cụ làm thời khóa biểu',
        desc: 'Bộ quy tắc trên Excel phát hiện trùng ca, trùng tiết và trùng giảng viên trước khi ban hành, kèm video hướng dẫn để bàn giao cho đội đào tạo.',
        result: 'Bắt được trùng lịch trước khi ban hành, bớt vòng kiểm tra thủ công lặp lại.',
        tags: ['Excel', 'Kiểm tra xung đột'],
        image: '/images/projects/tkb/z7810881838440_d98bbeac46cafd98bc5709fbba40760d.jpg',
        link: 'Xem video demo ↗',
        href: 'https://youtu.be/zRkD5tdxXh4',
      },
      {
        category: 'Lab tương tác · Khảo thí',
        title: 'Mô phỏng vận hành dữ liệu điểm',
        desc: 'Xử lý lô điểm của 2.000 học sinh: tiếp nhận, chuẩn hóa, kiểm tra, xử lý ngoại lệ, đối soát, khóa và công bố có lưu vết.',
        tags: ['React', 'TypeScript', 'Rule engine'],
        image: '/images/projects/labs/assessment-data-integrity-lab.webp',
        link: 'Thử lab →',
        to: '/showcase/assessment-data-integrity-lab',
      },
      {
        category: 'Lab tương tác · Hệ điều hành',
        title: 'Trình mô phỏng lập lịch CPU',
        desc: 'Nhập bảng tiến trình, chọn FCFS, SJF, SRTF, Round Robin hoặc Priority, rồi xem CPU chia thời gian theo từng nhịp cùng các chỉ số hiệu năng.',
        tags: ['React', 'TypeScript', 'SVG'],
        image: '/images/projects/labs/cpu-scheduling-visualizer.webp',
        link: 'Thử lab →',
        to: '/showcase/cpu-scheduling-visualizer',
      },
    ],
    canvaCategory: 'Thiết kế · Canva',
    canvaTitle: '13 ấn phẩm PC Express',
    canvaDesc: 'Ấn phẩm nội bộ cho truyền thông, sự kiện và hoạt động sinh viên, tự lên ý tưởng và thiết kế.',
    canvaLink: 'Xem bộ sưu tập',
    worksIndex: '02',
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
    index: '03',
    label: '// Hành trình',
    title: 'Kinh nghiệm & học vấn',
    desc: 'Từ giảng dạy tiếng Anh đến vận hành đào tạo – khảo thí, song song với bằng Khoa học Máy tính.',
    pill: 'Album công tác →',
    educationHeading: 'Học vấn',
    awardsHeading: 'Thành tích & chứng chỉ',
    work: [
      {
        period: '04/2024 – 04/2026',
        title: 'Cán bộ Tổ chức & Quản lý Đào tạo, Khảo thí, kiêm IT',
        organization: 'FPT PolySchool Huế',
        bullets: [
          'Lập lịch đánh giá, phân công giảng viên và điều phối hồ sơ nhiều khóa theo đúng quy chế.',
          'Quản lý dữ liệu học tập, phổ điểm và báo cáo định kỳ; bảo đảm toàn vẹn hồ sơ sinh viên.',
          'Vận hành IAPS9, LMS9, CMS, Udemy, EOS, FLM, Language Hub, Fuge; xây công cụ bằng Claude, ChatGPT, Codex, NotebookLM kết hợp Excel/Python.',
        ],
      },
      {
        period: '08/2022 – 03/2024',
        title: 'Cán bộ Chủ nhiệm & Giám thị',
        organization: 'FPT PolySchool Huế',
        bullets: [
          'Theo dõi học tập, nề nếp, học phí; kết nối phụ huynh, sinh viên và các bộ phận.',
        ],
      },
      {
        period: '09/2020 – 05/2022',
        title: 'Giảng viên tiếng Anh',
        organization: 'Trung tâm Anh ngữ AMA – Huế',
        bullets: ['Giảng dạy, hỗ trợ ngoại khóa và phiên dịch.'],
      },
      {
        period: '2017 – 2019',
        title: 'Thực tập sinh & tình nguyện viên y tế',
        organization: 'Granville Medical Center, Vidant Medical Center · North Carolina, Hoa Kỳ',
        bullets: [],
      },
    ],
    education: [
      {
        period: '2025 – 2026',
        title: 'Cử nhân Khoa học Máy tính (B.S.)',
        organization: 'University of the People, Hoa Kỳ',
      },
      {
        period: '2015 – 2019',
        title: 'Cao đẳng AAS Quản lý Chăm sóc Sức khỏe; AGE',
        organization: 'Pitt Community College, Hoa Kỳ',
      },
    ],
    awards: [
      {label: '2025', text: 'Giải Bộ phận hoàn thành xuất sắc công tác vận hành'},
      {label: '2022, 2023', text: 'Nhân viên xuất sắc, Ban Đảm bảo PTCĐ'},
      {label: '2022', text: 'Giảng viên xuất sắc, Trung tâm Anh ngữ AMA Huế'},
      {
        label: '2014 – 2021',
        text: "Học bổng ECU Honor và Pitt CC Foundation; Dean's List nhiều học kỳ",
      },
      {
        label: 'Chứng chỉ',
        text: 'TOEIC 700 · Nghiệp vụ sư phạm Trung cấp – Cao đẳng · Tin học văn phòng',
      },
    ],
  },
  album: {
    backHome: 'Về trang chủ',
    pageLabel: '// Album công tác',
    pageTitle: 'Khoảnh khắc công tác',
    tileLabel: 'Xem ảnh {n} trên {total}',
    photosCount: '30 ảnh',
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
  contact: {
    index: '04',
    label: '// Liên hệ',
    title: 'Kết nối với tôi',
    description:
      'Bạn có thể liên hệ trực tiếp qua email hoặc điện thoại — rất sẵn lòng trao đổi về vận hành đào tạo, dữ liệu học vụ và tự động hóa.',
    cards: [
      {
        label: 'Cơ hội công việc',
        title: 'Đơn vị cần chuẩn hóa dữ liệu đào tạo – khảo thí?',
        text: 'Tôi có kinh nghiệm vận hành lịch đánh giá, luồng điểm và các hệ thống LMS, cùng công cụ có AI hỗ trợ để giảm việc thủ công.',
      },
      {
        label: 'Hợp tác dự án',
        title: 'Cần một website hay công cụ nhỏ?',
        text: 'Tôi đã làm website song ngữ, tối ưu tìm kiếm địa phương cho nhà hàng, homestay và phòng khám tại Việt Nam và Hoa Kỳ.',
      },
    ],
    emailBtn: 'Gửi email',
    email: 'baophongcmu@gmail.com',
    phone: '077 575 3003',
    github: 'GitHub ↗',
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
