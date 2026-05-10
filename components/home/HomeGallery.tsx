"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import { GALLERY_PHOTOS } from "@/data/photos";
import { SectionHeading } from "@/components/SectionHeading";

import "yet-another-react-lightbox/styles.css";

export const HomeGallery = () => {
  const [index, setIndex] = useState(-1);
  const previewPhotos = GALLERY_PHOTOS.slice(0, 8);

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="bg-white/65 py-24 md:py-32"
    >
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          watermark="Photo Portfolio"
          title="攝影作品"
          description="點擊任一張照片，看見每場派對最動人的瞬間。"
        />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {previewPhotos.map((src, i) => (
            <motion.li
              key={src}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl"
                aria-label={`第 ${i + 1} 張作品`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/20" />
              </button>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            href="/baby-party#gallery"
            className="inline-flex items-center gap-2 rounded-full border border-brand-soft/60 bg-white px-8 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand hover:text-white"
          >
            觀看完整作品集
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={previewPhotos.map((src) => ({ src }))}
      />
    </section>
  );
};
