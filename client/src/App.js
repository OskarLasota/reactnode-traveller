import React, {useState, useEffect} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl'
import './App.css';
import LogEntryForm from './LogEntryForm';


import { listLogEntries } from './API';


const App = () =>{
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 3
  });

  const getEntries = async() =>{
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() =>{
    getEntries();
  }, []); //leave dependency empty, we dont want it to re run if an instance occurs now, just load once

  const showAddMarkerPopup = (event) => {
    const[longitude, latitude] = event.lngLat;
    setAddEntryLocation({
        latitude,
        longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
    {
      logEntries.map(entry =>(
        <React.Fragment key={entry._id}>
        <Marker
        
        latitude={entry.latitude}
        longitude={entry.longitude}
         >
        <div 
                onClick={() => setShowPopup({
                  //...showPopup, 
                  [entry._id]: true
                })}>
          <img
            className="marker"
            style={{
              height: `${6  * viewport.zoom}px`,
              width: `${6 * viewport.zoom}px`
            }}
            src="http://i.imgur.com/y0G5YTX.png"
            alt="marker"
          />
          </div> 
        </Marker>
        {
          showPopup[entry._id] ? (
            <Popup
            latitude={entry.latitude}
            longitude={entry.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={()=> setShowPopup({})}
            anchor="top" >
              <div className="popup">
                <h3>{entry.title}</h3>
                 <p>{entry.comments}</p>
                  <small>{new Date(entry.visitDate).toLocaleDateString()}</small>
                  {entry.image ? <img src={entry.image} alt={entry.title}/> : null}
              </div>
          </Popup>
          ) : null
        }
        </React.Fragment>
      ))
    };
    {
      addEntryLocation ? (
        <>
               <Marker
                  latitude={addEntryLocation.latitude}
                  longitude={addEntryLocation.longitude}
                  >
                  <div>
                    <img
                      className="marker"
                      style={{
                        height: `${6  * viewport.zoom}px`,
                        width: `${6 * viewport.zoom}px`
                      }}
                      src="http://i.imgur.com/y0G5YTX.png"
                      alt="marker"
                    />
                    </div> 
        </Marker>
           <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={()=> setAddEntryLocation(null)}
            anchor="top" >
              <div className="popup">
               <LogEntryForm onClose={() =>{
                 setAddEntryLocation(null);
                 getEntries();
               }}
                location={addEntryLocation}/>
              </div>
          </Popup>
        </> 
      ) : null
    }
    
    ></ReactMapGL>
  );
}

export default App;
