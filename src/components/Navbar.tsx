import { useLang } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { lang, toggleLang, t } = useLang();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-2xl bg-foreground/10 backdrop-blur-xl border border-foreground/15 px-6 md:px-8 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold text-sm">حم</span>
          </div>
          <span className="text-foreground text-lg font-bold font-cairo">
            {t("حكاية مكان", "Hekayet Makan")}
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-foreground/70">
          <a href="#videos" className="hover:text-foreground transition-colors duration-300">
            {t("الحلقات", "Episodes")}
          </a>
          <a href="#places" className="hover:text-foreground transition-colors duration-300">
            {t("الأماكن", "Places")}
          </a>
          <Link to="/stats" className="hover:text-foreground transition-colors duration-300">
            {t("الإحصائيات", "Statistics")}
          </Link>
          <a href="#team" className="hover:text-foreground transition-colors duration-300">
            {t("الفريق", "Team")}
          </a>
        </div>

        {/* Right side: Language toggle + CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors duration-300 text-sm"
          >
            <Globe className="w-4 h-4" />
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <a
            href="#team"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full border border-foreground/30 text-foreground text-sm hover:bg-foreground/10 transition-all duration-300"
          >
            {t("تواصل معنا", "Contact Us")}
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
