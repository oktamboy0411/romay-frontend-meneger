import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

interface PropTypes {
  onClickDelete: () => Promise<void>
  onClickUpdate: () => void
  id: string
  openPopover: string
  setOpenPopover: React.Dispatch<React.SetStateAction<string>>
}

export default function EditAndDeletePopover({
  onClickDelete,
  onClickUpdate,
  openPopover,
  setOpenPopover,
  id,
}: PropTypes) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true)
    setOpenPopover(id)
  }

  const openEditModal = () => {
    onClickUpdate()
    setOpenPopover(id)
  }

  const confrimDeleteFunction = async () => {
    setIsDeleting(true)
    await onClickDelete()
    setIsDeleting(false)
    setIsDeleteModalOpen(false)
  }

  return (
    <div>
      <Popover
        open={openPopover === id}
        onOpenChange={(open) => setOpenPopover(open ? id : '')}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => openEditModal()}
            >
              <Edit className="mr-2 h-4 w-4" />
              Yangilash
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => openDeleteModal()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              O'chirish
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Ro'yxatdan o'chirish
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Rostan ham o'chirmoqchimisiz?
              </p>
              <p className="text-sm text-red-600 mt-2">
                Bu amal bekor qilib bo'lmaydi.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Yo'q, bekor qilish
              </Button>
              <Button
                variant="destructive"
                onClick={confrimDeleteFunction}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
