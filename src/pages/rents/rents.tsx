import { useState } from 'react'
import { PageTitle } from '@/components/PageTitle'
import RentUsersTable from './RentUsersTable'
import RentDetailsModal from './RentDetailsModal'

export default function Rents() {
  const [selectedRentId, setSelectedRentId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleRentClick = (rentId: string) => {
    setSelectedRentId(rentId)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedRentId(null)
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Ijaralar" />

      <RentUsersTable onRentClick={handleRentClick} />

      <RentDetailsModal
        rentId={selectedRentId}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
    </div>
  )
}
