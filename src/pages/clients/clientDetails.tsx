import { SetLocation } from '@/hooks/setLocation'
import { useGetOneClientQuery } from '@/store/clients/clients.api'
import { useGetAllSalesQuery } from '@/store/sales-client/salesApi'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import SaleDetailsDialog from '../sales/AddSalesDialog'
import { useState } from 'react'
import type { Sale } from '@/store/sales-client/types'

// Fixed money function with proper null checks
function money(
  n: number | undefined | null,
  sign: 'neutral' | 'debt' | 'pos' = 'neutral'
) {
  // Handle null, undefined, or invalid number cases
  if (n === null || n === undefined || isNaN(n)) {
    n = 0
  }

  const text = n.toLocaleString('uz-UZ')
  const cls =
    sign === 'debt'
      ? 'text-rose-600'
      : sign === 'pos'
        ? 'text-emerald-600'
        : 'text-[#18181B]'
  return <span className={cls}>{text}</span>
}

export default function ClientDetails() {
  const id = useParams<{ id: string }>().id
  const [open, setOpen] = useState(false)
  const { data } = useGetOneClientQuery(id as string, { skip: !id })
  const { data: client_items } = useGetAllSalesQuery(
    { client_id: id as string },
    { skip: !id }
  )
  const [selectedSale, setSelectedSale] = useState<Sale>({
    _id: 'string',
    branch_id: { _id: 'string', name: 'string', address: 'string' },
    cashier_id: { _id: 'string', username: 'string', phone: 'string' },
    client_id: { _id: 'string', username: 'string', phone: 'string' },
    sales_assistant_id: { _id: 'string', username: 'string', phone: 'string' },
    items: [],
    status: 'PENDING',
    payments: {
      total_amount: 0,
      paid_amount: 0,
      debt_amount: 0,
      type: '',
      currency: '',
      _id: '',
    },
    created_at: '',
    updated_at: '',
  })

  SetLocation('Mijozlar > Mijoz haqida')

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-[30px] font-semibold text-[#09090B] mb-4">
        Mijoz haqida
      </h1>
      <div className="border border-[#E4E4E7] rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info
              title="Ismi"
              value={data?.data?.username || 'Maʼlumot mavjud emas'}
            />
            <Info
              title="Tug'ilgan sana"
              value={
                data?.data?.birth_date
                  ? format(new Date(data?.data?.birth_date), 'dd.MM.yyyy')
                  : 'Maʼlumot mavjud emas'
              }
            />
            <Info
              title="Filial"
              value={data?.data?.branch_id?.name || 'Maʼlumot mavjud emas'}
            />
            <Info
              title="Phone Number"
              value={data?.data?.phone || 'Maʼlumot mavjud emas'}
            />
            <Info
              title="Kasbi"
              value={data?.data?.profession || 'Maʼlumot mavjud emas'}
            />
            <Info
              title="Manzili"
              value={data?.data?.address || 'Maʼlumot mavjud emas'}
            />

            {/* qo‘shimcha maydonlar */}
            <Info title="Izoh" value={data?.data?.description || ''} />
            <Info
              title="Filial manzili"
              value={data?.data?.branch_id?.address || ''}
            />
            <Info
              title="Mijoz darajasi"
              value={data?.data?.customer_tier || ''}
            />
            <Info
              title="Buyurtmalar soni"
              value={data?.data?.sales_count?.toString() || '0'}
            />
            <Info
              title="Ro‘yxatdan o‘tgan sana"
              value={
                data?.data?.created_at
                  ? format(new Date(data?.data?.created_at), 'dd.MM.yyyy HH:mm')
                  : ''
              }
            />
            <Info
              title="Yangilangan sana"
              value={
                data?.data?.updated_at
                  ? format(new Date(data?.data?.updated_at), 'dd.MM.yyyy HH:mm')
                  : ''
              }
            />
          </div>

          <div className="md:col-span-1">
            <div className="rounded-md border border-[#E4E4E7] p-5">
              <div className="text-sm text-[#71717A]">Qarz</div>
              <div className="text-[28px] font-semibold text-rose-600">
                {money(data?.data?.debt?.total_amount, 'debt')} so'm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <div className="px-6 py-3 font-medium text-[#18181B] border-b">
          Buyurtmalari
        </div>
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">
                Buyurtma raqami
              </th>
              <th className="px-6 py-3 text-left font-medium">
                Buyurtma sanasi
              </th>
              <th className="px-6 py-3 text-left font-medium">status</th>
              <th className="px-6 py-3 text-left font-medium">
                Umumiy to'lov summasi
              </th>
              <th className="px-6 py-3 text-left font-medium">
                To'lov qilingan summa
              </th>
              <th className="px-6 py-3 text-left font-medium">Qarzdorlik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {client_items?.data?.length ? (
              client_items.data.map((o) => (
                <tr key={o._id} className="hover:bg-[#F9F9F9]">
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div
                      onClick={() => {
                        setSelectedSale(o)
                        setOpen(true)
                      }}
                      className="text-sm text-[#18181B] underline cursor-pointer"
                    >
                      {o?._id || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {o?.created_at
                        ? format(new Date(o.created_at), 'dd.MM.yyyy')
                        : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">{o?.status}</div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {money(o?.payments?.total_amount)} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="text-sm text-[#18181B]">
                      {money(o?.payments?.paid_amount)} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="text-sm">
                      {money(o?.payments?.debt_amount, 'debt')} so'm
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Buyurtmalar topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <SaleDetailsDialog
        open={open}
        setOpen={setOpen}
        saleData={selectedSale}
      />
    </div>
  )
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-0">
      <div className="text-sm text-[#71717A]">{title}</div>
      <div className="text-[16px] font-semibold text-[#18181B]">{value}</div>
    </div>
  )
}
