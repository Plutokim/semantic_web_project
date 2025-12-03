import Link from "next/link";
import type { Institution } from "~/types/institution";
import styles from "./InstitutionCard.module.css";

type InstitutionCardProps = {
  institution: Institution;
};

export default function InstitutionCard({ institution }: InstitutionCardProps) {
  const { item, itemLabel, typeLabel, locationLabel } = institution;
  
  const itemId = item.split("/").pop() || item;

  return (
    <Link href={`/institution/${itemId}`} className={styles.link}>
      <article className={styles.card}>
        <h3 className={styles.title}>{itemLabel}</h3>
        <div className={styles.chips}>
          {locationLabel && (
            <span className={`${styles.chip} ${styles.city}`}>{locationLabel}</span>
          )}
          {typeLabel && (
            <span className={`${styles.chip} ${styles.type}`}>{typeLabel}</span>
          )}
        </div>
      </article>
    </Link>
  );
}

