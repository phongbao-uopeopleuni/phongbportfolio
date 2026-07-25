/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Menu,
  X,
  ChevronRight,
  Mail,
  School,
  Database,
  Settings,
  TrendingUp,
  Activity,
  Cpu,
  Clock,
  BookOpen,
  Brain,
  UploadCloud,
  Archive,
  Phone,
  Zap,
  Download,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ImageIcon,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { I18nProvider, useI18n } from './i18n';
import heroProfileBundled from './assets/hero/profile.jpg?url';

/** Paths under `public/` — must include Vite `base` (e.g. /phongbportfolio/) for GitHub Pages. */
function publicUrl(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${clean}`;
}

const heroProfileFallback = publicUrl(
  `/images/hero/${encodeURIComponent('pic 1.jpg')}`,
);

/** Drop the CV file at public/cv/bao-phong-cv.pdf to make the hero CTA work. */
const cvUrl = publicUrl('/cv/bao-phong-cv.pdf');

// --- Shared pieces ---

/** Section eyebrow rendered as a code comment; the real title is an h2. */
const SectionHeading = ({
  kicker,
  title,
  align = 'left',
}: {
  kicker?: string;
  title: string;
  align?: 'left' | 'center';
}) => (
  <div className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : ''}`}>
    {kicker ? (
      <p className="font-mono text-sm text-accent mb-3">
        <span aria-hidden="true">{'// '}</span>
        {kicker}
      </p>
    ) : null}
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
      {title}
    </h2>
  </div>
);

const SkipLink = () => {
  const { locale } = useI18n();
  return (
    <a href="#home" className="skip-link">
      {locale === 'vi' ? 'Bỏ qua đến nội dung chính' : 'Skip to main content'}
    </a>
  );
};

/** Hiện dần phần tử khi cuộn tới; delay (ms) tạo hiệu ứng lần lượt. */
const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

/** Con trỏ tùy biến: chấm bám chính xác + vòng bám trễ mượt. Chỉ bật khi có chuột thật. */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    setEnabled(true);
    document.body.classList.add('cursor-none');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      const interactive = (e.target as Element)?.closest?.(
        'a, button, [role="button"], input, textarea, select, label',
      );
      ring.classList.toggle('is-hovering', Boolean(interactive));
    };
    const onDown = () => ring.classList.add('is-clicking');
    const onUp = () => ring.classList.remove('is-clicking');
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '0.6';
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('cursor-none');
    };
  }, []);

  return (
    <div aria-hidden="true" style={{ display: enabled ? undefined : 'none' }}>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};

/** Màn hình boot dạng terminal, hiện một lần mỗi phiên rồi mờ dần. */
const Preloader = () => {
  const [phase, setPhase] = useState<'loading' | 'fadeout' | 'gone'>(() => {
    try {
      return sessionStorage.getItem('booted') ? 'gone' : 'loading';
    } catch {
      return 'loading';
    }
  });

  useEffect(() => {
    if (phase === 'gone') return;
    try {
      sessionStorage.setItem('booted', '1');
    } catch {
      /* sessionStorage không khả dụng — vẫn chạy bình thường */
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setPhase('fadeout'), reduce ? 150 : 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 'fadeout') return;
    const t = setTimeout(() => setPhase('gone'), 500);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-surface px-6 transition-opacity duration-500 ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-[min(90vw,26rem)] font-mono text-sm">
        <p className="flex items-center gap-3 text-ink">
          <span className="preloader-spinner" />
          <span>
            <span className="text-accent">~/</span>bao-phong
            <span className="text-muted"> — booting…</span>
          </span>
        </p>
        <div className="mt-5 space-y-1.5 text-muted">
          <p>
            <span className="text-accent">$</span> loading assets
          </p>
          <p>
            <span className="text-accent">$</span> mounting components
          </p>
          <p>
            <span className="text-accent">$</span> ready
            <span className="cursor-blink text-accent"> _</span>
          </p>
        </div>
        <div className="mt-5 h-1 rounded-full bg-line overflow-hidden">
          <div className="h-full rounded-full bg-accent preloader-bar" />
        </div>
      </div>
    </div>
  );
};

// --- Components ---

const Navbar = () => {
  const { locale, setLocale, t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeId, setActiveId] = useState('home');

  const navItems = [
    { href: '#about', label: t.nav.about },
    { href: '#metrics', label: t.nav.metrics },
    { href: '#strengths', label: t.nav.strengths },
    { href: '#workflow', label: t.nav.workflow },
    { href: '#projects', label: t.nav.projects },
    { href: '#timeline', label: t.nav.timeline },
    { href: '#album', label: t.nav.album },
    { href: '#achievements', label: t.nav.achievements },
    { href: '#contact', label: t.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: làm sáng mục nav theo section đang hiển thị giữa màn hình
  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const langBtn = (active: boolean) =>
    `px-2.5 py-1.5 font-mono text-xs transition-colors ${
      active
        ? 'text-accent underline underline-offset-4 decoration-2'
        : 'text-muted hover:text-ink'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-md border-line h-16'
          : 'bg-transparent border-transparent h-20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <a href="#home" className="font-mono text-sm text-ink font-semibold">
          <span className="text-accent">~/</span>bao-phong
          <span className="cursor-blink text-accent" aria-hidden="true">
            _
          </span>
        </a>

        <div className="hidden xl:flex items-center gap-5 font-mono text-[13px]">
          {navItems.map((item) => {
            const isActive = item.href === `#${activeId}`;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={`transition-colors ${
                  isActive ? 'text-accent' : 'text-muted hover:text-accent'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-line rounded-md px-1">
            <button
              type="button"
              className={langBtn(locale === 'vi')}
              onClick={() => setLocale('vi')}
              aria-pressed={locale === 'vi'}
            >
              vi
            </button>
            <span className="text-line" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              className={langBtn(locale === 'en')}
              onClick={() => setLocale('en')}
              aria-pressed={locale === 'en'}
            >
              en
            </button>
          </div>
          <button
            type="button"
            className="xl:hidden p-2 text-ink hover:text-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={
              isMobileMenuOpen
                ? locale === 'vi'
                  ? 'Đóng menu'
                  : 'Close menu'
                : locale === 'vi'
                  ? 'Mở menu'
                  : 'Open menu'
            }
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Thanh tiến độ cuộn trang */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-panel border-y border-line p-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-sm text-muted hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-accent" aria-hidden="true">
                {'> '}
              </span>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { t } = useI18n();
  const [profileSrc, setProfileSrc] = useState(heroProfileBundled);
  const onProfileError = useCallback(() => {
    setProfileSrc((current) =>
      current === heroProfileFallback ? current : heroProfileFallback,
    );
  }, []);

  const badges = [
    { icon: <School size={14} />, text: t.hero.badgeTrainingOps },
    { icon: <Database size={14} />, text: t.hero.badgeDataIntegrity },
    { icon: <Settings size={14} />, text: t.hero.badgeAutomation },
    { icon: <Zap size={14} />, text: t.hero.badgeToeic },
  ];

  return (
    <section id="home" className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-6 overflow-hidden">
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true"></div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-[7fr_5fr] gap-10 md:gap-12 items-center">
        <div className="min-w-0 hero-reveal">
          <p className="font-mono text-sm text-accent mb-5">
            <span aria-hidden="true">$ </span>whoami
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink leading-[1.05] mb-6 break-words">
            Bảo Phong
          </h1>
          <p className="text-lg sm:text-xl text-ink font-medium mb-2 leading-snug break-words">
            {t.hero.roleLine1}
          </p>
          <p className="font-mono text-sm sm:text-base text-muted mb-8 break-words">
            {t.hero.roleLine2}
          </p>

          <ul className="flex flex-wrap gap-2.5 mb-10 list-none">
            {badges.map((badge, i) => (
              <li
                key={i}
                className="px-3 py-1.5 rounded-md border border-line bg-panel flex items-center gap-2 font-mono text-xs text-muted"
              >
                <span className="text-accent">{badge.icon}</span>
                {badge.text}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-accent text-accent-ink rounded-md font-semibold text-sm hover:brightness-110 transition-[filter] inline-flex items-center gap-2"
            >
              {t.hero.ctaProjects}
              <ChevronRight size={16} className="shrink-0" />
            </a>
            <a
              href={cvUrl}
              download
              className="px-6 py-3 border border-line text-ink rounded-md font-semibold text-sm hover:border-accent hover:text-accent transition-colors inline-flex items-center gap-2"
            >
              <Download size={16} className="shrink-0" />
              {t.hero.ctaCv}
            </a>
          </div>
        </div>

        <div className="min-w-0 flex justify-center md:justify-end hero-reveal hero-reveal-delay">
          {/* Ảnh profile trong khung "cửa sổ terminal" (bundle JPG + fallback public).
              Kích thước khung co giãn theo breakpoint: gọn trên mobile, đầy cột trên laptop. */}
          <div className="w-full max-w-[min(100%,17rem)] sm:max-w-[20rem] md:max-w-[22rem] lg:max-w-[24rem] rounded-lg border border-line bg-panel overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 border-b border-line">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-line" aria-hidden="true"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-line" aria-hidden="true"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent/60" aria-hidden="true"></span>
              <span className="ml-2 font-mono text-xs text-muted">profile.jpg</span>
            </div>
            <img
              src={profileSrc}
              alt="Bảo Phong"
              width={800}
              height={800}
              loading="eager"
              decoding="async"
              onError={onProfileError}
              className="block w-full aspect-[4/5] sm:aspect-square object-cover object-[center_32%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { t } = useI18n();

  return (
    <section id="about" className="py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[5fr_7fr] gap-10 md:gap-12 lg:gap-16">
        <div className="min-w-0">
          <SectionHeading kicker={t.about.kicker} title={t.about.title} />
          <div className="space-y-4 text-base leading-relaxed -mt-6 md:-mt-8">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </div>
        <div className="min-w-0 rounded-lg border border-line bg-panel p-6 md:p-8 lg:p-10 flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {t.about.cards.map((item, i) => (
              <div key={i} className="space-y-2">
                <h3 className="font-semibold text-ink text-base">
                  <span className="font-mono text-accent text-sm mr-2" aria-hidden="true">
                    0{i + 1}.
                  </span>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Metrics = () => {
  const { t } = useI18n();
  const metrics = [
    { label: t.metrics.students, value: '300+', icon: <TrendingUp size={18} /> },
    { label: t.metrics.dataPoints, value: '5000+', icon: <Activity size={18} /> },
    { label: t.metrics.automationTools, value: '3+', icon: <Cpu size={18} /> },
    { label: t.metrics.timeOpt, value: '70%', icon: <Clock size={18} /> },
  ];

  return (
    <section id="metrics" className="px-6 border-t border-line bg-panel/50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {metrics.map((metric, i) => (
          <Reveal
            key={i}
            delay={i * 160}
            className="reveal-left reveal-slow py-10 md:py-12 px-6 border-line border-b sm:border-b-0 last:border-b-0 md:border-r md:first:border-l"
          >
            <span className="text-accent block mb-3">{metric.icon}</span>
            <p className="font-mono text-3xl lg:text-4xl font-bold text-ink mb-1">
              {metric.value}
            </p>
            <p className="font-mono text-xs uppercase tracking-wider">
              {metric.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const Strengths = () => {
  const { t } = useI18n();
  const pillarMeta = [
    { icon: <Database size={20} key="db" />, file: 'systems.data' },
    { icon: <BookOpen size={20} key="book" />, file: 'operations.edu' },
    { icon: <Brain size={20} key="brain" />, file: 'innovation.dev' },
  ];
  const total = String(t.strengths.pillars.length).padStart(2, '0');

  return (
    <section id="strengths" className="py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          kicker={t.strengths.kicker}
          title={t.strengths.title}
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-5">
          {t.strengths.pillars.map((pillar, i) => {
            const meta = pillarMeta[i];
            return (
              <Reveal
                key={i}
                delay={i * 90}
                className="group rounded-lg border border-line bg-panel overflow-hidden hover:border-accent/50 transition-colors"
              >
                {/* Thanh tiêu đề dạng tab tên file */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-line font-mono text-xs">
                  <span className="flex items-center gap-2 text-muted">
                    <span
                      className="w-2 h-2 rounded-full bg-accent/70"
                      aria-hidden="true"
                    />
                    {meta.file}
                  </span>
                  <span className="text-muted/50" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')} / {total}
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-10 h-10 rounded-md border border-line flex items-center justify-center text-accent shrink-0 group-hover:border-accent/50 transition-colors">
                      {meta.icon}
                    </span>
                    <h3 className="text-lg font-semibold text-ink leading-tight">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Danh sách năng lực với cột số dòng như editor */}
                  <ul>
                    {pillar.items.map((item, j) => (
                      <li
                        key={j}
                        className="grid grid-cols-[1.75rem_1fr] gap-3 py-1"
                      >
                        <span className="font-mono text-xs text-accent/60 text-right tabular-nums select-none border-r border-line pr-2 leading-6">
                          {String(j + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm text-muted leading-6">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Workflow = () => {
  const { t } = useI18n();
  const nodeIcons = [
    <UploadCloud size={16} key="upload" />,
    <School size={16} key="school" />,
    <Activity size={16} key="activity" />,
    <Settings size={16} key="settings" />,
    <BookOpen size={16} key="book" />,
    <Archive size={16} key="archive" />,
  ];

  return (
    <section id="workflow" className="py-16 md:py-24 px-6 border-t border-line bg-panel/50">
      <div className="max-w-6xl mx-auto">
        <SectionHeading kicker={t.workflow.kicker} title={t.workflow.title} align="center" />
        <div className="max-w-2xl mx-auto rounded-lg border border-line bg-surface overflow-hidden shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
            <span className="w-3 h-3 rounded-full bg-line" aria-hidden="true"></span>
            <span className="w-3 h-3 rounded-full bg-line" aria-hidden="true"></span>
            <span className="w-3 h-3 rounded-full bg-accent/60" aria-hidden="true"></span>
            <span className="ml-2 font-mono text-xs text-muted">systems.sh</span>
          </div>
          <div className="p-6 md:p-8 font-mono text-sm">
            <p className="mb-6">
              <span className="text-accent" aria-hidden="true">
                $&nbsp;
              </span>
              <span className="text-ink">ls</span> ./systems
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 list-none mb-7">
              {t.workflow.nodes.map((label, i) => (
                <li key={i} className="flex items-center gap-2.5 text-ink min-w-0">
                  <span className="text-accent shrink-0">{nodeIcons[i]}</span>
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>
            <p aria-hidden="true">
              <span className="text-accent">$&nbsp;</span>
              <span className="cursor-blink text-accent">▍</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const { t } = useI18n();

  return (
    <section id="projects" className="py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12 md:mb-16 flex-wrap gap-4">
          <div>
            <p className="font-mono text-sm text-accent mb-3">
              <span aria-hidden="true">{'// '}</span>
              {t.projects.kicker}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
              {t.projects.title}
            </h2>
          </div>
          <a
            href={t.projects.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent inline-flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            {t.projects.github}
            <ArrowUpRight size={16} className="shrink-0" />
          </a>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {t.projects.list.map((project, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={i}
                className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center"
              >
                {/* Ảnh: xen kẽ trái/phải theo thứ tự dự án */}
                <div className={`min-w-0 ${reversed ? 'md:order-2' : ''}`}>
                  <div className="relative rounded-lg border border-line bg-panel overflow-hidden">
                    <img
                      src={publicUrl(project.image)}
                      alt={project.title}
                      loading="lazy"
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute left-3 top-3 rounded border border-line bg-surface/90 px-2 py-0.5 font-mono text-[11px] text-muted">
                      {t.projects.screenshotSlot}
                    </div>
                  </div>
                  {'gallery' in project && project.gallery?.length ? (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {project.gallery.map((src, g) => (
                        <img
                          key={g}
                          src={publicUrl(src)}
                          alt=""
                          loading="lazy"
                          className="w-full aspect-video rounded border border-line object-cover"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className={`min-w-0 ${reversed ? 'md:order-1' : ''}`}>
                  <p className="font-mono text-sm text-accent mb-3">
                    <span aria-hidden="true">0{i + 1} · </span>[{project.category}]
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-ink mb-6 leading-tight">
                    {project.title}
                  </h3>

                  <div className="space-y-5 text-sm leading-relaxed">
                    <div>
                      <p className="font-mono text-xs text-ink mb-1.5">
                        <span className="text-accent" aria-hidden="true">
                          {'> '}
                        </span>
                        {t.projects.problem}
                      </p>
                      <p>{project.problem}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-ink mb-1.5">
                        <span className="text-accent" aria-hidden="true">
                          {'> '}
                        </span>
                        {t.projects.solution}
                      </p>
                      <p>{project.solution}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-2.5 py-0.5 rounded border border-line font-mono text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Tác động: điểm nhấn chính của mỗi case study */}
                  <div className="border-l-2 border-accent pl-4 md:pl-5 mt-8">
                    <p className="font-mono text-xs text-muted mb-1">
                      {t.projects.impact}
                    </p>
                    <p className="text-base md:text-lg font-semibold text-ink leading-snug">
                      {project.impact}
                    </p>
                  </div>

                  {'videoUrl' in project && project.videoUrl ? (
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-md border border-line font-mono text-sm text-accent hover:border-accent transition-colors"
                    >
                      {t.projects.watchVideo}
                      <ArrowUpRight size={15} className="shrink-0" />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {/* Tầng 2: website đã hoàn thiện — lưới card, thêm dự án mới không cần ảnh */}
        {t.projects.works.length ? (
          <div className="mt-20 md:mt-28 pt-12 md:pt-16 border-t border-line">
            <div className="mb-8 md:mb-10">
              <p className="font-mono text-sm text-accent mb-3">
                <span aria-hidden="true">{'// '}</span>
                {t.projects.worksKicker}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
                {t.projects.worksTitle}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {t.projects.worksNote}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.projects.works.map((work, i) => (
                <a
                  key={i}
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex min-w-0 flex-col rounded-lg border border-line bg-panel p-5 transition-colors hover:border-accent ${
                    work.highlight ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs text-muted">[{work.type}]</p>
                    {work.wip ? (
                      <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-accent">
                        {t.projects.worksWipBadge}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2.5 text-base font-semibold leading-snug text-ink">
                    {work.name}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed">{work.role}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {work.stack.map((item, j) => (
                      <span
                        key={j}
                        className="rounded border border-line px-2 py-0.5 font-mono text-[11px]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-accent">
                    {work.wip ? t.projects.worksWip : t.projects.worksLive}
                    <ArrowUpRight size={14} className="shrink-0" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const Timeline = () => {
  const { t } = useI18n();

  return (
    <section id="timeline" className="py-16 md:py-24 px-6 border-t border-line bg-panel/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading kicker={t.timeline.kicker} title={t.timeline.title} align="center" />

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-12 xl:gap-16 items-start">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2.5 font-mono text-sm text-accent mb-7">
              <Briefcase size={15} className="shrink-0" aria-hidden="true" />
              {t.timeline.workHeading}
            </h3>
            <div className="border-l border-line pl-6 md:pl-7 flex flex-col gap-5">
              {t.timeline.work.map((job, i) => (
                <Reveal key={i} delay={i * 70} className="relative">
                  <span
                    className="absolute -left-[1.84rem] md:-left-[2.09rem] top-7 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-surface"
                    aria-hidden="true"
                  />
                  <div className="rounded-lg border border-line bg-surface p-5 md:p-6 hover:border-accent/50 transition-colors">
                    <p className="text-base font-semibold text-ink leading-snug">{job.title}</p>
                    <p className="text-sm mt-1">{job.organization}</p>
                    {job.period ? (
                      <p className="mt-2.5">
                        <span className="inline-block rounded border border-line px-2 py-0.5 font-mono text-xs text-accent">
                          {job.period}
                        </span>
                      </p>
                    ) : null}
                    <ul className="mt-3.5 space-y-2 text-sm leading-relaxed">
                      {job.bullets.map((line, j) => (
                        <li key={j} className="flex gap-2.5">
                          <span className="font-mono text-accent shrink-0" aria-hidden="true">
                            -
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="flex items-center gap-2.5 font-mono text-sm text-accent mb-7">
              <GraduationCap size={16} className="shrink-0" aria-hidden="true" />
              {t.timeline.educationHeading}
            </h3>
            <div className="border-l border-line pl-6 md:pl-7 flex flex-col gap-5">
              {t.timeline.education.map((school, i) => (
                <Reveal key={i} delay={i * 70} className="relative">
                  <span
                    className="absolute -left-[1.84rem] md:-left-[2.09rem] top-7 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-surface"
                    aria-hidden="true"
                  />
                  <div className="rounded-lg border border-line bg-surface p-5 md:p-6 hover:border-accent/50 transition-colors">
                    <p className="text-base font-semibold text-ink leading-snug">{school.school}</p>
                    <div className="mt-3.5 space-y-3.5">
                      {school.blocks.map((block, j) => (
                        <div key={j} className="text-sm leading-relaxed">
                          <span className="inline-block rounded border border-line px-2 py-0.5 font-mono text-xs text-accent">
                            {block.period}
                          </span>
                          <span className="block mt-1.5 text-ink">{block.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Achievements = () => {
  const { t } = useI18n();

  return (
    <section id="achievements" className="py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-3xl mx-auto">
        <SectionHeading title={t.achievements.title} align="center" />
        <div className="rounded-lg border border-line bg-panel p-6 md:p-10">
          <p className="font-mono text-xs text-muted mb-8">
            <span className="text-accent" aria-hidden="true">
              $&nbsp;
            </span>
            git log --achievements
          </p>
          <div className="flex flex-col">
            {t.achievements.groups.map((group, i) => {
              const isLast = i === t.achievements.groups.length - 1;
              return (
                <Reveal
                  key={i}
                  delay={i * 80}
                  className="grid grid-cols-[4rem_1fr] md:grid-cols-[6.5rem_1fr] gap-4 md:gap-8"
                >
                  <div className="pt-px text-right">
                    <span className="font-mono text-sm font-bold text-accent">
                      {group.year}
                    </span>
                  </div>
                  <div
                    className={`relative border-l border-line pl-5 md:pl-7 ${isLast ? 'pb-1' : 'pb-8'}`}
                  >
                    <span
                      className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-panel"
                      aria-hidden="true"
                    />
                    <ul className="space-y-2.5 text-base leading-relaxed text-ink">
                      {group.items.map((item, j) => (
                        <li key={j} className="flex gap-2.5">
                          <span className="font-mono text-accent shrink-0" aria-hidden="true">
                            -
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Album = () => {
  const { t } = useI18n();
  const photos = t.album.photos;
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: number) =>
      setActive((a) =>
        a === null ? a : (a + dir + photos.length) % photos.length,
      ),
    [photos.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, go]);

  return (
    <section id="album" className="py-16 md:py-24 border-t border-line overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="font-mono text-sm text-accent mb-4 flex flex-wrap items-center justify-center gap-x-2">
          <span aria-hidden="true">$</span>
          <span>
            open <span className="text-ink">~/album</span> --slideshow
          </span>
          <span className="cursor-blink text-accent" aria-hidden="true">
            _
          </span>
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
          {t.album.title}
        </h2>
        <div className="mt-6 mb-10 flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-muted">
          {t.album.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1"
            >
              <Zap size={12} className="text-accent" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {photos.length ? (
        // Băng ảnh tự chạy ngang (marquee) — nhân đôi để lặp liền mạch
        <div className="marquee">
          <div className="marquee-track">
            {photos.concat(photos).map((photo, i) => {
              const real = i % photos.length;
              const isClone = i >= photos.length;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(real)}
                  aria-hidden={isClone ? 'true' : undefined}
                  tabIndex={isClone ? -1 : undefined}
                  aria-label={photo.caption || t.album.photoAlt}
                  className="marquee-item group relative block h-44 md:h-56 mr-3 md:mr-4 shrink-0 rounded-lg border border-line overflow-hidden bg-panel hover:border-accent/50 transition-colors"
                >
                  <img
                    src={publicUrl(photo.src)}
                    alt={isClone ? '' : photo.caption || t.album.photoAlt}
                    loading="lazy"
                    className="h-full w-auto max-w-none object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {photo.caption ? (
                    <span className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-surface/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="block font-mono text-xs text-ink text-left leading-snug">
                        {photo.caption}
                      </span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-lg border border-dashed border-line bg-panel/40 py-16 flex flex-col items-center gap-3 text-muted">
            <ImageIcon size={28} className="text-accent" aria-hidden="true" />
            <p className="font-mono text-sm">{t.album.empty}</p>
          </div>
        </div>
      )}

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[active].caption || t.album.photoAlt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-surface/95 backdrop-blur-sm p-4 md:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t.album.closeLabel}
            className="absolute top-4 right-4 p-2 rounded-md border border-line text-ink hover:border-accent hover:text-accent transition-colors"
          >
            <X size={20} />
          </button>

          {photos.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label={t.album.prevLabel}
              className="absolute left-3 md:left-6 p-2 rounded-md border border-line text-ink hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
          ) : null}

          <figure
            className="max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={publicUrl(photos[active].src)}
              alt={photos[active].caption || t.album.photoAlt}
              className="max-h-[78vh] w-auto max-w-full rounded-lg border border-line object-contain"
            />
            <figcaption className="mt-4 font-mono text-sm text-muted text-center">
              <span className="text-accent" aria-hidden="true">
                {String(active + 1).padStart(2, '0')}
              </span>
              {' / '}
              {String(photos.length).padStart(2, '0')}
              {photos[active].caption ? ` · ${photos[active].caption}` : ''}
            </figcaption>
          </figure>

          {photos.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label={t.album.nextLabel}
              className="absolute right-3 md:right-6 p-2 rounded-md border border-line text-ink hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

const Contact = () => {
  const { t } = useI18n();
  const contactItems = [
    {
      label: t.contact.emailLabel,
      value: t.contact.email,
      href: `mailto:${t.contact.email}`,
      icon: <Mail size={18} />,
    },
    {
      label: t.contact.phoneLabel,
      value: t.contact.phone,
      href: `tel:${t.contact.phone.replace(/\s/g, '')}`,
      icon: <Phone size={18} />,
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-start">
        <div className="min-w-0">
          <p className="font-mono text-sm text-accent mb-3">
            <span aria-hidden="true">{'// '}</span>
            {t.contact.kicker}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink mb-6 leading-tight break-words">
            {t.contact.title}
          </h2>
          <p className="text-base leading-relaxed mb-8 break-words">
            {t.contact.description}
          </p>
          <a
            href={`mailto:${t.contact.email}`}
            className="inline-flex max-w-full items-center gap-2 px-6 py-3 rounded-md bg-accent text-accent-ink font-semibold text-sm hover:brightness-110 transition-[filter]"
          >
            <Mail size={16} className="shrink-0" />
            {t.contact.cta}
          </a>
        </div>

        <div className="grid gap-4 min-w-0">
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group flex min-w-0 items-center gap-4 rounded-lg border border-line bg-panel p-5 hover:border-accent/50 transition-colors"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line text-accent">
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-xs text-muted">{item.label}</span>
                <span className="block break-words font-mono text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                  {item.value}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const line = `© ${year} Bảo Phong`;
  const [typed, setTyped] = useState('');
  const lineRef = useRef<HTMLParagraphElement>(null);

  /* Gõ từng ký tự khi footer lọt vào khung nhìn; hiện thẳng nếu người dùng tắt chuyển động. */
  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(line);
      return;
    }

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let i = 0;
        timer = window.setInterval(() => {
          i += 1;
          setTyped(line.slice(0, i));
          if (i >= line.length) window.clearInterval(timer);
        }, 55);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [line]);

  return (
    <footer className="border-t border-line py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4 font-mono text-xs md:flex-row md:justify-between">
        <p ref={lineRef} className="text-center md:text-left">
          {/* Đọc màn hình lấy chuỗi đầy đủ, phần gõ dần chỉ để nhìn */}
          <span className="sr-only">{line}</span>
          <span aria-hidden="true">
            <span className="text-accent">$&nbsp;</span>
            {typed}
            <span className="cursor-blink text-accent">▍</span>
          </span>
        </p>
        <div className="flex items-center gap-5">
          {t.footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

function AppContent() {
  return (
    <div className="min-h-screen">
      <Preloader />
      <CustomCursor />
      <SkipLink />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Metrics />
        <Strengths />
        <Workflow />
        <Projects />
        <Timeline />
        <Album />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
