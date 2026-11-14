"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import { cn } from "@/lib/cn";

import "yet-another-react-lightbox/styles.css";

export const ProductGallery = ({
  images,
  name,
}: {
  images: string[];
  name: string;
}) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(-1);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(active)}
        aria-label={`放大檢視 ${name}`}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-3xl bg-brand-beige shadow-[0_18px_48px_rgba(237,160,157,0.18)]"
      >
        <Image
          src={current}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </button>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <li key={`${i}-${src}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${name} 第 ${i + 1} 張`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-xl ring-2 transition",
                  i === active
                    ? "ring-brand"
                    : "ring-transparent opacity-75 hover:opacity-100",
                )}
              >
                <Image
                  src={src}
                  alt={`${name} 第 ${i + 1} 張`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        open={lightbox >= 0}
        index={lightbox}
        close={() => setLightbox(-1)}
        slides={images.map((src) => ({ src }))}
      />
    </div>
  );
};
