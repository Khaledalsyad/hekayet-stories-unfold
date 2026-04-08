import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";
import place3 from "@/assets/place-3.jpg";
import place4 from "@/assets/place-4.jpg";

const places = [
  {
    titleAr: "وادي الحيتان",
    titleEn: "Wadi Al-Hitan",
    infoAr: "موقع تراث عالمي في الفيوم",
    infoEn: "UNESCO World Heritage Site in Fayoum",
    img: place1,
  },
  {
    titleAr: "واحة سيوة",
    titleEn: "Siwa Oasis",
    infoAr: "واحة أمازيغية في الصحراء الغربية",
    infoEn: "Amazigh oasis in the Western Desert",
    img: place2,
  },
  {
    titleAr: "الصحراء البيضاء",
    titleEn: "White Desert",
    infoAr: "تشكيلات طبيعية فريدة من نوعها",
    infoEn: "Unique natural rock formations",
    img: place3,
  },
  {
    titleAr: "دهب",
    titleEn: "Dahab",
    infoAr: "جوهرة البحر الأحمر",
    infoEn: "Jewel of the Red Sea",
    img: place4,
  },
];

const PlacesSection = () => {
  const { t } = useLang();

  return (
    <section id="places" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-3 font-cairo">
            {t("استكشف", "Explore")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("أماكن تحكي", "Places That Speak")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((place, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="cinematic-card group cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={place.img}
                  alt={t(place.titleAr, place.titleEn)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                  loading="lazy"
                  width={768}
                  height={512}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-bold font-cairo text-foreground">
                    {t(place.titleAr, place.titleEn)}
                  </h3>
                  <p className="text-muted-foreground text-sm font-cairo mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t(place.infoAr, place.infoEn)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlacesSection;
