import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import OpenAI from 'openai';

const OPENAI_API_KEY = 'API_KEY';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function getLocation() {
  const response = await fetch("https://ipapi.co/json/");
  const locationData = await response.json();
  return locationData;
}

async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}

const RecommendationModal = () => {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [map, setMap] = useState(null);

  const tools = [
    {
      type: "function",
      function: {
        name: "getCurrentWeather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            latitude: {
              type: "string",
            },
            longitude: {
              type: "string",
            },
          },
          required: ["longitude", "latitude"],
        },
      }
    },
    {
      type: "function",
      function: {
        name: "getLocation",
        description: "Get the user's current location based on their IP address",
        parameters: {
          type: "object",
          properties: {},
        },
      }
    },
  ];

  const availableTools = {
    getCurrentWeather,
    getLocation,
  };

  useEffect(() => {
    const fetchData = async () => {
      const locationData = await getLocation();
      setCurrentLocation(locationData);
      const weatherData = await getCurrentWeather(locationData.latitude, locationData.longitude);
      setCurrentWeather(weatherData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (open && map === null) {
      const timeout = setTimeout(() => {
        initializeMap();
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [open, map]);

  const initializeMap = () => {
    if (!currentLocation) {
      console.log("Current location is not available yet.");
      return;
    }

    if (typeof google === 'undefined') {
      return;
    }

    const mapCenter = { lat: currentLocation.latitude, lng: currentLocation.longitude };
    const mapElement = document.getElementById('google-map');
    if (!mapElement) {
      console.log("Map element not found.");
      return;
    }

    const mapOptions = {
      center: mapCenter,
      zoom: 10,
    };
    const newMap = new window.google.maps.Map(mapElement, mapOptions);
    setMap(newMap);

    // Add marker for user's current location
    const userMarker = new window.google.maps.Marker({
      position: mapCenter,
      map: newMap,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      },
      label: {
        text: 'You are Here',
        color: 'darkblue'
      }
    });

    
    const restaurantLocations = [
      { lat: currentLocation.latitude + 0.01, lng: currentLocation.longitude + 0.01 },
      { lat: currentLocation.latitude - 0.01, lng: currentLocation.longitude - 0.01 },
      { lat: currentLocation.latitude + 0.04, lng: currentLocation.longitude - 0.04 },
    ];

    const sportsEventLocations = [
      { lat: currentLocation.latitude + 0.015, lng: currentLocation.longitude - 0.015 },
      { lat: currentLocation.latitude - 0.015, lng: currentLocation.longitude + 0.015 },
      { lat: currentLocation.latitude + 0.03, lng: currentLocation.longitude - 0.03 },
    ];

    const concertLocations = [
      { lat: currentLocation.latitude - 0.02, lng: currentLocation.longitude + 0.02 },
      { lat: currentLocation.latitude + 0.02, lng: currentLocation.longitude - 0.02 },
      { lat: currentLocation.latitude - 0.03, lng: currentLocation.longitude + 0.03 },
    ];

    // Add markers for restaurants
    restaurantLocations.forEach((location, index) => {
      new window.google.maps.Marker({
        position: location,
        map: newMap,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        },
        label: {
          text: `Restaurant ${index + 1}`,
          color: 'darkblue'
        }
      });
    });

    // Add markers for sports events
    sportsEventLocations.forEach((location, index) => {
      new window.google.maps.Marker({
        position: location,
        map: newMap,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        },
        label: {
          text: `Sports Event ${index + 1}`,
          color: 'darkred'
        }
      });
    });

    // Add markers for concert events
    concertLocations.forEach((location, index) => {
      new window.google.maps.Marker({
        position: location,
        map: newMap,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png', // Change color to purple
          scaledSize: new window.google.maps.Size(40, 40)
        },
        label: {
          text: `Concert ${index + 1}`,
          color: 'darkpurple' // Change color to dark purple
        }
      });
    });
  };

  const handleClick = async () => {
    setOpen(true);
    const response = await agent(
      "Please suggest some activities based on my current location and the current weather condition."
    );
    setResponse(response);
  };

  const handleClose = () => {
    setOpen(false);
    setMap(null);
    setResponse('');
  };

  const agent = async (userInput) => {
    const messages = [
      {
        role: "user",
        content: userInput,
      },
    ];

    for (let i = 0; i < 5; i++) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: messages,
        tools: tools,
      });

      const { finish_reason, message } = response.choices[0];

      if (finish_reason === "tool_calls" && message.tool_calls) {
        const functionName = message.tool_calls[0].function.name;
        const functionToCall = availableTools[functionName];
        const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
        const functionArgsArr = Object.values(functionArgs);
        const functionResponse = await functionToCall.apply(null, functionArgsArr);

        messages.push({
          role: "function",
          name: functionName,
          content: `
            The result of the last function was this: ${JSON.stringify(
              functionResponse
            )}
          `,
        });

        if (functionName === "getCurrentWeather") {
          if (functionResponse.hourly.apparent_temperature[0] > 20) {
            messages.push({
              role: "system",
              content: `Please suggest top three recommended restaurants, top three sports events, and top three musical concert events for this warm weather.`,
            });
          } else {
            messages.push({
              role: "system",
              content: `Please suggest top three recommended restaurants, top three sports events, and top three musical concert events for this weather.`,
            });
          }
        }
      } else if (finish_reason === "stop") {
        messages.push(message);
        return message.content;
      }
    }
    return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
  };

  const convertCelsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  const sampleOpeningClosingHours = {
    restaurants: [
      { name: "Restaurant 1", openingHours: "10:00 AM - 10:00 PM", daysOpen: "Monday - Sunday" },
      { name: "Restaurant 2", openingHours: "11:00 AM - 11:00 PM", daysOpen: "Monday - Saturday" },
      { name: "Restaurant 3", openingHours: "12:00 PM - 9:00 PM", daysOpen: "Monday - Friday" }
    ],
    sportsEvents: [
      { name: "Sports Event 1", openingHours: "5:00 PM - 10:00 PM", daysOpen: "Friday - Sunday" },
      { name: "Sports Event 2", openingHours: "6:00 PM - 9:00 PM", daysOpen: "Saturday - Sunday" },
      { name: "Sports Event 3", openingHours: "7:00 PM - 11:00 PM", daysOpen: "Thursday - Sunday" }
    ],
    concerts: [
      { name: "Concert 1", openingHours: "7:30 PM - 11:00 PM", daysOpen: "Friday - Sunday" },
      { name: "Concert 2", openingHours: "8:00 PM - 10:30 PM", daysOpen: "Saturday - Sunday" },
      { name: "Concert 3", openingHours: "9:00 PM - 1:00 AM", daysOpen: "Thursday - Saturday" }
    ]
  };

  return (
    <>
      <Button variant="outlined" size="small" color="primary" onClick={handleClick}
      style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
        Recommended For You
      </Button>
      <Modal open={open} onClose={handleClose} >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, height: 700, bgcolor: 'background.paper', boxShadow: 24, p: 4, overflow: 'auto' }}>
          <Typography id="modal-modal-title" variant="h6" component= "h2">Recommended For You</Typography>
          <div
            id="google-map"
            style={{ width: '100%', height: '500px' }} 
          ></div>
          <Typography variant="body1" gutterBottom>
            Current Location: {currentLocation ? `${currentLocation.city}, ${currentLocation.country_name}` : 'Loading...'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Current Weather: {currentWeather ? `${convertCelsiusToFahrenheit(currentWeather.hourly.apparent_temperature[0])}°F` : 'Loading...'}
          </Typography>
          {/* Display recommended restaurants with opening and closing hours */}
          <Typography variant="body1" gutterBottom>Recommended Restaurants:</Typography>
          {sampleOpeningClosingHours.restaurants.map((restaurant, index) => (
            <Typography key={index} variant="body2" gutterBottom>
              {restaurant.name} - {restaurant.openingHours} ({restaurant.daysOpen})
            </Typography>
          ))}
          {/* Similarly, display recommendations for sports events and concerts */}
          <Typography variant="body1" gutterBottom>Recommended Sports Events:</Typography>
          {sampleOpeningClosingHours.sportsEvents.map((event, index) => (
            <Typography key={index} variant="body2" gutterBottom>
              {event.name} - {event.openingHours} ({event.daysOpen})
            </Typography>
          ))}
          <Typography variant="body1" gutterBottom>Recommended Concerts:</Typography>
          {sampleOpeningClosingHours.concerts.map((concert, index) => (
            <Typography key={index} variant="body2" gutterBottom>
              {concert.name} - {concert.openingHours} ({concert.daysOpen})
            </Typography>
          ))}
          {/* TextField for response */}
          <TextField
            fullWidth
            multiline
            rows={10}
            value={response ? response : "Loading Recommendation..."}
            disabled
            variant="outlined"
            sx={{ mt: 2}} 
          />
        </Box>
      </Modal>
    </>
  );
};

export default RecommendationModal;
