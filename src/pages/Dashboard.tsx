import { useState } from 'react'
import Header from '../components/common/Header'
import PartsCabinet from '../components/parts/PartsCabinet'
import TheGarage from '../components/builds/TheGarage'
import BuildComparison from '../components/compare/BuildComparison'

type Tab = 'cabinet' | 'garage' | 'compare'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('cabinet')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Navigation Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('cabinet')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === 'cabinet'
                    ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Parts Cabinet
              </button>
              <button
                onClick={() => setActiveTab('garage')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === 'garage'
                    ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                The Garage
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === 'compare'
                    ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
