type PointType = {
  lat: number
  lng: number
}

export const getHull = (points: PointType[]) => {
  let newPoints = points.slice()
  newPoints.sort((a, b) => {
    if (a.lat < b.lat) return -1
    else if (a.lat > b.lat) return +1
    else if (a.lng < b.lng) return -1
    else if (a.lng > b.lng) return +1
    else return 0
  })
  function makeHullPresorted (points: PointType[]) {
    if (points.length <= 1) return points.slice()
    let upperHull = []
    for (let i = 0; i < points.length; i++) {
      let p = points[i]
      while (upperHull.length >= 2) {
        let q = upperHull[upperHull.length - 1]
        let r = upperHull[upperHull.length - 2]
        if (
          (q.lat - r.lat) * (p.lng - r.lng) >=
          (q.lng - r.lng) * (p.lat - r.lat)
        )
          upperHull.pop()
        else break
      }
      upperHull.push(p)
    }
    upperHull.pop()
    let lowerHull = []
    for (let i = points.length - 1; i >= 0; i--) {
      let p = points[i]
      while (lowerHull.length >= 2) {
        let q = lowerHull[lowerHull.length - 1]
        let r = lowerHull[lowerHull.length - 2]
        if (
          (q.lat - r.lat) * (p.lng - r.lng) >=
          (q.lng - r.lng) * (p.lat - r.lat)
        )
          lowerHull.pop()
        else break
      }
      lowerHull.push(p)
    }
    lowerHull.pop()
    if (
      upperHull.length === 1 &&
      lowerHull.length === 1 &&
      upperHull[0].lat === lowerHull[0].lat &&
      upperHull[0].lng === lowerHull[0].lng
    )
      return upperHull
    else return upperHull.concat(lowerHull)
  }
  return makeHullPresorted(newPoints)
}
