import mapboxgl, { Marker } from "mapbox-gl";

import Head from "next/head";
import styles from "../styles/Home.module.scss";

import {
  RestaurantProps,
  Restaurant,
} from "../components/Restaurant/Restaurant";
import { MapProps, Map } from "../components/Map/Map";
import {
  RestaurantDetailsProps,
  RestaurantDetails,
} from "../components/RestaurantDetails/RestaurantDetails";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

let userLat = 35.664669;
let userLng = 139.737832;

interface ExtendedRestaurantProps extends RestaurantProps {
  geocodes: {
    latitude: string;
    longitude: string;
  };
}

function setMarkerColor(marker: Marker, color: string) {
  let markerElement = marker.getElement();
  markerElement.querySelectorAll("path")[0].setAttribute("fill", color);
}

// TODO: define API data types
function formatRestaurantData(data: any): ExtendedRestaurantProps[] {
  return data.map((restaurant: any) => {
    return {
      id: restaurant.fsq_id,
      name: restaurant.name,
      address: restaurant.location.formatted_address,
      geocodes: restaurant.geocodes.main,
      description: restaurant.categories
        .map((category: any) => {
          return category.name;
        })
        .join(", "),
      distance: restaurant.distance,
      open: restaurant.hours?.open_now,
      website: restaurant.website,
      photo: restaurant.photos
        ? `${restaurant.photos[0].prefix}130x130${restaurant.photos[0].suffix}`
        : "",
    };
  });
}

// Taken from mapbox docs
// https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup-example
function createPopup(name: string) {
  const markerHeight = 50;
  const markerRadius = 10;
  const linearOffset = 25;
  const popupOffsets = {
    top: [0, 0],
    "top-left": [0, 0],
    "top-right": [0, 0],
    bottom: [0, -markerHeight],
    "bottom-left": [
      linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    "bottom-right": [
      -linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    left: [markerRadius, (markerHeight - markerRadius) * -1],
    right: [-markerRadius, (markerHeight - markerRadius) * -1],
  };

  const popup = new mapboxgl.Popup({
    offset: popupOffsets as any, // FIXME: This was taken from the docs so I'm not sure why it fails
    className: styles.popup,
    closeButton: false,
  })
    .setHTML(`<h2>${name}</h2>`)
    .setMaxWidth("300px");

  return popup;
}

export default function Home() {
  let [query, setQuery] = useState("");
  let [queryParams, setQueryParams] = useState("");
  let [restaurants, setRestaurants] = useState<ExtendedRestaurantProps[]>([]);
  let [highlighted, setHighlighted] = useState<string>();
  let [selected, setSelected] = useState<string>();

  useEffect(() => {
    if (!queryParams) {
      return;
    }

    let ignore = false;

    fetch(`/api/search?${queryParams}`).then(async (result) => {
      if (!ignore) {
        let data = await result.json();

        let formattedData = formatRestaurantData(data.results);

        setRestaurants(formattedData);
      }
    });

    return () => {
      ignore = true;
    };
  }, [queryParams]);

  async function handleFeelingLucky() {
    const params = new URLSearchParams({
      query,
      ll: `${userLat},${userLng}`,
      radius: "1000",
      categories: "13000",
      fields:
        "name,description,categories,location,distance,fsq_id,photos,geocodes,website",
    }).toString();

    let res = await fetch(`/api/lucky?${params}`);
    let data = await res.json();

    let formattedData = formatRestaurantData(data.results);

    setRestaurants(formattedData);
    setSelected(formattedData[0]["id"]);
  }

  let handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: standardize this with the lucky function
    const searchParams = new URLSearchParams({
      query,
      ll: `${userLat},${userLng}`,
      radius: "1000",
      categories: "13000",
      fields:
        "name,description,categories,location,distance,fsq_id,photos,geocodes,website",
    }).toString();

    setSelected(undefined);
    setQueryParams(searchParams);
  };

  let handleQueryChange = (e: FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  let markers = restaurants.map(({ geocodes, id, name }) => {
    let newPopup = createPopup(name);
    let currentMarker = new mapboxgl.Marker({
      color: selected === id ? "#FFFF33" : "#3333FF",
    })
      .setLngLat([Number(geocodes.longitude), Number(geocodes.latitude)])
      .setPopup(newPopup);

    let element = currentMarker.getElement();

    element.addEventListener("mouseenter", (e) => {
      setMarkerColor(currentMarker, selected === id ? "#FFFF33" : "#FF3333");
      currentMarker.togglePopup();
      setHighlighted(id);
    });
    element.addEventListener("mouseleave", (e) => {
      setMarkerColor(currentMarker, selected === id ? "#FFFF33" : "#FF3333");
      currentMarker.togglePopup();
      setHighlighted(undefined);
    });
    element.addEventListener("click", (e) => {
      setSelected(id);
    });

    return currentMarker;
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Restaurant Picker</title>
        <meta name="description" content="Restaurant Picker" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          {selected ? (
            <RestaurantDetails
              id={selected}
              onClear={() => setSelected(undefined)}
            />
          ) : (
            restaurants.map(
              ({
                name,
                description,
                address,
                distance,
                photo,
                id,
                open,
                website,
              }) => {
                return (
                  <Restaurant
                    key={`${name}${address}`}
                    name={name}
                    description={description}
                    distance={distance}
                    address={address}
                    photo={photo}
                    id={id}
                    open={open}
                    website={website}
                    highlight={highlighted === id}
                    onClick={() => setSelected(id)}
                  />
                );
              }
            )
          )}
        </div>
        <div className={styles.header}>Restaurant Picker</div>
        <div className={styles.mapContainer}>
          <Map lat={userLat} lng={userLng} markers={markers} />
          <form onSubmit={handleOnSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.searchInput}
                name="search_query"
                placeholder="Search for a restaurant!"
                onChange={handleQueryChange}
              />
              <input
                type="button"
                className={styles.groupButton}
                name="lucky_button"
                value="I'm feeling lucky"
                onClick={handleFeelingLucky}
              />
              <input
                type="submit"
                className={styles.groupButton}
                name="submit_button"
                value="Search!"
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
