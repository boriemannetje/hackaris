"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RegistrationForm.module.css";

const GOOGLE_FORM_ID = "1FAIpQLSc-MZYCy7xndxTaK9Umz-Gh8B49HdAFsLCdpbUkfKHSt72ULQ";
const REGISTRATION_FORM_ACTION =
  process.env.NEXT_PUBLIC_REGISTRATION_FORM_ACTION ??
  `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

const REGISTRATION_NAME_FIELD =
  process.env.NEXT_PUBLIC_REGISTRATION_NAME_ENTRY?.trim() ||
  process.env.NEXT_PUBLIC_REGISTRATION_NAME_FIELD?.trim() ||
  "entry.166634338";

const REGISTRATION_EMAIL_FIELD =
  process.env.NEXT_PUBLIC_REGISTRATION_EMAIL_ENTRY?.trim() ||
  process.env.NEXT_PUBLIC_REGISTRATION_EMAIL_FIELD?.trim() ||
  "entry.21754644";

const REGISTRATION_PROFILE_FIELD =
  process.env.NEXT_PUBLIC_REGISTRATION_PROFILE_ENTRY?.trim() ||
  process.env.NEXT_PUBLIC_REGISTRATION_PROFILE_FIELD?.trim() ||
  "entry.1737713986";

const REGISTRATION_WEBSITE_FIELD =
  process.env.NEXT_PUBLIC_REGISTRATION_WEBSITE_ENTRY?.trim() ||
  process.env.NEXT_PUBLIC_REGISTRATION_WEBSITE_FIELD?.trim() ||
  "entry.1396573139";

const REGISTRATION_PROJECT_FIELD =
  process.env.NEXT_PUBLIC_REGISTRATION_PROJECT_ENTRY?.trim() ||
  process.env.NEXT_PUBLIC_REGISTRATION_PROJECT_FIELD?.trim() ||
  "entry.829520659";

type SubmitState = "idle" | "success" | "error";

export default function RegistrationForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const pendingSubmissionRef = useRef(false);
  const submitTimeoutRef = useRef<number | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const completeSubmission = useCallback((nextState: SubmitState) => {
    pendingSubmissionRef.current = false;
    if (submitTimeoutRef.current !== null) {
      window.clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
    setIsSubmitting(false);
    setSubmitState(nextState);

    if (nextState === "success") {
      formRef.current?.reset();
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      if (isSubmitting) {
        event.preventDefault();
        return;
      }

      const form = event.currentTarget;
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }

      setIsSubmitting(true);
      setSubmitState("idle");
      pendingSubmissionRef.current = true;

      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current);
      }

      submitTimeoutRef.current = window.setTimeout(() => {
        if (pendingSubmissionRef.current) {
          completeSubmission("error");
        }
      }, 10000);
    },
    [completeSubmission, isSubmitting],
  );

  const handleHiddenFrameLoad = useCallback(() => {
    if (pendingSubmissionRef.current) {
      completeSubmission("success");
    }
  }, [completeSubmission]);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className={styles.wrap} aria-label="Hackaris registration form">
      <iframe
        title="Hidden Google registration form"
        name="registration_google_form_iframe"
        src="about:blank"
        className={styles.iframeHidden}
        loading="lazy"
        tabIndex={-1}
        aria-hidden="true"
        onLoad={handleHiddenFrameLoad}
      />

      <button
        type="button"
        className={styles.title}
        aria-expanded={isOpen}
        aria-controls="invite-request-form-panel"
        onClick={() => setIsOpen((current) => !current)}
      >
        Join Hackaris
      </button>

      <div
        id="invite-request-form-panel"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}
      >
        <div className={styles.panelInner}>
        <form
          ref={formRef}
          className={styles.form}
          action={REGISTRATION_FORM_ACTION}
          method="POST"
          target="registration_google_form_iframe"
          onSubmit={handleSubmit}
        >
          <label className={styles.field}>
            <span>Your name</span>
            <input
              type="text"
              name={REGISTRATION_NAME_FIELD}
              placeholder="Tim Apple"
              autoComplete="name"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              name={REGISTRATION_EMAIL_FIELD}
              placeholder="tim@apple.com"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Your X or LinkedIn profile</span>
            <input
              type="text"
              name={REGISTRATION_PROFILE_FIELD}
              placeholder="https://x.com/@ItsMeTimApple"
              inputMode="url"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Your personal or product website</span>
            <input
              type="text"
              name={REGISTRATION_WEBSITE_FIELD}
              placeholder="https://tim.apple.com"
              inputMode="url"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Project/startup that you&apos;re building</span>
            <textarea
              name={REGISTRATION_PROJECT_FIELD}
              placeholder="A little about what idea or product you work on, we'd like to know!"
              rows={5}
              required
            />
          </label>

          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          {submitState === "error" && (
            <p className={styles.error}>Could not confirm submission. Try again.</p>
          )}

          {submitState === "success" && (
            <p className={styles.success}>Thanks, invite request received.</p>
          )}
        </form>
        </div>
      </div>
    </section>
  );
}
