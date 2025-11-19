import styles from './styles.module.scss';
export default function SemSala() {
  return (
    <div className={styles.vazio}>
      <div className={styles.content}>
        <p>Selecione uma sala para ver a programação</p>
      </div>
    </div>
  );
}
