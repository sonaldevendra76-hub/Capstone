import { useState } from "react";
import {
  User,
  Bell,
  ShieldCheck,
  Palette,
  Check,
  ChevronRight,
} from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`;

const tokens = {
  bg: "#EEF1EF",
  panel: "#FFFFFF",
  ink: "#16221F",
  muted: "#5B6B66",
  faint: "#8B978F",
  border: "#DCE1DE",
  accent: "#2F6F5E",
  accentHover: "#255A4C",
  accentSoft: "#E4EEEA",
  gold: "#C9A24B",
  danger: "#A6402F",
};

const NAV = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & security", icon: ShieldCheck },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-6 py-4 text-left focus:outline-none"
      style={{ borderBottom: `1px solid ${tokens.border}` }}
    >
      <span className="flex flex-col gap-0.5">
        <span
          className="text-sm font-medium"
          style={{ color: tokens.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          {label}
        </span>
        {description && (
          <span
            className="text-xs"
            style={{ color: tokens.muted, fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            {description}
          </span>
        )}
      </span>
      <span
        className="relative mt-0.5 shrink-0 rounded-full transition-colors duration-200"
        style={{
          width: 40,
          height: 22,
          backgroundColor: checked ? tokens.accent : "#D3D9D6",
        }}
      >
        <span
          className="absolute rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{
            width: 16,
            height: 16,
            top: 3,
            left: 3,
            transform: checked ? "translateX(18px)" : "translateX(0)",
          }}
        />
      </span>
    </button>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5 py-3" style={{ display: "flex" }}>
      <span
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: tokens.muted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em" }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span className="text-xs" style={{ color: tokens.faint, fontFamily: "'IBM Plex Sans', sans-serif" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

const inputStyle = {
  fontFamily: "'IBM Plex Sans', sans-serif",
  color: tokens.ink,
  backgroundColor: tokens.bg,
  border: `1px solid ${tokens.border}`,
};

function SectionEyebrow({ children }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span
        className="inline-block rounded-full"
        style={{ width: 7, height: 7, backgroundColor: tokens.accent }}
      />
      <span
        className="text-xs font-semibold uppercase"
        style={{ color: tokens.accent, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.12em" }}
      >
        {children}
      </span>
    </div>
  );
}

export default function SettingsForm() {
  const [active, setActive] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex@northline.co",
    bio: "Product designer working on developer tools.",
  });

  const [notif, setNotif] = useState({
    productUpdates: true,
    weeklyDigest: true,
    mentions: true,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityStatus: false,
    dataSharing: false,
  });

  const [appearance, setAppearance] = useState({
    theme: "system",
    density: "comfortable",
    reduceMotion: false,
  });

  function markDirty(setter) {
    return (updater) => {
      setter(updater);
      setDirty(true);
      setSaved(false);
    };
  }
  const setProfileField = (key) => (e) =>
    markDirty(setProfile)((p) => ({ ...p, [key]: e.target.value }));
  const setNotifField = (key) => (val) =>
    markDirty(setNotif)((p) => ({ ...p, [key]: val }));
  const setPrivacyField = (key) => (val) =>
    markDirty(setPrivacy)((p) => ({ ...p, [key]: val }));

  function handleSave() {
    setSaved(true);
    setDirty(false);
  }

  return (
    <div
      className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl"
      style={{ backgroundColor: tokens.panel, border: `1px solid ${tokens.border}`, fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      <style>{FONT_IMPORT}</style>

      {/* Header */}
      <div
        className="flex items-center justify-between px-8 py-6"
        style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.bg }}
      >
        <div>
          <div
            className="text-xs font-semibold uppercase"
            style={{ color: tokens.faint, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.14em" }}
          >
            Account
          </div>
          <h1 className="mt-1 text-xl font-semibold" style={{ color: tokens.ink }}>
            Settings
          </h1>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: dirty ? tokens.gold : tokens.accent,
            backgroundColor: dirty ? "#F7EFDD" : tokens.accentSoft,
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, backgroundColor: dirty ? tokens.gold : tokens.accent }}
          />
          {dirty ? "Unsaved changes" : "All changes saved"}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <nav
          className="flex shrink-0 gap-1 overflow-x-auto px-4 py-4 sm:w-56 sm:flex-col sm:overflow-visible sm:px-3"
          style={{ borderBottom: `1px solid ${tokens.border}`, borderRight: `1px solid ${tokens.border}` }}
        >
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                style={{
                  color: isActive ? tokens.accent : tokens.muted,
                  backgroundColor: isActive ? tokens.accentSoft : "transparent",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon size={16} strokeWidth={2} />
                <span className="whitespace-nowrap">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto hidden sm:block" />}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 px-8 py-7">
          {active === "profile" && (
            <div>
              <SectionEyebrow>Profile</SectionEyebrow>
              <Field label="Full name">
                <input
                  value={profile.name}
                  onChange={setProfileField("name")}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={inputStyle}
                />
              </Field>
              <Field label="Email address" hint="Used for sign-in and account notices.">
                <input
                  type="email"
                  value={profile.email}
                  onChange={setProfileField("email")}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={inputStyle}
                />
              </Field>
              <Field label="Bio" hint="Shown on your public profile.">
                <textarea
                  value={profile.bio}
                  onChange={setProfileField("bio")}
                  rows={3}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={inputStyle}
                />
              </Field>
            </div>
          )}

          {active === "notifications" && (
            <div>
              <SectionEyebrow>Notifications</SectionEyebrow>
              <Toggle
                label="Product updates"
                description="New features and improvements."
                checked={notif.productUpdates}
                onChange={setNotifField("productUpdates")}
              />
              <Toggle
                label="Weekly digest"
                description="A summary of activity each Monday."
                checked={notif.weeklyDigest}
                onChange={setNotifField("weeklyDigest")}
              />
              <Toggle
                label="Mentions"
                description="Someone mentions you in a comment."
                checked={notif.mentions}
                onChange={setNotifField("mentions")}
              />
              <Toggle
                label="Marketing emails"
                description="Offers, tips, and other promotions."
                checked={notif.marketing}
                onChange={setNotifField("marketing")}
              />
            </div>
          )}

          {active === "privacy" && (
            <div>
              <SectionEyebrow>Privacy & security</SectionEyebrow>
              <Toggle
                label="Public profile"
                description="Anyone can view your profile page."
                checked={privacy.profileVisible}
                onChange={setPrivacyField("profileVisible")}
              />
              <Toggle
                label="Show activity status"
                description="Let others see when you're active."
                checked={privacy.activityStatus}
                onChange={setPrivacyField("activityStatus")}
              />
              <Toggle
                label="Share usage data"
                description="Helps us improve the product."
                checked={privacy.dataSharing}
                onChange={setPrivacyField("dataSharing")}
              />
              <div className="mt-6 flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: "#FBEEEA" }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: tokens.danger }}>
                    Delete account
                  </div>
                  <div className="text-xs" style={{ color: tokens.muted }}>
                    Permanently remove your account and all data.
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                  style={{ color: "#fff", backgroundColor: tokens.danger }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {active === "appearance" && (
            <div>
              <SectionEyebrow>Appearance</SectionEyebrow>
              <Field label="Theme">
                <div className="flex gap-2">
                  {["light", "dark", "system"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => markDirty(setAppearance)((p) => ({ ...p, theme: opt }))}
                      className="flex-1 rounded-lg py-2 text-sm capitalize transition-colors"
                      style={{
                        border: `1px solid ${appearance.theme === opt ? tokens.accent : tokens.border}`,
                        color: appearance.theme === opt ? tokens.accent : tokens.muted,
                        backgroundColor: appearance.theme === opt ? tokens.accentSoft : tokens.bg,
                        fontWeight: appearance.theme === opt ? 600 : 500,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Density">
                <div className="flex gap-2">
                  {["compact", "comfortable", "spacious"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => markDirty(setAppearance)((p) => ({ ...p, density: opt }))}
                      className="flex-1 rounded-lg py-2 text-sm capitalize transition-colors"
                      style={{
                        border: `1px solid ${appearance.density === opt ? tokens.accent : tokens.border}`,
                        color: appearance.density === opt ? tokens.accent : tokens.muted,
                        backgroundColor: appearance.density === opt ? tokens.accentSoft : tokens.bg,
                        fontWeight: appearance.density === opt ? 600 : 500,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>
              <Toggle
                label="Reduce motion"
                description="Minimize animations across the app."
                checked={appearance.reduceMotion}
                onChange={(val) => markDirty(setAppearance)((p) => ({ ...p, reduceMotion: val }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-end gap-3 px-8 py-4"
        style={{ borderTop: `1px solid ${tokens.border}`, backgroundColor: tokens.bg }}
      >
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{ color: tokens.muted }}
          onClick={() => setDirty(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: saved ? tokens.accent : tokens.accent }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.accentHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = tokens.accent)}
        >
          {saved ? <Check size={15} /> : null}
          {saved ? "Saved" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
