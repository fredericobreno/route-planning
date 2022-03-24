import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import MapProvider from './contexts/MapContext'

ReactDOM.render(
  <React.StrictMode>
    <MapProvider>
      <App />
    </MapProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
