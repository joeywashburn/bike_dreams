import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ComponentCategory, COMPONENT_CATEGORY_LABELS, ShopLink } from '../../types/build'

interface PartFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PartFormData) => void
  initialData?: PartFormData | null
  mode?: 'create' | 'edit'
}

export interface PartFormData {
  category: ComponentCategory
  brand: string
  model: string
  name?: string
  color?: string
  price: number
  imageUrl?: string
  description?: string
  links: ShopLink[]
}

const CATEGORIES: ComponentCategory[] = [
  'frame',
  'fork',
  'brakes',
  'seat_post',
  'seat_post_clamp',
  'rear_disc',
  'sprocket',
  'rear_cog',
  'rear_tire',
  'front_tire',
  'chain',
  'headset',
  'cranks',
  'spider',
  'bottom_bracket',
  'stem',
  'bars',
  'grips',
  'pedals',
  'seat',
  'wheelset',
  'front_hub',
  'front_wheel',
  'rear_hub',
  'rear_wheel',
  'spokes',
  'nipples',
  'tubes',
  'other',
]

export default function PartForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}: PartFormProps) {
  const [formData, setFormData] = useState<PartFormData>(
    initialData || {
      category: 'frame',
      brand: '',
      model: '',
      name: '',
      color: '',
      price: 0,
      imageUrl: '',
      description: '',
      links: [],
    }
  )
  const [newLink, setNewLink] = useState({ store: '', url: '' })
  const [linkError, setLinkError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData)
    } else if (isOpen && !initialData) {
      setFormData({
        category: 'frame',
        brand: '',
        model: '',
        name: '',
        color: '',
        price: 0,
        imageUrl: '',
        description: '',
        links: [],
      })
    }
  }, [isOpen, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.brand?.trim() || !formData.model?.trim()) return
    onSubmit(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      category: 'frame',
      brand: '',
      model: '',
      name: '',
      color: '',
      price: 0,
      imageUrl: '',
      description: '',
      links: [],
    })
    setNewLink({ store: '', url: '' })
    setLinkError(null)
    onClose()
  }

  const addLink = () => {
    const store = newLink.store.trim()
    const url = newLink.url.trim()

    setLinkError(null)

    // Validation
    if (!store || !url) {
      setLinkError('Please enter both store name and URL')
      return
    }

    // Validate URL format
    try {
      const urlObj = new URL(url)
      if (!urlObj.protocol.startsWith('http')) {
        setLinkError('URL must start with http:// or https://')
        return
      }
    } catch (e) {
      setLinkError('Please enter a valid URL (e.g., https://www.danscomp.com/product)')
      return
    }

    // Limit to 10 links per part
    if (formData.links.length >= 10) {
      setLinkError('Maximum 10 shop links per part')
      return
    }

    // Check for duplicate URLs
    if (formData.links.some((link) => link.url === url)) {
      setLinkError('This URL has already been added')
      return
    }

    const updatedLinks = [
      ...formData.links,
      {
        store,
        url,
        price: formData.price,
        lastChecked: new Date(),
        available: true,
      },
    ]

    setFormData({
      ...formData,
      links: updatedLinks,
    })
    setNewLink({ store: '', url: '' })
    setLinkError(null)
  }

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    })
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {mode === 'create' ? 'Add Part to Cabinet' : 'Edit Part'}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Image URL - PROMINENT */}
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      📸 Product Image (Recommended)
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      Right-click product image → "Copy Image Address" → Paste here
                    </p>
                    <input
                      type="url"
                      value={formData.imageUrl || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="input-field"
                      placeholder="https://example.com/product-image.jpg"
                    />
                    {formData.imageUrl && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-2">Preview:</p>
                        <img
                          src={formData.imageUrl}
                          alt="Product preview"
                          className="w-32 h-32 object-cover rounded border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Component Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Component Type *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as ComponentCategory,
                        })
                      }
                      className="input-field"
                      required
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {COMPONENT_CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand and Model */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brand *
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className="input-field"
                        placeholder="e.g. S&M"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model *
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) =>
                          setFormData({ ...formData, model: e.target.value })
                        }
                        className="input-field"
                        placeholder="e.g. Big Jumper"
                        required
                      />
                    </div>
                  </div>

                  {/* Nickname and Color */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nickname (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="input-field"
                        placeholder="e.g. My dream frame"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Personal reference name (optional)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        className="input-field"
                        placeholder="e.g. Matte Black"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price * ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="input-field"
                      rows={2}
                      placeholder="Optional notes..."
                    />
                  </div>

                  {/* Shop Links */}
                  {formData.links.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Shop Links ({formData.links.length})
                      </h4>
                      <div className="space-y-2 mb-3">
                        {formData.links.map((link, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {link.store}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {link.url}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLink(index)}
                              className="ml-2 text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Shop Links */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Add Shop Links (Optional)
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      Add links to different stores where this part is available
                    </p>

                    {/* Error Message */}
                    {linkError && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 flex items-start">
                          <span className="text-red-500 mr-2">⚠️</span>
                          {linkError}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLink.store}
                        onChange={(e) => {
                          setNewLink({ ...newLink, store: e.target.value })
                          setLinkError(null)
                        }}
                        className="input-field w-1/4"
                        placeholder="Store name"
                      />
                      <input
                        type="url"
                        value={newLink.url}
                        onChange={(e) => {
                          setNewLink({ ...newLink, url: e.target.value })
                          setLinkError(null)
                        }}
                        className="input-field flex-1"
                        placeholder="Product URL"
                      />
                      <button
                        type="button"
                        onClick={addLink}
                        className="btn-secondary flex items-center justify-center px-4"
                        title="Add link"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button type="button" onClick={handleClose} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {mode === 'create' ? 'Add to Cabinet' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
