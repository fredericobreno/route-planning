import React from 'react'
import { read as readXlsx, utils as utilsXlsx } from 'xlsx'
import { MarkerType } from '../contexts/MapContext'
import useMapContext from '../hooks/useMapContext'
import { getClosestMarkersInGroupsOf } from './Map'

const FileUpload: React.FC = () => {
  const { map, setMarkers } = useMapContext()

  const storeDataIntoContext = (data: any[]) => {
    let _markers: MarkerType[] = []
    const columns = data.shift().map((column: string) => column.toLowerCase())

    data.forEach((row: any, rowIndex: number) => {
      const lat: number = row[columns.indexOf('lat')]
      const lng: number = row[columns.indexOf('lng')]

      if (!lat || !lng) return

      const marker: MarkerType = {
        id: rowIndex,
        lat,
        lng,
        data: {},
        groupId: -1,
        groupName: '',
      }

      columns.forEach((column: string, index: number) => {
        if (['lat', 'lng'].includes(column)) return
        marker.data[column] = row[index]
      })
      _markers.push(marker)
    })

    _markers = _markers.filter(
      (value, index, self) =>
        self.findIndex(
          item => item.lat === value.lat && item.lng === value.lng,
        ) === index,
    )
    _markers = getClosestMarkersInGroupsOf(_markers, 6)
    setMarkers(_markers)
    map.flyToBounds(_markers.map(marker => [marker.lat, marker.lng]))
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
