import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Part } from '../../types/build'
import { COMPONENT_CATEGORY_LABELS } from '../../types/build'

interface PartCardProps {
  part: Part
  onEdit: (part: Part) => void
  onDelete: (partId: string) => void
  isSelected?: boolean
  onToggleSelect?: (partId: string) => void
}

export default function PartCard({ part, onEdit, onDelete, isSelected, onToggleSelect }: PartCardProps) {
  return (
    <div
      className={`card hover:shadow-md transition-all flex flex-col h-full relative ${
        isSelected ? 'ring-2 ring-primary-600 bg-primary-50' : ''
      }`}
    >
      {/* Selection Checkbox */}
      {onToggleSelect && (
        <div className="absolute top-3 right-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(part.id)}
            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
          />
        </div>
      )}
      {/* Image - Fixed height */}
      {part.imageUrl && (
        <div className="mb-3">
          <img
            src={part.imageUrl}
            alt={`${part.brand} ${part.model}`}
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Content - Grows to fill space */}
      <div className="flex-grow">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
            {COMPONENT_CATEGORY_LABELS[part.category]}
          </span>
        </div>

        {/* Brand & Model */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {part.brand} {part.model}
        </h3>

        {/* Nickname */}
        {part.name && <p className="text-sm text-gray-600 italic mb-2">{part.name}</p>}

        {/* Color */}
        {part.color && <p className="text-sm text-gray-600 mb-2">{part.color}</p>}

        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-primary-600">${part.price.toFixed(2)}</p>
        </div>

        {/* Shop Links */}
        {part.links.length > 0 && (
          <div className="mb-3 space-y-1">
            <p className="text-xs font-medium text-gray-700 mb-1">Available at:</p>
            {part.links.map((link, index) => (
              <a
                key={index}
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

        {/* Description */}
        {part.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{part.description}</p>
        )}
      </div>

      {/* Actions - Stays at bottom */}
      <div className="flex space-x-2 pt-3 border-t mt-auto">
        <button
          onClick={() => onEdit(part)}
          className="flex-1 btn-secondary text-sm flex items-center justify-center"
        >
          <PencilIcon className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm('Delete this part from your cabinet?')) {
              onDelete(part.id)
            }
          }}
          className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm flex items-center justify-center"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  )
}
