import { useHomeFeed } from '@/hooks/useHomeFeed';
import { HeroSection } from '@/components/home/HeroSection';
import { SectionStack } from '@/components/home/SectionStack';
import { TrendingSidebar } from '@/components/home/TrendingSidebar';
import { LatestFeed } from '@/components/home/LatestFeed';
import { VideoRail } from '@/components/home/VideoRail';
import { PhotoCarousel } from '@/components/home/PhotoCarousel';
import { CalendarSection } from '@/components/home/CalendarSection';
import { YouTubeSection } from '@/components/home/YouTubeSection';

export const HomePage = () => {
  const { data, isLoading, error } = useHomeFeed();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-72 bg-gray-200 rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-40 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-serif mb-2">Unable to Load Content</h2>
          <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasData =
    data &&
    ((data.hero && data.hero.length > 0) ||
      (data.sections && data.sections.length > 0) ||
      (data.categorySections && data.categorySections.length > 0) ||
      (data.latest && data.latest.length > 0) ||
      (data.trending && data.trending.length > 0) ||
      (data.calendar && data.calendar.length > 0) ||
      (data.youtube && data.youtube.length > 0));

  if (!hasData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <h2 className="text-3xl font-serif mb-4">Welcome to Newsroom</h2>
          <p className="text-gray-600 mb-6">No articles available at the moment. Articles will appear here once they are published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 pb-6 sm:pb-8 lg:pb-12">
      <HeroSection stories={data.hero || []} />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 grid lg:grid-cols-[2fr_0.8fr] gap-4 sm:gap-6 lg:gap-8">
        <SectionStack sections={data.sections || data.categorySections || []} />
        <TrendingSidebar stories={data.trending || []} />
      </div>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 space-y-6 sm:space-y-8 lg:space-y-10">
        <SectionStack sections={data.categorySections || []} />
        <LatestFeed stories={data.latest || []} />
        <CalendarSection events={data.calendar || []} />
        <YouTubeSection videos={data.youtube || []} />
        <VideoRail stories={data.videos || []} />
        <PhotoCarousel stories={data.photos || []} />
      </div>
    </div>
  );
};

