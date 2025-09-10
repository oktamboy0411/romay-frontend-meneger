import Modal from '@/components/modal/Modal'

export interface AddSellerProps {
  isOpen: boolean
  onClose: () => void
}
export const AddSeller = ({ isOpen, onClose }: AddSellerProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      title="Sotuvchi qo’shish"
      description="Sotuvchi ma'lumotlarini kiritish uchun quyidagi maydonlarni to'ldiring"
    >
      {''}
    </Modal>
  )
}
