import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import PlacesSection from "@/components/PlacesSection";
import StatsSection from "@/components/StatsSection";
import StoriesStatsSection from "@/components/StoriesStatsSection";
import TeamSection from "@/components/TeamSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <VideoSection />
      <PlacesSection />
      <StatsSection />
      <StoriesStatsSection />
      <TeamSection />
    </div>
  );
};

export default Index;
