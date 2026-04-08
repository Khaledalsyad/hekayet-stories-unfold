import { useLang } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { lang, toggleLang, t } = useLang();

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="flex items-center gap-2">
        <span className="text-accent text-xl font-bold font-cairo">
          {t("حكاية مكان", "Hekayet Makan")}
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#videos" className="hover:text-accent transition-colors">{t("الحلقات", "Episodes")}</a>
        <a href="#places" className="hover:text-accent transition-colors">{t("الأماكن", "Places")}</a>
        <a href="#stats" className="hover:text-accent transition-colors">{t("الإحصائيات", "Statistics")}</a>
        <a href="#team" className="hover:text-accent transition-colors">{t("الفريق", "Team")}</a>
      </div>

      <button
        onClick={toggleLang}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 text-sm"
      >
        <Globe className="w-4 h-4" />
        {lang === "ar" ? "EN" : "عربي"}
      </button>
    </motion.nav>
  );
};

export default Navbar;
