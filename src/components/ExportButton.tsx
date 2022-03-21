import React from 'react'
import useMapContext from '../hooks/useMapContext'

type Props = {}

const ExportButton: React.FC<Props> = () => {
  const { markers } = useMapContext()

  const handleExportClick = () => {
    if (markers.length) {
      const rows = [
        [
          ...Object.keys(markers[0].data),
          'lat',
          'lng',
          'groupId',
          'groupValue',
        ],
      ]

      for (let marker of markers) {
        rows.push([
          ...Object.values(marker.data as string),
          marker.lat.toString(),
          marker.lng.toString(),
          marker.groupId.toString(),
          marker.groupName,
        ])
      }

      const encodedUri = encodeURI(
        'data:text/csv;charset=utf-8,' +
          rows.map(row => row.join(',')).join('\r\n'),
      )
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'router-planning.csv')
      document.body.appendChild(link)

      link.click()
    }
  }

  return <button onClick={handleExportClick}>export</button>
}

export default ExportButton
