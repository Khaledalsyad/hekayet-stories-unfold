import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useState } from "react";
import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";
import place3 from "@/assets/place-3.jpg";
import place4 from "@/assets/place-4.jpg";

const videos = [
  {
    id: 1,
    titleAr: "وادي الحيتان",
    titleEn: "Wadi Al-Hitan",
    descAr: "في قلب الصحراء الغربية، حيث كانت الحيتان تسبح منذ ملايين السنين. رحلة عبر الزمن إلى عصر ما قبل التاريخ.",
    descEn: "In the heart of the Western Desert, where whales once swam millions of years ago. A journey through time to prehistoric ages.",
    thumb: place1,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    titleAr: "واحة سيوة",
    titleEn: "Siwa Oasis",
    descAr: "واحة معزولة على حافة بحر الرمال العظيم. مكان يتوقف فيه الزمن وتبدأ الحكايات.",
    descEn: "An isolated oasis on the edge of the Great Sand Sea. A place where time stops and stories begin.",
    thumb: place2,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    titleAr: "الصحراء البيضاء",
    titleEn: "White Desert",
    descAr: "تشكيلات صخرية سريالية تحكي قصة ملايين السنين من النحت الطبيعي.",
    descEn: "Surreal rock formations telling a story of millions of years of natural sculpting.",
    thumb: place3,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    titleAr: "دهب",
    titleEn: "Dahab",
    descAr: "حيث تلتقي الجبال بالبحر الأحمر. قصة مدينة ولدت من رحم البساطة.",
    descEn: "Where mountains meet the Red Sea. A story of a city born from simplicity.",
    thumb: place4,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

const VideoSection = () => {
  const { t } = useLang();
  const [activeVideo, setActiveVideo] = useState<(typeof videos)[0] | null>(null);

  return (
    <section id="videos" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm tracking-[0.2em] uppercase mb-3 font-cairo">
            {t("شاهد الحلقات", "Watch Episodes")}
          </p>
          <h2 className="heading-cinematic font-cairo">
            {t("حكايات من كل مكان", "Stories From Every Place")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onClick={() => setActiveVideo(video)}
              className="cinematic-card cursor-pointer group"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={video.thumb}
                  alt={t(video.titleAr, video.titleEn)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  width={768}
                  height={512}
                />
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center glow-accent">
                    <Play className="w-7 h-7 text-accent-foreground ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold font-cairo text-foreground">
                  {t(video.titleAr, video.titleEn)}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2 font-cairo">
                  {t(video.descAr, video.descEn)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-5xl w-full grid md:grid-cols-5 gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:col-span-3 aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                src={activeVideo.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={t(activeVideo.titleAr, activeVideo.titleEn)}
              />
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <h3 className="heading-cinematic text-2xl font-cairo mb-4">
                {t(activeVideo.titleAr, activeVideo.titleEn)}
              </h3>
              <p className="text-muted-foreground font-cairo leading-relaxed">
                {t(activeVideo.descAr, activeVideo.descEn)}
              </p>
            </div>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoSection;
