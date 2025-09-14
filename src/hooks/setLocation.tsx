import { setLocation } from '@/store/slice/Location.slice'
import { useDispatch } from 'react-redux'

export const SetLocation = (location: string) => {
  const dispatch = useDispatch()
  dispatch(setLocation(location))
}
