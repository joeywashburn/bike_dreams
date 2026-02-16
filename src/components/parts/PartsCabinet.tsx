import { useState, useMemo } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { usePartsPaginated, useCreatePart, useUpdatePart, useDeletePart } from '../../hooks/useParts'
import PartForm, { PartFormData } from './PartForm'
import PartCard from './PartCard'
import CsvImport, { CsvPartData } from './CsvImport'
import { Part, ComponentCategory, COMPONENT_CATEGORY_LABELS } from '../../types/build'

export default function PartsCabinet() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPart, setEditingPart] = useState<Part | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all')
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set())

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePartsPaginated(selectedCategory)
  const createPart = useCreatePart()
  const updatePart = useUpdatePart()
  const deletePart = useDeletePart()

  // Flatten paginated data
  const parts = useMemo(() => {
    return data?.pages.flatMap((page) => page.parts) || []
  }, [data])

  const handleCreate = async (data: PartFormData) => {
    await createPart.mutateAsync(data)
  }

  const handleCsvImport = async (csvParts: CsvPartData[]) => {
    // Import parts one by one (could be batched for better performance)
    for (const part of csvParts) {
      await createPart.mutateAsync({
        ...part,
        links: (part.links || []).map((link) => ({
          ...link,
          price: part.price,
          lastChecked: new Date(),
          available: true,
        })),
      })
    }
  }

  const handleSelectAll = () => {
    if (selectedParts.size === filteredParts.length) {
      setSelectedParts(new Set())
    } else {
      setSelectedParts(new Set(filteredParts.map((p) => p.id)))
    }
  }

  const handleToggleSelect = (partId: string) => {
    const newSelected = new Set(selectedParts)
    if (newSelected.has(partId)) {
      newSelected.delete(partId)
    } else {
      newSelected.add(partId)
    }
    setSelectedParts(newSelected)
  }

  const handleDeleteSelected = async () => {
    if (selectedParts.size === 0) return

    const count = selectedParts.size
    if (!confirm(`Delete ${count} selected part${count !== 1 ? 's' : ''}? This cannot be undone.`)) {
      return
    }

    for (const partId of selectedParts) {
      await deletePart.mutateAsync(partId)
    }
    setSelectedParts(new Set())
  }

  const handleUpdate = async (data: PartFormData) => {
    if (!editingPart) return
    await updatePart.mutateAsync({
      partId: editingPart.id,
      data,
    })
    setEditingPart(null)
  }

  const handleDelete = async (partId: string) => {
    await deletePart.mutateAsync(partId)
  }

  const handleEdit = (part: Part) => {
    setEditingPart(part)
  }

  const partToFormData = (part: Part): PartFormData => ({
    category: part.category,
    brand: part.brand,
    model: part.model,
    name: part.name,
    color: part.color,
    price: part.price,
    imageUrl: part.imageUrl,
    description: part.description,
    links: part.links,
  })

  // Group parts by category
  const partsByCategory = parts?.reduce((acc, part) => {
    if (!acc[part.category]) {
      acc[part.category] = []
    }
    acc[part.category].push(part)
    return acc
  }, {} as Record<ComponentCategory, Part[]>)

  // Get unique categories that have parts
  const categoriesWithParts = parts
    ? Array.from(new Set(parts.map((p) => p.category)))
    : []

  // Filter and sort parts based on selected category
  const filteredParts = (() => {
    let filtered =
      selectedCategory === 'all'
        ? parts
        : parts?.filter((p) => p.category === selectedCategory)

    if (!filtered) return []

    // Sort logic
    if (selectedCategory === 'all') {
      // Sort by Category first, then Brand
      return [...filtered].sort((a, b) => {
        // First compare categories
        const catCompare = a.category.localeCompare(b.category)
        if (catCompare !== 0) return catCompare

        // Then compare brands
        return (a.brand || '').localeCompare(b.brand || '')
      })
    } else {
      // Sort by Brand only for filtered category
      return [...filtered].sort((a, b) =>
        (a.brand || '').localeCompare(b.brand || '')
      )
    }
  })()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading parts. Please try again.</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Parts Cabinet</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your collection of bike parts • {parts?.length || 0} parts
            {selectedParts.size > 0 && (
              <span className="ml-2 text-primary-600">
                • {selectedParts.size} selected
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          {selectedParts.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              Delete {selectedParts.size} Selected
            </button>
          )}
          <CsvImport onImport={handleCsvImport} existingParts={parts || []} />
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Part
          </button>
        </div>
      </div>

      {/* Category Filter & Select All */}
      {categoriesWithParts.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({parts?.length || 0})
              </button>
              {categoriesWithParts.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {COMPONENT_CATEGORY_LABELS[category]} ({partsByCategory?.[category]?.length || 0})
                </button>
              ))}
            </div>
            {filteredParts.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {selectedParts.size === filteredParts.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Parts Grid */}
      {parts && parts.length === 0 ? (
        <div className="text-center py-12 card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parts yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your cabinet by adding parts!
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Your First Part
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredParts?.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isSelected={selectedParts.has(part.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="btn-primary px-8 py-3"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  `Load More Parts`
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Form */}
      <PartForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        mode="create"
      />

      {/* Edit Form */}
      <PartForm
        isOpen={!!editingPart}
        onClose={() => setEditingPart(null)}
        onSubmit={handleUpdate}
        initialData={editingPart ? partToFormData(editingPart) : null}
        mode="edit"
      />
    </>
  )
}
