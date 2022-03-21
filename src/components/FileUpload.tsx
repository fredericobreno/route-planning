import React from 'react'
import { read as readXlsx, utils as utilsXlsx } from 'xlsx'
import { MarkerType } from '../contexts/markers'
import useMarkers from '../hooks/useMarkers'

const FileUpload: React.FC = () => {
  const { addMarkers } = useMarkers()

  const storeDataIntoContext = (data: any[]) => {
    const _markers: MarkerType[] = []
    const columns = data.shift().map((column: string) => column.toLowerCase())

    data.forEach((row: any, rowIndex: number) => {
      const marker: MarkerType = {
        id: rowIndex,
        lat: row[columns.indexOf('lat')],
        lng: row[columns.indexOf('lng')],
        data: {},
        groupId: 0,
        groupName: '',
      }
      columns.forEach((column: string, index: number) => {
        if (['lat', 'lng'].includes(column)) return
        marker.data[column] = row[index]
      })
      _markers.push(marker)
    })

    addMarkers(_markers)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const file = e.target.files && e.target.files[0]
    const reader = new FileReader()

    if (!file) return

    reader.onload = function (e) {
      if (!e.target) return

      const data = e.target.result
      const readedData = readXlsx(data, { type: 'binary' })
      const wsname = readedData.SheetNames[0]
      const ws = readedData.Sheets[wsname]
      const dataParse = utilsXlsx.sheet_to_json(ws, { header: 1 })

      storeDataIntoContext(dataParse)
    }
    reader.readAsBinaryString(file)
  }

  return <input type='file' onChange={handleUpload} />
}

export default FileUpload
