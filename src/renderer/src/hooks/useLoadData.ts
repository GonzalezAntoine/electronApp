import { useState, useEffect } from 'react'
import { DataRow } from '@renderer/types/db'

const useLoadData = () => {
  const [data, setData] = useState<DataRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await (window.api as any).getData()
        setData(result)
      } catch (err) {
        console.error(err)
        setError('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error }
}

export default useLoadData
