"use client";

import { motion } from "framer-motion";

export const HeroIntro = () => (
  <section className="bg-white/65 py-20 md:py-28">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-auto max-w-content px-6 text-center"
    >
      <h1 className="text-brand text-4xl md:text-5xl font-semibold tracking-wide mb-6">
        寶寶派對
      </h1>
      <p className="text-brand-ink text-base md:text-lg leading-loose whitespace-pre-line">
        {`桃園楊梅包場寶寶抓週派對、兒童生日派對、寶寶性別揭曉派對推薦，給正在為此煩惱的家長們一個全新選擇！
從場佈、流程、主持、抓週道具、餐點等，甚至是捕捉小寶貝的每一個經典畫面，我們都會幫您準備好📸
Happy 抓週小屋讓你特別輕鬆，爸爸媽媽寶貝只需要打扮美美人到就好！`}
      </p>
    </motion.div>
  </section>
);
