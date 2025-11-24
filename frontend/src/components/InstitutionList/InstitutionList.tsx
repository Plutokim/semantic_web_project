import InstitutionCard from "~/components/InstitutionCard/InstitutionCard";
import type { Institution } from "~/types/institution";
import styles from "./InstitutionList.module.css";

type InstitutionListProps = {
  institutions: Institution[];
};

export default function InstitutionList({ institutions }: InstitutionListProps) {
  if (!institutions.length) {
    return (
      <div className={styles.empty}>
        Заклади не знайдено. Спробуйте виконати синхронізацію.
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {institutions.map((institution) => (
        <InstitutionCard
          key={institution.item}
          institution={institution}
        />
      ))}
    </div>
  );
}

