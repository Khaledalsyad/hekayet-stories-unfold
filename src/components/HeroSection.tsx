import { useLang } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import whaleFossil from "@/assets/whale-fossil.png";

const Bubble = ({ delay, left, size }: { delay: number; left: string; size: number }) => (
  <div
    className="absolute rounded-full opacity-0 animate-bubble"
    style={{
      left,
      bottom: "0",
      width: size,
      height: size,
      background: "radial-gradient(circle, hsl(200 80% 60% / 0.3), transparent)",
      animationDelay: `${delay}s`,
      animationDuration: `${6 + Math.random() * 4}s`,
    }}
  />
);

const HeroSection = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const whaleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center">
      {/* Ocean side */}
      <div className="absolute inset-y-0 left-0 w-1/2" style={{ background: "var(--gradient-ocean)" }}>
        {/* Wave SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full animate-wave"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ height: "120px" }}
        >
          <path
            d="M0,120 C360,180 720,60 1080,120 C1260,150 1380,100 1440,120 L1440,200 L0,200 Z"
            fill="hsl(200 80% 25% / 0.3)"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full animate-wave animation-delay-200"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ height: "100px" }}
        >
          <path
            d="M0,140 C480,80 960,180 1440,100 L1440,200 L0,200 Z"
            fill="hsl(195 70% 20% / 0.4)"
          />
        </svg>

        {/* Bubbles */}
        <Bubble delay={0} left="10%" size={8} />
        <Bubble delay={1.5} left="25%" size={12} />
        <Bubble delay={3} left="40%" size={6} />
        <Bubble delay={2} left="15%" size={10} />
        <Bubble delay={4} left="35%" size={8} />
      </div>

      {/* Desert side */}
      <div className="absolute inset-y-0 right-0 w-1/2" style={{ background: "var(--gradient-desert)" }}>
        {/* Sand dunes */}
        <svg
          className="absolute bottom-0 right-0 w-full animate-sand-drift"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ height: "150px" }}
        >
          <path
            d="M0,200 C240,100 480,160 720,120 C960,80 1200,140 1440,100 L1440,200 Z"
            fill="hsl(35 60% 40% / 0.5)"
          />
        </svg>
        <svg
          className="absolute bottom-0 right-0 w-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ height: "100px" }}
        >
          <path
            d="M0,180 C360,120 720,160 1080,130 C1260,115 1380,150 1440,140 L1440,200 Z"
            fill="hsl(25 70% 35% / 0.4)"
          />
        </svg>

        {/* Subtle glow */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-glow-pulse" />
      </div>

      {/* Center divider gradient */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-40 bg-gradient-to-r from-ocean-light/50 via-transparent to-desert/50 blur-xl" />

      {/* Whale Fossil - Center */}
      <motion.div
        style={{ y: whaleY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[500px] md:w-[700px] pointer-events-none"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          src={whaleFossil}
          alt="Whale Fossil"
          className="w-full drop-shadow-2xl animate-float"
          width={1024}
          height={512}
        />
      </motion.div>

      {/* Text Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-20 w-full flex flex-col items-center justify-center text-center px-4 pt-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-accent text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-cairo"
        >
          {t("حكاية مكان", "Hekayet Makan")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="heading-cinematic text-4xl md:text-7xl font-cairo mb-6 drop-shadow-lg"
          style={{ textShadow: "0 0 60px hsl(30 90% 67% / 0.3)" }}
        >
          {t("كل مكان ليه حكاية", "Every Place Has a Story")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-foreground/70 text-lg md:text-xl max-w-xl font-cairo"
        >
          {t(
            "رحلة سينمائية عبر الأماكن المنسية في مصر",
            "A cinematic journey through Egypt's forgotten places"
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12"
        >
          <a
            href="#videos"
            className="inline-block px-8 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 hover:scale-105"
          >
            {t("ابدأ الرحلة", "Start the Journey")}
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-30" />
    </section>
  );
};

export default HeroSection;
