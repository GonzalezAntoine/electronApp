import { useState, useEffect } from 'react'

const useLoadData = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    window.api.getData().then(setData)
  }, [])

  return data
}

export default useLoadData
