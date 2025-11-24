import type { Institution } from "~/types/institution";
import styles from "./InstitutionCard.module.css";

type InstitutionCardProps = {
  institution: Institution;
};

export default function InstitutionCard({ institution }: InstitutionCardProps) {
  const { itemLabel, typeLabel, locationLabel } = institution;

  return (
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
  );
}

