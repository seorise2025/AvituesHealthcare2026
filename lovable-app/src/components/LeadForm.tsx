import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitLead, type LeadType } from "@/lib/submitLead";

const THANKS: Record<LeadType, string> = {
  employer: "/thank-you/employer/",
  candidate: "/thank-you/candidate/",
  general: "/thank-you/message/",
};
const PREFIX: Record<LeadType, string> = { employer: "e", candidate: "c", general: "g" };

type FieldError = { id: string; text: string };
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function labelFor(form: HTMLFormElement, el: Control): string {
  const lab = el.id ? form.querySelector(`label[for="${el.id}"]`) : null;
  if (lab?.textContent) return lab.textContent.replace("*", "").trim();
  const lg = el.closest("fieldset")?.querySelector("legend");
  return lg?.textContent ? lg.textContent.replace("*", "").replace("(required)", "").trim() : el.name;
}

function markError(form: HTMLFormElement, name: string, msg?: string): Control | null {
  const all = form.querySelectorAll<Control>(`[name="${name}"]`);
  if (!all.length) return null;
  const wrap = all[0].closest(".field");
  if (wrap) {
    wrap.classList.add("has-error");
    const m = wrap.querySelector(".error-msg");
    if (m && msg) m.textContent = msg;
  }
  all.forEach((x) => x.setAttribute("aria-invalid", "true"));
  return all[0];
}

function clearErrors(form: HTMLFormElement) {
  form.querySelectorAll(".has-error").forEach((w) => w.classList.remove("has-error"));
  form.querySelectorAll("[aria-invalid]").forEach((x) => x.setAttribute("aria-invalid", "false"));
}

function validate(form: HTMLFormElement): FieldError[] {
  const errs: FieldError[] = [];
  const seen = new Set<string>();
  form.querySelectorAll<Control>("[required]").forEach((el) => {
    if (seen.has(el.name)) return;
    seen.add(el.name);
    let ok: boolean;
    if (el instanceof HTMLInputElement && el.type === "radio") ok = !!form.querySelector(`[name="${el.name}"]:checked`);
    else if (el instanceof HTMLInputElement && el.type === "checkbox") ok = el.checked;
    else ok = el.value.trim() !== "" && el.checkValidity();
    if (!ok) {
      const msg = el.closest(".field")?.querySelector(".error-msg")?.textContent;
      markError(form, el.name);
      errs.push({ id: el.id, text: msg || labelFor(form, el) });
    }
  });
  return errs;
}

/**
 * Wraps the fields of a lead form. Handles checking, the spam traps,
 * sending, and the error messages. The fields themselves are plain markup.
 */
export default function LeadForm({ type, id, children }: { type: LeadType; id: string; children: ReactNode }) {
  const ref = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const sendErrRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(Date.now());
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [sendFailed, setSendFailed] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const p = PREFIX[type];

  useEffect(() => {
    if (errors.length) summaryRef.current?.focus();
  }, [errors]);
  useEffect(() => {
    if (sendFailed) sendErrRef.current?.focus();
  }, [sendFailed]);

  // Clear a field's error as soon as it is fixed.
  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    const t = e.target as Control;
    const wrap = t.closest(".field");
    if (!wrap?.classList.contains("has-error")) return;
    const ok = t instanceof HTMLInputElement && (t.type === "radio" || t.type === "checkbox") ? true : t.checkValidity();
    if (ok) {
      wrap.classList.remove("has-error");
      t.setAttribute("aria-invalid", "false");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = ref.current;
    if (!form || sending) return;
    clearErrors(form);
    setSendFailed(false);
    const errs = validate(form);
    setErrors(errs);
    if (errs.length) return;

    const body = new URLSearchParams();
    new FormData(form).forEach((v, k) => body.append(k, String(v)));
    body.set("page_url", location.pathname);
    body.set("referrer", document.referrer ? document.referrer.slice(0, 300) : "");
    body.set("form_ts", String(startedAt.current));
    const q = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign"].forEach((k) => {
      const v = q.get(k);
      if (v) body.set(k, v.slice(0, 100));
    });

    const btn = form.querySelector<HTMLButtonElement>('[type="submit"]');
    const label = btn?.textContent ?? "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending...";
    }
    setSending(true);
    const res = await submitLead(type, body);
    setSending(false);
    if (btn) {
      btn.disabled = false;
      btn.textContent = label;
    }
    if (res.kind === "ok") {
      navigate(THANKS[type] + (res.ref ? `?ref=${encodeURIComponent(res.ref)}` : ""));
      return;
    }
    if (res.kind === "invalid") {
      const list: FieldError[] = [];
      Object.entries(res.errors).forEach(([name, msg]) => {
        const el = markError(form, name, msg);
        if (el) list.push({ id: el.id, text: msg });
      });
      if (list.length) {
        setErrors(list);
        return;
      }
    }
    setSendFailed(true);
  };

  return (
    <form ref={ref} className="form-card" id={id} noValidate onSubmit={onSubmit} onChange={onChange} aria-busy={sending}>
      {/* Spam trap: people never see or fill this field. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${p}-website`}>Leave this empty</label>
        <input id={`${p}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div ref={summaryRef} className={`error-summary${errors.length ? " is-visible" : ""}`} role="alert" tabIndex={-1}>
        <h2>Please check the form</h2>
        <ul>
          {errors.map((er) => (
            <li key={er.id + er.text}>
              <a
                href={`#${er.id}`}
                onClick={(ev) => {
                  ev.preventDefault();
                  if (er.id) document.getElementById(er.id)?.focus();
                }}
              >
                {er.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {children}
      <div ref={sendErrRef} className={`notice send-error${sendFailed ? " is-visible" : ""}`} role="alert" tabIndex={-1}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l10 18H2L12 3z" /><path d="M12 10v5M12 18h.01" /></svg>
        <p>
          <strong>Your form did not send.</strong> Please call <a href="tel:+442034888172">020 3488 8172</a> or email{" "}
          <a href="mailto:info@aviteushealthcare.co.uk">info@aviteushealthcare.co.uk</a>.
        </p>
      </div>
    </form>
  );
}
