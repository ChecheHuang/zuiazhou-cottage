"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import { GALLERY_PHOTOS } from "@/data/photos";

import "yet-another-react-lightbox/styles.css";

export const PhotoGallery = () => {
  const [index, setIndex] = useState(-1);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-white/65 py-20 md:py-28"
    >
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
            Photo Gallery
          </p>
          <h2
            id="gallery-heading"
            className="mt-3 text-3xl font-semibold tracking-wide text-brand md:text-4xl"
          >
            攝影作品
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-loose text-brand-ink/80">
            從佈置到寶寶笑容，每一刻都值得珍藏。
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04 } },
          }}
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5"
        >
          {GALLERY_PHOTOS.map((src, i) => (
            <motion.li
              key={src}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block aspect-square w-full overflow-hidden rounded-xl"
                aria-label={`開啟第 ${i + 1} 張照片`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/20" />
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={GALLERY_PHOTOS.map((src) => ({ src }))}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  );
};
