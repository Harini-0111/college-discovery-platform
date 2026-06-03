import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Search, GraduationCap } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
        Discover Your <span className="text-blue-600">Dream College</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
        The ultimate platform to search, compare, and predict your admission chances at top engineering colleges across India.
      </p>
      
      <div className="flex justify-center gap-4">
        <Link href="/colleges">
          <Button className="flex items-center gap-2 text-lg px-8 py-4">
            <Search size={20} />
            Explore Colleges
          </Button>
        </Link>
        <Link href="/predictor">
          <Button variant="outline" className="flex items-center gap-2 text-lg px-8 py-4 bg-white">
            <GraduationCap size={20} />
            College Predictor
          </Button>
        </Link>
      </div>
    </div>
  )
}
