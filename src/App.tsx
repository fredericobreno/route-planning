import React, { useEffect } from 'react'
import ExportButton from './components/ExportButton'
import FileUpload from './components/FileUpload'
import Map, { getClosestMarkersInGroupsOf } from './components/Map'
import useMapContext from './hooks/useMapContext'

const App: React.FC = () => {
  const {
    markers,
    setMarkers,
    numMarkersPerGroup,
    setNumMarkersPerGroup,
  } = useMapContext()

  const handleNumMarkersPerGroupChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!isNaN(Number(e.target.value))) {
      setNumMarkersPerGroup(Number(e.target.value))
    }
  }

  useEffect(() => {
    const _markers = getClosestMarkersInGroupsOf(markers, numMarkersPerGroup)
    setMarkers(_markers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numMarkersPerGroup])

  return (
    <div style={{ minHeight: '100vh' }}>
      <FileUpload />
      <ExportButton />
      <label>num per area:</label>
      <input
        type='number'
        onChange={handleNumMarkersPerGroupChange}
        value={numMarkersPerGroup}
      />
      <Map />
    </div>
  )
}

export default App
