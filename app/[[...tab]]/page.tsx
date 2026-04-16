import Header from "../components/Header";
import PixelStars from "../components/PixelStars";
import RegistrationForm from "../components/RegistrationForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <PixelStars />
      <main className={styles.container}>
        <div className={styles.viewport}>
          <Header />

          <section className={styles.hero}>
            <p className={styles.lead}>
              A community-run group of indie makers, coders, designers, and
              hardware hackers building products together in Paris, meeting
              every Thursday for co-working and demos.
            </p>
            <p className={styles.subLead}>
              Not in Paris?{" "}
              <a
                href="https://hacka.network/?utm_source=hackaris"
                target="_blank"
                rel="noreferrer"
              >
                More locations →
              </a>
            </p>
          </section>

          <RegistrationForm />

          <section className={styles.content}>
            <p>
              If you code your own projects, come join us every Thursday from
              9:15 AM at a rotating co-working space in Paris. We share the
              exact venue details after registration.
            </p>
            <p>The usual schedule is:</p>
            <ul className={styles.schedule}>
              <li>
                <strong>9:30 AM - Intros</strong> (quick intro + what you are
                building)
              </li>
              <li>
                <strong>12:30 PM - Lunch</strong> together (optional)
              </li>
              <li>
                <strong>4:00 PM - Demos</strong> (share what you made today)
              </li>
              <li>
                <strong>5:30 PM - Apéro</strong> nearby
              </li>
            </ul>
          </section>
        </div>

        <footer className={styles.footer}>
          <p>HACKARIS</p>
        </footer>
      </main>
    </>
  );
}
