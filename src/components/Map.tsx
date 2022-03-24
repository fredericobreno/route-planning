import { LatLngLiteral } from 'leaflet'
import React from 'react'
import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet'
import { MarkerType } from '../contexts/MapContext'
import useMapContext from '../hooks/useMapContext'
import { getHull } from '../utils/convexHull'

export const getClosestMarkersInGroupsOf = (
  markers: MarkerType[],
  size: number,
) => {
  const _markers: MarkerType[] = markers.map(marker => ({
    ...marker,
    groupId: -1,
  }))
  let newGroupId = 0
  let unchosen = _markers.filter(marker => marker.groupId === -1)
  const distanceBetween = (a: LatLngLiteral, b: LatLngLiteral) =>
    Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2))

  while (unchosen.length) {
    const firstCoord = unchosen.reduce(
      (acc, cur) =>
        cur.lat > acc.lat && cur.lng > acc.lng
          ? { lat: cur.lat, lng: cur.lng }
          : acc,
      { lat: -999, lng: -999 },
    )
    const closests = unchosen
      .sort(
        (a, b) =>
          distanceBetween(firstCoord, a) - distanceBetween(firstCoord, b),
      )
      .slice(0, size)

    // eslint-disable-next-line no-loop-func
    closests.forEach(closest => {
      const markerIndex = _markers.findIndex(marker => closest.id === marker.id)

      _markers[markerIndex].groupId = newGroupId
    })
    unchosen = _markers.filter(marker => marker.groupId === -1)
    newGroupId++
  }

  return _markers
}

const Map: React.FC = () => {
  const {
    setMap,
    markers,
    setMarkers,
    selectedGroupId,
    setSelectedGroupId,
  } = useMapContext()

  return (
    <MapContainer
      center={[-3.71839, -38.5434]}
      zoom={13}
      scrollWheelZoom={false}
      whenCreated={map => setMap(map)}
      style={{ height: '90vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          eventHandlers={{
            click: () => {
              if (selectedGroupId === -1)
                setSelectedGroupId(
                  selectedGroupId === marker.groupId ? -1 : marker.groupId,
                )
            },
          }}
        >
          {selectedGroupId > -1 && (
            <Popup>
              <div>
                {Object.entries(marker.data).map(([key, value]) => (
                  <div key={key}>
                    <span>{key}:</span> {value}
                  </div>
                ))}
                {selectedGroupId === marker.groupId ? (
                  <button
                    onClick={() => {
                      const lastGroupId = markers.reduce(
                        (acc, cur) => (acc > cur.groupId ? acc : cur.groupId),
                        0,
                      )
                      setMarkers(
                        markers.map(_marker =>
                          _marker.id === marker.id
                            ? { ..._marker, groupId: lastGroupId + 1 }
                            : _marker,
                        ),
                      )
                    }}
                  >
                    remove
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const markerFromSelectedGroup = markers.find(
                        marker => marker.groupId === selectedGroupId,
                      )

                      if (markerFromSelectedGroup) {
                        setMarkers(
                          markers.map(_marker =>
                            _marker.id === marker.id
                              ? {
                                  ..._marker,
                                  groupId: markerFromSelectedGroup.groupId,
                                  groupName: markerFromSelectedGroup.groupName,
                                }
                              : _marker,
                          ),
                        )
                      }
                    }}
                  >
                    add
                  </button>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      ))}
      {markers
        .sort((a, b) => a.groupId - b.groupId)
        .reduce<MarkerType[][]>((acc, cur) => {
          if (
            acc.length &&
            acc[acc.length - 1] &&
            cur.groupId === acc[acc.length - 1][0].groupId
          ) {
            return [
              ...acc.slice(0, acc.length - 1),
              [...acc[acc.length - 1], cur],
            ]
          } else {
            return [...acc, [cur]]
          }
        }, [])
        .map((markers, markersIndex) => {
          const convexHull = getHull(
            markers.map(marker => ({ lat: marker.lat, lng: marker.lng })),
          )
          const hasGroupName = markers[0]?.groupName?.length

          return (
            <Polygon
              key={markersIndex}
              pathOptions={{
                opacity:
                  selectedGroupId > -1
                    ? selectedGroupId === markersIndex
                      ? 1
                      : 0.6
                    : 0.8,
                fillOpacity:
                  selectedGroupId > -1
                    ? selectedGroupId === markersIndex
                      ? 0.5
                      : 0.1
                    : 0.3,
                color: hasGroupName ? '#3388ff' : 'red',
              }}
              positions={convexHull}
              eventHandlers={{
                click: () =>
                  setSelectedGroupId(
                    selectedGroupId === markersIndex ? -1 : markersIndex,
                  ),
              }}
            />
          )
        })}
    </MapContainer>
  )
}

export default Map
