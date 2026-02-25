import { createContext, useState, useContext, ReactNode } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import type { FavItem } from '../types'

interface ExtensionContextType {
  theme: string
  favs: FavItem[]
  editedFavObj: FavItem | undefined
  addToFavourites: (fav: FavItem) => void
  removeFromFavourites: (id: number) => void
  updateFavouritesItem: (fav: FavItem) => void
  addEditedObject: (fav: FavItem) => void
}

const ExtensionContext = createContext<ExtensionContextType | undefined>(undefined)

function ExtensionContextProvider({ children }: { children: ReactNode }) {
  const [theme] = useLocalStorage<string>('theme', 'light')
  const [editedFavObj, setEditedFavObj] = useState<FavItem | undefined>()
  const [favs, setFavs] = useLocalStorage<FavItem[]>('favourites', [])

  function addToFavourites(favObj: FavItem) {
    setFavs([...favs, favObj])
  }

  function removeFromFavourites(favId: number) {
    setFavs(favs.filter((fav) => fav.id !== favId))
  }

  function updateFavouritesItem(favObj: FavItem) {
    setEditedFavObj(undefined)
    setFavs(favs.map((fav) => (fav.id === favObj.id ? favObj : fav)))
  }

  function addEditedObject(obj: FavItem) {
    setEditedFavObj(obj)
  }

  return (
    <ExtensionContext.Provider
      value={{
        theme,
        favs,
        editedFavObj,
        addToFavourites,
        removeFromFavourites,
        updateFavouritesItem,
        addEditedObject,
      }}
    >
      {children}
    </ExtensionContext.Provider>
  )
}

function useExtensionContext(): ExtensionContextType {
  const context = useContext(ExtensionContext)
  if (!context) throw new Error('useExtensionContext must be used within ExtensionContextProvider')
  return context
}

export { ExtensionContextProvider, ExtensionContext, useExtensionContext }
