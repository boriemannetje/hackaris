"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import LineArtGlobe from "./LineArtGlobe";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.globeWrap}>
        <LineArtGlobe />
      </div>
      <div className={styles.text}>
        <Link href="/" className={styles.titleLink}>
          <h1 className={styles.title}>HACKARIS</h1>
        </Link>
        <p className={styles.tagline}>PARIS INDIE MAKERS</p>
        <p className={styles.meta}>
          EST 2026. Part of{" "}
          <a
            href="https://hacka.network/?utm_source=hackaris"
            target="_blank"
            rel="noreferrer"
          >
            HACKA* NETWORK
          </a>
        </p>
      </div>
    </header>
  );
}
