"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import { SectionHeading } from "@/components/SectionHeading";

import "yet-another-react-lightbox/styles.css";

interface AboutPhotoStripProps {
  watermark: string;
  title: string;
  description?: string;
  images: string[];
  bg?: "white" | "beige";
}

export const AboutPhotoStrip = ({
  watermark,
  title,
  description,
  images,
  bg = "white",
}: AboutPhotoStripProps) => {
  const [index, setIndex] = useState(-1);

  return (
    <section
      className={
        bg === "beige"
          ? "bg-brand-beige/40 py-20 md:py-28"
          : "bg-white py-20 md:py-28"
      }
    >
      <div className="mx-auto max-w-content px-6">
        <SectionHeading
          watermark={watermark}
          title={title}
          description={description}
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
          {images.map((src, i) => (
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
        slides={images.map((src) => ({ src }))}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  );
};
