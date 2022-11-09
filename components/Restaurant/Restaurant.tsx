import styles from "./Restaurant.module.scss";
import Image from "next/image";

import Link from "next/link";
import { EventHandler } from "react";

export interface RestaurantProps {
  id: string;
  name: string;
  description: string;
  distance: string;
  address: string;
  open: boolean;
  photo: string;
  website: string;
  highlight: boolean;
  onClick: () => void;
}

export function Restaurant({
  name,
  description,
  distance,
  address,
  website,
  open,
  photo,
  highlight,
  onClick,
}: RestaurantProps) {
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: highlight ? "#ddd" : "" }}
      onClick={onClick}
    >
      <Image src={photo} alt={name} width={120} height={120} />
      <div className={styles.metadataContainer}>
        <h4>{name}</h4>
        {website ? <Link href={website}>Go to website</Link> : ""}
        <div>{description}</div>
        <div>{distance}m away</div>
        <div>{address}</div>
        <div>{open ? "Open now" : "Closed"}</div>
      </div>
    </div>
  );
}
