import React from 'react'
import FileUpload from './components/FileUpload'
import MarkersProvider from './contexts/markers'

const App: React.FC = () => {
  return (
    <MarkersProvider>
      <div style={{ backgroundColor: '#333', minHeight: '100vh' }}>
        <FileUpload />
      </div>
    </MarkersProvider>
  )
}

export default App
