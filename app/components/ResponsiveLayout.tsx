import styles from '../styles/Layout.module.css';

export default function ResponsiveLayout({ children }) {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
} 