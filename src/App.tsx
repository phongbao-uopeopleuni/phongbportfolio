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
  Terminal,
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
  Globe,
  Phone,
  Zap,
  Table,
  Code2,
  Coffee,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { I18nProvider, useI18n } from './i18n';
import heroProfileBundled from './assets/hero/profile.jpg?url';

/** Paths under `public/` — must include Vite `base` (e.g. /phongbportfolio/) for GitHub Pages. */
function publicUrl(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${clean}`;
}

const heroProfileFallback = publicUrl('/images/hero/profile.jpg');

// --- Components ---

const Navbar = () => {
  const { locale, setLocale, t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '#strengths', label: t.nav.strengths },
    { href: '#projects', label: t.nav.projects },
    { href: '#metrics', label: t.nav.metrics },
    { href: '#timeline', label: t.nav.timeline },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const langBtn = (active: boolean) =>
    `px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
      active
        ? 'bg-secondary-container text-white shadow-sm'
        : 'bg-transparent text-on-surface-variant hover:text-on-surface'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm h-16'
          : 'bg-transparent h-20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="text-xl font-bold text-primary font-manrope tracking-tight">
          {t.nav.brand}
        </div>

        <div className="hidden md:flex items-center gap-8 font-manrope font-semibold text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full">
            <button
              type="button"
              className={langBtn(locale === 'vi')}
              onClick={() => setLocale('vi')}
              aria-pressed={locale === 'vi'}
            >
              VI
            </button>
            <button
              type="button"
              className={langBtn(locale === 'en')}
              onClick={() => setLocale('en')}
              aria-pressed={locale === 'en'}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="md:hidden text-on-surface"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-outline-variant/10 p-6 flex flex-col gap-4 shadow-xl">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-on-surface-variant font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
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
    {
      icon: <Terminal size={16} />,
      text: t.hero.badgeBs,
      color: 'text-primary',
    },
    { icon: <Zap size={16} />, text: t.hero.badgeToeic, color: 'text-secondary' },
    {
      icon: <School size={16} />,
      text: t.hero.badgePedagogy,
      color: 'text-tertiary',
    },
    {
      icon: <Table size={16} />,
      text: t.hero.badgeExcel,
      color: 'text-emerald-600',
    },
    {
      icon: <Code2 size={16} />,
      text: t.hero.badgePython,
      color: 'text-primary',
    },
    {
      icon: <Coffee size={16} />,
      text: t.hero.badgeJava,
      color: 'text-red-600',
    },
    {
      icon: <Database size={16} />,
      text: t.hero.badgeMysql,
      color: 'text-primary-container',
    },
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-surface to-surface"></div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold text-on-surface leading-[1.1] mb-6">
            Bảo Phong
          </h1>
          <p className="text-2xl font-manrope font-semibold text-primary mb-8 leading-snug">
            {t.hero.roleLine1} <br />
            <span className="text-on-surface-variant font-normal text-xl">
              {t.hero.roleLine2}
            </span>
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {badges.map((badge, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl bg-white shadow-sm flex items-center gap-2 text-sm font-medium border border-outline-variant/10"
              >
                <span className={badge.color}>{badge.icon}</span>
                {badge.text}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20 inline-block text-center"
            >
              {t.hero.ctaProjects}
            </a>
            <button
              type="button"
              className="px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/5 transition-colors"
            >
              {t.hero.ctaCv}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-5 flex justify-center md:justify-end"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          {/* Ảnh profile (bundle JPG + fallback public) */}
          <div className="w-full max-w-[min(100%,26rem)] aspect-square rounded-[2rem] p-[3px] bg-gradient-to-br from-primary via-secondary-container to-tertiary shadow-xl">
            <img
              src={profileSrc}
              alt="Bảo Phong"
              width={800}
              height={800}
              loading="eager"
              decoding="async"
              onError={onProfileError}
              className="block h-full w-full rounded-[calc(2rem-3px)] object-cover object-center bg-surface-container-low"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Metrics = () => {
  const { t } = useI18n();
  const metrics = [
    {
      label: t.metrics.students,
      value: '300+',
      icon: <TrendingUp size={20} />,
      color: 'bg-secondary-container',
    },
    {
      label: t.metrics.dataPoints,
      value: '5000+',
      icon: <Activity size={20} />,
      color: 'bg-primary',
    },
    {
      label: t.metrics.automationTools,
      value: '3+',
      icon: <Cpu size={20} />,
      color: 'bg-tertiary',
    },
    {
      label: t.metrics.timeOpt,
      value: '70%',
      icon: <Clock size={20} />,
      color: 'bg-secondary-container',
    },
  ];

  return (
    <section id="metrics" className="bg-surface-container-low py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-xl relative overflow-hidden group"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div
                className={`absolute left-0 top-0 w-1 h-full ${metric.color}`}
              ></div>
              <p className="text-xs font-medium text-on-surface-variant mb-2">
                {metric.label}
              </p>
              <div className="flex items-end gap-2">
                <h3 className="text-4xl font-bold text-primary">{metric.value}</h3>
                <span className="text-tertiary mb-1">{metric.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { t } = useI18n();
  const cardStyles = [
    'text-primary',
    'text-secondary',
    'text-tertiary',
    'text-on-surface',
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-16">
        <div className="md:col-span-5">
          <h2 className="text-xs font-extrabold text-secondary tracking-[0.2em] uppercase mb-4">
            {t.about.kicker}
          </h2>
          <h3 className="text-4xl font-bold text-on-surface mb-6 leading-tight">
            {t.about.title}
          </h3>
          <div className="space-y-4 text-lg text-on-surface-variant leading-relaxed">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </div>
        <div className="md:col-span-7 bg-surface-container-low rounded-3xl p-10 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-8">
            {t.about.cards.map((item, i) => (
              <div key={i} className="space-y-2">
                <h4 className={`font-bold ${cardStyles[i]}`}>{item.title}</h4>
                <p className="text-sm text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Strengths = () => {
  const { t } = useI18n();
  const pillarsUi = [
    {
      icon: <Database size={28} />,
      color: 'border-primary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: <BookOpen size={28} />,
      color: 'border-secondary-container',
      iconBg: 'bg-secondary-container/10',
      iconColor: 'text-secondary-container',
    },
    {
      icon: <Brain size={28} />,
      color: 'border-tertiary',
      iconBg: 'bg-tertiary/10',
      iconColor: 'text-tertiary',
    },
  ];

  return (
    <section id="strengths" className="py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-extrabold text-secondary tracking-[0.2em] uppercase mb-4">
            {t.strengths.kicker}
          </h2>
          <h3 className="text-4xl font-bold text-on-surface">{t.strengths.title}</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {t.strengths.pillars.map((pillar, i) => {
            const ui = pillarsUi[i];
            return (
              <motion.div
                key={i}
                className={`bg-white p-8 rounded-2xl border-t-4 ${ui.color} shadow-sm hover:shadow-xl transition-all duration-500`}
                whileHover={{ y: -10 }}
              >
                <div
                  className={`w-14 h-14 ${ui.iconBg} rounded-xl flex items-center justify-center mb-6 ${ui.iconColor}`}
                >
                  {ui.icon}
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-4">
                  {pillar.title}
                </h4>
                <ul className="space-y-3 text-sm">
                  {pillar.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${ui.iconColor.replace('text-', 'bg-')}`}
                      ></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Workflow = () => {
  const { t } = useI18n();
  const nodeUi = [
    { icon: <UploadCloud size={32} />, color: 'text-secondary' },
    { icon: <School size={32} />, color: 'text-primary' },
    { icon: <Activity size={32} />, color: 'text-tertiary' },
    { icon: <Settings size={32} />, color: 'text-primary-container' },
    { icon: <BookOpen size={32} />, color: 'text-secondary-container' },
    { icon: <Archive size={32} />, color: 'text-on-surface-variant' },
  ];

  return (
    <section className="py-24 px-6 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-xs font-extrabold text-primary tracking-[0.2em] uppercase mb-4">
            {t.workflow.kicker}
          </h2>
          <h3 className="text-4xl font-bold text-on-surface">{t.workflow.title}</h3>
        </div>
        <div className="relative flex flex-wrap justify-between items-center gap-8">
          {t.workflow.nodes.map((label, i) => {
            const ui = nodeUi[i];
            return (
              <div key={i} className="flex flex-col items-center gap-4 group">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-outline-variant/10 group-hover:scale-110 transition-transform duration-300">
                  <span className={ui.color}>{ui.icon}</span>
                </div>
                <span className="font-bold text-sm">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const { t } = useI18n();

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 flex-wrap gap-4">
          <div>
            <h2 className="text-xs font-extrabold text-secondary tracking-[0.2em] uppercase mb-4">
              {t.projects.kicker}
            </h2>
            <h3 className="text-4xl font-bold text-on-surface">{t.projects.title}</h3>
          </div>
          <button
            type="button"
            className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all group"
          >
            {t.projects.github}{' '}
            <ChevronRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {t.projects.list.map((project, i) => (
            <motion.div
              key={i}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={publicUrl(project.image)}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-[10px] font-bold uppercase tracking-widest">
                    {project.category}
                  </span>
                  <h4 className="text-2xl font-bold mt-2">{project.title}</h4>
                </div>
              </div>
              <div className="p-8">
                <p className="text-sm text-on-surface-variant mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 bg-surface-container-low rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="border-t border-outline-variant/10 pt-6">
                  <p className="text-[10px] font-bold text-tertiary uppercase">
                    {t.projects.impact}
                  </p>
                  <p className="text-xs font-medium">{project.impact}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Timeline = () => {
  const { t } = useI18n();

  return (
    <section id="timeline" className="py-24 px-6 bg-surface-container-low">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-sm md:text-base font-extrabold text-secondary tracking-[0.2em] uppercase mb-4">
            {t.timeline.kicker}
          </h2>
          <h3 className="text-4xl font-bold text-on-surface">{t.timeline.title}</h3>
        </div>

        <div className="border-l-4 border-primary pl-6 md:pl-8 space-y-16 md:space-y-20">
          <div>
            <h4 className="text-sm font-extrabold text-secondary tracking-[0.15em] uppercase mb-8 -ml-1">
              {t.timeline.workHeading}
            </h4>
            <div className="flex flex-col gap-6 md:gap-8">
              {t.timeline.work.map((job, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-outline-variant/15"
                >
                  <span className="absolute -left-[1.65rem] md:-left-[2.15rem] top-6 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
                  <p className="text-base font-bold text-primary leading-snug">{job.title}</p>
                  <p className="text-sm font-semibold text-on-surface mt-1.5">{job.organization}</p>
                  {job.period ? (
                    <p className="text-xs text-on-surface-variant mt-1 mb-3">{job.period}</p>
                  ) : null}
                  <ul
                    className={`list-disc list-outside ml-4 space-y-2 text-sm text-on-surface-variant leading-relaxed ${job.period ? '' : 'mt-2'}`}
                  >
                    {job.bullets.map((line, j) => (
                      <li key={j}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-secondary tracking-[0.15em] uppercase mb-8 -ml-1">
              {t.timeline.educationHeading}
            </h4>
            <div className="flex flex-col gap-6 md:gap-8">
              {t.timeline.education.map((school, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-outline-variant/15"
                >
                  <span className="absolute -left-[1.65rem] md:-left-[2.15rem] top-6 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
                  <p className="text-base font-bold text-primary leading-snug">{school.school}</p>
                  <div className="mt-4 space-y-4">
                    {school.blocks.map((block, j) => (
                      <div key={j} className="text-sm text-on-surface-variant leading-relaxed">
                        <span className="font-semibold text-on-surface">{block.period}</span>
                        {' — '}
                        <span>{block.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
    <section id="achievements" className="py-24 px-6 bg-primary">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 font-manrope tracking-tight text-white drop-shadow-sm">
          {t.achievements.title}
        </h3>
        <div className="rounded-2xl bg-white p-6 md:p-9 shadow-2xl shadow-black/25 ring-1 ring-black/10">
          <div className="flex flex-col gap-8 md:gap-10">
            {t.achievements.groups.map((group, i) => (
              <div key={i}>
                <p className="text-lg md:text-xl font-bold text-secondary mb-3 tracking-tight">
                  {group.year}
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2.5 text-base md:text-lg leading-relaxed text-on-surface marker:text-primary">
                  {group.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Certifications = () => {
  const { t } = useI18n();
  const certUi = [
    { icon: <Globe size={32} />, color: 'hover:bg-primary' },
    { icon: <Brain size={32} />, color: 'hover:bg-secondary-container' },
    { icon: <Database size={32} />, color: 'hover:bg-tertiary' },
    { icon: <Terminal size={32} />, color: 'hover:bg-primary-container' },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-on-surface">{t.certs.title}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {t.certs.items.map((cert, i) => {
            const ui = certUi[i];
            return (
              <motion.div
                key={i}
                className={`p-6 bg-surface-container-low rounded-2xl flex flex-col items-center text-center group ${ui.color} transition-colors duration-500`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-primary group-hover:text-white mb-4 transition-colors">
                  {ui.icon}
                </div>
                <h5 className="font-bold group-hover:text-white transition-colors">
                  {cert.label}
                </h5>
                <p className="text-xs group-hover:text-white/80 transition-colors">
                  {cert.sub}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-surface py-12 mt-20 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
        <div>
          <h5 className="font-bold text-on-surface mb-6">{t.footer.quickLinks}</h5>
          <div className="flex flex-col gap-3">
            {t.footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="text-on-surface-variant hover:text-secondary-container transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-bold text-on-surface mb-6">{t.footer.personalTitle}</h5>
          <div className="space-y-3 text-on-surface-variant">
            <a
              href="tel:+84775753003"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone size={16} className="shrink-0 text-primary" aria-hidden />
              <span>{t.footer.phone}</span>
            </a>
            <a
              href={`mailto:${t.footer.email}`}
              className="flex items-center gap-2 hover:text-primary transition-colors break-all"
            >
              <Mail size={16} className="shrink-0 text-primary" aria-hidden />
              <span>{t.footer.email}</span>
            </a>
            <a
              href={t.footer.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-primary transition-colors break-all underline-offset-2 hover:underline"
            >
              {t.footer.facebookUrl}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function AppContent() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Metrics />
        <About />
        <Strengths />
        <Workflow />
        <Projects />
        <Timeline />
        <Achievements />
        <Certifications />
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
