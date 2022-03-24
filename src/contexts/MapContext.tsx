import { Map } from 'leaflet'
import React from 'react'

export type MarkerType = {
  readonly id: number
  lat: number
  lng: number
  data: any
  groupId: number
  groupName: string
}

type ContextType = {
  map: Map
  setMap: React.Dispatch<React.SetStateAction<Map>>
  markers: MarkerType[]
  setMarkers: React.Dispatch<React.SetStateAction<MarkerType[]>>
  selectedGroupId: number
  setSelectedGroupId: React.Dispatch<React.SetStateAction<number>>
  numMarkersPerGroup: number
  setNumMarkersPerGroup: React.Dispatch<React.SetStateAction<number>>
}

export const MapContext = React.createContext({} as ContextType)

const MapProvider: React.FC = ({ children }) => {
  const [map, setMap] = React.useState<Map>({} as Map)
  const [markers, setMarkers] = React.useState<MarkerType[]>([])
  const [selectedGroupId, setSelectedGroupId] = React.useState<number>(-1)
  const [numMarkersPerGroup, setNumMarkersPerGroup] = React.useState<number>(6)

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        markers,
        setMarkers,
        selectedGroupId,
        setSelectedGroupId,
        numMarkersPerGroup,
        setNumMarkersPerGroup,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export default MapProvider
