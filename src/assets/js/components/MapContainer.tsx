import React, { useState, useEffect } from "react";
import {
   GoogleMap,
   LoadScript,
   Marker,
   MarkerClusterer,
   InfoWindow,
} from "@react-google-maps/api";

import { style1 } from "../configs/mapConfigs/style1";
import { style2 } from "../configs/mapConfigs/style2";
import { EAST_COAST_BOUNDS } from "../configs/mapConfigs/eastCoastRestrictions";
import { IWLocObj } from "../configs/mapConfigs/mapTypes";
import { apiKey } from "../configs/apiKey";
import { divStyleMaker } from "../configs/mapConfigs/createDivStyleChoosers";
import { modChairLoc } from "../configs/mapConfigs/modChairLoc";
import {
   iwLocStyle,
   pStyle,
   pStyleU,
   pStyleID,
   borderedDiv,
} from "../configs/mapConfigs/reactStyles";

const optionsMarkerCluster = {
   imagePath: "/images/m",
};

const MapContainer = (inputObj: Array<IWLocObj>, myPanel: any) => {
   const [mapRef, setMapRef] = useState<any>();
   const [selected, setSelected] = useState<any>();
   const [added, setAdded] = useState<boolean>(false);

   useEffect(() => {
      if (typeof mapRef != "undefined" && !added) {
         mapRef.setOptions({ styles: style1 }); // initialize map style
         const div1 = divStyleMaker("style1.png");
         div1.addEventListener("click", () => {
            mapRef.setOptions({ styles: style1 });
            div1.style.border = "4px hsla(12, 95%, 47%, 0.93) solid";
            div2.style.border = "1px rgb(250, 245, 198) solid";
         });
         mapRef.controls[window.google.maps.ControlPosition.LEFT_BOTTOM].push(
            div1
         );
         const div2 = divStyleMaker("style2.png");
         div2.addEventListener("click", () => {
            mapRef.setOptions({ styles: style2 });
            div2.style.border = "4px hsla(12, 95%, 47%, 0.93) solid";
            div1.style.border = "1px rgb(250, 245, 198) solid";
         });
         mapRef.controls[window.google.maps.ControlPosition.LEFT_BOTTOM].push(
            div2
         );
         div2.style.border = "1px rgb(250, 245, 198) solid";
         setAdded(true);
      }
   });

   const onMarkerSelect = (item: IWLocObj) => {
      let modifiedItem = modChairLoc(item);
      setSelected(modifiedItem);
      console.log(item.id);
   };

   const onMapLoad = (map: any) => {
      console.log(
         `%cloading map`,
         "background:white; border: 3px solid red; margin: 2px; padding: 3px; color:red;"
      );
      setMapRef(map);
   };

   const myMapContainerStyle = {
      height: "82vh",
      width: "73vw",
      background: "rgb(250, 245, 198)",
      border: "2px hsla(12, 95%, 47%, 0.93) solid",
      borderRadius: "6px",
   };

   let chairLocs: Array<IWLocObj> = Object.values(inputObj);

   return (
      <LoadScript googleMapsApiKey={apiKey}>
         <GoogleMap
            mapContainerStyle={myMapContainerStyle}
            zoom={10}
            center={chairLocs[0].location}
            onLoad={(map) => onMapLoad(map)}
            options={{
               streetViewControl: false,
               mapTypeControl: false,
            }}
            onBoundsChanged={() => {
               mapRef && mapRef.panToBounds(EAST_COAST_BOUNDS, 20);
            }}
            onZoomChanged={() => {
               if (mapRef && mapRef.getZoom() < 5) {
                  mapRef.setZoom(5);
               }
            }}
            onClick={() => {
               setSelected({});
            }}
         >
            <MarkerClusterer options={optionsMarkerCluster} gridSize={35}>
               {(clusterer) =>
                  chairLocs.map((x) => (
                     <Marker
                        key={x.id}
                        position={x.location}
                        onClick={() => onMarkerSelect(x)}
                        // icon={"./images/xIcon20.png"}
                        icon={"/images/xIcon20.png"}
                        clusterer={clusterer}
                     />
                  ))
               }
            </MarkerClusterer>
            {selected && selected.location && (
               <InfoWindow
                  position={selected.location}
                  // @ts-ignore
                  options={{ clickable: true }}
                  onCloseClick={() => {
                     setSelected({});
                  }}
               >
                  <div style={iwLocStyle}>
                     <div style={borderedDiv}>
                        <p style={pStyleU}>{selected.assetlabel}</p>
                     </div>
                     <p style={pStyle}>{selected.beach}</p>
                     <p style={pStyle}>
                        {selected.day} {selected.shortDate}
                     </p>
                     <p style={pStyle}> {selected.shortTime}</p>
                     <p style={pStyleID}>{selected.id}</p>
                  </div>
               </InfoWindow>
            )}
         </GoogleMap>
      </LoadScript>
   );
};

export default MapContainer;
