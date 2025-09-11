import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { ProductWarehouseItem } from '@/store/product/types.d'

type ProductDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  product: ProductWarehouseItem | null
}

const formatPrice = (price?: string | number) => {
  if (price == null) return '0.00'

  const numericPrice =
    typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : price

  return numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })
}

export function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="p-4">
          <div className="space-y-4">
            <div className="w-[350px] h-40">
              <img
                src={
                  product.product.images?.[0] ||
                  'https://media.istockphoto.com/id/184639599/photo/power-drill-with-large-bit.jpg?s=612x612&w=0&k=20&c=TJczKvZqLmWc5c5O6r86jelaUbYFLCZnwA_uWlhHOG0='
                }
                alt={product.product.name}
                className="w-full h-full rounded-md object-cover"
              />
            </div>
            <div className="flex flex-col gap-1 items-start mt-10">
              {/* <Tag variant="ghost">{product?.product?.category_id}</Tag> */}
              <p className="font-medium text-[#18181B]">
                {product?.product.name}
              </p>
              <div className="flex items-center gap-4">
                <p className="font-medium text-[#059669]">
                  ${formatPrice(product.product.price || 0)}
                </p>
              </div>
              <p className="text-sm text-zinc-400 mt-4">
                {product.product.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
