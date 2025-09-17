import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { RentProduct } from '@/store/product/types.d'

type RentProductDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  product: RentProduct | null
}

const formatPrice = (price?: string | number) => {
  if (price == null) return '0.00'

  const numericPrice =
    typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : price

  return numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })
}

export default function ViewRentProductModal({
  isOpen,
  onClose,
  product,
}: RentProductDetailsModalProps) {
  if (!product) return null

  const base = product.product // BaseProduct
  const branch = product.branch // Branch

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-4 space-y-6">
          {/* Image */}
          <div className="w-full h-48">
            <img
              src={
                base.images?.[0] ||
                'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0='
              }
              alt={base.name}
              className="w-full h-full rounded-md object-cover"
            />
          </div>

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

            {/* Name */}
            <h2 className="text-lg font-semibold text-[#18181B]">
              {base.name}
            </h2>

            {/* Rent Price */}
            <p className="text-green-700 font-medium">
              Rent price: {base.currency || 'UZS'}{' '}
              {formatPrice(product.product_rent_price)}
            </p>

            {/* Barcode */}
            <p className="text-sm text-zinc-500">
              Barcode: <strong>{base.barcode}</strong>
            </p>

            {/* From Create */}
            <p className="text-sm text-zinc-500">
              From create: <strong>{product.from_create}</strong>
            </p>

            {/* Branch */}
            <p className="text-sm text-zinc-500">
              Branch: <strong>{branch?.name}</strong>
            </p>

            {/* Product counts */}
            <p className="text-sm text-zinc-500">
              Total count: <strong>{product.product_total_count}</strong>
            </p>
            <p className="text-sm text-zinc-500">
              Active count: <strong>{product.product_active_count}</strong>
            </p>

            {/* Created at */}
            <p className="text-xs text-zinc-400">
              Created at: {new Date(product.created_at).toLocaleString()}
            </p>

            {/* Updated at */}
            <p className="text-xs text-zinc-400">
              Updated at: {new Date(product.updated_at).toLocaleString()}
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
