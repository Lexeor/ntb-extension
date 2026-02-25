export interface FavItem {
  id: number
  url: string
  name: string
}

export interface ModuleSettings {
  visible: boolean
}

export interface Settings {
  modules: {
    search: ModuleSettings
    clock: ModuleSettings
    favourites: ModuleSettings
    weather: ModuleSettings
  }
  colors: string[]
}

export interface WeatherData {
  name: string
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  weather: Array<{
    main: string
    icon: string
    description: string
  }>
  main: {
    temp: number
    humidity: number
  }
  wind: {
    speed: number
  }
  rain?: {
    '1h': number
  }
  received: string
}
