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
    about: 'About',
    metrics: 'Metrics',
    strengths: 'Strengths',
    workflow: 'Systems',
    projects: 'Projects',
    timeline: 'Journey',
    album: 'Album',
    achievements: 'Achievements',
    certs: 'Certificates',
    contact: 'Contact',
  },
  hero: {
    roleLine1: 'Officer for Training Organization and Examination Management',
    roleLine2: 'System Automation & Data Integrity Architect',
    badgeTrainingOps: 'Training operations',
    badgeDataIntegrity: 'Data integrity',
    badgeAutomation: 'Automation systems',
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
    githubUrl: 'https://github.com/phongbao-uopeopleuni',
    problem: 'Problem',
    solution: 'Solution',
    technology: 'Technology',
    impact: 'Result / Impact',
    screenshotSlot: 'Screenshot placeholder',
    watchVideo: 'Watch demo video',
    list: [
      {
        title: 'CMS progress monitoring',
        category: 'Efficiency tool',
        problem:
          'Manual CMS progress checks took significant time and made it easy to miss delayed learners.',
        solution:
          'Automated progress synchronization and dashboard views for completion status, exceptions, and follow-up.',
        tags: ['Python', 'CMS API', 'Automation'],
        impact: 'Reduced manual reporting time by ~60% with a live synchronized dashboard.',
        image:
          '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        title: 'Timetable builder tool',
        category: 'Scheduling',
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
        category: 'Video & screenshots',
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
          'Managed term-based training and examination operations, including faculty assignment and assessments across cohorts.',
          'Operated IAPS9, LMS9, CMS, Language Hub, and Fuge workflows to protect grade and student-record integrity.',
          'Built Excel/Python support tools that reduced manual reporting and grade-processing work.',
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
        period: 'Period to be updated',
        bullets: [
          'Verification and data entry for medical records.',
        ],
      },
      {
        title: 'Volunteer',
        organization: 'Vidant Medical Center, North Carolina, USA',
        period: 'Period to be updated',
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
        year: '2025',
        items: [
          'Department Award for Excellence in Operational Completion',
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
    title: 'Let’s connect about training operations, data integrity, and automation.',
    description:
      'Feel free to reach out directly by email or phone — I’m happy to discuss training operations, academic data, and automation.',
    emailLabel: 'Email',
    email: 'baophongcmu@gmail.com',
    phoneLabel: 'Phone',
    phone: '077 575 3003',
    cta: 'Connect with me',
  },
  footer: {
    tagline: 'Training operations · Data integrity · Automation',
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
    workflow: 'Hệ thống',
    projects: 'Dự án',
    timeline: 'Hành trình',
    album: 'Album',
    achievements: 'Thành tích',
    certs: 'Chứng chỉ',
    contact: 'Liên hệ',
  },
  hero: {
    roleLine1: 'Cán bộ Tổ chức và Quản lí Đào tạo, Khảo thí.',
    roleLine2: 'Tự động hóa hệ thống & đảm bảo toàn vẹn dữ liệu',
    badgeTrainingOps: 'Vận hành đào tạo',
    badgeDataIntegrity: 'Toàn vẹn dữ liệu',
    badgeAutomation: 'Tự động hóa hệ thống',
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
    githubUrl: 'https://github.com/phongbao-uopeopleuni',
    problem: 'Vấn đề',
    solution: 'Giải pháp',
    technology: 'Công nghệ',
    impact: 'Kết quả / Tác động',
    screenshotSlot: 'Vị trí ảnh minh họa',
    watchVideo: 'Xem video demo',
    list: [
      {
        title: 'Giám sát tiến độ CMS',
        category: 'Công cụ hiệu quả',
        problem:
          'Việc kiểm tra tiến độ CMS thủ công tốn nhiều thời gian và dễ bỏ sót sinh viên cần theo dõi.',
        solution:
          'Tự động đồng bộ dữ liệu tiến độ và dựng dashboard để theo dõi trạng thái hoàn thành, ngoại lệ và nhắc việc.',
        tags: ['Python', 'API CMS', 'Tự động hóa'],
        impact: 'Giảm khoảng 60% thời gian báo cáo thủ công nhờ dashboard đồng bộ trực tiếp.',
        image:
          '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        title: 'Tool làm thời khóa biểu',
        category: 'Lập lịch',
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
        category: 'Video & hình ảnh',
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
          'Quản lí vận hành đào tạo và khảo thí theo kỳ, gồm phân công giảng viên, lịch đánh giá và điều phối hồ sơ nhiều khóa.',
          'Vận hành IAPS9, LMS9, CMS, Language Hub và Fuge để bảo đảm tính toàn vẹn điểm số, tiến độ và hồ sơ sinh viên.',
          'Xây dựng công cụ Excel/Python giúp giảm thao tác báo cáo và xử lí điểm thủ công.',
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
        period: 'Thời gian sẽ cập nhật',
        bullets: ['Kiểm tra, xử lí nhập liệu hồ sơ bệnh án;'],
      },
      {
        title: 'Tình nguyện viên',
        organization: 'Vidant Medical Center – tiểu bang North Carolina, Hoa Kỳ',
        period: 'Thời gian sẽ cập nhật',
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
        year: '2025',
        items: [
          'Đạt giải Bộ phận hoàn thành xuất sắc vận hành',
        ],
      },
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
    title: 'Kết nối để trao đổi về vận hành đào tạo, dữ liệu học vụ và tự động hóa.',
    description:
      'Bạn có thể liên hệ trực tiếp qua email hoặc điện thoại — rất sẵn lòng trao đổi về vận hành đào tạo, dữ liệu học vụ và tự động hóa.',
    emailLabel: 'Email',
    email: 'baophongcmu@gmail.com',
    phoneLabel: 'Số điện thoại',
    phone: '077 575 3003',
    cta: 'Kết nối với tôi',
  },
  footer: {
    tagline: 'Vận hành đào tạo · Toàn vẹn dữ liệu · Tự động hóa',
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
