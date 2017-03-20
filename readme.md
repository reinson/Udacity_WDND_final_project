# Visualization of Estonian cities and towns
This project was made during Udacity's Front End Web Development Nanodegree program. 

The application is online [here.](https://reinson.github.io/Udacity_WDND_final_project/index.html)


## Data generation
Estonian cities data was downloaded from the Statistics Estonia [database](http://pub.stat.ee/px-web.2001/I_Databas/Population/databasetree.asp). Then Google maps API based 'transform_and_geocode_data.js' script was used to add location data.

## Dependencies
This application uses following libraries/servises.

* Google maps API - draws the map and markers.
* Wikipedia API - provides descriptive texts into city marker popups.
* Knockout.js - populates and filters cities list in the sidebar.
* jQuery - used for making AJAX request to the Wikipedia API.
* D3.js - loads json data file. Calculates population color scale.

## Running the application
A local server must be started to run this project locally. Here are two ways that I have used:

1. Using Python built-in [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html) module.
    * Run `python -m http.server` in the project folder for Python 3.
    * Run `python -m SimpleHTTPServer` in the project folder for Python 2.
2. Run index.html file using PyCharm (or probably any other (JetBrains) IDE). This will also start a local web server and opens the application in a browser window.
    * Open index.html in PyCharm and run it from the menu or by pressing Ctrl+F10.
