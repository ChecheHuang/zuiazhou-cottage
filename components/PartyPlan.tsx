"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

import "swiper/css";
import "swiper/css/pagination";

interface PartyPlanProps {
  title: string;
  features: string[];
  images: { src: string; alt: string }[];
  reverse?: boolean;
  autoplayDelay?: number;
}

export const PartyPlan = ({
  title,
  features,
  images,
  reverse,
  autoplayDelay = 3800,
}: PartyPlanProps) => (
  <section className="bg-white/65 py-16 md:py-24">
    <div
      className={cn(
        "mx-auto grid max-w-content items-center gap-10 px-6 md:grid-cols-2 md:gap-14",
        reverse && "md:[&>:first-child]:order-2",
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: reverse ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl shadow-[0_18px_48px_rgba(237,160,157,0.18)]"
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop
          speed={500}
          autoplay={{
            delay: autoplayDelay,
            pauseOnMouseEnter: true,
            disableOnInteraction: true,
          }}
          pagination={{ clickable: true }}
          className="party-swiper aspect-[4/3]"
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.src}>
              <div className="relative size-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reverse ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      >
        <h3 className="mb-6 whitespace-pre-line text-2xl font-semibold leading-tight text-brand md:text-3xl">
          {title}
        </h3>
        <ul className="space-y-3 text-brand-ink">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="mt-1 inline-block size-2 shrink-0 rounded-full bg-brand-soft" />
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);
