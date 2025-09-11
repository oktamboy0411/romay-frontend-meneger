import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Sale } from '@/store/sales/types'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  saleData: Sale // bu GET ONE dan keladigan data
}

export default function SaleDetailsDialog({ open, setOpen, saleData }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sale tafsilotlari</DialogTitle>
        </DialogHeader>

        {saleData ? (
          <div className="space-y-4 grid grid-cols-2">
            {/* Branch */}
            <div>
              <p className="text-sm text-gray-500">Filial nomi</p>
              <p className="font-medium">
                {typeof saleData.branch_id === 'object'
                  ? saleData.branch_id.name
                  : "Noma'lum"}
              </p>
            </div>

            {/* Cashier */}
            <div>
              <p className="text-sm text-gray-500">Kassir</p>
              <p className="font-medium">
                {typeof saleData.cashier_id === 'object'
                  ? saleData.cashier_id.username
                  : "Noma'lum"}
              </p>
            </div>

            {/* Client */}
            <div>
              <p className="text-sm text-gray-500">Mijoz</p>
              <p className="font-medium">
                {saleData.client_id && typeof saleData.client_id === 'object'
                  ? saleData.client_id.username
                  : "Noma'lum"}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{saleData.status || "Noma'lum"}</p>
            </div>

            {/* Payments */}
            <div>
              <p className="text-sm text-gray-500">Jami summa</p>
              <p className="font-medium">
                {saleData.payments.total_amount || 0}{' '}
                {saleData.payments.currency || "Noma'lum"}
              </p>
            </div>

            <div className="col-span-2">
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-200 rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Mahsulot Nomi
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Kategoriya
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Miqdori
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Narxi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleData.items.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="px-4 py-2 text-sm">
                          {item.product_id.product?.name || "Noma'lum"}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {item.product_id.product?.category_id?.name ||
                            "Noma'lum"}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {item.quantity || 0}
                        </td>
                        <td className="px-4 py-2 text-sm">{item.price || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Yopish
              </Button>
            </div>

            {/* Items */}
          </div>
        ) : (
          <p>Ma’lumot yuklanmoqda...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
