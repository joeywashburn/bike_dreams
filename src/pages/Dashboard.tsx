import { useState } from 'react'
import Header from '../components/common/Header'
import PartsCabinet from '../components/parts/PartsCabinet'
import TheGarage from '../components/builds/TheGarage'
import BuildComparison from '../components/compare/BuildComparison'

type Tab = 'cabinet' | 'garage' | 'compare'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('cabinet')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Navigation Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('cabinet')}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'cabinet'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Parts Cabinet
              </button>
              <button
                onClick={() => setActiveTab('garage')}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'garage'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                The Garage
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'compare'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Compare
              </button>
            </nav>
          </div>

          {/* Content Area */}
          {activeTab === 'cabinet' && <PartsCabinet />}

          {activeTab === 'garage' && <TheGarage />}

          {activeTab === 'compare' && <BuildComparison />}
        </div>
      </main>
    </div>
  )
}
