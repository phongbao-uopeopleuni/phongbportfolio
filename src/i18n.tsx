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
 * D? �n web ? t?ng 2 c?a m?c "D? �n": ch? text + link, kh�ng c?n ?nh,
 * n�n th�m m?t d? �n m?i ch? t?n th�m m?t object.
 */
export type ProjectWork = {
  name: string;
  /** Nhan ng?n trong ngo?c vu�ng, v� d? "Nh� h�ng � Greenville, NC". */
  type: string;
  role: string;
  stack: string[];
  url: string;
  /** Cho card chi?m 2 c?t - d�nh cho d? �n d�ng ch� y nh?t. */
  highlight?: boolean;
  /** Dang x�y d?ng: d?i nhan link v� th�m badge. */
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
    badgePedagogy: 'Pedagogical practice (TC-CD)',
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
    p2: 'I translate operational needs into practical digital tools using Excel, Python, and AI-assisted workflows. This work supports data standardization, progress monitoring, grade processing, and more consistent training and assessment operations-forming my pathway from Educational Technology & Assessment toward AI-Enhanced Education.',
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
      'Projects built outside of work - from a custom genealogy web app to local business websites in Vietnam and the United States.',
    worksLive: 'Visit site',
    worksWip: 'Preview build',
    worksWipBadge: 'In progress',
    works: [
      {
        name: 'Ph�ng Tuy Bi�n Qu?n C�ng online genealogy',
        type: 'Web app � Nguy?n Phu?c clan',
        role:
          'Designed and built the whole platform: an interactive family tree across 8 generations, member search, PDF export, statistics, gravesite lookup, member registration, and a clan news and album section. Ancestral anniversary dates are counted down from the lunar calendar, and the lookup flow is reworked for phone-first use.',
        stack: ['Web app', 'Interactive family tree', 'PDF export', 'Cloudflare'],
        url: 'https://www.phongtuybienquancong.info/',
        highlight: true,
      },
      {
        name: 'EC Ph? Vietnamese Noodle House',
        type: 'Restaurant � Greenville, NC',
        role:
          'Menu and storytelling site with Gallery, Blog, and Contact pages, plus schema.org Restaurant structured data for local search.',
        stack: ['React', 'Vite', 'Vercel', 'schema.org SEO'],
        url: 'https://www.ecphonoodlehousenc.com/home-page',
      },
      {
        name: "Fairy's House Hu?",
        type: 'Homestay � Hu?, Vietnam',
        role:
          'Bilingual Vietnamese-English homestay site with a live Hu? weather bar, a local travel guide section, and one-tap Zalo, hotline, and directions actions.',
        stack: ['React', 'Vite', 'VI-EN bilingual', 'Local SEO'],
        url: 'https://www.fairyshousehue.com/',
      },
      {
        name: 'Dr. Nguyen Dac Nguyen Clinic',
        type: 'Fertility & OB-GYN clinic � Hue, Vietnam',
        role:
          'Patient-facing clinic website with a doctor profile, care categories, appointment flow, health resources, FAQs, a consultation form, and one-tap Zalo, phone, and Google Maps actions. Currently being finalized on a temporary Vercel domain.',
        stack: ['React', 'Vite', 'Vercel', 'Local SEO'],
        url: 'https://drnguyenclinic.vercel.app/',
        wip: true,
      },
      {
        name: 'North Carolina Ph?',
        type: 'Restaurant � Washington, NC',
        role:
          'Bilingual English-Vietnamese restaurant site. Still being finished on a temporary Vercel domain before the official domain goes live.',
        stack: ['React', 'Vite', 'Vercel', 'EN-VI bilingual'],
        url: 'https://ncpho-ten.vercel.app/',
        wip: true,
      },
      {
        name: 'EC Star Nails & Spa',
        type: 'Beauty salon � Greenville, NC',
        role:
          'Service site built on Google Sites: page structure for Services, Gallery, About, and Contact, plus the salon copy itself.',
        stack: ['Google Sites', 'Content & IA'],
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
        period: 'Apr 1, 2024 - Apr 30, 2026',
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
        period: 'Aug 2022 - Mar 2024',
        bullets: [
          'Planned class advisory workflows and coordinated academic, conduct, and tuition follow-up.',
          'Connected parents, students, and departments for timely student-service resolution.',
        ],
      },
      {
        title: 'English Language Instructor',
        organization: 'AMA English Center - Hue',
        period: 'Sep 2020 - May 2022',
        bullets: [
          'Delivered English instruction and learner support.',
          'Supported extracurricular activities and interpretation.',
        ],
      },
      {
        title: 'Intern',
        organization: 'Granville Medical Center, North Carolina, USA',
        period: 'Jun 2019 - Dec 2019',
        bullets: [
          'Verification and data entry for medical records.',
        ],
      },
      {
        title: 'Volunteer',
        organization: 'Vidant Medical Center, North Carolina, USA',
        period: 'Dec 5, 2017 - Feb 2018; Aug 2018 - Nov 2018',
        bullets: ['Patient Services department.'],
      },
    ],
    education: [
      {
        school: 'University of the People, USA',
        blocks: [
          {
            period: 'Jun 2025 - Nov 2026',
            description: 'Bachelor of Science in Computer Science (B.S.)',
          },
        ],
      },
      {
        school: 'Pitt Community College, USA',
        blocks: [
          {
            period: 'Aug 2017 - Dec 2019',
            description:
              'Associate in Applied Science (AAS) - Healthcare Management',
          },
          {
            period: 'Jan 2015 - Dec 2016',
            description: 'Associate in General Education (AGE)',
          },
        ],
      },
      {
        school: 'East Carolina University, North Carolina, USA',
        blocks: [
          {
            period: 'Jul 2014 - Dec 2014',
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
          'Outstanding employee, PTCD Assurance Board (2023)',
          'Staff recognition for outstanding academic performance',
        ],
      },
      {
        year: '2022',
        items: [
          'Outstanding employee, PTCD Assurance Board (2022)',
          'Outstanding instructor, AMA English Center Hue',
        ],
      },
      {
        year: '2014 - 2021',
        items: [
          'East Carolina University Honor Scholarship',
          'Pitt Community College Foundation Scholarship',
          "Dean's List and top program ranking across multiple terms, Pitt Community College",
          'Fourth place, Volunteers of the Quarter - Granville Health System',
        ],
      },
    ],
  },
  album: {
    kicker: 'Work moments',
    title: 'Album - moments at work',
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
    title: 'Album - Canva publications designed by me',
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
      { label: 'Pedagogical training (Vocational-College)', sub: 'Training Professionalism' },
      { label: 'Excel Specialist', sub: 'Advanced Data Management' },
      { label: 'IT Fundamentals', sub: 'Systems Administration' },
    ],
  },
  contact: {
    kicker: 'Contact',
    title: 'Let's connect about educational technology, assessment, learning data, and AI.',
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
    about: 'Gi?i thi?u',
    metrics: 'S? li?u',
    strengths: 'Th? m?nh',
    workflow: 'H? th?ng EdTech',
    projects: 'Gi?i ph�p',
    showcase: 'Ph�ng lab EdTech',
    timeline: 'H�nh tr�nh',
    album: 'Album',
    canva: 'Thi?t k?',
    achievements: 'Th�nh t�ch',
    certs: 'Ch?ng ch?',
    contact: 'Li�n h?',
  },
  hero: {
    roleLine1: 'C�n b? T? ch?c & Qu?n ly D�o t?o, Kh?o th� | Educational Technology & Assessment',
    roleLine2:
      'Hon 5 nam trong linh v?c gi�o d?c qua c�c vai tr� gi?ng d?y, ch? nhi?m v� v?n h�nh d�o t?o - kh?o th�. N?n t?ng C? nh�n Khoa h?c M�y t�nh gi�p t�i k?t n?i nghi?p v? gi�o d?c v?i h? th?ng, d? li?u v� AI d? chu?n h�a quy tr�nh, c?ng c? t�nh to�n v?n c?a d? li?u d�nh gi� v� c?i thi?n tr?i nghi?m ngu?i h?c. D?nh hu?ng ph�t tri?n c?a t�i l� Educational Technology & Assessment, ti?n t?i c�c gi?i ph�p AI-Enhanced Education thi?t th?c v� c� tr�ch nhi?m.',
    badgeTrainingOps: 'C�ng ngh? gi�o d?c',
    badgeDataIntegrity: 'D�nh gi� & d? li?u h?c t?p',
    badgeAutomation: 'Quy tr�nh tang cu?ng b?i AI',
    badgeToeic: 'TOEIC 700',
    badgePedagogy: 'Nghi?p v? su ph?m TC-CD',
    badgeBs: 'C? nh�n Khoa h?c m�y t�nh',
    badgeExcel: 'Excel',
    badgePython: 'Python',
    badgeJava: 'Java',
    badgeMysql: 'MySQL',
    ctaProjects: 'Xem d? �n',
    ctaCv: 'T?i CV',
  },
  metrics: {
    students: 'Ngu?i h?c da h? tr?',
    dataPoints: 'Di?m d? li?u h?c v? da x? ly',
    automationTools: 'C�ng c? v?n h�nh da ph�t tri?n',
    timeOpt: 'Th?i gian th? c�ng du?c gi?m',
  },
  about: {
    kicker: 'N?n t?ng chuy�n m�n & d?nh hu?ng',
    title:
      'K?t n?i c�ng ngh? gi�o d?c, d�nh gi� v� d? li?u h?c t?p d? h? tr? quy?t d?nh t?t hon',
    p1: 'N?n t?ng chuy�n m�n c?a t�i l� t? ch?c d�o t?o, v?n h�nh kh?o th� v� qu?n ly d? li?u h?c v? t?i FPT Education. Qua kinh nghi?m th?c t? tr�n IAPS9, CMS, LMS9, Language Hub v� Fuge, t�i t?p trung v�o ti?n d? d�o t?o, d? ch�nh x�c di?m s?, l?ch d�nh gi� v� t�nh to�n v?n c?a h? so ngu?i h?c.',
    p2: 'T�i chuy?n c�c nhu c?u v?n h�nh th�nh c�ng c? s? thi?t th?c b?ng Excel, Python v� quy tr�nh h? tr? b?i AI. C�ng vi?c n�y ph?c v? chu?n h�a d? li?u, theo doi ti?n d?, x? ly di?m v� tang t�nh nh?t qu�n trong d�o t?o - d�nh gi�; d?ng th?i t?o n?n t?ng d? t�i ph�t tri?n t? Educational Technology & Assessment d?n AI-Enhanced Education.',
    cards: [
      {
        title: 'V?n h�nh d�nh gi�',
        desc: 'Di?u ph?i l?ch d�nh gi�, h? so, ph? di?m v� c�c lu?ng d? li?u kh?o th� d�ng tin c?y.',
      },
      {
        title: 'To�n v?n d? li?u h?c t?p',
        desc: 'Chu?n h�a d? li?u t?t nghi?p, lu?ng di?m v� quy t?c ki?m tra h? so ngu?i h?c.',
      },
      {
        title: 'H? th?ng c�ng ngh? gi�o d?c',
        desc: 'V?n h�nh c�c lu?ng k?t n?i gi?a CMS, LMS9, Language Hub, Fuge v� IAPS9.',
      },
      {
        title: 'Quy tr�nh tang cu?ng b?i AI',
        desc: 'Ph�t tri?n c�ng c? thi?t th?c b?ng AI, Excel v� Python d? h? tr? d?i ngu d�o t?o - kh?o th�.',
      },
    ],
  },
  strengths: {
    kicker: 'Th? m?nh',
    title: 'C�c nang l?c c?t loi',
    pillars: [
      {
        title: 'H? th?ng & d? li?u gi�o d?c',
        items: [
          'IAPS9, LMS9, CMS & Language Hub',
          'Ti?n d? h?c t?p & lu?ng di?m',
          'Python, Java, MySQL & Excel',
          'Ch?t lu?ng & to�n v?n d? li?u h?c v?',
        ],
      },
      {
        title: 'D�nh gi� & v?n h�nh d�o t?o',
        items: [
          'L?ch d�nh gi� & di?u ph?i kh?o th�',
          'H? so h?c v? & ph? di?m',
          'Ph?i h?p li�n ph�ng ban',
          'D?m b?o ch?t lu?ng & tu�n th?',
        ],
      },
      {
        title: 'D?nh hu?ng AI-Enhanced Education',
        items: [
          'Thi?t k? quy tr�nh h? tr? b?i AI',
          'T?o m?u c�ng c? gi�o d?c',
          'T? d?ng h�a v?i Python & Excel',
          '?ng d?ng c� tr�ch nhi?m, l?y ngu?i h?c l�m trung t�m',
        ],
      },
    ],
  },
  workflow: {
    kicker: '',
    title: 'C�c h? th?ng c�ng ngh? gi�o d?c v� d�nh gi� da v?n h�nh',
    nodes: ['CMS', 'LMS9', 'Fuge', 'IAPS9', 'Moodle', 'Luu tr? QA'],
  },
  projects: {
    kicker: 'C�ng ngh? gi�o d?c & d�nh gi�',
    title: 'Gi?i ph�p thi?t th?c t? b�i to�n v?n h�nh gi�o d?c',
    github: 'Kho ma GitHub',
    githubUrl: 'https://github.com/phongbao-uopeopleuni',
    problem: 'V?n d?',
    solution: 'Gi?i ph�p',
    technology: 'C�ng ngh?',
    impact: 'K?t qu? / T�c d?ng',
    screenshotSlot: '?nh t? d? �n th?c t?',
    watchVideo: 'Xem video demo',
    list: [
      {
        title: 'Gi�m s�t ti?n d? CMS',
        category: 'Ti?n d? h?c t?p & d? li?u',
        problem:
          'Vi?c ki?m tra ti?n d? CMS th? c�ng t?n nhi?u th?i gian v� d? b? s�t sinh vi�n c?n theo doi.',
        solution:
          'T? d?ng d?ng b? d? li?u ti?n d? v� d?ng dashboard d? theo doi tr?ng th�i ho�n th�nh, ngo?i l? v� nh?c vi?c.',
        tags: ['Python', 'API CMS', 'D? li?u h?c t?p'],
        impact: 'Gi?m kho?ng 60% th?i gian b�o c�o th? c�ng v� gi�p nh?n di?n ngu?i h?c ch?m ti?n d? ro hon.',
        image:
          '/images/projects/cms/z7694280097276_ba533de986669a9779589c89bc17a528.jpg',
      },
      {
        title: 'Tool l�m th?i kh�a bi?u',
        category: 'L?p k? ho?ch h?c v?',
        problem:
          'Tr�ng ca, tr�ng ti?t v� tr�ng gi?ng vi�n kh� ph�t hi?n d?y d? tru?c khi ban h�nh th?i kh�a bi?u.',
        solution:
          'Thi?t l?p b? quy t?c ki?m tra tr�n Excel d? ph�t hi?n xung d?t s?m v� d�nh d?u d�ng c?n r� so�t.',
        tags: ['Excel', 'Th?i kh�a bi?u', 'Ki?m tra xung d?t'],
        impact: 'Ph�t hi?n tr�ng l?ch tru?c khi ban h�nh v� gi?m v�ng ki?m tra th? c�ng l?p l?i.',
        image:
          '/images/projects/schedule/z7694406689202_599389826dde70b80c94b68e5ed08bda.jpg',
      },
      {
        title: 'Demo tool th?i kh�a bi?u',
        category: 'Chuy?n giao & hu?ng d?n s? d?ng',
        problem:
          'D?i ngu d�o t?o c?n m?t b?n minh h?a c? th? d? hi?u quy tr�nh ki?m tra c?a c�ng c? TKB.',
        solution:
          'Chu?n b? video demo v� lu?ng ?nh minh h?a quy tr�nh ki?m tra xung d?t ca, ti?t, gi?ng vi�n.',
        tags: ['YouTube', 'Excel', 'TKB'],
        impact: 'Gi�p gi?i ph�p d? d�nh gi�, d? tr�nh b�y v� d? b�n giao cho d?i ngu d�o t?o.',
        image:
          '/images/projects/tkb/z7810881838440_d98bbeac46cafd98bc5709fbba40760d.jpg',
        gallery: [
          '/images/projects/tkb/z7810883920207_da66c312fea21a5118dd3d4b50dcde06.jpg',
          '/images/projects/tkb/z7810881404285_f179659f2b70a07a5585e29ddb0ef59e.jpg',
        ],
        videoUrl: 'https://youtu.be/zRkD5tdxXh4',
      },
    ],
    worksKicker: 'S?n ph?m kh�c',
    worksTitle: 'Website & s?n ph?m da ho�n thi?n',
    worksNote:
      'C�c d? �n l�m ngo�i c�ng vi?c ch�nh - t? web app gia ph? t? ph�t tri?n d?n website cho doanh nghi?p d?a phuong t?i Vi?t Nam v� Hoa K?.',
    worksLive: 'Xem site',
    worksWip: 'Xem b?n d?ng',
    worksWipBadge: 'Dang x�y d?ng',
    works: [
      {
        name: 'Gia ph? online Ph�ng Tuy Bi�n Qu?n C�ng',
        type: 'Web app � Nguy?n Phu?c T?c',
        role:
          'Thi?t k? v� ph�t tri?n to�n b? h? th?ng: c�y gia ph? tuong t�c 8 d?i, t�m ki?m th�nh vi�n, xu?t PDF, th?ng k�, tra c?u m? ph?n, dang ky t�i kho?n v� m?c tin t?c - album d�ng h?. Ng�y gi? du?c d?m ngu?c theo l?ch �m, lu?ng tra c?u t?i uu ri�ng cho di?n tho?i.',
        stack: ['Web app', 'C�y gia ph? tuong t�c', 'Xu?t PDF', 'Cloudflare'],
        url: 'https://www.phongtuybienquancong.info/',
        highlight: true,
      },
      {
        name: 'EC Ph? Vietnamese Noodle House',
        type: 'Nh� h�ng � Greenville, NC',
        role:
          'Website gi?i thi?u v� th?c don v?i c�c trang Gallery, Blog, Contact; g?n d? li?u c� c?u tr�c schema.org Restaurant ph?c v? t�m ki?m d?a phuong.',
        stack: ['React', 'Vite', 'Vercel', 'SEO schema.org'],
        url: 'https://www.ecphonoodlehousenc.com/home-page',
      },
      {
        name: "Fairy's House Hu?",
        type: 'Homestay � Hu?',
        role:
          'Website homestay song ng? Vi?t - Anh, c� thanh th?i ti?t Hu? c?p nh?t tr?c ti?p, chuy�n m?c c?m nang du l?ch v� c�c n�t li�n h? nhanh Zalo, hotline, ch? du?ng.',
        stack: ['React', 'Vite', 'Song ng? VI-EN', 'SEO local'],
        url: 'https://www.fairyshousehue.com/',
      },
      {
        name: 'Ph�ng kh�m TS.BS. D?c Nguy�n',
        type: 'Hi?m mu?n & S?n Ph? khoa � Hu?',
        role:
          'Website gi?i thi?u ph�ng kh�m v?i h? so b�c si, nh�m d?ch v?, quy tr�nh d?t l?ch, n?i dung s?c kh?e, FAQ, bi?u m?u tu v?n v� c�c h�nh d?ng nhanh qua Zalo, di?n tho?i, Google Maps. Dang ho�n thi?n tr�n t�n mi?n t?m c?a Vercel.',
        stack: ['React', 'Vite', 'Vercel', 'SEO local'],
        url: 'https://drnguyenclinic.vercel.app/',
        wip: true,
      },
      {
        name: 'North Carolina Ph?',
        type: 'Nh� h�ng � Washington, NC',
        role:
          'Website nh� h�ng song ng? Anh - Vi?t. Dang ho�n thi?n tr�n t�n mi?n t?m c?a Vercel tru?c khi tr? v? t�n mi?n ch�nh th?c.',
        stack: ['React', 'Vite', 'Vercel', 'Song ng? EN-VI'],
        url: 'https://ncpho-ten.vercel.app/',
        wip: true,
      },
      {
        name: 'EC Star Nails & Spa',
        type: 'L�m d?p � Greenville, NC',
        role:
          'Website d?ch v? d?ng tr�n Google Sites: t? ch?c c?u tr�c trang Services, Gallery, About, Contact v� bi�n t?p to�n b? n?i dung gi?i thi?u ti?m.',
        stack: ['Google Sites', 'N?i dung & c?u tr�c trang'],
        url: 'https://www.ecstarnailsandspagreenvillenc.com/',
      },
    ] as ProjectWork[],
  },
  timeline: {
    kicker: 'H�nh tr�nh',
    title: 'C?t m?c ngh? nghi?p & h?c thu?t',
    workHeading: 'Qu� tr�nh c�ng t�c',
    educationHeading: 'Qu� tr�nh h?c t?p',
    work: [
      {
        title: 'Ki�m nhi?m C�n b? TC & QL D�o t?o/Kh?o th�/CB IT',
        organization: 'FPT PolySchool Hu?',
        period: '01/4/2024 - 30/4/2026',
        bullets: [
          'L?p k? ho?ch v� tri?n khai ho?t d?ng gi?ng d?y, d�o t?o, kh?o th� theo d�ng quy ch?; ph�n c�ng gi?ng vi�n, x�y d?ng l?ch d�nh gi� v� di?u ph?i h? so nhi?u kh�a.',
          'Qu?n ly d? li?u h?c t?p, k?t qu? h?c t?p, ph? di?m v� b�o c�o d?nh k?, b?o d?m t�nh ch�nh x�c v� to�n v?n c?a h? so sinh vi�n.',
          'V?n h�nh c�c h? th?ng d�o t?o v� thi g?m IAPS9, LMS9, CMS, Udemy, EOS, FLM, Language Hub v� Fuge.',
          'Ph?i h?p v?i gi?ng vi�n v� c�c ph�ng ban nh?m b?o d?m ch?t lu?ng d�o t?o.',
          'S? d?ng th�nh th?o Claude, ChatGPT, Codex v� NotebookLM d? x�y d?ng c�ng c?, ?ng d?ng ph?c v? v?n h�nh d�o t?o v� kh?o th�; k?t h?p Excel/Python nh?m gi?m thao t�c b�o c�o v� x? ly di?m th? c�ng.',
        ],
      },
      {
        title: 'Ki�m nhi?m C�n b? Ch? nhi?m v� Gi�m th?',
        organization: 'FPT PolySchool Hu?',
        period: '01/8/2022 - 31/3/2024',
        bullets: [
          'X�y d?ng k? ho?ch ch? nhi?m v� ph?i h?p theo doi h?c t?p, n? n?p, h?c ph� cho sinh vi�n.',
          'Duy tr� k?t n?i gi?a ph? huynh, sinh vi�n v� c�c b? ph?n d? x? l� v?n d? k?p th?i.',
        ],
      },
      {
        title: 'Gi?ng vi�n ngo?i ng? ti?ng Anh',
        organization: 'Trung t�m Anh ng? AMA - Hu?',
        period: '09/2020 - 05/2022',
        bullets: [
          'Gi?ng d?y ti?ng Anh v� h? tr? ti?n b? h?c vi�n.',
          'H? tr? ho?t d?ng ngo?i kh�a v� phi�n d?ch.',
        ],
      },
      {
        title: 'Th?c t?p sinh',
        organization: 'Granville Medical Center - ti?u bang North Carolina, Hoa K?',
        period: '06/2019 - 12/2019',
        bullets: ['Ki?m tra, x? l� nh?p li?u h? so b?nh �n;'],
      },
      {
        title: 'T�nh nguy?n vi�n',
        organization: 'Vidant Medical Center - ti?u bang North Carolina, Hoa K?',
        period: '05/12/2017 - 02/2018; 08/2018 - 11/2018',
        bullets: ['C�c ho?t d?ng t?i b? ph?n D?ch v? b?nh nh�n.'],
      },
    ],
    education: [
      {
        school: 'University of the People, Hoa K?',
        blocks: [
          {
            period: '06/2025 - 11/2026',
            description: 'C? nh�n Khoa h?c M�y t�nh (B.S.)',
          },
        ],
      },
      {
        school: 'Pitt Community College, Hoa K?',
        blocks: [
          {
            period: '08/2017 - 12/2019',
            description:
              'Cao d?ng Khoa h?c ?ng d?ng (AAS) - Qu?n ly Cham s�c S?c kh?e',
          },
          {
            period: '01/2015 - 12/2016',
            description: 'Cao d?ng Gi�o d?c D?i cuong (AGE)',
          },
        ],
      },
      {
        school:
          'Tru?ng D?i h?c East Carolina University - ti?u bang North Carolina, Hoa K?',
        blocks: [
          {
            period: '07/2014 - 12/2014',
            description: 'Chuong tr�nh ti?ng Anh ESL',
          },
        ],
      },
    ],
  },
  achievements: {
    title: 'Th�nh t�ch d?t du?c',
    groups: [
      {
        year: '2025',
        items: [
          'Gi?i B? ph?n ho�n th�nh xu?t s?c c�ng t�c v?n h�nh',
        ],
      },
      {
        year: '2024',
        items: [
          'Tri?n khai th�nh c�ng chu?i d? �n d�o t?o v� d?nh hu?ng sinh vi�n',
        ],
      },
      {
        year: '2023',
        items: [
          'Nh�n vi�n xu?t s?c Ban D?m b?o PTCD nam 2023',
          'C�n b? c� th�nh t�ch h?c t?p xu?t s?c',
        ],
      },
      {
        year: '2022',
        items: [
          'Nh�n vi�n xu?t s?c Ban D?m b?o PTCD nam 2022',
          'Gi?ng vi�n xu?t s?c c?a trung t�m Anh ng? AMA Hu?',
        ],
      },
      {
        year: '2014 - 2021',
        items: [
          'H?c b?ng East Carolina University Honor Scholarship',
          'H?c b?ng Pitt Community College Foundation Scholarship',
          "D?t Dean's List v� d?ng d?u ng�nh qua nhi?u h?c k? t?i Pitt Community College",
          'H?ng 4 gi?i Volunteers of the Quarter - Granville Health System',
        ],
      },
    ],
  },
  album: {
    kicker: 'Kho?nh kh?c c�ng t�c',
    title: 'Album - kho?nh kh?c c�ng t�c',
    note: 'T?p h?p h�nh ?nh trong qu� tr�nh v?n h�nh d�o t?o, kh?o th� v� c�c ho?t d?ng c�ng d?ng nghi?p. Nh?p v�o ?nh d? xem l?n.',
    empty: 'H�nh ?nh dang du?c c?p nh?t.',
    closeLabel: 'D�ng',
    prevLabel: '?nh tru?c',
    nextLabel: '?nh sau',
    photoAlt: 'Kho?nh kh?c c�ng t�c',
    photosLabel: '?nh',
    tags: ['T?n t�m', 'Nhi?t huy?t', 'Kh�ng ng?ng h?c'],
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
    kicker: 'S?n ph?m s�ng t?o',
    title: 'Album - C�c ?n ph?m t? thi?t k? b?ng Canva',
    note:
      'Tuy?n ch?n c�c ?n ph?m n?i b? PC Express do t�i l�n y tu?ng v� tr?c ti?p thi?t k? tr�n Canva, ph?c v? truy?n th�ng, s? ki?n v� ho?t d?ng sinh vi�n.',
    designAlt: '?n ph?m PC Express t? thi?t k? b?ng Canva',
    closeLabel: 'D�ng b?n xem thi?t k?',
    prevLabel: 'Thi?t k? tru?c',
    nextLabel: 'Thi?t k? ti?p theo',
    itemsLabel: '?n ph?m t? thi?t k?',
  },
  certs: {
    title: 'Ch?ng ch? & th�nh t�ch',
    items: [
      { label: 'TOEIC 700', sub: 'Ti?ng Anh thuong m?i' },
      { label: 'NVSP Trung c?p - Cao d?ng', sub: 'Nang l?c d�o t?o' },
      { label: 'Th�nh th?o Excel', sub: 'Qu?n ly d? li?u n�ng cao' },
      { label: 'N?n t?ng CNTT', sub: 'Qu?n tr? h? th?ng' },
    ],
  },
  contact: {
    kicker: 'Li�n h?',
    title: 'K?t n?i d? trao d?i v? c�ng ngh? gi�o d?c, d�nh gi�, d? li?u h?c t?p v� AI.',
    description:
      'T�i s?n s�ng trao d?i v? c�ng ngh? gi�o d?c, v?n h�nh d�nh gi�, ch?t lu?ng d? li?u h?c t?p v� c�ch ?ng d?ng AI thi?t th?c, c� tr�ch nhi?m trong gi�o d?c.',
    emailLabel: 'Email',
    email: 'baophongcmu@gmail.com',
    phoneLabel: 'S? di?n tho?i',
    phone: '077 575 3003',
    cta: 'K?t n?i v?i t�i',
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
