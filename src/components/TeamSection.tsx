import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import ahmedRami from "@/assets/ahmed-rami.jpg";
import ahmedWael from "@/assets/ahmed-wael.jpg";
import hassanAlaa from "@/assets/hassan-alaa.jpg";
import ahmedSalah from "@/assets/ahmed-salah.jpg";
import abdullahFares from "@/assets/abdullah-fares.jpg";
import aminSalah from "@/assets/amin-salah.jpg";
import khaledAbdullah from "@/assets/khaled-abdullah.jpg";
import ahmedMahmoud from "@/assets/ahmed-mahmoud.jpg";
import abdulrahmanFarag from "@/assets/abdulrahman-farag.jpg";
import khaledMohamed from "@/assets/khaled-mohamed.jpg";

const team = [
  { nameAr: "أحمد رامي ربيع", nameEn: "Ahmed Rami Rabie", img: ahmedRami },
  { nameAr: "أحمد وائل رجب", nameEn: "Ahmed Wael Ragab", img: ahmedWael },
  { nameAr: "الحسن علاء", nameEn: "Al-Hassan Alaa", img: hassanAlaa },
  { nameAr: "أحمد صلاح الدين", nameEn: "Ahmed Salah El-Din", img: ahmedSalah },
  { nameAr: "عبدالله فارس", nameEn: "Abdullah Fares", img: abdullahFares },
  { nameAr: "أمين صلاح محمد", nameEn: "Amin Salah Mohamed", img: aminSalah },
  { nameAr: "خالد عبدالله", nameEn: "Khaled Abdullah", img: khaledAbdullah },
  { nameAr: "أحمد محمود", nameEn: "Ahmed Mahmoud", img: ahmedMahmoud },
  { nameAr: "عبدالرحمن فرج", nameEn: "Abdulrahman Farag", img: abdulrahmanFarag },
  { nameAr: "خالد محمد", nameEn: "Khaled Mohamed", img: khaledMohamed },
];

const TeamSection = () => {
  const { t } = useLang();

  return (
    <section id="team" className="section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-3 font-cairo">
            {t("أعضاء المشروع", "Project Members")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("صُنّاع الحكاية", "The Storytellers")}
          </h2>
        </motion.div>

        {/* Supervisor */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="cinematic-card flex flex-col items-center p-8 mb-14 max-w-sm mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
          <p className="text-accent text-xs tracking-[0.2em] uppercase mb-4 font-cairo z-10">
            {t("المشرف على المشروع", "Project Supervisor")}
          </p>
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-[3px] border-accent shadow-[0_0_30px_hsl(var(--accent)/0.3)] mb-4 z-10">
            {supervisorImg ? (
              <img src={supervisorImg} alt={t("المشرف", "Supervisor")} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-cairo">
                {t("صورة المشرف", "Supervisor Photo")}
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold font-cairo text-foreground z-10">
            {t("اسم الدكتور", "Supervisor Name")}
          </h3>
        </motion.div>

        {/* Leader - first member highlighted */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-accent/50 hover:border-accent transition-colors duration-300 mb-4">
            <img src={team[0].img} alt={t(team[0].nameAr, team[0].nameEn)} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <h3 className="text-xl font-bold font-cairo text-foreground">
            {t(team[0].nameAr, team[0].nameEn)}
          </h3>
        </motion.div>

        {/* Rest of team */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8">
          {team.slice(1).map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-accent/30 group-hover:border-accent transition-colors duration-300 mb-3">
                <img src={member.img} alt={t(member.nameAr, member.nameEn)} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="text-base font-bold font-cairo text-foreground text-center">
                {t(member.nameAr, member.nameEn)}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-24 pt-12 border-t border-border/30"
      >
        <p className="text-accent font-cairo text-lg font-bold mb-2">
          {t("حكاية مكان", "Hekayet Makan")}
        </p>
        <p className="text-muted-foreground text-sm font-cairo">
          {t("كل مكان ليه حكاية © ٢٠٢٦", "Every Place Has a Story © 2026")}
        </p>
      </motion.div>
    </section>
  );
};

export default TeamSection;
