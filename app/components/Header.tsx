"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import LineArtGlobe from "./LineArtGlobe";

export default function Header() {
  return (
    <header className={styles.header}>
      <LineArtGlobe />
      <Link href="/" className={styles.titleLink}>
        <h1 className={styles.title}>HACKARIS</h1>
      </Link>
      <p className={styles.tagline}>PARIS INDIE MAKERS</p>
    </header>
  );
}
