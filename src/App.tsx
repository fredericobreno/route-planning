import React from 'react'
import ExportButton from './components/ExportButton'
import FileUpload from './components/FileUpload'
import Map from './components/Map'
import MapProvider from './contexts/MapContext'

const App: React.FC = () => {
  return (
    <MapProvider>
      <div style={{ backgroundColor: '#333', minHeight: '100vh' }}>
        <FileUpload />
        <ExportButton />
        <Map />
      </div>
    </MapProvider>
  )
}

export default App
