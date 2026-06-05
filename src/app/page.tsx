import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Search, GraduationCap } from 'lucide-react'

export default function Home() {
  return (
    <>
    <div className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          🎓 Your Journey to Higher Education Starts Here
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight px-4">
          Discover Your{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dream College
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed px-4">
          The ultimate platform to search, compare, and predict your admission chances at top engineering colleges across India.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
          <Link href="/colleges" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2 text-base sm:text-lg px-6 sm:px-8 py-4 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300">
              <Search size={20} />
              Explore Colleges
            </Button>
          </Link>
          <Link href="/predictor" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 text-base sm:text-lg px-6 sm:px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 hover:bg-white transition-all duration-300">
              <GraduationCap size={20} />
              College Predictor
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">50+</div>
            <div className="text-xs sm:text-sm text-gray-600">Top Colleges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">100+</div>
            <div className="text-xs sm:text-sm text-gray-600">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Real-time</div>
            <div className="text-xs sm:text-sm text-gray-600">Cutoff Data</div>
          </div>
        </div>
      </div>
    </div>

    {/* Featured Colleges Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Top Engineering Institutes
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore premier institutions across India
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { name: 'IIT & NIT', desc: 'Premier Technical Institutes', count: '23+ Colleges', color: 'from-blue-500 to-blue-600' },
          { name: 'IIIT', desc: 'Information Technology Excellence', count: '10+ Colleges', color: 'from-purple-500 to-purple-600' },
          { name: 'State Universities', desc: 'Regional Engineering Colleges', count: '17+ Colleges', color: 'from-pink-500 to-pink-600' },
        ].map((category, idx) => (
          <Link key={idx} href="/colleges" className="group">
            <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 p-6 transition-all duration-300 hover:shadow-xl">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                {category.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-600 mb-3">{category.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600">{category.count}</span>
                <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link href="/colleges">
          <Button className="text-base px-8 py-3">
            View All Colleges
          </Button>
        </Link>
      </div>
    </div>
    </>
  )
}
