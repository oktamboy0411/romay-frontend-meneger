import React from 'react'

function GetProductStatus({
  quantity,
  limit = 10,
}: {
  quantity: number
  limit?: number
}): React.ReactNode {
  if (quantity > limit) {
    return (
      <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700">
        Mavjud
      </span>
    )
  } else if (quantity > 0 && quantity <= limit) {
    return (
      <span className="px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-700">
        Oz qoldi
      </span>
    )
  } else {
    return (
      <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700">
        Mavjud emas
      </span>
    )
  }
}

export default GetProductStatus
