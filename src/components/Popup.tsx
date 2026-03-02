import { useEffect, useRef } from 'react';
import { useExtensionContext } from './extensionContext';

interface PopupProps {
  isPopupShowed: boolean;
  switchPopup: () => void;
}

function Popup({ isPopupShowed, switchPopup }: PopupProps) {
  const inputUrl = useRef<HTMLInputElement>(null);
  const inputName = useRef<HTMLInputElement>(null);
  const context = useExtensionContext();

  useEffect(() => {
    if (context.editedFavObj && inputName.current && inputUrl.current) {
      inputName.current.value = context.editedFavObj.name;
      inputUrl.current.value = context.editedFavObj.url;
    }
  }, [context.editedFavObj]);

  function cleanInputs() {
    if (inputName.current) inputName.current.value = '';
    if (inputUrl.current) inputUrl.current.value = '';
  }

  function handleCancel() {
    switchPopup();
    cleanInputs();
  }

  function handleOk() {
    if (!inputUrl.current || !inputName.current) return;

    if (!context.editedFavObj) {
      const favId = context.favs.length > 0 ? context.favs[context.favs.length - 1].id + 1 : 1;
      context.addToFavourites({
        id: favId,
        url: inputUrl.current.value,
        name: inputName.current.value,
      });
    } else {
      context.updateFavouritesItem({
        id: context.editedFavObj.id,
        url: inputUrl.current.value,
        name: inputName.current.value,
      });
    }

    switchPopup();
    cleanInputs();
  }

  const header = context.editedFavObj
    ? `Editing "${context.editedFavObj.name}"`
    : 'Create new item';

  return (
    <div className={`popup-fade${!isPopupShowed ? ' hidden' : ''}`}>
      <div className="popup-container">
        <div className="popup-header">{header}</div>
        <div className="popup-body">
          <label htmlFor="popup-url">URL</label>
          <input
            ref={inputUrl}
            type="text"
            className="popup-input"
            id="popup-url"
            autoComplete="off"
          />
          <label htmlFor="popup-name">Description</label>
          <input
            ref={inputName}
            type="text"
            className="popup-input"
            id="popup-name"
            autoComplete="off"
          />
        </div>
        <div className="popup-controls">
          <button className="popup-button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="popup-button" onClick={handleOk}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
