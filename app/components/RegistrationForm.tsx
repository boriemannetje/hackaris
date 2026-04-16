"use client";

import { FormEvent, useState } from "react";
import styles from "./RegistrationForm.module.css";

type SubmitState = "idle" | "submitting" | "success";

export default function RegistrationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    setSubmitState("submitting");
    window.setTimeout(() => {
      setSubmitState("success");
      form.reset();
    }, 450);
  };

  return (
    <section className={styles.wrap} aria-label="Hackaris registration form">
      <h3 className={styles.title}>Request An Invite</h3>
      <p className={styles.note}>
        Same questions as the original registration form.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Your name</span>
          <input type="text" name="name" placeholder="Tim Apple" required />
        </label>

        <label className={styles.field}>
          <span>Email</span>
          <input type="email" name="email" placeholder="tim@apple.com" required />
        </label>

        <label className={styles.field}>
          <span>Your X or LinkedIn profile</span>
          <input
            type="url"
            name="profile"
            placeholder="https://x.com/@ItsMeTimApple"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Your personal or product website</span>
          <input
            type="url"
            name="website"
            placeholder="https://tim.apple.com"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Project/startup that you&apos;re building</span>
          <textarea
            name="project"
            placeholder="A little about what idea or product you work on, we'd like to know!"
            rows={5}
            required
          />
        </label>

        <button
          type="submit"
          className={styles.submit}
          disabled={submitState === "submitting"}
        >
          {submitState === "submitting" ? "Submitting..." : "Submit"}
        </button>

        {submitState === "success" && (
          <p className={styles.success}>Thanks, invite request received.</p>
        )}
      </form>
    </section>
  );
}
