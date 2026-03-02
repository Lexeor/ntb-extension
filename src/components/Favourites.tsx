import { useExtensionContext } from './extensionContext';
import FavouritesItem from './FavouritesItem';

interface FavouritesProps {
  switchPopup: () => void;
}

function Favourites({ switchPopup }: FavouritesProps) {
  const { favs } = useExtensionContext();

  return (
    <div className="favourites-container">
      {favs.map((fav) => (
        <FavouritesItem
          key={fav.id}
          id={fav.id}
          url={fav.url}
          name={fav.name}
          switchPopup={switchPopup}
        />
      ))}
      <button className="btn-new-fav" onClick={switchPopup}>
        <span className="favourites-card new">
          <i className="ri-add-line" />
        </span>
      </button>
    </div>
  );
}

export default Favourites;
