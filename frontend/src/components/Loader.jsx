import loader from '../assets/Loader.svg';
import styles from './Loader.module.css';

export default function Loader() {
  return <img src={loader} alt="Loading..." className={styles.loader} />;
}
