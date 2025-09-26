import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { Product } from '@/store/product/types.d'

type ProductDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

const formatPrice = (price?: string | number) => {
  if (price == null) return '0.00'

  const numericPrice =
    typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : price

  return numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })
}

export default function ViewSaleProductModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  if (!product) return null

  const base = product.product // BaseProduct

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-4 space-y-6">
          {/* Image */}
          {base.images?.[0] && (
            <div className="w-full h-48">
              <img
                src={base.images[0]}
                alt={base.name}
                className="w-full h-full rounded-md object-cover"
              />
            </div>
          )}

          {/* Main info */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                {base.category_id?.name || '—'}
              </span>
              <span
                className={`inline-flex items-center border px-2.5 py-1 text-xs rounded-md ${
                  base.status === 'active'
                    ? 'text-green-700 bg-green-50 border-green-100'
                    : 'text-red-700 bg-red-50 border-red-100'
                }`}
              >
                Status: {base.status}
              </span>
            </div>
            {/* Category */}

            {/* Name */}
            <h2 className="text-lg font-semibold text-[#18181B]">
              {base.name}
            </h2>

            {/* Price */}
            <p className="text-green-700 font-medium">
              {base.currency || 'UZS'} {formatPrice(base.price || 0)}
            </p>

            {/* Barcode */}
            <p className="text-sm text-zinc-500">
              Barcode: <strong>{base.barcode}</strong>
            </p>

            {/* From Create */}
            <p className="text-sm text-zinc-500">
              From create: <strong>{base.from_create}</strong>
            </p>

            {/* Product Count (warehouse) */}
            <p className="text-sm text-zinc-500">
              Product count (warehouse):{' '}
              <strong>{product.product_count}</strong>
            </p>

            {/* Description */}
            <div className="mt-2">
              <h3 className="text-sm font-medium text-zinc-600">Description</h3>
              <p className="text-sm text-zinc-500">
                {base.description || 'Tavsif kiritilmagan'}
              </p>
            </div>

            {/* Attributes */}
            {base.attributes?.length > 0 && (
              <div className="mt-2 w-full">
                <h3 className="text-sm font-medium text-zinc-600">
                  Attributes
                </h3>
                <ul className="list-disc pl-5 text-sm text-zinc-500">
                  {base.attributes.map((attr) => (
                    <li key={attr._id}>
                      <strong>{attr.key}</strong>: {attr.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
