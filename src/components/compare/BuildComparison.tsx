import { useState } from 'react'
import { useBuilds } from '../../hooks/useBuilds'
import { useParts } from '../../hooks/useParts'
import { Build, ComponentCategory, COMPONENT_CATEGORY_LABELS } from '../../types/build'

const MAIN_CATEGORIES: ComponentCategory[] = [
  'frame',
  'fork',
  'bars',
  'stem',
  'grips',
  'brakes',
  'cranks',
  'pedals',
  'seat',
  'seat_post',
  'wheelset',
  'front_tire',
  'rear_tire',
  'chain',
]

export default function BuildComparison() {
  const { data: builds, isLoading: buildsLoading } = useBuilds()
  const { data: parts, isLoading: partsLoading } = useParts()
  const [selectedBuildIds, setSelectedBuildIds] = useState<string[]>([])

  // Auto-select all builds initially
  if (builds && builds.length > 0 && selectedBuildIds.length === 0) {
    setSelectedBuildIds(builds.map((b) => b.id))
  }

  const toggleBuildSelection = (buildId: string) => {
    if (selectedBuildIds.includes(buildId)) {
      setSelectedBuildIds(selectedBuildIds.filter((id) => id !== buildId))
    } else {
      setSelectedBuildIds([...selectedBuildIds, buildId])
    }
  }

  const selectedBuilds = builds?.filter((b) => selectedBuildIds.includes(b.id)) || []

  const getPartForBuild = (build: Build, category: ComponentCategory) => {
    const partId = build.selectedParts[category]
    if (!partId) return null
    return parts?.find((p) => p.id === partId) || null
  }

  // Get categories that have at least one part selected across all builds
  const relevantCategories = MAIN_CATEGORIES.filter((category) =>
    selectedBuilds.some((build) => build.selectedParts[category])
  )

  if (buildsLoading || partsLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!builds || builds.length === 0) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Builds to Compare</h3>
        <p className="text-gray-600">
          Create some builds in The Garage to compare them here.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Builds</h2>
        <p className="text-gray-600">Select builds to compare side-by-side</p>
      </div>

      {/* Build Selection */}
      <div className="card mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Builds to Compare</h3>
        <div className="flex flex-wrap gap-2">
          {builds.map((build) => (
            <button
              key={build.id}
              onClick={() => toggleBuildSelection(build.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedBuildIds.includes(build.id)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {build.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedBuilds.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Select at least one build to compare</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left font-medium text-gray-900 border-b-2 border-gray-200 sticky left-0 bg-gray-100 z-10">
                  Component
                </th>
                {selectedBuilds.map((build) => (
                  <th
                    key={build.id}
                    className="p-4 text-left font-medium text-gray-900 border-b-2 border-gray-200 min-w-[250px]"
                  >
                    <div>
                      <div className="font-bold">{build.name}</div>
                      <div className="text-sm text-gray-600 font-normal">
                        {Object.keys(build.selectedParts).length} parts
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {relevantCategories.map((category) => {
                // Get prices for this category across builds to highlight differences
                const prices = selectedBuilds
                  .map((build) => getPartForBuild(build, category)?.price || 0)
                  .filter((p) => p > 0)
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0
                const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
                const hasDifference = minPrice !== maxPrice

                return (
                  <tr key={category} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white z-10">
                      {COMPONENT_CATEGORY_LABELS[category]}
                    </td>
                    {selectedBuilds.map((build) => {
                      const part = getPartForBuild(build, category)
                      const isLowest = part && hasDifference && part.price === minPrice
                      const isHighest = part && hasDifference && part.price === maxPrice

                      return (
                        <td
                          key={build.id}
                          className={`p-4 ${
                            isLowest
                              ? 'bg-green-50'
                              : isHighest && prices.length > 1
                              ? 'bg-red-50'
                              : ''
                          }`}
                        >
                          {part ? (
                            <div className="flex items-start space-x-3">
                              {part.imageUrl && (
                                <img
                                  src={part.imageUrl}
                                  alt={`${part.brand} ${part.model}`}
                                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm">
                                  {part.brand} {part.model}
                                </p>
                                {part.name && (
                                  <p className="text-xs text-gray-600 italic">{part.name}</p>
                                )}
                                {part.color && (
                                  <p className="text-xs text-gray-600">{part.color}</p>
                                )}
                                <p
                                  className={`text-sm font-bold mt-1 ${
                                    isLowest
                                      ? 'text-green-600'
                                      : isHighest && prices.length > 1
                                      ? 'text-red-600'
                                      : 'text-primary-600'
                                  }`}
                                >
                                  ${part.price.toFixed(2)}
                                  {isLowest && prices.length > 1 && (
                                    <span className="ml-1 text-xs">lowest</span>
                                  )}
                                  {isHighest && prices.length > 1 && minPrice !== maxPrice && (
                                    <span className="ml-1 text-xs">highest</span>
                                  )}
                                </p>
                                {/* Shop Links */}
                                {part.links && part.links.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {part.links.map((link, linkIndex) => (
                                      <a
                                        key={linkIndex}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-xs text-primary-600 hover:text-primary-700 hover:underline truncate"
                                      >
                                        🔗 {link.store}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 italic">Not selected</p>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}

              {/* Total Row */}
              <tr className="bg-primary-50 font-bold border-t-2 border-primary-200">
                <td className="p-4 text-gray-900 sticky left-0 bg-primary-50 z-10">
                  TOTAL PRICE
                </td>
                {selectedBuilds.map((build) => {
                  const allPrices = selectedBuilds.map((b) => b.totalPrice)
                  const minTotal = Math.min(...allPrices)
                  const maxTotal = Math.max(...allPrices)
                  const isLowest = build.totalPrice === minTotal && minTotal !== maxTotal
                  const isHighest = build.totalPrice === maxTotal && minTotal !== maxTotal

                  return (
                    <td
                      key={build.id}
                      className={`p-4 ${
                        isLowest
                          ? 'bg-green-100'
                          : isHighest
                          ? 'bg-red-100'
                          : 'bg-primary-50'
                      }`}
                    >
                      <p
                        className={`text-2xl font-bold ${
                          isLowest
                            ? 'text-green-600'
                            : isHighest
                            ? 'text-red-600'
                            : 'text-primary-600'
                        }`}
                      >
                        ${build.totalPrice.toFixed(2)}
                      </p>
                      {isLowest && allPrices.length > 1 && (
                        <p className="text-xs text-green-600 mt-1">Best Value</p>
                      )}
                      {isHighest && allPrices.length > 1 && minTotal !== maxTotal && (
                        <p className="text-xs text-red-600 mt-1">Most Expensive</p>
                      )}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      {selectedBuilds.length > 1 && (
        <div className="card mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2"></div>
              <span className="text-gray-600">Lowest price for component</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
              <span className="text-gray-600">Highest price for component</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
