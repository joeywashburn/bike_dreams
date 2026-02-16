import { useState, useEffect } from 'react'
import { useBuilds, useCreateBuild, useUpdateBuildParts, useDuplicateBuild } from '../../hooks/useBuilds'
import { useParts } from '../../hooks/useParts'
import BuildSelector from './BuildSelector'
import BuildConfigurator from './BuildConfigurator'
import { Build, ComponentCategory } from '../../types/build'

export default function TheGarage() {
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null)

  const { data: builds, isLoading: buildsLoading } = useBuilds()
  const { data: parts, isLoading: partsLoading } = useParts()
  const createBuild = useCreateBuild()
  const updateBuildParts = useUpdateBuildParts()
  const duplicateBuild = useDuplicateBuild()

  // Get the current selected build from the latest data
  const selectedBuild = builds?.find((b) => b.id === selectedBuildId) || null

  // Auto-select first build if none selected
  useEffect(() => {
    if (!selectedBuildId && builds && builds.length > 0) {
      setSelectedBuildId(builds[0].id)
    }
  }, [builds, selectedBuildId])

  const handleCreateBuild = async (name: string) => {
    const buildId = await createBuild.mutateAsync({ name })
    setSelectedBuildId(buildId)
  }

  const handleSelectBuild = (build: Build) => {
    setSelectedBuildId(build.id)
  }

  const handleSelectPart = async (category: ComponentCategory, partId: string | null) => {
    if (!selectedBuild) return

    await updateBuildParts.mutateAsync({
      buildId: selectedBuild.id,
      category,
      partId,
    })
  }

  const handleDuplicateBuild = async (buildId: string) => {
    const originalBuild = builds?.find((b) => b.id === buildId)
    if (!originalBuild) return

    const newName = prompt('Enter name for the new build:', `Copy of ${originalBuild.name}`)
    if (!newName || !newName.trim()) return

    const newBuildId = await duplicateBuild.mutateAsync({ buildId, newName: newName.trim() })
    setSelectedBuildId(newBuildId)
  }

  if (buildsLoading || partsLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar - Build Selector */}
      <div className="lg:col-span-1">
        <div className="card sticky top-6">
          <h2 className="text-xl font-bold mb-4">Your Builds</h2>
          <BuildSelector
            builds={builds || []}
            selectedBuild={selectedBuild}
            onSelectBuild={handleSelectBuild}
            onCreateBuild={handleCreateBuild}
          />
        </div>
      </div>

      {/* Right Side - Build Configurator */}
      <div className="lg:col-span-2">
        {selectedBuild ? (
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedBuild.name}</h2>
              <p className="text-gray-600">Configure your build by selecting parts</p>
            </div>
            <BuildConfigurator
              build={selectedBuild}
              parts={parts || []}
              onSelectPart={handleSelectPart}
              onDuplicateBuild={handleDuplicateBuild}
            />
          </>
        ) : (
          <div className="card text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Build Selected</h3>
            <p className="text-gray-600">Create a build to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
