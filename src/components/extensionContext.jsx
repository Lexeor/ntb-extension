import React, { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
const ExtensionContext = React.createContext();

function ExtensionContextProvider(props) {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [editedFavObj, setEditedFavObj] = useState();
  const [favs, setFavs] = useLocalStorage("favourites", []);

  //// Favourites

  // Add / Remove / Update actions
  // Object template { id, url, name }
  function addToFavourites(favObj) {
    const favTemp = favs;
    favTemp.push(favObj);
    setFavs(favTemp);
  }

  function removeFromFavourites(favId) {
    let favsNew = favs.filter((fav) => {
      return fav.id !== favId;
    });
    setFavs(favsNew);
  }

  function updateFavouritesItem(favObj) {
    let favsNew = favs.map((fav) => {
      if (fav.id === favObj.id) {
        return favObj;
      }
      return fav;
    });

    setEditedFavObj(undefined);
    setFavs(favsNew);
  }

  // Edited fav object
  function addEditedObject(obj) {
    setEditedFavObj(obj);
  }

  return (
    <ExtensionContext.Provider
      value={{
        theme,
        favs,
        addToFavourites,
        removeFromFavourites,
        editedFavObj,
        addEditedObject,
        updateFavouritesItem,
      }}
    >
      {props.children}
    </ExtensionContext.Provider>
  );
}

export { ExtensionContextProvider, ExtensionContext };
