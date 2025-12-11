import { useState, useEffect } from 'react'
import Papa from 'papaparse'

// Type générique pour représenter une ligne du CSV
export type CSVRow = Record<string, string>

const useLoadCSV = (filePath: string): CSVRow[] => {
  const [data, setData] = useState<CSVRow[]>([])

  useEffect(() => {
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => {
        const result = Papa.parse<CSVRow>(text, { header: true })
        setData(result.data)
      })
      .catch((error) => console.error('Erreur de chargement du CSV :', error))
  }, [filePath])

  return data
}

export default useLoadCSV
