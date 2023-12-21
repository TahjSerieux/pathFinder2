import React, { useEffect, useRef, useState } from 'react';
import {useJsApiLoader,Autocomplete } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../Hooks/useAuthContext';
import { useLogout } from '../Hooks/useLogout';
import '../Styles/PathFinderMainPage.css';
import UserPreference from '../Components/UserPreference';
import SearchResult from '../Components/SearchResult';
import FavoriteRoutes from '../Components/FavoriteRoutes';

import '../Styles/UserPreference.css';

const PathFinderMainPage = () => {
  const {user} = useAuthContext();

  const {logout} = useLogout();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });
/**Boolean for deciding if you want the map to Render
 * TO BE REMOVED IN FINAL PRODUCT
 */
  const [showMap, setShowMap] = useState(true);
/**Booleand for deciding if you want to show the origin and destination picker */
  const [showDestinationPicker, setShoeDestinationPicker] = useState(false);
  /**Holds the geolocation(latitiude and longiutude), for the user current location, if it can be found */
  const [location, setLocation] = useState(null);
  /**Holds the google maps object of type window.google.maps.Maps */
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
/**Boolean fo showing if the users current location is being located */
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
/**Holds the value for the distance of the route */
  const [distance, setDistance] = useState('');
  /**Holds the value for the duration in minutes fior a route */
  const [duration, setDuration] = useState('');
/**Google Maps API. Holds the object that will be calculating a route based on origin and destination
 * of @type google.maps.DirectionService
 */
  const [directionService, setDirectionService] = useState(/** @type google.maps.DirectionsService */ (null));
  /**Google Maps API. Holds the object that will be used to render the original route to the map. 
   * of @type window.google.maps.DirectionRenderer
   */
  const [directionRenderer, setDirectionRenderer] = useState(/** @type google.maps.DirectionsRenderer */(null));

  // const [directionRenderForCalculatedRoutes, setDirectionRenderForCalculatedRoutes] = useState(/** @type {Array<google.maps.DirectionsRenderer>}  */[]);

  const [directionsArray, setDirectionsArray] = useState([]);
  const [nodesAlongRoute, setNodesAlongRoute] = useState([]);
  const [pickRoute, setPickRoute] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  /**Holds the lng lat object array for each route */
  const [calculatedRouteWaypoints, setCalculatedRouteWaypoints] = useState([]);

  /**Routes generated from the way points calculated fro the ML api */
  const [generatedRoutes, setGeneratedRoutes] = useState([])

  const [selectedLocations, setSelectedLocations] = useState([])


  const [searchBarValueM, setSearchBarValueM] = useState([]);

  const [searchBarValue, setSearchBarValue] = useState([]);
  const [radiusValue, setRadiusValue] = useState(5000);
  const [endPointsArray, setEndPointsArray] = useState([]);
  const [endPointsDestinationArray, setEndPointsDestinationArray] = useState([]);
const [tabView, setTabView] = useState('EndPoint');
  const [radius, setradius] = useState();
  const [favoriteRoutesArray,setFavoriteRoutesArray] = useState([]);
  
const [midwayPointsArray, setMidwayPointsArray] = useState([])
const [midwayPointsDestinationArray, setMidwayPointsDestinationArray] = useState([])

const [originalRoute, setOriginalRoute] = useState(null)
/**Is a reference to the div that will be containting the map */
  const mapDivRef = useRef(null)
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef(null)
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef()
const [userPrice, setUserPrice] = useState({min_price:0, max_price:4})
const [UserPreferenceValues, setUserPreferenceValues] = useState();
  const handleWhereToButtonClick = () => {
    setShoeDestinationPicker(!showDestinationPicker);
  };

  const center = { lat: 40.7678, lng: -73.9645 };

  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsGettingCurrentLocation(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          // console.log(`Location is lat: ${position.coords.latitude} lng:${position.coords.longitude} `)
          setIsGettingCurrentLocation(false);
        },
        (error) => {
          setIsGettingCurrentLocation(false);
        }
      );
    } else {
      console.log('Error: Geolocation is not supported');
    }
    
    
  }, []);
  
useEffect(()=>{
  
  if(isLoaded && showMap)
  {
    const mapOptions = {
        zoom:14,
        center:location ||{ lat: 40.748817, lng: -73.9857 },
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ]
    }
    const newMap = new window.google.maps.Map(mapDivRef.current, mapOptions)
    setMap(newMap)

    setDirectionService(new window.google.maps.DirectionsService());
    setDirectionRenderer(new window.google.maps.DirectionsRenderer());
  
     
    

  }
  
},[isLoaded,showMap,location])

// Calculate and display the route between origin and destination
const newCalculateRoute = () =>{
  setDistance(null)
  setDuration(null)
  directionRenderer.setMap(null)
  setDirectionsArray([])
  setNodesAlongRoute([])
  if(!originRef.current.value || !destinationRef.current.value){
    alert('Both fields must be filled');
  };
  const origin = originRef.current.value;
  const destination = destinationRef.current.value;
  const request = {
    origin,
    destination,
    travelMode: 'DRIVING'
  };
  directionService.route(request,(result, status)=>{
    if(status === 'OK'){
      directionRenderer.setMap(map)
      directionRenderer.setDirections(result)
      setDistance(result.routes[0].legs[0].distance.text);
      setDuration(result.routes[0].legs[0].duration.text);
      setDirectionsArray([result])
      fetchNodesAlongRoute(result)
      // console.log(directionsArray)

    };

  }) 

};
  // Clear the route and related information
const newClearRoute = () =>{
  originRef.current.value = '';
  destinationRef.current.value = '';
  setDistance(null);
  setDuration(null);
  directionRenderer.setMap(null);
  setDirectionsArray([]);
  setNodesAlongRoute([]);
  setGeneratedRoutes([]);

};

const addWaypoint = () =>{
  const wayPoint = {location:{lat:40.7484, lng:-73.985428}, stopover:true}
  if(!originRef.current.value || !destinationRef.current.value){
    alert('Both fields must be filled');
  };
  const origin = originRef.current.value;
  const destination = destinationRef.current.value;
  const request = {
    origin,
    destination,
    travelMode: 'DRIVING',
    waypoints: [wayPoint]
  };
  directionService.route(request,(result, status)=>{
    if(status === 'OK'){
      directionRenderer.setMap(map)
      directionRenderer.setDirections(result)
      setDistance(result.routes[0].legs[0].distance.text);
      setDuration(result.routes[0].legs[0].duration.text);
      setDirectionsArray((array)=>[...array,result])
      setGeneratedRoutes((array)=>[...array,directionsArray[0],result])
      // setCalculatedRouteWaypoints([])
      console.log(directionsArray)

    };

  }) 
}
const toggleRoutes = ()=>{
 if(directionsArray.length>1){ 
    directionRenderer.setDirections(directionsArray[pickRoute]);
    // console.log(pickRoute,directionsArray.length)
    setPickRoute((index)=> ((index +1)%directionsArray.length));
  }
}
const fetchNodesAlongRoute = (directionRouteResult) =>{

    // Calculate the marker interval (every 5th of the route)
    let nodeResultArray = []
    const routePath = directionRouteResult.routes[0].overview_path;
    const totalDistance = window.google.maps.geometry.spherical.computeLength(routePath);
    const markerIntervalMeters = totalDistance / 4;
  
    let remainingDistance = markerIntervalMeters;
    let markerCount = 0;
  
    for (let i = 0; i < routePath.length - 1; i++) {
      const startPoint = routePath[i];
      const endPoint = routePath[i + 1];
      const segmentDistance = window.google.maps.geometry.spherical.computeDistanceBetween(startPoint, endPoint);
  
      if (segmentDistance < remainingDistance) {
        remainingDistance -= segmentDistance;
      } else {
        // Calculate the position of the marker along the current segment
        const fraction = remainingDistance / segmentDistance;
        const markerPosition = new window.google.maps.LatLng(
          startPoint.lat() + fraction * (endPoint.lat() - startPoint.lat()),
          startPoint.lng() + fraction * (endPoint.lng() - startPoint.lng())
        );
  
        // Place a marker at the markerPosition
        // new window.google.maps.Marker({
        //   position: markerPosition,
        //   map: map,
        //   title: 'Marker',
        // });
        
        // const geoPoint = {lng:markerPosition.lng(), lat:markerPosition.lat()}
        // setTestWaypoints(prev => prev.concat(geoPoint))
        const waypoint = {key: markerCount,lat:markerPosition.lat(), lng:markerPosition.lng()};
        console.log(waypoint)
        nodeResultArray.push(waypoint)
        setNodesAlongRoute((nodeArray)=> [...nodeArray,waypoint]);
        // console.log(`Marker ${markerCount+ 1 } - Position: lat: ${markerPosition.lat()}, lng: ${markerPosition.lng()}`);
        markerCount++;
  
        // Move to the next marker interval
        remainingDistance = markerIntervalMeters - segmentDistance + remainingDistance;
      }
    }
    // setNodesAlongRoute((nodeArray)=>nodeArray.slice(0,-1))
    return(nodeResultArray)
};
useEffect(()=>{
  console.log(selectedLocations);

},[selectedLocations])
const generateRoutesForUser = async()=>{
  setIsLoading(true);
  console.log("selectedLocations.length: ",selectedLocations.length)

  if(selectedLocations.length === 0){
    alert('Please chooose a location');
  }else{
    // console.log("selectedLocations: ", selectedLocations);
  // console.log(nodesAlongRoute);
    setCalculatedRouteWaypoints([]);
    setGeneratedRoutes([]);
    setDistance(``);
    setDuration(``);
  //   //URL to be changbed 
    let results = await fetch('http://localhost:3002/EndPoint_finder',{
          method:"POST",
          headers:{'Content-Type': 'application/json'},
          body:JSON.stringify({
            cordinates: [
                location.lat,location.lng
            ],
            keywords: searchBarValue,
            radius:5000,
            max_price:4,
            min_price:1
        })
      } 
    )

    results = await results.json();
    // console.log(results)
    /**This Calculates a route for each set of waypoints from the api */
    //Get the origin coordinates
    const origin = originRef.current.value;
    //get the destination coordinates
    const destination = destinationRef.current.value;
    //results.routeWayPoints is subject to change
    // setCalculatedRouteWaypoints(results.routeWayPoints);
     //For each array of waypoints
    // console.log(results)
    // console.log(results.results)
     setGeneratedRoutes((prev)=>[...prev,directionsArray[0]]);
     results.results.forEach((waypoint)=>{
      let stopoverWaypoints = []
      //creates a waypoint object and saves it to an array 
          stopoverWaypoints.push({location:waypoint, stopover:true});
          setCalculatedRouteWaypoints((prev)=>[...prev,waypoint] )
          // They way Wu is setting up the list is causing the python server to crash
          // console.log({location:waypoint, stopover:true})
          //create the DirectionService request object
      const request = {
        origin,
        destination,
        travelMode: 'DRIVING',
        waypoints:stopoverWaypoints,
        optimizeWaypoints: true
      };
      //Uses the directionService.route to generate a route and saves it to generated route
      directionService.route(request, (result,status) =>{
        if(status === 'OK')
        {console.log("OK")
          setGeneratedRoutes((prev)=>[...prev,result]);

        }
        else{
          alert(status);
        }
      })
          
    })
    
  }
  setIsLoading(false);
};
const selectRoute = (routeIndex)=>{
  console.log(calculatedRouteWaypoints);
  directionRenderer.setDirections(generatedRoutes[routeIndex]);
  let totalDistance = 0;
  let totalDuration = 0;

  generatedRoutes[routeIndex].routes[0].legs.forEach((leg)=>{
    totalDistance += leg.distance.value
    totalDuration += leg.duration.value
  })
  const totalDistanceInMiles = (totalDistance * 0.000621371).toFixed(2);
   // Convert the total duration to hours or minutes as needed
   let formattedDuration;
   if (totalDuration < 3600) {
     // If the total duration is less than an hour, show it in minutes
     const minutes = Math.floor(totalDuration / 60);
     formattedDuration = `${minutes} minutes`;
   } else {
     // Otherwise, show it in hours
     const hours = Math.floor(totalDuration / 3600);
     const minutes = Math.floor((totalDuration % 3600) / 60);
     formattedDuration = `${hours} hours ${minutes} minutes`;
   }
  setDistance(`${totalDistanceInMiles}: miles`);
  setDuration(formattedDuration);

}
const callML = async() =>{

  fetch('http://localhost:5000/POI',{
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify({
      cordinates: [
          {
              lat: 40.728728,
              lng: -73.982614
          },
          {
              lat: 40.767867,
              lng: -73.964271
          },
          {
              lat: 40.710601,
              lng: -73.960901
          }
      ],
      keywords: ["Cafe"]
  } )
  })
  .then(result => result.json())
  .then(data => {
    data.forEach((object)=>{
      console.log(object)
    })
  })
  
}
const saveWaypoint = async(waypoint) =>{
  console.log(waypoint)
  // const origin = originRef.current.value;
  // const destination = destinationRef.current.value;
  // const route = {origin, waypoint, destination}
  // const token = localStorage.getItem('user-token')
  // console.log(user.returnJWT)
  // const response = await fetch('http://localhost:8001/user/info/save-waypoint',
  //   {
  //     method:"POST",
  //     headers:{'Content-Type': 'application/json','Authorization': `Bearer ${user.returnJWT}`},
  //     body:JSON.stringify({route})
  //   } 
  // )
  // const result = await response.json();
  // if(response.ok){
  //   alert(result.mssg);
  // }else{
  //   alert()
  // }

  
}
const getSavedRoutes = async()=>{
  setIsLoading(true)
  setFavoriteRoutesArray([])
  const response = await fetch('http://localhost:8001/user/info/get-saved-waypoints',
  {
      method:"POST",
      headers:{'Content-Type': 'application/json','Authorization': `Bearer ${user.returnJWT}`},
      
    } 
  )
  const data =  await response.json();
  // console.log(data)
  setFavoriteRoutesArray(data.savedWaypoints)
  setIsLoading(false)
  
}
const generateRoutesForUser2 = async()=>{
  setIsLoading(true);

  if(selectedLocations.length === 0){
    alert('Please chooose a location');
  }else{
    // console.log("selectedLocations: ", selectedLocations);
  // console.log(nodesAlongRoute);
    setCalculatedRouteWaypoints([]);
    setGeneratedRoutes([]);
    setDistance(``);
    setDuration(``);
  //   //URL to be changbed 
    let results = await fetch('http://localhost:3002/EndPoint_finder',{
          method:"POST",
          headers:{'Content-Type': 'application/json'},
          body:JSON.stringify({
            cordinates: [
                location.lat,location.lng
            ],
            keywords: selectedLocations,
            radius:5000,
            max_price:3,
            min_price:1
        })
      } 
    )

    results = await results.json();
    // console.log(results)
    /**This Calculates a route for each set of waypoints from the api */
    //Get the origin coordinates
    const origin = originRef.current.value;
    //get the destination coordinates
    const destination = destinationRef.current.value;
    //results.routeWayPoints is subject to change
    // setCalculatedRouteWaypoints(results.routeWayPoints);
     //For each array of waypoints
    // console.log(results)
    // console.log(results.results)
     setGeneratedRoutes((prev)=>[...prev,directionsArray[0]]);
     results.results.forEach((destinationO)=>{
      const curDest = destinationO.address
      //creates a waypoint object and saves it to an array 
          // stopoverWaypoints.push({location:waypoint, stopover:true});
          // setCalculatedRouteWaypoints((prev)=>[...prev,waypoint] )
          // They way Wu is setting up the list is causing the python server to crash
          // console.log({location:waypoint, stopover:true})
          //create the DirectionService request object
      const request = {
        origin,
        destination: destinationO.address,
        travelMode: 'DRIVING',
      };
      //Uses the directionService.route to generate a route and saves it to generated route
      directionService.route(request, (result,status) =>{
        if(status === 'OK')
        {console.log("OK")
          setGeneratedRoutes((prev)=>[...prev,result]);

        }
        else{
          alert(status);
        }
      })
          
    })
    
  }
  setIsLoading(false);
};

const findEndPoint = async() => {
    // console.log(searchBarValue);
    // console.log(tabView)
  setIsLoading(true);
  // console.log(location)
  if(!location){
    alert("Cannot determine user location, please allow location in your browser and wait a few seconds");
  }else if(searchBarValue.length == 0){
    alert("Please enter keyword")
  }else{
    setCalculatedRouteWaypoints([]);
    setGeneratedRoutes([]);
    setDistance(``);
    setDuration(``);
    setEndPointsArray([])
    setEndPointsDestinationArray([])
  //   //URL to be changbed 
    let result = await fetch('http://localhost:3002/EndPoint_Finder',{
          method:"POST",
          headers:{'Content-Type': 'application/json'},
          body:JSON.stringify({
            cordinates: {lat:location.lat,lng:location.lng},
            keywords: searchBarValue,
            radius:radiusValue,
            max_price:3,
            min_price:1
        })
      } 
    )
    const data = await result.json()
    // console.log(data.results)
    if(data.status === "OK" || data.status === "FEWER_RESULTS"){
      if(data.status === "FEWER_RESULTS"){
        alert("Fewer result than expected")
      }
      setEndPointsArray(data.results);
    // console.log("setEndPointsArray",setEndPointsArray)
      console.log(data)
      const generatedEndpoints = data.results
      const origin = location;
      generatedEndpoints.forEach((endpoint)=>{
        const request = {
          origin,
          destination:endpoint.address,
          travelMode: 'DRIVING',
        };
        directionService.route(request,(result, status)=>{
          if(status === 'OK'){
            directionRenderer.setMap(map)
            // console.log(result)
            setEndPointsDestinationArray(prev=>[...prev,result])
            // console.log(result)
            // setEndPointsArray(prev=>[...prev,result])

            // setDistance(result.routes[0].legs[0].distance.text);
            // setDuration(result.routes[0].legs[0].duration.text);
            // setDirectionsArray((array)=>[...array,result])
            // setGeneratedRoutes((array)=>[...array,directionsArray[0],result])
            // setCalculatedRouteWaypoints([])
            // console.log(endPointsDestinationArray)
      
          };
      
        })

      })
    }else{
      alert('No Results')
    }
    }
  setIsLoading(false);
  // console.log("Length:: ",endPointsDestinationArray[0])

}; 
const selectEndpoint = (routeIndex)=>{
  console.log(endPointsDestinationArray[routeIndex])
  directionRenderer.setDirections(endPointsDestinationArray[routeIndex]);
  let totalDistance = 0;
  let totalDuration = 0;
  // console.log(routeIndex)

  endPointsDestinationArray[routeIndex].routes[0].legs.forEach((leg)=>{
    totalDistance += leg.distance.value
    totalDuration += leg.duration.value
  })
  const totalDistanceInMiles = (totalDistance * 0.000621371).toFixed(2);
   // Convert the total duration to hours or minutes as needed
   let formattedDuration;
   if (totalDuration < 3600) {
     // If the total duration is less than an hour, show it in minutes
     const minutes = Math.floor(totalDuration / 60);
     formattedDuration = `${minutes} minutes`;
   } else {
     // Otherwise, show it in hours
     const hours = Math.floor(totalDuration / 3600);
     const minutes = Math.floor((totalDuration % 3600) / 60);
     formattedDuration = `${hours} hours ${minutes} minutes`;
   }
  setDistance(`${totalDistanceInMiles}: miles`);
  setDuration(formattedDuration);

}
const selectOriginalRoute = ()=>{
  directionRenderer.setMap(map)
  directionRenderer.setDirections(originalRoute);
  let totalDistance = 0;
  let totalDuration = 0;
  // console.log(routeIndex)

  originalRoute.routes[0].legs.forEach((leg)=>{
    totalDistance += leg.distance.value
    totalDuration += leg.duration.value
  })
  const totalDistanceInMiles = (totalDistance * 0.000621371).toFixed(2);
   // Convert the total duration to hours or minutes as needed
   let formattedDuration;
   if (totalDuration < 3600) {
     // If the total duration is less than an hour, show it in minutes
     const minutes = Math.floor(totalDuration / 60);
     formattedDuration = `${minutes} minutes`;
   } else {
     // Otherwise, show it in hours
     const hours = Math.floor(totalDuration / 3600);
     const minutes = Math.floor((totalDuration % 3600) / 60);
     formattedDuration = `${hours} hours ${minutes} minutes`;
   }
  setDistance(`${totalDistanceInMiles}: miles`);
  setDuration(formattedDuration);

}
const selectMidpoint = (routeIndex)=>{
  directionRenderer.setMap(map)
  directionRenderer.setDirections(midwayPointsDestinationArray[routeIndex]);
  let totalDistance = 0;
  let totalDuration = 0;
  // console.log(routeIndex)

  midwayPointsDestinationArray[routeIndex].routes[0].legs.forEach((leg)=>{
    totalDistance += leg.distance.value
    totalDuration += leg.duration.value
  })
  const totalDistanceInMiles = (totalDistance * 0.000621371).toFixed(2);
   // Convert the total duration to hours or minutes as needed
   let formattedDuration;
   if (totalDuration < 3600) {
     // If the total duration is less than an hour, show it in minutes
     const minutes = Math.floor(totalDuration / 60);
     formattedDuration = `${minutes} minutes`;
   } else {
     // Otherwise, show it in hours
     const hours = Math.floor(totalDuration / 3600);
     const minutes = Math.floor((totalDuration % 3600) / 60);
     formattedDuration = `${hours} hours ${minutes} minutes`;
   }
  setDistance(`${totalDistanceInMiles}: miles`);
  setDuration(formattedDuration);

}
const selectFavorites = (routeIndex)=>{
  console.log(favoriteRoutesArray)
  directionRenderer.setMap(map)
  directionRenderer.setDirections(favoriteRoutesArray[routeIndex].route);
  let totalDistance = 0;
  let totalDuration = 0;
  // console.log(routeIndex)

  favoriteRoutesArray[routeIndex].route.routes[0].legs.forEach((leg)=>{
    totalDistance += leg.distance.value
    totalDuration += leg.duration.value
  })
  const totalDistanceInMiles = (totalDistance * 0.000621371).toFixed(2);
   // Convert the total duration to hours or minutes as needed
   let formattedDuration;
   if (totalDuration < 3600) {
     // If the total duration is less than an hour, show it in minutes
     const minutes = Math.floor(totalDuration / 60);
     formattedDuration = `${minutes} minutes`;
   } else {
     // Otherwise, show it in hours
     const hours = Math.floor(totalDuration / 3600);
     const minutes = Math.floor((totalDuration % 3600) / 60);
     formattedDuration = `${hours} hours ${minutes} minutes`;
   }
  setDistance(`${totalDistanceInMiles}: miles`);
  setDuration(formattedDuration);

}
const findMidwayPoint = async() =>{
  setIsLoading(true)
  setDistance(null)
  setDuration(null)
  directionRenderer.setMap(null)
  setDirectionsArray([])
  setNodesAlongRoute([])
  setMidwayPointsArray([])
  setMidwayPointsDestinationArray([])
  let nodeAlongRoute = []
  if(searchBarValue.length == 0){
      alert('Please provide a location type');
      return
    }
  // console.log(originRef, destinationRef)
  if(!originRef.current.value || !destinationRef.current.value){
    alert('Both fields must be filled');
    return
  };
  const origin = originRef.current.value;
  const destination = destinationRef.current.value;
  const request = {
    origin,
    destination,
    travelMode: 'DRIVING'
  };
  directionService.route(request,async(result, status)=>{
    if(status === 'OK'){
      directionRenderer.setMap(map)
      directionRenderer.setDirections(result)
      setDistance(result.routes[0].legs[0].distance.text);
      setDuration(result.routes[0].legs[0].duration.text);
      setDirectionsArray([result])
      nodeAlongRoute = fetchNodesAlongRoute(result)
      setOriginalRoute(result)
      // console.log("lkjhgfdsdfghjk",nodeAlongRoute)
      // console.log(directionsArray)

    };
    console.log("nodre",nodeAlongRoute)
    const cordinates = [
      {lat: nodeAlongRoute[0].lat,lng:nodeAlongRoute[0].lng},
      {lat:nodeAlongRoute[1].lat,lng:nodeAlongRoute[1].lng},
      {lat:nodeAlongRoute[2].lat,lng:nodeAlongRoute[2].lng}
    ]
    console.log('nbgvfdgsdhfjklhgfdsdc',{cordinates,keywords: searchBarValue,
      radius:radiusValue,
      min_price:0,
      max_price:5

    })
  const response = await fetch('http://localhost:3002/WayPoint_Finder',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({cordinates,keywords: searchBarValue,
        radius:radiusValue,
        min_price:0,
        max_price:5

      })
  })
  const data = await response.json()
  if(data.status === "OK" || data.status === "FEWER_RESULTS"){
    const resultArray = data.results
    if(response.ok){
      setMidwayPointsArray(resultArray)
      if(resultArray){
        
        resultArray.forEach((destination)=>{
          let stopoverWaypoints = []
          //creates a waypoint object and saves it to an array 
          stopoverWaypoints.push({location:destination.address, stopover:true});
          const request = {
            origin:originRef.current.value,
            destination:destinationRef.current.value,
            travelMode: 'DRIVING',
            waypoints:stopoverWaypoints,
            optimizeWaypoints: true
          };
          directionService.route(request, (result,status) =>{
            if(status === 'OK')
            {console.log("OK")
              setMidwayPointsDestinationArray((prev)=>[...prev,result]);

            }
          })
        })
      }
    }

  setIsLoading(false)

  }else{
    
  }
  
  
} ) 
setIsLoading(false)
  
}
const saveRoute = async(route, endPointInfo) =>{
  console.log("HERE: ",route, endPointInfo)
  // console.log(user.returnJWT)
  const response = await fetch('http://localhost:8001/user/info/save-waypoint',{
    method:'POST',
    headers:{'Content-Type': 'application/json','Authorization': `Bearer ${user.returnJWT}`},
    body: JSON.stringify({route, endPointInfo})
  });
  const data = await response.json();
  alert(data.mssg);
  console.log(data)
  if(favoriteRoutesArray){
    setFavoriteRoutesArray(prev=>[...prev,{route, endPointInfo}])

  }else{
    setFavoriteRoutesArray([{route, endPointInfo}])
  }
}
const deleteRoute = async(index) =>{
  const response = await fetch('http://localhost:8001/user/info/delete-route',{
    method:'DELETE',
    headers:{'Content-Type': 'application/json','Authorization': `Bearer ${user.returnJWT}`},
    body:JSON.stringify({index})
  })
  const data = await response.json()
  alert(data.mssg)
  // setFavoriteRoutesArray([])
  if(response.ok){
    console.log(data.mssg === "successfully deleted",data.mssg)
    if(data.mssg === "successfully deleted"){
      if(favoriteRoutesArray){
        console.log("THIS IS THE ARRAYBefore",favoriteRoutesArray)
        const array = favoriteRoutesArray.filter((_,currentIndex)=> currentIndex != index)
        console.log("THIS IS THE ARRAY",array)
        setFavoriteRoutesArray(array)
    
      }
      return(true)
    }else{
      return(false)
    }
  }
}
const [selectedOption, setSelectedOption] = useState('Endpoint'); // Initial state

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };
useEffect(()=>{
  console.log(midwayPointsDestinationArray,midwayPointsArray)
  console.log(midwayPointsDestinationArray.length)
  if(midwayPointsArray){
    console.log("HERE", midwayPointsArray[0])
  }
},[midwayPointsArray,midwayPointsDestinationArray])
return (
    <div className="PathFinderMapPage">
      {isGettingCurrentLocation ? <div className="getting-current-location">Getting Current Location...</div> : null}
      {isLoading ? <div className="getting-current-location">Loading...</div> : null}
      {/* <button onClick={() => setShowMap(!showMap)}>Render Map</button> */}
      {isLoaded ? ( 
        <div className="path-finder">
          <div className="main-container" ref={mapDivRef}></div>

          <div className="destination-calculator">
            <div className="destination-calculator-header-buttons">
              <label className="where-to-button" htmlFor="Where To?" onClick={handleWhereToButtonClick}>
                Where To?
              </label>
              {user? <label htmlFor="" onClick={()=>logout()}>Logout</label> : <Link to="/user/login"> Login </Link> }
            </div>
            {showDestinationPicker ? ( <div className="DestinationPicker">
                <Autocomplete>
                    <input ref={originRef} type="text" name="" id="" placeholder="Choose a starting location..."  />
                </Autocomplete>
                <Autocomplete>
                    <input ref={destinationRef} type="text" name="" id="" placeholder="Choose a destination..."  />
                </Autocomplete>
            </div>): null}
             {/* <div className="customize-trip"></div> */}
             <div className='timing'> 
                <label className="distination" htmlFor="">Duration: {duration} </label>
                <label className="distination" htmlFor="">Distance: {distance} </label>
                </div>
                <div className='routes'>
                {/* <button className="routebuttons" onClick={() => map.panTo(center)}>Reset</button> */}
                <button className="routebuttons"  onClick={() => getSavedRoutes()}>Console</button>
                {/* <button onClick={getLocation}>location</button> */}
                <button className="routebuttons" onClick={()=>newCalculateRoute()}>Calculate Route</button>
                <button className="routebuttons" >Try Again</button>
                <button className="routebuttons"  onClick={()=> newClearRoute()}>Clear Route</button>
                {/* <button className="routebuttons"  onClick={()=> addWaypoint()}>Add Waypoint Route</button> */}
                <button className="routebuttons"  onClick={()=> generateRoutesForUser2()}>Find Routes</button>
                {/* <button className="routebuttons"  onClick={()=>callML()}>Call ML</button> */}
                {/* <button className="routebuttons"  onClick={()=>toggleRoutes()}>Toggle routes</button> */}
                </div>
                                {/* {nodesAlongRoute.map((object) => (
                  <label key={object.id}>Lat: {object.lat}, Lng: {object.lng}</label>
                ))} */}
                {/* <button onClick={createAlbanyRoute}>Creare Albany Route</button> */}
                <div>
                {/* <p>Selected Option: {selectedOption}</p> */}

            <label>
                <input
                    type="radio"
                    value="Endpoint"
                    checked={selectedOption === 'Endpoint'}
                    onChange={handleOptionChange}
                />
                Endpoint
            </label>
            <label>
                <input
                    type="radio"
                    value="Midpoint"
                    checked={selectedOption === 'Midpoint'}
                    onChange={handleOptionChange}
                />
                Midpoint
            </label>
            <label>
                <input
                    type="radio"
                    value="Favorite"
                    checked={selectedOption === 'Favorite'}
                    onChange={handleOptionChange}
                />
                Favorite
            </label>

            {/* Display the selected option */}
            <p>Selected Option: {selectedOption}</p>
        </div>
                {selectedOption === "Endpoint" && endPointsDestinationArray.length>0 && 
                  <div className="display-generated-routes">{
                    endPointsDestinationArray.map((route,index) =>{
                      // console.log(endPointsArray[index],"HERERERE")
                      if(endPointsArray[index]){
                        // console.log(endPointsArray[index])
                        // return <div key={index}>"Full"</div>
                        return <SearchResult isMidPointSearchResult={false} saveRoute={()=>saveRoute(endPointsDestinationArray[index], endPointsArray[index])} onClickFunction = {()=>selectEndpoint(index)} endPoint={endPointsArray[index]} />
                      }else{
                        return <div key={index}>"EMPTY"</div> 
                      }
                    
                      }
                    )
                  }
                  </div>
                }
                {selectedOption === "Favorite" && favoriteRoutesArray && (
                    <div>
                        {/* <label htmlFor="">Favorites</label> */}
                        <div className="display-generated-routes">
                            {favoriteRoutesArray.map((route, index) => (
                                <FavoriteRoutes key={index} favoriteRoutesArray={favoriteRoutesArray} index={index} onClickFunction = {()=>selectFavorites(index)} routeInfo={route.endPointInfo} setFavoriteRoutesArray={()=>setFavoriteRoutesArray()} deleteRoute={()=>deleteRoute(index)} />
                            ))}
                        </div>
                        {/* FavoriteRoutes */}
                    </div>
                )}
                {selectedOption === "Midpoint" && generatedRoutes && (
                    <div className="display-generated-routes">
                        {originRef.current.value && destinationRef.current.value && <div style={{ display: 'flex', flexDirection: 'column', border: '2px solid black', borderRadius: '10px', marginBottom:'4px' }} onClick={() => selectOriginalRoute()}>
                          <label htmlFor="">{/* Add your content for the first label here */}Original Route</label>
                          <label htmlFor="">{originRef.current.value} - {destinationRef.current.value}</label>
                        </div>}
                        {midwayPointsDestinationArray.map((route, index) => {
                          return <SearchResult isMidPointSearchResult={true} saveRoute={()=>saveRoute(midwayPointsDestinationArray[index], midwayPointsArray[index])}  onClickFunction = {()=>selectMidpoint(index)} midPoint={midwayPointsArray[index]}/>
                        })}
                    </div>
                )}

                <UserPreference  selectedOption={selectedOption} setUserPrice={()=>setUserPrice()}searchBarValue={searchBarValue} getSavedRoutes={()=>getSavedRoutes()} setTabView={()=>setTabView()} findEndPoint={()=>findEndPoint()} findMidwayPoint={()=>findMidwayPoint()} setRadiusValue={setRadiusValue} setSearchBarValue={setSearchBarValue} setradius={setradius} setSearchBarValueM = {setSearchBarValueM} setSelectedLocations={setSelectedLocations} setUserPreferenceValues={setUserPreferenceValues}/>
            </div>
            
        </div>
      ) : null}
    </div>
  );
};

export default PathFinderMainPage;
 

