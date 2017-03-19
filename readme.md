# Visualization of Estonian cities and towns
This project was made during Udacity's Front End Web Development Nanodegree program. 

## Data generation
Estonian cities data was downloaded from the Statistics Estonia [database](http://pub.stat.ee/px-web.2001/I_Databas/Population/databasetree.asp). Then Google maps API based 'transform_and_geocode_data.js' script was used to add location data.

## Dependencies
This application uses following libraries/servises.

* Google maps API - draws the map and markers.
* Wikipedia API - provides descriptive texts into city marker popups.
* Knockout.js - populates and filters cities list in the sidebar.
* jQuery - used for making AJAX request to the Wikipedia API.
* D3.js - loads json data file. Calculates population color scale.