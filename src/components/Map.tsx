import React, { useState } from 'react';
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import './Map.css';

const Map = () => {
  const [center] = useState({ lat: 22.28552, lng: 114.15769 });
  const zoomLevel = 17;
  const [zoom] = useState(zoomLevel);
  const getMapOptions = () => {
    return {
      disableDefaultUI: false,
      mapTypeControl: true,
      streetViewControl: false,
    };
  };

  const setTimeTo12 = (time24: any) => {
    const H: number = + time24.substr(0, 2);
    const h: any = (H % 12) || 12;
    const ampm: string = H < 12 ? 'am' : 'pm';
    return h + time24.substr(2, 3) + ampm;
  };

  const setUserCenter = (map: any, maps: any) => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const place = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(place);
        const marker = new maps.Marker({
          map,
          position: {
            lat: place.lat,
            lng: place.lng,
          },
        });

        marker.setIcon({
          fillColor: '#4285f4',
          fillOpacity: 1,
          path: maps.SymbolPath.CIRCLE,
          scale: 6,
          strokeColor: '#4285f4',
          strokeOpacity: .3,
          strokeWeight: 12,
        });
      });
    }
  }

  const setMarker = (map: any, maps: any, loc: any) => {
    const place = {
      address_en_us: loc.address_en_us,
      address_zh_hk: loc.address_zh_hk,
      facebook: loc.facebook,
      latitude: loc.latitude * 1,
      longitude: loc.longitude * 1,
      name_en_us: loc.name_en_us,
      name_zh_hk: loc.name_zh_hk,
      opening_hours: loc.opening_hours,
      opening_hours_close: loc.opening_hours_close,
      opening_hours_open: loc.opening_hours_open,
      phone: loc.phone,
      website: loc.website,
    }

    const marker = new maps.Marker({
      map,
      position: {
        lat: place.latitude,
        lng: place.longitude,
      },
    });

    setInfoWindow(map, maps, marker, place);
  }

  const setInfoWindow = (map: any, maps: any, marker: any, place: any) => {
    let contentString = `
      <div class="InfoWindow">
        <div><h1>${place.name_en_us}</h1></div>
        <div>${place.name_zh_hk}</div>
        <p>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}"
            target="_blank"
          >
            Directions
          </a>
        </p>
        <address class="session-info-line">
          ${place.address_en_us}
        </address>
    `;

    if (place.opening_hours_open && place.opening_hours_close) {
      contentString += `
        <div class="session-info">
          <div class="session-info-line">
            ${setTimeTo12(place.opening_hours_open)} – ${setTimeTo12(place.opening_hours_close)}
          </div>
        </div>
      `;
    }
    if (place.opening_hours) {
      contentString += `
        <div class="session-info">
          <div class="session-info-line">
            Open Hours: ${place.opening_hours}
          </div>
        </div>
      `;
    }
    if (place.website) {
      contentString += `
        <div class="session-info">
          <div class="session-info-line">
            <i class="home icon"></i>
            <a href="${place.website}" target="_blank">
              ${place.website.replace('https://www.', '').replace('http://www.', '').replace('/', '')}
            </a>
          </div>
        </div>
      `;
    }
    if (place.facebook) {
      contentString += `
        <div class="session-info">
          <div class="session-info-line">
            <i class="facebook icon"></i>
            <a href="${place.facebook}" target="_blank">
              facebook.com
            </a>
          </div>
        </div>
      `;
    }
    if (place.phone) {
      contentString += `
        <div class="session-info">
          <div class="session-info-line">
            <i class="phone icon"></i>
            <a href="tel:${place.phone}">
              ${place.phone}
            </a>
          </div>
        </div>
      `;
    }
    contentString += `</div>`;

    let infowindow: any;
    marker.addListener('click', () => {
      if (infowindow) {
        infowindow.close();
      }
      infowindow = new maps.InfoWindow({
        content: contentString,
      });
      infowindow.open(map, marker);
    });
  }

  const setCsvToJson = (csv: string) => {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const row = lines[i];
      let queryIdx = 0;
      let startValueIdx = 0;
      let idx = 0;

      if (row.trim() === '') { continue; }

      while (idx < row.length) {
        let c = row[idx];

        if (c === '"') {
          do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1);
        }

        if (c === ',' || idx === row.length - 1) {
          let value = row.substr(startValueIdx, idx - startValueIdx).trim();
          if (value[0] === '"') { value = value.substr(1); }
          if (value[value.length - 1] === ',') { value = value.substr(0, value.length - 1); }
          if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }

          const key = headers[queryIdx++];
          obj[key] = value;
          startValueIdx = idx + 1;
        }

        ++idx;
      }

      result.push(obj);
    }
    return result;
  }

  const handleApiLoaded = async (map: any, maps: any) => {
    let places: any;

    setUserCenter(map, maps);

    try {
      await axios.get(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTt0sdlsfqAevOZM6OQZUraflTqU6c_DjthMRbn8cYKMCZt1NXXXYsEKyv9lu5C9ca3rDSq-j5pBqt5/pub?output=csv'
        ).then((data: any) => {
        places = setCsvToJson(data.data);
      })
    } catch (error) {
      console.error('error', error)
    }

    if (places) {
      places.map((place: any) => {
        return setMarker(map, maps, place);
      });
    }
  };
  return (
    <div className="Map">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_MAP_KEY + '',
        }}
        defaultCenter={center}
        defaultZoom={zoom}
        options={getMapOptions}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      />
    </div >
  );
}

export default Map;

