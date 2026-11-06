"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ServiceImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  fit?: "cover" | "contain";
};

export default function ServiceImage({
  src,
  alt,
  priority = false,
  fit = "cover",
}: ServiceImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeDialog = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [closeDialog, isOpen]);

  return (
    <>
      <figure className="min-w-0">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Enlarge image: ${alt}`}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-navy text-left shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-steel focus-visible:ring-offset-4"
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 48vw, 560px"
            className={`${fit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-brand-navy/85 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
            View image
          </span>
        </button>
        <figcaption className="mt-3 text-xs leading-relaxed text-brand-muted">
          Stock photograph for service illustration — not a Finecon project.
        </figcaption>
      </figure>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/90 p-3 backdrop-blur-sm sm:p-8"
          onClick={closeDialog}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Enlarged image: ${alt}`}
            className="relative w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeDialog}
              className="absolute -top-12 right-0 rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none sm:-top-14"
            >
              Close
              <span className="sr-only"> enlarged image</span>
            </button>
            <div className="relative aspect-[4/3] max-h-[82vh] overflow-hidden rounded-xl bg-brand-navy">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-center text-sm text-white/80">{alt}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
