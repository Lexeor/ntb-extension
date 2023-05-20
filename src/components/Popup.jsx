import React, { useRef, useContext, useEffect } from "react";
import { ExtensionContext } from "./extensionContext";

function Popup(props) {
  const inputUrl = useRef(null);
  const inputName = useRef(null);
  const context = useContext(ExtensionContext);

  function handleCancelClick() {
    props.switchPopup();
    cleanInputs();
  }

  useEffect(() => {
    if (context.editedFavObj) {
      inputName.current.value = context.editedFavObj.name;
      inputUrl.current.value = context.editedFavObj.url;
    }
  }, [context]);

  function handleOkClick() {
    console.log(`edited: ${context.editedFavObj}`);
    if (!context.editedFavObj) {
      console.log(context.favs.length);
      const favId =
        context.favs.length > 0
          ? context.favs[context.favs.length - 1].id + 1
          : 1;
      context.addToFavourites(
        // Object template { id, url, name }
        {
          id: favId,
          url: inputUrl.current.value,
          name: inputName.current.value,
        }
      );
    } else {
      context.updateFavouritesItem({
        id: context.editedFavObj.id,
        url: inputUrl.current.value,
        name: inputName.current.value,
      });
    }
    props.switchPopup();
    cleanInputs();
  }

  function cleanInputs() {
    inputName.current.value = "";
    inputUrl.current.value = "";
  }

  return (
    <div className={`popup-fade${!props.isPopupShowed ? " hidden" : ""}`}>
      <div className="popup-container">
        <div className="popup-header">
          {!context.editedFavObj
            ? "Create new item"
            : `Editing item "${context.editedFavObj.name}"`}
        </div>
        <div className="popup-body">
          <label htmlFor="url">URL</label>
          <input
            ref={inputUrl}
            type="text"
            className="popup-input"
            id="url"
            autoComplete="off"
          ></input>
          <label htmlFor="name">Description</label>
          <input
            ref={inputName}
            type="text"
            className="popup-input"
            id="name"
            autoComplete="off"
          ></input>
        </div>
        <div className="popup-controls">
          <button className="popup-button" onClick={handleCancelClick}>
            Cancel
          </button>
          <button className="popup-button" onClick={handleOkClick}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
