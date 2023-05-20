import React, { useState, useEffect, useContext } from "react";
import FavouritesItem from "./FavouritesItem";
import { ExtensionContext } from "./extensionContext";

function Favourites(props) {
  const context = useContext(ExtensionContext);

  const favComponents =
    context.favs.length > 0
      ? context.favs.map((fav) => {
          return (
            <FavouritesItem
              key={fav.id}
              id={fav.id}
              url={fav.url}
              name={fav.name}
              switchPopup={props.switchPopup}
            />
          );
        })
      : "";

  const favNewItemComponent = (
    <button className="btn-new-fav" onClick={() => props.switchPopup()}>
      <span className="favourites-card new">
        <i className="ri-add-line"></i>
      </span>
    </button>
  );

  return (
    <div className="favourites-container">
      {favComponents}
      {favNewItemComponent}
    </div>
  );
}

export default Favourites;
