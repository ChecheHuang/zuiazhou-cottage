"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import { photoPortfolio } from "@/data/photo";
import { SectionHeading } from "@/components/SectionHeading";

import "yet-another-react-lightbox/styles.css";

export const PhotoPortfolio = () => {
  const [index, setIndex] = useState(-1);

  return (
    <section className="bg-white/65 py-20 md:py-28">
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          watermark="Portfolio"
          title="攝影作品"
          description="長期合作的攝影師團隊，擅長捕捉寶寶最真實的表情與互動。"
        />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04 } },
          }}
          className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5"
        >
          {photoPortfolio.map((src, i) => (
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
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl"
                aria-label={`開啟第 ${i + 1} 張作品`}
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

        <div className="mt-12 flex justify-center">
          <Link
            href="/baby-party#gallery"
            className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white px-7 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
          >
            我要看更多照片
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photoPortfolio.map((src) => ({ src }))}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  );
};
