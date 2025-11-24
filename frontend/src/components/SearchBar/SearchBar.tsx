import styles from "./SearchBar.module.css";

type SearchBarProps = {
  placeholder?: string;
};

export default function SearchBar({
  placeholder = "Пошук закладів...",
}: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <input className={styles.input} type="search" placeholder={placeholder} />
      <button type="button" className={styles.button}>
        Пошук
      </button>
    </div>
  );
}

