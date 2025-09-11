import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Sale } from '@/store/sales/types'

// 🔹 Sales GET ONE schema (faqat view uchun)
const saleSchema = z.object({
  _id: z.string(),
  branch_id: z.object({
    _id: z.string(),
    name: z.string(),
    address: z.string(),
  }),
  cashier_id: z.object({
    _id: z.string(),
    username: z.string(),
    phone: z.string(),
  }),
  client_id: z.object({
    _id: z.string(),
    username: z.string(),
    phone: z.string(),
  }),
  items: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number(),
      price: z.number(),
      _id: z.string(),
    })
  ),
  status: z.string(),
  payments: z.object({
    total_amount: z.number(),
    paid_amount: z.number(),
    debt_amount: z.number(),
    type: z.string(),
    currency: z.string(),
    _id: z.string(),
  }),
  created_at: z.string(),
  updated_at: z.string(),
})

type SaleValues = z.infer<typeof saleSchema>

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  saleData: Sale | null // bu GET ONE dan keladigan data
}

export default function SaleDetailsDialog({ open, setOpen, saleData }: Props) {
  useForm<SaleValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: saleData || undefined,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sale tafsilotlari</DialogTitle>
        </DialogHeader>

        {saleData ? (
          <div className="space-y-4">
            {/* Branch */}
            <div>
              <p className="text-sm text-gray-500">Filial nomi</p>
              <p className="font-medium">{saleData.branch_id.name}</p>
            </div>

            {/* Cashier */}
            <div>
              <p className="text-sm text-gray-500">Kassir</p>
              <p className="font-medium">{saleData.cashier_id.username}</p>
            </div>

            {/* Client */}
            <div>
              <p className="text-sm text-gray-500">Mijoz</p>
              <p className="font-medium">{saleData.client_id.username}</p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{saleData.status}</p>
            </div>

            {/* Payments */}
            <div>
              <p className="text-sm text-gray-500">Jami summa</p>
              <p className="font-medium">
                {saleData.payments.total_amount} {saleData.payments.currency}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="font-semibold">Items:</p>
              {saleData.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm border p-2 rounded"
                >
                  <span>Mahsulot ID: {item.product_id}</span>
                  <span>Miqdori: {item.quantity}</span>
                  <span>Narxi: {item.price}</span>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Yopish
            </Button>
          </div>
        ) : (
          <p>Ma’lumot yuklanmoqda...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
