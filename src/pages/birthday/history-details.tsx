import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import type { History } from '@/types/history'

type HistoryDetailsProps = {
  isOpen: boolean
  onClose: () => void
  historyItem: History | null
}

export function HistoryDetails({
  isOpen,
  onClose,
  historyItem,
}: HistoryDetailsProps) {
  if (!historyItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px] p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Xodimlar harakati</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-300 h-45 p-4 rounded-lg"></div>
            <div className="bg-red-100 p-4 rounded-lg flex justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-red-600 leading-4 font-medium">
                  Birinchi
                </span>
                <p className="text-[#111827] text-[14px] font-medium">
                  3 500 000 so’m
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-red-600 leading-4 font-medium">
                  O'zgartirilgan
                </span>
                <p className="text-[#111827] text-[14px] font-medium">
                  3 300 000 so’m
                </p>
              </div>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg grid grid-cols-3 gap-10">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[#6B7280] leading-4">
                  Xodim
                </span>
                <p className="text-[#111827] text-[14px]">Jahongir Ahamadev</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[#6B7280] leading-4">
                  Roli
                </span>
                <p className="text-[#111827] text-[14px]">Sotuvchi</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[#6B7280] leading-4">
                  Filial
                </span>
                <p className="text-[#111827] text-[14px]">Termiz</p>
              </div>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg flex justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[#6B7280] leading-4">
                  Harakat turi
                </span>
                <p className="text-[#111827] text-[14px]">Xatolik</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[#6B7280] leading-4">
                  O'zgartirilgan vaqti
                </span>
                <p className="text-[#111827] text-[14px]">
                  18:20 | 4-iyul, 2025
                </p>
              </div>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg flex justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[#6B7280] leading-4">
                  Xodim izohi
                </span>
                <p className="text-[#111827] text-[14px]">
                  Summani xato yozibman, 1 raqam ortiqcha edi
                </p>
              </div>
            </div>

            <Button
              className="w-full mt-6 flex items-center gap-2"
              onClick={onClose}
            >
              Buyurtmaga o'tish <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
