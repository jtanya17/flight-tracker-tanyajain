# Flight Tracker
This application is part of a job application.

A real-time aviation data tracking application built using React and TypeScript, leveraging [OpenSky Network's REST API](https://openskynetwork.github.io/opensky-api/rest.html). 

<img width="1431" alt="Screenshot 2023-07-22 at 11 00 53 PM" src="https://github.com/jtanya17/flight-tracker-tanyajain/assets/72416398/6b3e5dc4-ee99-4038-8817-2bfc8d73d18c">

# Installation

# Clone the repository
```git clone https://github.com/jtanya17/flight-tracker-tanyajain.git```

# Navigate to the directory
```cd flight-tracker-tanyajain```

# Install dependencies
```npm install```

# Start the project
```npm run dev```

The application is built on [Vite](https://vitejs.dev/) and is available on Port 5173.

_Note: Please make sure to use your OpenSky account credentials to access the application. These details can be added to the "opensky-service.tsx" file._

# Usage
This application provides real-time aviation data tracking. Once authorized with OpenSky credentials, the user can visualize the real-time position of aircraft on the map and access relevant flight data.

# Features
1. The application leverages the [Mapbox API](https://docs.mapbox.com/mapbox-gl-js/guides/) to provide a fully interactive map spanning the entire webpage.
2. The map supports zooming in and out and can locate the user's current location.
3. The map displays the real-time positions of aircraft. The aircraft icons are rotated in the direction they are headed.
4. Clicking an aircraft icon presents a pop-up with the country of origin and the ICAO24 Code, a unique identifier for each aircraft.
5. An information box at the bottom left of the page provides real-time insights and data for various flights.

# Challenges
1. Working within the API access limit of 80 minutes for registered users of the OpenSky Network.
2. Managing dependency versions.
3. Handling JSX constructor calls in React.

# Future Optimizations
1. Plan to integrate flight-specific information between the aircraft icons on the map and the data box at the bottom of the page, currently they are mutually exclusive functionalities on the application.
2. Improve the user interface to make it more intuitive and information-rich.
3. The potential addition of a landing page.
