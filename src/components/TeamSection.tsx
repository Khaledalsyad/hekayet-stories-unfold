import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";

const team = [
  {
    nameAr: "أحمد حسن",
    nameEn: "Ahmed Hassan",
    quoteAr: "كل حجر في الصحراء له حكاية، ومهمتي إني أخليك تسمعها.",
    quoteEn: "Every stone in the desert has a story, and my mission is to make you hear it.",
    img: team1,
  },
  {
    nameAr: "سارة محمود",
    nameEn: "Sara Mahmoud",
    quoteAr: "الكاميرا مش بتصور مناظر، الكاميرا بتصور مشاعر.",
    quoteEn: "The camera doesn't capture scenery, it captures emotions.",
    img: team2,
  },
  {
    nameAr: "كريم علي",
    nameEn: "Karim Ali",
    quoteAr: "الكتابة هي الجسر بين المكان والإنسان.",
    quoteEn: "Writing is the bridge between a place and a person.",
    img: team3,
  },
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
            {t("وراء الكاميرا", "Behind the Camera")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("صُنّاع الحكاية", "The Storytellers")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="cinematic-card group text-center p-8"
            >
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-accent/30 group-hover:border-accent transition-colors duration-300">
                <img
                  src={member.img}
                  alt={t(member.nameAr, member.nameEn)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={512}
                  height={512}
                />
                <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              <h3 className="text-xl font-bold font-cairo text-foreground mb-3">
                {t(member.nameAr, member.nameEn)}
              </h3>

              <blockquote className="text-muted-foreground text-sm font-cairo leading-relaxed italic">
                "{t(member.quoteAr, member.quoteEn)}"
              </blockquote>
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
