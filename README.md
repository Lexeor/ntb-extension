# New tab Chrome browser extension using React.js

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Searchbar for Google and Youtube direct search

Simple applet to direct search in Youtube or Google.
Saving it's state in browser Local storage.

## Background module

Background color mode changes depending on the time of day.

## Weather module

Manually created weather icons.
Data powered by [Openweathermap.org API](https://openweathermap.org/).
How to implement it for everyone's use is still in progress :)

Due to free Openweather license I've decided to store weather data once an hour.
Data syncing thru [Chrome Storage Sync API](https://developer.chrome.com/docs/extensions/reference/storage/) so it's available on any device logged in with Chrome account.

## Favorites module

- Add, edit and remove favorites.
- Data also syncing thru [Chrome Storage Sync API](https://developer.chrome.com/docs/extensions/reference/storage/) so it's available on any device logged in with Chrome account.

## Settings bar

All extension applets can be disabled thru settings bar.
