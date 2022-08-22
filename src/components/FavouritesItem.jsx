import React, { useState, useContext } from 'react';
import {getCompactLabel} from '../utils';
import {ExtensionContext} from './extensionContext';

function FavouritesItem(props) {
    const context = useContext(ExtensionContext);
    const [showSettingsButton, setShowSettingsButton] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    function handleMouseEnter() {
        if(!showSettingsMenu)
            setShowSettingsButton(true);
    }

    function handleMouseLeave() {
        setShowSettingsButton(false);
        setShowSettingsMenu(false);
    }

    function handleSettingsClick() {
        //console.log('settings click');
        setShowSettingsMenu(prev => !prev);
        setShowSettingsButton(false);
    }

    function handleEdit() {
        context.addEditedObject({id: props.id, url: props.url, name: props.name});
        console.log('fav object saved');
        props.switchPopup();
    }

    function handleRemove() {
        context.removeFromFavourites(props.id);
    }

    return (
        <div 
            className="fav-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`fav-item-menu ${!showSettingsMenu ? 'hidden' : ''}`}>
                <button className="btn-fav-item-menu" onClick={handleEdit}>
                    <i className="ri-pencil-line"></i>
                    <span>Edit</span>
                </button>
                <button className="btn-fav-item-menu" onClick={handleRemove}>
                    <i className="ri-delete-bin-2-line"></i>
                    <span>Remove</span>
                </button>
            </div>
            <button 
                className={`btn-fav-settings${!showSettingsButton ? ' hidden' : ''}`}
                onClick={handleSettingsClick}
            ><i className="ri-more-2-fill"></i>
            </button>
            <a href={props.url}>
                <span className={`favourites-card${showSettingsMenu ? ' blurred' : ''}`}>
                    <img src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${props.url}&size=256`} />
                    <p>{getCompactLabel(props.name)}</p>
                </span>
            </a>
        </div>
    )
}

export default FavouritesItem