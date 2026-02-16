import { useState, Fragment } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Build } from '../../types/build'

interface BuildSelectorProps {
  builds: Build[]
  selectedBuild: Build | null
  onSelectBuild: (build: Build) => void
  onCreateBuild: (name: string) => void
}

export default function BuildSelector({
  builds,
  selectedBuild,
  onSelectBuild,
  onCreateBuild,
}: BuildSelectorProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreateBuild(name)
    setName('')
    setIsFormOpen(false)
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Select Build</h3>
          <button
            onClick={() => setIsFormOpen(true)}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            New Build
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {builds.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-sm mb-3">No builds yet</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary text-sm"
              >
                <PlusIcon className="w-4 h-4 inline mr-1" />
                Create Your First Build
              </button>
            </div>
          ) : (
            builds.map((build) => (
              <button
                key={build.id}
                onClick={() => onSelectBuild(build)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedBuild?.id === build.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{build.name}</h4>
                    <p className="text-xs text-gray-500">
                      {Object.keys(build.selectedParts).length} parts selected
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      ${build.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Create Build Modal */}
      <Transition appear show={isFormOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsFormOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Create New Build
                    </Dialog.Title>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Build Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        placeholder="e.g. My Street Bike"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Create Build
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
