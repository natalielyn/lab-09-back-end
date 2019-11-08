Code 301 Lab 09 - Advanced Topics
Author: Natalie Alway, Mark Swearingen, David Vloedmen
Version: 1.0.0

Overview
Create a node.js server that connects to APIs that provide weather, events, restaurants, and movie showing information to the City Explorer site.

Getting Started
Fork this repository
Clone it to your computer
In your command line: $ touch .env
Add the following to your .env file and save PORT = 3000 GEOCODE_API_KEY = "[your api goes here]" WEATHER_API_KEY = "[your api goes here]" EVENT_API_KEY = "[your api goes here]"
Confirm that node is installed: $ node -v (if not installed, do so)
To start your server: $ nodemon
Go to city-explorer-code301.netlify.com and enter "http://localhost:3000" in the field. Search for a city and you should see the location and weather information.
Architecture
This is a Node.js server that uses express, dotenv, and cors packages. The server currently references two json data files in order to provide information to the client.

Change Log
11-08-2019 _____ AM - placeholder

11-08-2019 _____ AM - placeholder

11-08-2019 _____ AM - placeholder

Credits and Collaborations
Number and name of feature: Feature #1 ___________
Estimate of time needed to complete:
Start time:
Finish time:
Actual time needed to complete:

Number and name of feature: Feature #2 ___________
Estimate of time needed to complete:
Start time:
Finish time:
Actual time needed to complete:

Number and name of feature: Feature #3 ___________
Estimate of time needed to complete:
Start time:
Finish time:
Actual time needed to complete:
