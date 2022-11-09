import { useEffect, useState } from "react";

import styles from "./RestaurantDetails.module.scss";

import Image from "next/image";
import Link from "next/link";

export interface RestaurantDetailsProps {
  id: string;
  onClear: () => void;
}

// TODO: define API data types
function formatResponse(data: any) {
  return {
    id: data.fsq_id,
    name: data.name,
    address: data.location.formatted_address,
    description: data.categories
      .map((category: any) => {
        return category.name;
      })
      .join(", "),
    open: data.hours?.open_now,
    hours: data.hours.display,
    website: data.website,
    photos: data.photos.map((photo: any) => {
      return `${photo.prefix}400x300${photo.suffix}`;
    }),
  };
}

export function RestaurantDetails({ id, onClear }: RestaurantDetailsProps) {
  let [data, setData] = useState<{
    loading: Boolean;
    result?: Record<string, any>;
  }>({
    loading: true,
    result: undefined,
  });
  let [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    let ignore = false;
    setData({
      loading: true,
      result: undefined,
    });

    const searchParams = new URLSearchParams({
      fields:
        "name,description,categories,location,distance,fsq_id,photos,geocodes,website,hours",
    }).toString();

    fetch(`/api/details/${id}?${searchParams}`).then(async (result) => {
      if (!ignore) {
        let data = await result.json();

        let formattedData = formatResponse(data);

        setData({
          result: formattedData,
          loading: false,
        });
      }
    });

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className={styles.container}>
      {data.loading ? (
        `Loading...`
      ) : (
        <>
          <div className={styles.carousel}>
            <button
              className={styles.carouselButton}
              onClick={() => setPhotoIndex(photoIndex - 1)}
            >
              ←
            </button>
            <button
              className={styles.carouselButton}
              onClick={() => setPhotoIndex(photoIndex + 1)}
            >
              →
            </button>
            {data.result && (
              <Image
                src={
                  data.result.photos[
                    photoIndex >= 0
                      ? photoIndex % data.result.photos.length
                      : Math.abs(
                          data.result.photos.length -
                            1 +
                            (photoIndex % data.result.photos.length)
                        )
                  ]
                }
                alt={data.result.name}
                width={400}
                height={300}
              />
            )}
          </div>
          {data.result && (
            <div className={styles.contentContainer}>
              <div className={styles.header}>
                <h2 className={styles.title}>{data.result.name}</h2>
                <button onClick={onClear}>X</button>
              </div>
              <div>{data.result.open ? "Open now" : "Closed"}</div>
              {data.result.website ? (
                <Link href={data.result.website}>Go to website</Link>
              ) : (
                ""
              )}
              <div>{data.result.description}</div>
              <div>{data.result.address}</div>
              <div>{data.result.hours}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
