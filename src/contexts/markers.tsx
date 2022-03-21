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
  markers: MarkerType[]
  addMarkers(markers: MarkerType[]): void
}

export const MarkersContext = React.createContext({} as ContextType)

const MarkersProvider: React.FC = ({ children }) => {
  const [markers, setMarkers] = React.useState<MarkerType[]>([])

  const addMarkers = (markers: MarkerType[]) => {
    setMarkers([...markers, ...markers])
  }

  return (
    <MarkersContext.Provider
      value={{
        markers,
        addMarkers,
      }}
    >
      {children}
    </MarkersContext.Provider>
  )
}

export default MarkersProvider
