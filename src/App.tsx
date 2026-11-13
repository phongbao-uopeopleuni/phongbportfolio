/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {Menu, Moon, Sun, X} from 'lucide-react';
import {Link, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {I18nProvider, useI18n} from './i18n';
import {SHOWCASE_ENABLED} from './features/showcase/enabled';
import Lightbox from './components/Lightbox';
import heroProfileBundled from './assets/hero/profile.webp?url';

/** Duong dan trong public/ phai kem Vite base, neu khong se vo tren GitHub Pages. */
export function publicUrl(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${clean}`;
}

const cvUrl = publicUrl(`/${encodeURIComponent('1. PhongBCV_Updated.pdf')}`);
const heroProfileFallback = publicUrl(
  `/images/hero/${encodeURIComponent('pic 1.jpg')}`,
);

const canvaDesigns = Array.from({length: 13}, (_, index) => ({
  number: index + 1,
  src: `/images/projects/canvathietke/${index + 1}.webp`,
}));

/* ------------------------------------------------------------------ */
/* Nen tang dung chung                                                  */
/* ------------------------------------------------------------------ */

/** 1120px noi dung + 16px le hai ben. */
const WRAP = 'mx-auto w-full max-w-[1152px] px-4';

const MonoLabel = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={`font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted ${className}`}
  >
    {children}
  </p>
);

const Tags = ({items}: {items: string[]}) => (
  <ul className="flex list-none flex-wrap gap-1.5">
    {items.map((tag) => (
      <li
        key={tag}
        className="rounded-full bg-surface px-2.5 py-[3px] font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-muted"
      >
        {tag}
      </li>
    ))}
  </ul>
);

/** Theme sang/toi. Gia tri ban dau do script trong index.html dat truoc khi ve. */
function useTheme() {
  const [dark, setDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark',
  );

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      const root = document.documentElement;
      if (next) root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        /* localStorage bi chan — van doi duoc theme trong phien nay */
      }
      return next;
    });
  }, []);

  return {dark, toggle};
}

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */

const SECTION_IDS = ['projects', 'works', 'timeline', 'contact'] as const;

const Header = () => {
  const {locale, setLocale, t} = useI18n();
  const {dark, toggle} = useTheme();
  const {pathname} = useLocation();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  const onHome = pathname === '/';

  /* Lam sang muc nav theo phan dang xem. Chi chay o trang chu. */
  useEffect(() => {
    if (!onHome) {
      setActive('');
      return;
    }
    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => Boolean(n),
    );
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      {rootMargin: '-45% 0px -50% 0px'},
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const items = [
    {id: 'projects', label: t.nav.projects},
    {id: 'works', label: t.nav.works},
    {id: 'timeline', label: t.nav.timeline},
    {id: 'contact', label: t.nav.contact},
  ];

  /* Tu /album, lien ket phai quay ve trang chu kem hash. */
  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  const langBtn = (on: boolean) =>
    `px-1 font-mono text-xs ${on ? 'font-medium text-ink' : 'text-muted hover:text-ink'}`;

  const sheetLink =
    'block rounded-xl px-4 py-3 font-medium text-ink no-underline hover:bg-surface';

  return (
    <header className="sticky top-4 z-50">
      <div className={WRAP}>
        <div className="header-bar relative grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full border border-line pl-6 pr-3 max-md:grid-cols-[1fr_auto] max-md:pl-5 max-md:pr-2">
          <Link
            to="/"
            className="flex min-h-11 flex-col justify-center justify-self-start leading-tight no-underline"
          >
            <span className="text-base font-semibold tracking-[-0.01em] text-ink">
              {t.nav.brand}
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted max-[419px]:hidden">
              {t.nav.brandLabel}
            </span>
          </Link>

          <nav className="flex gap-1 rounded-full bg-surface p-1 max-md:hidden">
            {items.map((item) =>
              onHome ? (
                <a
                  key={item.id}
                  href={hrefFor(item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium no-underline transition-colors max-lg:px-3 ${
                    active === item.id
                      ? 'bg-raised text-ink shadow-card'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={hrefFor(item.id)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted no-underline transition-colors hover:text-ink max-lg:px-3"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <p className="px-2 font-mono text-xs text-muted">
              <button
                type="button"
                onClick={() => setLocale('vi')}
                className={langBtn(locale === 'vi')}
                aria-pressed={locale === 'vi'}
              >
                VI
              </button>
              <span aria-hidden="true"> / </span>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={langBtn(locale === 'en')}
                aria-pressed={locale === 'en'}
              >
                EN
              </button>
            </p>

            <button
              type="button"
              onClick={toggle}
              aria-label={dark ? t.nav.themeToLight : t.nav.themeToDark}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-raised text-ink"
            >
              {dark ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-sheet"
              aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
              className="hidden h-11 w-11 place-items-center rounded-full border border-line bg-raised text-ink max-md:grid"
            >
              {open ? (
                <X size={18} aria-hidden="true" />
              ) : (
                <Menu size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          {open ? (
            <div
              id="mobile-sheet"
              className="absolute inset-x-0 top-[72px] rounded-card border border-line bg-raised p-2 shadow-card"
            >
              {items.map((item) =>
                onHome ? (
                  <a
                    key={item.id}
                    href={hrefFor(item.id)}
                    onClick={() => setOpen(false)}
                    className={sheetLink}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={hrefFor(item.id)}
                    onClick={() => setOpen(false)}
                    className={sheetLink}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Khung section dung chung cho 01-04                                   */
/* ------------------------------------------------------------------ */

const CARD =
  'rounded-section border border-line bg-panel p-12 max-lg:p-10 max-md:rounded-card max-md:p-5';
const ITEM = 'rounded-card border border-line bg-raised shadow-card';

const PillLink = ({
  children,
  href,
  to,
}: {
  children: ReactNode;
  href?: string;
  to?: string;
}) => {
  const cls =
    'inline-flex min-h-11 flex-none items-center whitespace-nowrap rounded-full border border-line bg-raised px-[18px] font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink no-underline hover:border-muted';
  return to ? (
    <Link to={to} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  );
};

const Section = ({
  id,
  index,
  label,
  title,
  desc,
  pill,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  desc: string;
  pill?: ReactNode;
  children: ReactNode;
}) => (
  <section
    id={id}
    aria-labelledby={`h-${id}`}
    className={`${CARD} mt-8 max-md:mt-6`}
  >
    <div className="mb-8 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
      <div className="min-w-0">
        <p className="font-mono text-sm text-muted">{index}</p>
        <MonoLabel className="mt-2">{label}</MonoLabel>
        <h2
          id={`h-${id}`}
          className="my-1.5 text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.15] tracking-[-0.015em]"
        >
          {title}
        </h2>
        <p className="max-w-[60ch] text-muted">{desc}</p>
      </div>
      {pill}
    </div>
    {children}
  </section>
);

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

const TEXT_LINK =
  'border-b border-line pb-px text-ink no-underline hover:border-ink';

const Hero = () => {
  const {t} = useI18n();
  const [src, setSrc] = useState(heroProfileBundled);

  const stats = [
    {value: t.hero.statStudents, label: t.metrics.students},
    {value: t.hero.statData, label: t.metrics.dataPoints},
    {value: t.hero.statTime, label: t.metrics.timeOpt},
  ];

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="mt-8 grid grid-cols-[7fr_5fr] items-center gap-12 rounded-section border border-line bg-panel p-16 max-lg:gap-8 max-lg:p-10 max-md:grid-cols-1 max-md:rounded-card max-md:px-5 max-md:py-6"
    >
      <div className="min-w-0">
        <MonoLabel>{t.hero.eyebrow}</MonoLabel>
        <h1
          id="hero-title"
          className="mb-5 mt-4 text-[clamp(40px,6vw,64px)] font-bold leading-[1.05] tracking-[-0.02em]"
        >
          {t.hero.h1}
        </h1>
        <p className="max-w-[34em] text-xl leading-[1.5] text-muted max-md:text-lg">
          {t.hero.lead}
        </p>

        <div className="mb-5 mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-accent-ink no-underline hover:brightness-110"
          >
            {t.hero.ctaProjects}
          </a>
          <a
            href={cvUrl}
            download
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-raised px-6 text-[15px] font-semibold text-ink no-underline hover:border-muted"
          >
            {t.hero.ctaCv}
          </a>
        </div>

        <p className="text-sm text-muted">
          <a
            href={t.projects.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={TEXT_LINK}
          >
            GitHub ↗
          </a>
          {' · '}
          <a href={`mailto:${t.contact.email}`} className={TEXT_LINK}>
            Email
          </a>
          {' · '}
          <a
            href={t.footer.links[1].href}
            target="_blank"
            rel="noopener noreferrer"
            className={TEXT_LINK}
          >
            Facebook ↗
          </a>
        </p>

        <ul className="mt-8 grid list-none grid-cols-3 gap-4 border-t border-line pt-6">
          {stats.map((s) => (
            <li key={s.label}>
              <span className="block text-[28px] font-bold leading-tight tracking-[-0.02em] text-ink max-md:text-[22px]">
                {s.value}
              </span>
              <span className="mt-1 block font-mono text-[11px] uppercase leading-[1.4] tracking-[0.08em] text-muted max-md:text-[10.5px] max-md:tracking-[0.04em]">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <figure className="m-0 w-full max-w-[380px] justify-self-end max-md:max-w-[260px] max-md:justify-self-start">
        <img
          src={src}
          alt={t.hero.portraitAlt}
          onError={() =>
            setSrc((c) => (c === heroProfileFallback ? c : heroProfileFallback))
          }
          className="aspect-[4/5] w-full rounded-card bg-surface object-cover"
        />
      </figure>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 01 Du an                                                             */
/* ------------------------------------------------------------------ */

const ProjectsSection = () => {
  const {t} = useI18n();
  const cls = `grid grid-cols-[40%_1fr] gap-8 p-4 text-ink no-underline max-md:grid-cols-1 max-md:gap-4 max-md:p-3 ${ITEM}`;

  return (
    <Section
      id="projects"
      index={t.projects.index}
      label={t.projects.label}
      title={t.projects.title}
      desc={t.projects.desc}
      pill={<PillLink href={t.projects.githubUrl}>{t.projects.pill}</PillLink>}
    >
      <div className="grid gap-4">
        {t.projects.cards.map((card) => {
          const body = (
            <>
              <div className="overflow-hidden rounded-media bg-surface">
                <img
                  src={publicUrl(card.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] h-full w-full object-cover object-left-top"
                />
              </div>
              <div className="flex flex-col gap-2.5 py-3 pl-0 pr-4 max-md:px-2 max-md:pb-2 max-md:pt-0">
                <MonoLabel>{card.category}</MonoLabel>
                <h3 className="text-xl font-semibold leading-[1.3] tracking-[-0.01em]">
                  {card.title}
                </h3>
                <p className="text-muted">{card.desc}</p>
                {'result' in card && card.result ? (
                  <p className="text-[15px]">
                    <span className="mr-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      {t.projects.resultLabel}
                    </span>
                    {card.result}
                  </p>
                ) : null}
                <Tags items={card.tags} />
                {'link' in card && card.link ? (
                  <p className="mt-auto pt-1 text-[15px] font-semibold text-ink">
                    {card.link}
                  </p>
                ) : null}
              </div>
            </>
          );

          if ('to' in card && card.to) {
            return (
              <Link key={card.title} to={card.to} className={`${cls} lift`}>
                {body}
              </Link>
            );
          }
          if ('href' in card && card.href) {
            return (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cls} lift`}
              >
                {body}
              </a>
            );
          }
          return (
            <article key={card.title} className={cls}>
              {body}
            </article>
          );
        })}
      </div>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* 02 Website & san pham khac                                           */
/* ------------------------------------------------------------------ */

const WorksSection = () => {
  const {t} = useI18n();
  const [design, setDesign] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  /* Bo qua du an con dung ten mien tam; se hien lai khi co ten mien that. */
  const works = t.projects.works.filter((w) => !w.wip);
  const thumbs = [1, 5, 9];

  const items = canvaDesigns.map((d) => ({
    src: publicUrl(d.src),
    alt: `${t.canvaAlbum.designAlt} ${String(d.number).padStart(2, '0')}`,
  }));

  return (
    <Section
      id="works"
      index={t.projects.worksIndex}
      label={`// ${t.projects.worksKicker}`}
      title={t.projects.worksTitle}
      desc={t.projects.worksNote}
    >
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
        {works.map((w) => (
          <a
            key={w.url}
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`lift flex flex-col gap-2.5 p-6 text-ink no-underline ${ITEM} ${
              w.highlight ? 'col-span-2 max-md:col-span-1' : ''
            }`}
          >
            <MonoLabel>{w.type}</MonoLabel>
            <h3 className="text-xl font-semibold leading-[1.3] tracking-[-0.01em]">
              {w.name}
            </h3>
            <p className="text-muted">{w.role}</p>
            <Tags items={w.stack} />
            <p className="mt-auto pt-1 text-[15px] font-semibold">
              {t.projects.worksLive} ↗
            </p>
          </a>
        ))}

        <button
          type="button"
          ref={opener}
          onClick={() => setDesign(0)}
          className={`lift flex flex-col gap-2.5 p-6 text-left text-ink ${ITEM}`}
        >
          <MonoLabel>{t.projects.canvaCategory}</MonoLabel>
          <h3 className="text-xl font-semibold leading-[1.3] tracking-[-0.01em]">
            {t.projects.canvaTitle}
          </h3>
          <p className="text-muted">{t.projects.canvaDesc}</p>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {thumbs.map((n) => (
              <img
                key={n}
                src={publicUrl(`/images/projects/canvathietke/${n}.webp`)}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
            ))}
          </div>
          <p className="mt-auto pt-1 text-[15px] font-semibold">
            {t.projects.canvaLink}
          </p>
        </button>
      </div>

      <Lightbox
        items={items}
        index={design}
        onClose={() => {
          setDesign(null);
          opener.current?.focus();
        }}
        onStep={(d) =>
          setDesign((c) =>
            c === null ? c : (c + d + items.length) % items.length,
          )
        }
        labels={{
          prev: t.canvaAlbum.prevLabel,
          next: t.canvaAlbum.nextLabel,
          close: t.canvaAlbum.closeLabel,
        }}
      />
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* 03 Kinh nghiem & hoc van                                             */
/* ------------------------------------------------------------------ */

const ExperienceSection = () => {
  const {t} = useI18n();

  return (
    <Section
      id="timeline"
      index={t.timeline.index}
      label={t.timeline.label}
      title={t.timeline.title}
      desc={t.timeline.desc}
      pill={<PillLink to="/album">{t.timeline.pill}</PillLink>}
    >
      <ul className="list-none">
        {t.timeline.work.map((job) => (
          <li
            key={job.period}
            className="grid grid-cols-[168px_1fr] gap-6 border-t border-line py-5 first:border-t-0 max-md:grid-cols-1 max-md:gap-1"
          >
            <p className="pt-[3px] font-mono text-[13px] text-muted">
              {job.period}
            </p>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-[1.35]">
                {job.title}
              </h3>
              <p className="text-[15px] text-muted">{job.organization}</p>
              {job.bullets.length > 0 ? (
                <ul className="mt-2.5 list-disc pl-[18px] text-[15px] marker:text-muted">
                  {job.bullets.map((b, i) => (
                    <li key={i} className={i ? 'mt-1.5' : ''}>
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid grid-cols-2 gap-10 border-t border-line pt-8 max-md:grid-cols-1">
        <div>
          <h3 className="mb-1 text-lg font-semibold">
            {t.timeline.educationHeading}
          </h3>
          <ul className="list-none">
            {t.timeline.education.map((e) => (
              <li
                key={e.period}
                className="grid grid-cols-[120px_1fr] gap-4 border-t border-line py-3.5 first:border-t-0 max-md:grid-cols-1 max-md:gap-1"
              >
                <p className="pt-[3px] font-mono text-[13px] text-muted">
                  {e.period}
                </p>
                <div className="min-w-0">
                  <h4 className="text-base font-semibold leading-[1.35]">
                    {e.title}
                  </h4>
                  <p className="text-[15px] text-muted">{e.organization}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-1 text-lg font-semibold">
            {t.timeline.awardsHeading}
          </h3>
          <ul className="list-none">
            {t.timeline.awards.map((a) => (
              <li
                key={a.label}
                className="grid grid-cols-[120px_1fr] gap-4 border-t border-line py-3.5 text-[15px] first:border-t-0 max-md:grid-cols-[96px_1fr]"
              >
                <span className="font-mono text-[13px] text-muted">
                  {a.label}
                </span>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* 04 Album — dai anh chay                                              */
/* ------------------------------------------------------------------ */

const AlbumStrip = () => {
  const {t} = useI18n();

  /* Dai trang tri nen dung ban thu nho rieng (~16 kB/anh thay vi ~240 kB).
     16 anh la du dai de vong lap khong thay lap lai. */
  const strip = t.album.photos.slice(0, 16);
  const thumb = (src: string) =>
    publicUrl(src.replace('/images/album/', '/images/album/thumbs/'));

  return (
    <Section
      id="album"
      index={t.album.index}
      label={t.album.pageLabel}
      title={t.album.pageTitle}
      desc={t.album.note}
      pill={<PillLink to="/album">{t.album.viewAll}</PillLink>}
    >
      <div className="marquee -mx-12 max-lg:-mx-10 max-md:-mx-5">
        {/* Anh chi de trang tri: noi dung that nam o /album, va day la ban
            nhan doi nen an khoi trinh doc man hinh de khong doc lap hai lan. */}
        <div className="marquee-track" aria-hidden="true">
          {[...strip, ...strip].map((photo, i) => (
            <img
              key={`${photo.src}-${i}`}
              src={thumb(photo.src)}
              alt=""
              loading="lazy"
              decoding="async"
              className="mr-3 h-40 w-auto rounded-media bg-surface object-cover max-md:mr-2 max-md:h-28"
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* 05 Lien he                                                           */
/* ------------------------------------------------------------------ */

const ContactSection = () => {
  const {t} = useI18n();

  return (
    <Section
      id="contact"
      index={t.contact.index}
      label={t.contact.label}
      title={t.contact.title}
      desc={t.contact.description}
    >
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {t.contact.cards.map((c) => (
          <div key={c.title} className={`flex flex-col gap-2.5 p-7 ${ITEM}`}>
            <MonoLabel>{c.label}</MonoLabel>
            <h3 className="text-[22px] font-semibold leading-[1.3] tracking-[-0.01em]">
              {c.title}
            </h3>
            <p className="text-muted">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <a
          href={`mailto:${t.contact.email}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-accent-ink no-underline hover:brightness-110"
        >
          {t.contact.emailBtn}
        </a>
        <a
          href={`tel:${t.contact.phone.replace(/\s/g, '')}`}
          className={TEXT_LINK}
        >
          {t.contact.phone}
        </a>
        <a
          href={t.projects.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={TEXT_LINK}
        >
          {t.contact.github}
        </a>
      </div>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

const Footer = () => {
  const {t} = useI18n();
  const year = new Date().getFullYear();

  return (
    <div className={WRAP}>
      <footer className="mt-12 flex flex-wrap justify-between gap-4 border-t border-line pb-10 pt-6 text-sm text-muted">
        <p>© {year} Bảo Phong</p>
        <p className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/album" className={TEXT_LINK}>
            {t.nav.album}
          </Link>
          {t.footer.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={TEXT_LINK}
            >
              {l.label} ↗
            </a>
          ))}
          <a href={`mailto:${t.contact.email}`} className={TEXT_LINK}>
            Email
          </a>
        </p>
      </footer>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Trang                                                                */
/* ------------------------------------------------------------------ */

const HomePage = () => {
  const {hash} = useLocation();

  /* Den tu /album kem hash: cuon toi dung muc sau khi trang da dung xong. */
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({block: 'start'});
  }, [hash]);

  return (
    <main id="main" className={`${WRAP} pt-8`}>
      <Hero />
      <ProjectsSection />
      <WorksSection />
      <ExperienceSection />
      <AlbumStrip />
      <ContactSection />
    </main>
  );
};

const AlbumPage = lazy(() => import('./pages/AlbumPage'));
const ShowcaseRoutes = lazy(() => import('./features/showcase/ShowcaseRoutes'));

const RouteFallback = () => (
  <div className="grid min-h-[60vh] place-items-center font-mono text-sm text-muted">
    loading…
  </div>
);

const Shell = ({children}: {children: ReactNode}) => {
  const {locale} = useI18n();
  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link">
        {locale === 'vi' ? 'Bỏ qua đến nội dung chính' : 'Skip to main content'}
      </a>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Shell>
              <HomePage />
            </Shell>
          }
        />
        <Route
          path="/album"
          element={
            <Shell>
              <Suspense fallback={<RouteFallback />}>
                <AlbumPage />
              </Suspense>
            </Shell>
          }
        />
        <Route
          path="/showcase/*"
          element={
            SHOWCASE_ENABLED ? (
              <Suspense fallback={<RouteFallback />}>
                <ShowcaseRoutes />
              </Suspense>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </I18nProvider>
  );
}
