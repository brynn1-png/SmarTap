import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./starter.css";

const contacts = [
  { label: "Call", detail: "+63 0916 370 9474", href: "tel:+639163709474" },
  { label: "Text", detail: "+63 0916 370 9474", href: "sms:+639163709474" },
  { label: "Email", detail: "lloydpucyutan01@gmail.com", href: "mailto:lloydpucyutan01@gmail.com" },
  { label: "Messenger", href: "https://m.me/lloydpucyutan" },
  { label: "Location", detail: "San Pablo City, Laguna", href: "https://www.google.com/maps/search/?api=1&query=Brgy.%20San%20Antonio%202%2C%20San%20Pablo%20City%2C%20Laguna" },
];

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function StarterDemo() {
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("dark");

  function saveContact() {
    const vcard = ["BEGIN:VCARD", "VERSION:3.0", "FN:Lloyd Pucyutan", "TEL;TYPE=CELL:+639163709474", "EMAIL:lloydpucyutan01@gmail.com", "ADR;TYPE=HOME:;;Brgy. San Antonio 2, San Pablo City, Laguna;;;;", "ORG:SmarTap", "END:VCARD"].join("\r\n");
    const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "lloyd-pucyutan.vcf";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Contact card downloaded.");
  }

  async function shareCard() {
    try {
      if (navigator.share) await navigator.share({ title: "Lloyd Pucyutan | SmarTap", url: location.href });
      else {
        await navigator.clipboard.writeText(location.href);
        setStatus("Card link copied.");
      }
    } catch (error) {
      if (error.name !== "AbortError") setStatus("Use your browser’s share or copy option.");
    }
  }

  return <div className="page">
    <main>
      <div className="theme-switch" role="group" aria-label="Card color mode"><button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>Light</button><button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dark</button></div>
      <article className={`card theme-${theme}`} aria-labelledby="profile-name">
        <div className="card-hero">
          <div className="brand"><img src={theme === "dark" ? "/smartap-mark.svg" : "/smartap-mark-dark.svg"} alt="" /></div>
          <div className="portrait"><img src="/hero-editorial-branded.png" alt="Illustrative portrait from the SmarTap project" /></div>
          <div className="identity"><h1 id="profile-name">Lloyd Pucyutan</h1><span>San Pablo City · Laguna</span></div>
        </div>
        <div className="card-details">
          <div className="action-row"><button type="button" className="save-button" onClick={saveContact}>Save contact <Arrow /></button><button type="button" className="share-button" onClick={shareCard}>Share card <Arrow /></button></div>
          <div className="contact-list">{contacts.map(({ label, detail, href }) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}><span><strong>{label}</strong>{detail && <small>{detail}</small>}</span><Arrow /></a>)}</div>
          <div className="social-list"><a href="https://www.facebook.com/lloyd.pucyutan.01" target="_blank" rel="noopener noreferrer">Facebook <Arrow /></a><a href="https://www.instagram.com/_loidiii/" target="_blank" rel="noopener noreferrer">Instagram <Arrow /></a></div>
          <div className="product-note"><img src="/card-editorial-branded.png" alt="A SmarTap card beside a phone" loading="lazy" /></div>
        </div>
        <footer className="card-footer"><img src={theme === "dark" ? "/smartap-logo.svg" : "/smartap-logo-dark.svg"} alt="SmarTap" /></footer>
      </article>
      <p className="sample-note">Sample portrait</p>
      <p className="status" role="status" aria-live="polite">{status}</p>
    </main>
  </div>;
}

createRoot(document.getElementById("root")).render(<StarterDemo />);
