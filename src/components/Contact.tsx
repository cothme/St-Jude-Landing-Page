import { FormEvent, useMemo, useState } from 'react';
import { FaEnvelope, FaLocationDot, FaPhone, FaRegCircleCheck } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import type { ContactContent, SiteSettings } from '../content/types';
import Reveal from './Reveal';

type FormValues = {
  fullName: string;
  phone: string;
  email: string;
  relationship: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type TouchedFields = Partial<Record<keyof FormValues, boolean>>;

const initialValues: FormValues = {
  fullName: '',
  phone: '',
  email: '',
  relationship: '',
  message: '',
};

const contactIcons: Record<ContactContent['detailCards'][number]['icon'], IconType> = {
  email: FaEnvelope,
  location: FaLocationDot,
  phone: FaPhone,
};

function validate(values: FormValues) {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) errors.fullName = 'Please enter your full name.';
  if (!values.phone.trim()) errors.phone = 'Please enter a contact number.';
  if (values.phone.trim() && !/^[0-9+\-\s()]{7,}$/.test(values.phone.trim())) {
    errors.phone = 'Use a valid phone number format.';
  }
  if (!values.email.trim()) errors.email = 'Please enter an email address.';
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Use a valid email address.';
  }
  if (!values.relationship) errors.relationship = 'Please choose your relationship.';
  if (!values.message.trim()) errors.message = 'Please share how we can help.';

  return errors;
}

type ContactProps = {
  content: ContactContent;
  site: SiteSettings;
};

function Contact({ content, site }: ContactProps) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      relationship: true,
      message: true,
    });

    if (hasErrors) return;

    setSubmitted(true);
    setValues(initialValues);
    setTouched({});
  };

  const showError = (field: keyof FormValues) => Boolean(touched[field] && errors[field]);

  return (
    <section id="contact" className="bg-white py-20 sm:py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-heading">{content.heading}</h2>
          <p className="section-copy">{content.copy}</p>

          <div className="mt-10 grid gap-4">
            {content.detailCards.map((item, index) => {
              const Icon = contactIcons[item.icon];
              const detail = site.contact[item.detailKey];
              return (
                <Reveal key={item.title} delay={index * 90}>
                  <div className="card-sheen flex gap-4 rounded-3xl border border-moss/10 bg-cream p-5 transition duration-300 hover:-translate-y-1 hover:border-sage/40 hover:shadow-soft">
                    <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-harbor">
                      <Icon aria-hidden="true" />
                    </span>
                    <div className="relative">
                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-ink/46">{item.title}</p>
                      <p className="mt-1 font-semibold text-ink/78">{detail}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-moss/10 bg-cream p-5 shadow-lift sm:p-8">
          {/* Customize this form handler when connecting to email, CRM, or backend inquiry storage. */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              value={values.fullName}
              error={showError('fullName') ? errors.fullName : undefined}
              onBlur={() => setTouched((current) => ({ ...current, fullName: true }))}
              onChange={(value) => updateField('fullName', value)}
              placeholder="Juan Dela Cruz"
            />
            <Field
              label="Contact number"
              value={values.phone}
              error={showError('phone') ? errors.phone : undefined}
              onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
              onChange={(value) => updateField('phone', value)}
              placeholder="+63 900 000 0000"
              inputMode="tel"
            />
            <Field
              label="Email"
              value={values.email}
              error={showError('email') ? errors.email : undefined}
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              onChange={(value) => updateField('email', value)}
              placeholder="name@email.com"
              type="email"
            />
            <div>
              <label className="text-sm font-bold text-ink/78" htmlFor="relationship">
                Relationship to patient
              </label>
              <select
                id="relationship"
                value={values.relationship}
                onBlur={() => setTouched((current) => ({ ...current, relationship: true }))}
                onChange={(event) => updateField('relationship', event.target.value)}
                className={`focus-ring mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-ink shadow-sm transition ${
                  showError('relationship') ? 'border-red-400' : 'border-moss/15'
                }`}
              >
                <option value="">Select one</option>
                {content.form.relationships.map((relationship) => (
                  <option key={relationship}>{relationship}</option>
                ))}
              </select>
              {showError('relationship') && <p className="mt-2 text-sm font-semibold text-red-600">{errors.relationship}</p>}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-bold text-ink/78" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={values.message}
              onBlur={() => setTouched((current) => ({ ...current, message: true }))}
              onChange={(event) => updateField('message', event.target.value)}
              placeholder="Tell us about the type of care you are looking for."
              rows={5}
              className={`focus-ring mt-2 w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm font-medium leading-7 text-ink shadow-sm transition ${
                showError('message') ? 'border-red-400' : 'border-moss/15'
              }`}
            />
            {showError('message') && <p className="mt-2 text-sm font-semibold text-red-600">{errors.message}</p>}
          </div>

            <button
              type="submit"
              className="focus-ring button-glow mt-6 w-full rounded-full bg-moss px-6 py-4 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink"
            >
              <span className="relative z-10">Send Inquiry</span>
            </button>

            {submitted && (
              <div className="animate-fade-up mt-5 flex gap-3 rounded-2xl border border-sage/30 bg-white p-4 text-sm font-semibold text-moss">
                <FaRegCircleCheck className="mt-0.5 shrink-0" aria-hidden="true" />
                {content.form.successMessage}
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder: string;
  type?: string;
  inputMode?: 'text' | 'tel' | 'email';
};

function Field({ label, value, onChange, onBlur, error, placeholder, type = 'text', inputMode = 'text' }: FieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label className="text-sm font-bold text-ink/78" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`focus-ring mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-ink shadow-sm transition ${
          error ? 'border-red-400' : 'border-moss/15'
        }`}
      />
      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
}

export default Contact;
