import {useEffect, useRef} from 'react';

export type LightboxItem = {src: string; alt: string; caption?: string};

/**
 * Xem anh phong to, dung <dialog> that + showModal() nen trinh duyet tu lo
 * bay focus, lop phu va phim Esc. Focus duoc tra lai o cap goi (onClose).
 */
export default function Lightbox({
  items,
  index,
  onClose,
  onStep,
  labels,
}: {
  items: LightboxItem[];
  /** null = dong */
  index: number | null;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
  labels: {prev: string; next: string; close: string};
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onStep(1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onStep(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onStep]);

  if (index === null) return null;
  const item = items[index];
  if (!item) return null;

  const btn =
    'inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-raised px-[18px] text-sm text-ink max-sm:flex-1 max-sm:px-2';

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      /* Bam ra nen toi thi dong: su kien dung tren chinh the dialog,
         vi phan noi dung nam trong the con. */
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="w-full max-w-[min(1100px,calc(100vw-32px))] border-0 bg-transparent p-0 backdrop:bg-black/80"
    >
      <div className="rounded-card bg-raised p-3 text-ink">
        <img
          src={item.src}
          alt={item.alt}
          className="w-full rounded-media bg-surface object-contain"
          style={{maxHeight: 'calc(100vh - 180px)'}}
        />
        <div className="flex flex-wrap items-center justify-between gap-4 px-1 pb-1 pt-3">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
              {index + 1} / {items.length}
            </p>
            {item.caption ? (
              <p className="mt-0.5 text-[15px]">{item.caption}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 max-sm:w-full">
            <button type="button" onClick={() => onStep(-1)} className={btn}>
              {labels.prev}
            </button>
            <button type="button" onClick={() => onStep(1)} className={btn}>
              {labels.next}
            </button>
            <button type="button" onClick={onClose} className={btn}>
              {labels.close}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
