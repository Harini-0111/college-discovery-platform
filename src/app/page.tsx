import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CollegeCard } from '@/components/features/CollegeCard';
import { getFeaturedColleges, getPopularColleges } from '@/services/college.service';
import { HERO_CAMPUS_IMAGE } from '@/lib/college-images';
import { Search, GraduationCap, ArrowRight, TrendingUp, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featuredColleges, popularColleges] = await Promise.all([
    getFeaturedColleges(3),
    getPopularColleges(3),
  ]);

  return (
    <>
      {/* Hero */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden">
        <Image
          src={HERO_CAMPUS_IMAGE}
          alt="University campus"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/70 to-gray-900/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
            Your journey to higher education starts here
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight px-4">
            Discover Your Dream College
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed px-4">
            Search, compare, and predict your admission chances at top engineering colleges across India.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Link href="/colleges" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4">
                <Search size={20} />
                Explore Colleges
              </Button>
            </Link>
            <Link href="/predictor" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <GraduationCap size={20} />
                College Predictor
              </Button>
            </Link>
          </div>

          <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-xs sm:text-sm text-gray-300">Top Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-xs sm:text-sm text-gray-300">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">Live</div>
              <div className="text-xs sm:text-sm text-gray-300">Cutoff Data</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Colleges */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-2">
                <Award size={18} />
                Featured
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Top Rated Colleges
              </h2>
              <p className="text-gray-600 mt-2 max-w-xl">
                Highest-rated engineering institutes based on student reviews and placement records.
              </p>
            </div>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredColleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Colleges */}
      <section className="bg-gray-50 py-16 sm:py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-2">
                <TrendingUp size={18} />
                Popular
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Most Searched Colleges
              </h2>
              <p className="text-gray-600 mt-2 max-w-xl">
                Colleges students are actively exploring and comparing this season.
              </p>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm"
            >
              Compare colleges <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularColleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Not sure which college fits you?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Use our rank-based predictor to find colleges where you have a strong chance of admission.
          </p>
          <Link href="/predictor">
            <Button variant="outline" className="bg-white text-blue-600 border-white hover:bg-blue-50 hover:text-blue-700 px-8 py-3">
              Try College Predictor
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
