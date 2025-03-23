// This is a simplified type declaration file for Google Maps
// It only includes the types we're using in our application

interface Window {
  google: {
    maps: {
      Geocoder: any
      Size: any
      Map: any
      Marker: any
      InfoWindow: any
      LatLngBounds: any
      SymbolPath: {
        CIRCLE: any
        FORWARD_CLOSED_ARROW: any
        FORWARD_OPEN_ARROW: any
        BACKWARD_CLOSED_ARROW: any
        BACKWARD_OPEN_ARROW: any
      }
      Animation: {
        BOUNCE: any
        DROP: any
      }
      event: {
        addListener: (instance: any, event: string, handler: () => void) => any
        removeListener: (listener: any) => void
      }
    }
  }
}

