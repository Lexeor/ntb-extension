import { useState } from 'react'
import { getCompactLabel } from '../utils'
import { useExtensionContext } from './extensionContext'

interface FavouritesItemProps {
  id: number
  url: string
  name: string
  switchPopup: () => void
}

function FavouritesItem({ id, url, name, switchPopup }: FavouritesItemProps) {
  const context = useExtensionContext()
  const [showSettingsButton, setShowSettingsButton] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)

  function handleMouseEnter() {
    if (!showSettingsMenu) setShowSettingsButton(true)
  }

  function handleMouseLeave() {
    setShowSettingsButton(false)
    setShowSettingsMenu(false)
  }

  function handleSettingsClick() {
    setShowSettingsMenu((prev) => !prev)
    setShowSettingsButton(false)
  }

  function handleEdit() {
    context.addEditedObject({ id, url, name })
    switchPopup()
  }

  function handleRemove() {
    context.removeFromFavourites(id)
  }

  return (
    <div className="fav-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={`fav-item-menu${!showSettingsMenu ? ' hidden' : ''}`}>
        <button className="btn-fav-item-menu" onClick={handleEdit}>
          <i className="ri-pencil-line" />
          <span>Edit</span>
        </button>
        <button className="btn-fav-item-menu" onClick={handleRemove}>
          <i className="ri-delete-bin-2-line" />
          <span>Remove</span>
        </button>
      </div>
      <button
        className={`btn-fav-settings${!showSettingsButton ? ' hidden' : ''}`}
        onClick={handleSettingsClick}
      >
        <i className="ri-more-2-fill" />
      </button>
      <a href={url}>
        <span className={`favourites-card${showSettingsMenu ? ' blurred' : ''}`}>
          <img
            src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`}
            alt={name}
          />
          <p>{getCompactLabel(name)}</p>
        </span>
      </a>
    </div>
  )
}

export default FavouritesItem
