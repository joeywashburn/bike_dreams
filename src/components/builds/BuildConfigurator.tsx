import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { Build, Part, ComponentCategory, COMPONENT_CATEGORY_LABELS } from '../../types/build'

interface BuildConfiguratorProps {
  build: Build
  parts: Part[]
  onSelectPart: (category: ComponentCategory, partId: string | null) => void
  onDuplicateBuild: (buildId: string) => void
}

// Key categories for bikes
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

export default function BuildConfigurator({
  build,
  parts,
  onSelectPart,
  onDuplicateBuild,
}: BuildConfiguratorProps) {
  const [expandedCategories, setExpandedCategories] = useState<ComponentCategory[]>([])

  // Get parts by category
  const partsByCategory = parts.reduce((acc, part) => {
    if (!acc[part.category]) {
      acc[part.category] = []
    }
    acc[part.category].push(part)
    return acc
  }, {} as Record<ComponentCategory, Part[]>)

  // Get available categories (that have parts in cabinet)
  const availableCategories = MAIN_CATEGORIES.filter(
    (cat) => partsByCategory[cat]?.length > 0
  )

  const toggleCategory = (category: ComponentCategory) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category))
    } else {
      setExpandedCategories([...expandedCategories, category])
    }
  }

  const getSelectedPart = (category: ComponentCategory): Part | null => {
    const partId = build.selectedParts[category]
    if (!partId) return null
    return parts.find((p) => p.id === partId) || null
  }

  // Calculate total price
  const totalPrice = availableCategories.reduce((sum, category) => {
    const part = getSelectedPart(category)
    return sum + (part?.price || 0)
  }, 0)

  const handleDuplicate = () => {
    const newName = prompt('Enter name for the new build:', `Copy of ${build.name}`)
    if (newName && newName.trim()) {
      onDuplicateBuild(build.id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Total Price Header */}
      <div className="card bg-primary-50 border-2 border-primary-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Total Price</h3>
            <p className="text-sm text-gray-600">
              {Object.keys(build.selectedParts).length} of {availableCategories.length} parts
              selected
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDuplicate}
              className="btn-secondary text-sm flex items-center"
              title="Duplicate this build"
            >
              <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
              Save As New Build
            </button>
            <p className="text-3xl font-bold text-primary-600">${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Component Categories */}
      {availableCategories.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">
            No parts in your cabinet yet. Add parts to get started!
          </p>
        </div>
      ) : (
        availableCategories.map((category) => {
          const categoryParts = partsByCategory[category] || []
          const selectedPart = getSelectedPart(category)
          const isExpanded = expandedCategories.includes(category)

          return (
            <div key={category} className="card">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="text-left font-medium text-gray-900">
                      {COMPONENT_CATEGORY_LABELS[category]}
                    </h4>
                    {selectedPart ? (
                      <p className="text-sm text-gray-600 text-left">
                        {selectedPart.brand} {selectedPart.model} • $
                        {selectedPart.price.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 text-left">
                        {categoryParts.length} option
                        {categoryParts.length !== 1 ? 's' : ''} available
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedPart && (
                    <span className="text-lg font-bold text-primary-600">
                      ${selectedPart.price.toFixed(2)}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Part Options (Expanded) */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  {/* Option to clear selection */}
                  {selectedPart && (
                    <button
                      onClick={() => onSelectPart(category, null)}
                      className="w-full p-3 text-left border-2 border-red-200 rounded-lg hover:border-red-300 bg-red-50"
                    >
                      <p className="text-sm font-medium text-red-600">Remove Part</p>
                    </button>
                  )}

                  {/* Available parts */}
                  {categoryParts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => onSelectPart(category, part.id)}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                        selectedPart?.id === part.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-3">
                          {part.imageUrl && (
                            <img
                              src={part.imageUrl}
                              alt={`${part.brand} ${part.model}`}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {part.brand} {part.model}
                            </p>
                            {part.name && (
                              <p className="text-sm text-gray-600 italic">{part.name}</p>
                            )}
                            {part.color && (
                              <p className="text-sm text-gray-600">{part.color}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary-600">
                          ${part.price.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
