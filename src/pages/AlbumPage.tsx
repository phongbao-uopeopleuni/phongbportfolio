import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useI18n} from '../i18n';
import {publicUrl} from '../App';
import Lightbox from '../components/Lightbox';

export default function AlbumPage() {
  const {t, locale} = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  /* Nho o da mo lightbox de tra focus ve dung cho khi dong. */
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const previous = document.title;
    document.title = 'Album — Bảo Phong';
    return () => {
      document.title = previous;
    };
  }, [locale]);

  const items = t.album.photos.map((p, i) => ({
    src: publicUrl(p.src),
    alt: t.album.photoAlt,
    caption: p.caption || undefined,
    key: `${p.src}-${i}`,
  }));

  return (
    <main id="main" className="mx-auto w-full max-w-[1152px] px-4 pt-8">
      <p className="mb-4 mt-2 text-sm">
        <Link
          to="/"
          className="border-b border-line text-muted no-underline hover:border-ink hover:text-ink"
        >
          ← {t.album.backHome}
        </Link>
      </p>

      <section
        aria-labelledby="h-album"
        className="rounded-section border border-line bg-panel p-12 max-lg:p-10 max-md:rounded-card max-md:p-5"
      >
        <div className="mb-8 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <div className="min-w-0">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted">
              {t.album.pageLabel}
            </p>
            <h1
              id="h-album"
              className="my-1.5 text-[clamp(32px,4.5vw,48px)] font-bold leading-[1.1] tracking-[-0.02em]"
            >
              {t.album.pageTitle}
            </h1>
            <p className="max-w-[60ch] text-muted">{t.album.note}</p>
          </div>
          <p className="flex-none font-mono text-xs font-medium uppercase tracking-[0.12em] text-muted">
            {t.album.photosCount}
          </p>
        </div>

        <ul className="grid list-none grid-cols-4 gap-2 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-1.5">
          {items.map((photo, i) => (
            <li key={photo.key}>
              <button
                type="button"
                ref={(el) => {
                  tiles.current[i] = el;
                }}
                onClick={() => setOpen(i)}
                aria-label={t.album.tileLabel
                  .replace('{n}', String(i + 1))
                  .replace('{total}', String(items.length))}
                className="block w-full cursor-zoom-in overflow-hidden rounded-media border-0 bg-surface p-0"
              >
                <img
                  src={photo.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Lightbox
        items={items}
        index={open}
        onClose={() => {
          const i = open;
          setOpen(null);
          if (i !== null) tiles.current[i]?.focus();
        }}
        onStep={(d) =>
          setOpen((c) =>
            c === null ? c : (c + d + items.length) % items.length,
          )
        }
        labels={{
          prev: t.album.prevLabel,
          next: t.album.nextLabel,
          close: t.album.closeLabel,
        }}
      />
    </main>
  );
}
