"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import "./form.css";

type Gender = "male" | "female" | "other" | "";
type YesNo = "yes" | "no" | "";

type FormState = {
  fullName: string;
  id: string;
  father: string;
  mother: string;
  dob: string;
  gender: Gender;
  phone: string;
  email: string;
  presentAddress: string;
  permanentAddress: string;
  institution: string;
  classYear: string;
  whyJoin: string;
  experience: YesNo;
  experienceDetails: string;
  interestVolunteering: boolean;
  interestEvent: boolean;
  interestLeadership: boolean;
  interestSocial: boolean;
  interestOthers: boolean;
  interestOthersText: string;
  availability: YesNo;
};

const initialState: FormState = {
  fullName: "",
  id: "",
  father: "",
  mother: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  presentAddress: "",
  permanentAddress: "",
  institution: "",
  classYear: "",
  whyJoin: "",
  experience: "",
  experienceDetails: "",
  interestVolunteering: false,
  interestEvent: false,
  interestLeadership: false,
  interestSocial: false,
  interestOthers: false,
  interestOthersText: "",
  availability: "",
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [photo, setPhoto] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const LOGO_PATH = "/generated-logo.png";

  useEffect(() => {
    setIsClient(true);
    // Disable right-click globally
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const value = String(e.target?.result ?? "");
      setPhoto(value);
    };
    reader.readAsDataURL(file);
  };

  const resetAll = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setForm(initialState);
      setPhoto("");
    }
  };

  const validateForm = () => {
    if (!form.fullName.trim()) return "Please enter Member Full Name.";
    if (!form.id.trim()) return "Please enter Member ID.";
    if (!form.father.trim()) return "Please enter Father's Name.";
    if (!form.mother.trim()) return "Please enter Mother's Name.";
    if (!form.dob.trim()) return "Please enter a valid Date of Birth.";
    if (!form.gender) return "Please select Gender.";
    if (!photo) return "Please upload a Member Photo.";
    if (!form.phone.trim().match(/^[0-9+\-\s()]{10,15}$/)) return "Please enter a valid Phone Number.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid Email Address.";
    if (!form.presentAddress.trim()) return "Please enter Present Address.";
    if (!form.permanentAddress.trim()) return "Please enter Permanent Address.";
    if (!form.institution.trim()) return "Please enter Current Institution.";
    if (!form.classYear.trim()) return "Please enter Class / Year.";
    if (!form.whyJoin.trim()) return "Please state why you want to join.";
    if (!form.experience) return "Please indicate previous volunteering experience.";
    if (!form.availability) return "Please indicate your availability.";
    return null;
  };

  const openPreview = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    if (!formRef.current) return;

    // Clone the form for preview
    const clone = formRef.current.cloneNode(true) as HTMLDivElement;
    
    // Sync input values (cloneNode doesn't copy current JS state of inputs)
    const originalInputs = formRef.current.querySelectorAll('input, textarea');
    const clonedInputs = clone.querySelectorAll('input, textarea');
    originalInputs.forEach((orig, index) => {
      const cloned = clonedInputs[index] as HTMLInputElement | HTMLTextAreaElement;
      if (orig instanceof HTMLInputElement) {
        if (orig.type === 'checkbox' || orig.type === 'radio') {
          if (orig.checked) cloned.setAttribute('checked', 'true');
        } else {
          cloned.setAttribute('value', orig.value);
        }
      } else if (orig instanceof HTMLTextAreaElement) {
        cloned.textContent = orig.value;
      }
    });

    // Inject Auto-Date for signature
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const sigDateDiv = clone.querySelector('.sigBlock:last-child .sigLine');
    if (sigDateDiv) sigDateDiv.textContent = today;

    // Add Receipt Timestamp
    const now = new Date();
    const timestamp = `Downloaded: ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const stampDiv = document.createElement('div');
    stampDiv.className = 'receipt-stamp';
    stampDiv.style.cssText = "position: absolute; bottom: 10px; right: 25px; font-size: 0.6rem; color: #9ab; font-family: monospace;";
    stampDiv.textContent = timestamp;
    clone.appendChild(stampDiv);

    // Open new print window
    const previewWindow = window.open("", "_blank", "width=1100,height=900");
    if (!previewWindow) {
      alert("Please allow pop-ups to view the PDF.");
      return;
    }

    const fileName = `${form.fullName.replace(/\s+/g, '_')}_ID-${form.id}`;

    previewWindow.document.open();
    previewWindow.document.write(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${fileName}</title>
        <title>${fileName}</title>
        <style>
          /* ═══════════════════════════════════════════════
             INJECTED MASTER FORM STYLES FOR PRINT PARITY
             ═══════════════════════════════════════════════ */
          body { margin: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: 'Inter', sans-serif; }
          .preview-shell { padding: 40px 0; background: #f0f2f5; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
          .preview-controls { width: 210mm; display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; background: #fff; padding: 20px 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .print-btn { background: #0d9f9f; color: #fff; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 1rem; }
          
          /* Form Structure */
          .paper-frame-dynamic { width: 210mm; min-height: 297mm; height: auto; background: #fff; position: relative; box-sizing: border-box; box-shadow: 0 0 30px rgba(0,0,0,0.2); overflow: hidden; }
          .paper-content { width: 210mm; height: 297mm; background: #fff; position: relative; overflow: hidden; box-sizing: border-box; display: flex; flex-direction: column; }
          .watermark { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; opacity: 0.04; pointer-events: none; }
          .watermark img { width: 320px; }
          .paperHeader { background: #1a5f86 !important; padding: 10px 15px; display: grid; grid-template-columns: 60px 1fr 60px; gap: 15px; align-items: center; position: relative; z-index: 2; }
          .paperHeader .logo-wrap { width: 60px; height: 60px; background: #fff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }
          .paperHeader img { width: 85%; height: 85%; object-fit: contain; }
          .paperHeaderTitle { text-align: center; }
          .paperHeaderTitle h1 { margin: 0; color: #fff !important; font-size: 1rem; font-weight: 900; letter-spacing: 0.03em; }
          .paperHeaderTitle p { margin: 2px 0 0; color: #f5d98f !important; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; }
          .paperBody { padding: 15px 30px 20px; position: relative; z-index: 2; flex-grow: 1; }
          .section { margin-bottom: 20px; }
          .sectionTitle { background: #1a5f86 !important; color: #fff !important; padding: 5px 15px; font-size: 0.8rem; font-weight: 800; border-radius: 4px; display: block; text-transform: uppercase; margin-bottom: 12px; }
          .personal-layout { display: grid; grid-template-columns: 1fr auto; gap: 20px; }
          .form-grid { display: grid; gap: 8px; }
          .form-row { display: flex; align-items: baseline; gap: 10px; }
          .label { font-size: 0.75rem; font-weight: 700; color: #203a43; white-space: nowrap; }
          .form-input { border: none; border-bottom: 1.2px solid #cbd5e1; font-size: 0.75rem; padding: 2px 5px; width: 100%; outline: none; background: transparent; color: #1e293b; }
          .photo-box { width: 90px; height: 110px; border: 1.5px solid #94a3b8; background: #f8fafc !important; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #64748b; overflow: hidden; }
          .photo-box img { width: 100%; height: 100%; object-fit: cover; }
          .choice-row { display: flex; align-items: center; gap: 15px; margin: 2px 0; }
          .choice-item { display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 500; color: #334155; }
          .form-textarea { width: 100%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px; font-size: 0.75rem; min-height: 48px; resize: none; background: #fcfcfc; }
          .terms-section { margin-top: 15px; border: 1.2px dashed #94a3b8; padding: 10px 15px; border-radius: 8px; background: #f8fafc !important; }
          .terms-title { font-size: 0.78rem; font-weight: 800; color: #1a5f86; margin-bottom: 4px; text-decoration: underline; }
          .terms-list { margin: 0; padding-left: 20px; font-size: 0.7rem; color: #475569; line-height: 1.6; }
          .signature-area { margin-top: 30px; display: flex; justify-content: flex-end; gap: 50px; padding-right: 20px; }
          .sigLine { border-bottom: 1.8px solid #1a3a5a; min-width: 150px; height: 28px; display: flex; align-items: flex-end; justify-content: center; font-size: 0.75rem; color: #1e293b; padding-bottom: 2px; }
          .sigLabel { display: block; text-align: center; font-size: 0.7rem; font-weight: 700; color: #64748b; margin-top: 5px; }

          @page { size: A4 portrait; margin: 0; }
          @media print {
            .preview-controls { display: none !important; }
            .preview-shell { padding: 0; background: #fff; }
            .paper-frame-dynamic { box-shadow: none; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="preview-shell">
          <div class="preview-controls">
            <span style="font-weight: 800; color: #1a5f86;">Premium Digital Receipt</span>
            <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
          </div>
          ${clone.outerHTML}
        </div>
      </body>
      </html>
    `);
    previewWindow.document.close();
  };

  if (!isClient) return null;

  return (
    <div className="utility-wrapper" onContextMenu={(e) => e.preventDefault()} suppressHydrationWarning>
      <header className="utility-header">
        <div className="control-card">
          <div className="brand-minimal">
            <img src={LOGO_PATH} alt="Logo" />
            <div>
              <h1>NEXTGEN YOUTH CLUB UTTARA</h1>
              <p>Member Application System</p>
            </div>
          </div>
          <div className="btn-group">
            <button className="util-btn reset" onClick={resetAll}>Reset</button>
            <div className="upload-wrapper">
              <label htmlFor="photo-main" className="util-btn upload">Upload Photo</label>
              <input id="photo-main" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            </div>
            <button className="util-btn download" onClick={openPreview}>
              View & Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="form-main-area">
        <div className="paper-frame-dynamic" ref={formRef}>
          <div className="paper-content">
            <div className="watermark">
              <img src={LOGO_PATH} alt="" aria-hidden="true" />
            </div>

            <div className="paperHeader">
              <div className="logo-wrap">
                <img src={LOGO_PATH} alt="Logo" />
              </div>
              <div className="paperHeaderTitle">
                <h1>NEXTGEN YOUTH CLUB UTTARA-BD-0103</h1>
                <p>GENERAL MEMBER JOIN FORM</p>
              </div>
              <div className="logo-wrap">
                <img src={LOGO_PATH} alt="Logo" />
              </div>
            </div>

            <div className="paperBody">
              {/* 1. PERSONAL */}
              <div className="section">
                <h3 className="sectionTitle">1. Personal Information</h3>
                <div className="personal-layout">
                  <div className="form-grid">
                    <div className="form-row">
                      <span className="label">Full Name:</span>
                      <input className="form-input" placeholder="Enter Full Name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                      <span className="label" style={{ marginLeft: 15 }}>ID:</span>
                      <input className="form-input" style={{ maxWidth: 80 }} placeholder="ID" value={form.id} onChange={(e) => update("id", e.target.value)} />
                    </div>
                    <div className="form-row">
                      <span className="label">Father's Name:</span>
                      <input className="form-input" value={form.father} onChange={(e) => update("father", e.target.value)} />
                    </div>
                    <div className="form-row">
                      <span className="label">Mother's Name:</span>
                      <input className="form-input" value={form.mother} onChange={(e) => update("mother", e.target.value)} />
                    </div>
                    <div className="form-row">
                      <span className="label">Date of Birth:</span>
                      <input className="form-input" type="date" style={{ maxWidth: 140 }} value={form.dob} onChange={(e) => update("dob", e.target.value)} />
                      <div className="choice-row" style={{ marginLeft: 20 }}>
                        <span className="label">Gender:</span>
                        <label className="choice-item"><input type="radio" name="gender" checked={form.gender === "male"} onChange={() => update("gender", "male")} /> Male</label>
                        <label className="choice-item"><input type="radio" name="gender" checked={form.gender === "female"} onChange={() => update("gender", "female")} /> Female</label>
                      </div>
                    </div>
                  </div>
                  <div className="photo-box">
                    {photo ? <img src={photo} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>Photo</span>}
                  </div>
                </div>
              </div>

              {/* 2. CONTACT */}
              <div className="section">
                <h3 className="sectionTitle">2. Contact Information</h3>
                <div className="form-grid">
                  <div className="form-row"><span className="label">Phone:</span><input className="form-input" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
                  <div className="form-row"><span className="label">Email:</span><input className="form-input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                  <div className="form-row"><span className="label">Present Address:</span><input className="form-input" value={form.presentAddress} onChange={(e) => update("presentAddress", e.target.value)} /></div>
                  <div className="form-row"><span className="label">Permanent Address:</span><input className="form-input" value={form.permanentAddress} onChange={(e) => update("permanentAddress", e.target.value)} /></div>
                </div>
              </div>

              {/* 3. EDUCATION */}
              <div className="section">
                <h3 className="sectionTitle">3. Educational Information</h3>
                <div className="form-grid">
                  <div className="form-row"><span className="label">Institution:</span><input className="form-input" value={form.institution} onChange={(e) => update("institution", e.target.value)} /></div>
                  <div className="form-row"><span className="label">Class / Year:</span><input className="form-input" value={form.classYear} onChange={(e) => update("classYear", e.target.value)} /></div>
                </div>
              </div>

              {/* 4. CLUB INFO */}
              <div className="section">
                <h3 className="sectionTitle">4. Club Information</h3>
                <div className="form-grid">
                  <div className="form-row"><span className="label">Why joining?</span></div>
                  <textarea className="form-textarea" rows={2} value={form.whyJoin} onChange={(e) => update("whyJoin", e.target.value)} />
                  <div className="choice-row">
                    <span className="label">Previous Experience?</span>
                    <label className="choice-item"><input type="radio" name="exp" checked={form.experience === "yes"} onChange={() => update("experience", "yes")} /> Yes</label>
                    <label className="choice-item"><input type="radio" name="exp" checked={form.experience === "no"} onChange={() => update("experience", "no")} /> No</label>
                  </div>
                </div>
              </div>

              {/* 5. INTEREST */}
              <div className="section">
                <h3 className="sectionTitle">5. Area of Interest</h3>
                <div className="choice-row" style={{ gap: 20 }}>
                  <label className="choice-item"><input type="checkbox" checked={form.interestVolunteering} onChange={(e) => update("interestVolunteering", e.target.checked)} /> Volunteering</label>
                  <label className="choice-item"><input type="checkbox" checked={form.interestEvent} onChange={(e) => update("interestEvent", e.target.checked)} /> Events</label>
                  <label className="choice-item"><input type="checkbox" checked={form.interestLeadership} onChange={(e) => update("interestLeadership", e.target.checked)} /> Leadership</label>
                  <label className="choice-item"><input type="checkbox" checked={form.interestSocial} onChange={(e) => update("interestSocial", e.target.checked)} /> Social Work</label>
                </div>
              </div>

              {/* 6. AVAILABILITY */}
              <div className="section">
                <h3 className="sectionTitle">6. Availability</h3>
                <div className="choice-row">
                  <span className="label">Regular?</span>
                  <label className="choice-item"><input type="radio" name="avail" checked={form.availability === "yes"} onChange={() => update("availability", "yes")} /> Yes</label>
                  <label className="choice-item"><input type="radio" name="avail" checked={form.availability === "no"} onChange={() => update("availability", "no")} /> No</label>
                </div>
              </div>

              <div className="terms-section">
                <div className="terms-title">Terms & Conditions</div>
                <ul className="terms-list">
                  <li>Respect all members and follow club rules.</li>
                  <li>Maintain a positive attitude and attend meetings.</li>
                  <li>Participate actively in all club activities.</li>
                </ul>
              </div>

              <div className="signature-area">
                <div className="sigBlock">
                  <div className="sigLine"></div>
                  <span className="sigLabel">Signature</span>
                </div>
                <div className="sigBlock">
                  <div className="sigLine"></div>
                  <span className="sigLabel">Date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* DEVELOPER FOOTER */}
      <footer className="dev-footer">
        <div className="dev-content">
          <p>
            Developed by <a href="https://timonbiswas.vercel.app/" target="_blank" rel="noopener noreferrer">Timon Biswas</a>
          </p>
          <a href="mailto:timonbiswas33@gmail.com" className="dev-email">
            timonbiswas33@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
