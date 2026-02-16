import { useState, useRef } from 'react'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ComponentCategory, COMPONENT_CATEGORY_LABELS, Part } from '../../types/build'

interface CsvImportProps {
  onImport: (parts: CsvPartData[]) => void
  existingParts: Part[]
}

export interface CsvPartData {
  category: ComponentCategory
  brand: string
  model: string
  name?: string
  color?: string
  price: number
  imageUrl?: string
  description?: string
  links?: Array<{ store: string; url: string }>
  isDuplicate?: boolean
}

// Helper function to clean and normalize strings
const cleanString = (str: string): string => {
  return str
    ?.trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

// Helper function to properly parse CSV line with quoted fields
const parseCsvLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add final field
  result.push(current.trim())

  return result
}

export default function CsvImport({ onImport, existingParts }: CsvImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<CsvPartData[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      parseAndValidateCsv(text)
    }
    reader.readAsText(file)
  }

  const parseAndValidateCsv = (csvText: string) => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
      setErrors(['CSV file is empty or has no data rows'])
      return
    }

    const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
    const requiredHeaders = ['category', 'brand', 'model', 'price']
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

    if (missingHeaders.length > 0) {
      setErrors([`Missing required columns: ${missingHeaders.join(', ')}`])
      return
    }

    const parts: CsvPartData[] = []
    const parseErrors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCsvLine(line)
      const row: any = {}

      headers.forEach((header, index) => {
        row[header] = cleanString(values[index] || '')
      })

      // Validate category
      const category = cleanString(row.category)?.toLowerCase().replace(/\s+/g, '_')
      if (!COMPONENT_CATEGORY_LABELS[category as ComponentCategory]) {
        parseErrors.push(`Row ${i + 1}: Invalid category "${row.category}"`)
        continue
      }

      // Validate required fields
      if (!row.brand || !row.model) {
        parseErrors.push(`Row ${i + 1}: Missing brand or model`)
        continue
      }

      // Parse price
      const price = parseFloat(row.price)
      if (isNaN(price) || price < 0) {
        parseErrors.push(`Row ${i + 1}: Invalid price "${row.price}"`)
        continue
      }

      // Parse shop links (up to 3)
      const links: Array<{ store: string; url: string }> = []
      for (let j = 1; j <= 3; j++) {
        let storeName = cleanString(row[`shop ${j} name`] || row[`shop${j}name`])
        const storeUrl = cleanString(row[`shop ${j} url`] || row[`shop${j}url`])

        // If URL exists but no store name, extract domain from URL
        if (storeUrl && !storeName) {
          try {
            const urlObj = new URL(storeUrl)
            // Extract domain and clean it up (e.g., "www.danscomp.com" -> "Dan's Comp")
            const domain = urlObj.hostname.replace('www.', '')
            storeName = domain.split('.')[0] // Get first part of domain
            storeName = storeName.charAt(0).toUpperCase() + storeName.slice(1) // Capitalize
          } catch {
            storeName = 'Shop ' + j // Fallback
          }
        }

        if (storeName && storeUrl) {
          links.push({
            store: storeName,
            url: storeUrl,
          })
        }
      }

      const newPart: CsvPartData = {
        category: category as ComponentCategory,
        brand: cleanString(row.brand),
        model: cleanString(row.model),
        name: cleanString(row.name || row.nickname) || '',
        color: cleanString(row.color) || '',
        price,
        imageUrl: cleanString(row.imageurl || row['image url']) || '',
        description: cleanString(row.description) || '',
        links,
      }

      // Check for duplicates (same category, brand, and model)
      const isDuplicate = existingParts.some(
        (existing) =>
          existing.category === newPart.category &&
          cleanString(existing.brand).toLowerCase() === newPart.brand.toLowerCase() &&
          cleanString(existing.model).toLowerCase() === newPart.model.toLowerCase()
      )

      newPart.isDuplicate = isDuplicate

      parts.push(newPart)
    }

    if (parseErrors.length > 0) {
      setErrors(parseErrors)
    } else {
      setErrors([])
    }

    setPreview(parts)
  }

  const handleImport = () => {
    if (preview.length === 0) return
    // Filter out duplicates before importing
    const newParts = preview.filter((part) => !part.isDuplicate)
    if (newParts.length === 0) {
      setErrors(['All parts are duplicates. Nothing to import.'])
      return
    }
    onImport(newParts)
    setIsOpen(false)
    setPreview([])
    setErrors([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const duplicateCount = preview.filter((p) => p.isDuplicate).length
  const newPartsCount = preview.length - duplicateCount

  const downloadTemplate = () => {
    const template = `Category,Brand,Model,Nickname,Color,Price,Image URL,Description,Shop 1 Name,Shop 1 URL,Shop 2 Name,Shop 2 URL,Shop 3 Name,Shop 3 URL
frame,S&M,Big Jumper,,Matte Black,999,https://example.com/image.jpg,Great frame,Dan's Comp,https://www.danscomp.com/product1,Jenson USA,https://www.jensonusa.com/product1,,
fork,RockShox,Pike DJ Fork,,Red,769,https://example.com/fork.jpg,Solid fork,The Come Up,https://www.thecomeupbmx.net/product1,,,`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'parts-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary text-sm flex items-center"
      >
        <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
        Import CSV
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Import Parts from CSV</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">CSV Format</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Required columns: <strong>Category, Brand, Model, Price</strong>
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  Optional columns: Nickname, Color, Image URL, Description
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  Shop links (optional): Shop 1 Name, Shop 1 URL, Shop 2 Name, Shop 2 URL, Shop 3 Name, Shop 3 URL
                </p>
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Download CSV Template
                </button>
              </div>

              {/* File Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="input-field"
                />
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2">Errors Found:</h3>
                  <ul className="text-sm text-red-800 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preview */}
              {preview.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">
                    Preview ({newPartsCount} new, {duplicateCount} duplicate{duplicateCount !== 1 ? 's' : ''})
                  </h3>
                  {duplicateCount > 0 && (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ {duplicateCount} duplicate part{duplicateCount !== 1 ? 's' : ''} found and will be skipped.
                        Duplicates are detected by matching Category + Brand + Model.
                      </p>
                    </div>
                  )}
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="p-2 text-left">Status</th>
                          <th className="p-2 text-left">Category</th>
                          <th className="p-2 text-left">Brand</th>
                          <th className="p-2 text-left">Model</th>
                          <th className="p-2 text-left">Color</th>
                          <th className="p-2 text-left">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((part, index) => (
                          <tr
                            key={index}
                            className={`border-t ${part.isDuplicate ? 'bg-yellow-50 opacity-60' : ''}`}
                          >
                            <td className="p-2">
                              {part.isDuplicate ? (
                                <span className="text-yellow-600 text-xs">⚠️ Duplicate</span>
                              ) : (
                                <span className="text-green-600 text-xs">✓ New</span>
                              )}
                            </td>
                            <td className="p-2">{COMPONENT_CATEGORY_LABELS[part.category]}</td>
                            <td className="p-2">{part.brand}</td>
                            <td className="p-2">{part.model}</td>
                            <td className="p-2">{part.color || '-'}</td>
                            <td className="p-2">${part.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button onClick={() => setIsOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={preview.length === 0 || errors.length > 0 || newPartsCount === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import {newPartsCount} New Part{newPartsCount !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
