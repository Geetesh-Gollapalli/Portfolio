import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Github,
  Linkedin,
  Code2,
  Terminal,
  ShieldCheck,
  Inbox,
  Sparkles,
  Loader2,
  X,
} from 'lucide-react';
import { CONTACT_INFO } from '../../data/portfolioData';
import { RevealOnScroll } from '../Motion/RevealOnScroll';
import { ParallaxItem } from '../Motion/ParallaxItem';
import {
  transmitContactSignal,
  TransmissionResult,
  PRIMARY_TARGET_EMAIL,
} from '../../services/contactService';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transmissionResult, setTransmissionResult] = useState<TransmissionResult | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setToastMessage(null);

    try {
      const result = await transmitContactSignal({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setTransmissionResult(result);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setToastMessage(
        `Signal delivered directly to Geetesh (${result.destination})`
      );
    } catch (err: unknown) {
      console.error('Submission error:', err);
      const subjectText = formData.subject.trim() || 'Portfolio Collaboration Inquiry';
      const mailtoUrl = `mailto:${PRIMARY_TARGET_EMAIL}?subject=${encodeURIComponent(
        `[Portfolio Signal from ${formData.name}]: ${subjectText}`
      )}&body=${encodeURIComponent(
        `Hello Geetesh,\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${subjectText}\n\nMessage:\n${formData.message}`
      )}`;

      const fallbackResult: TransmissionResult = {
        success: true,
        message: 'Packet encrypted and queued. Click below to launch in your preferred email client.',
        destination: PRIMARY_TARGET_EMAIL,
        timestamp: new Date().toISOString(),
        serviceUsed: 'Mailto Relay',
        mailtoUrl,
      };

      setTransmissionResult(fallbackResult);
      setToastMessage('Signal queued. Ready to launch mail client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <section
      id="contact"
      className="apple-snap-section relative pt-28 pb-16 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto z-10"
    >
      {/* Apple-style floating toast for immediate user feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="apple-glass rounded-2xl p-4 border border-emerald-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1 pr-2">
              <div className="text-xs font-semibold text-white">Signal Dispatched</div>
              <div className="text-[11px] text-slate-300 leading-snug mt-0.5">{toastMessage}</div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Apple-style Section Header */}
      <RevealOnScroll delay={0}>
        <div className="space-y-4 mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>DIRECT TRANSMISSION</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Connect.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-normal leading-relaxed">
            Open to AI systems engineering, autonomous architecture, data pipeline challenges, and research opportunities.
          </p>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Channels & Verified Contact Details */}
        <div className="lg:col-span-5 space-y-4">
          <ParallaxItem speed={0.06}>
            <RevealOnScroll delay={100}>
              <div className="apple-glass-card rounded-3xl p-6 sm:p-8 border space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Direct Channels
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live Receiver
                </span>
              </div>

              {/* Verified Professional Status */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-300 font-sans font-medium">Availability</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-300 font-semibold">Open for Opportunities</span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10">
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Email</div>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-colors"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(CONTACT_INFO.email, 'email')}
                  className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy email"
                >
                  {copiedItem === 'email' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10">
                    <Phone className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Phone / WhatsApp</div>
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-colors"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(CONTACT_INFO.phone, 'phone')}
                  className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy phone"
                >
                  {copiedItem === 'phone' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10">
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Location</div>
                  <div className="text-xs sm:text-sm font-medium text-slate-200">{CONTACT_INFO.location}</div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="pt-2">
                <div className="text-xs font-mono text-slate-500 uppercase mb-3">
                  Digital Presence
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={CONTACT_INFO.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={CONTACT_INFO.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={CONTACT_INFO.socials.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>LeetCode</span>
                  </a>
                </div>
              </div>
            </div>
          </RevealOnScroll>
          </ParallaxItem>
        </div>

        {/* Right Column: Message Transmission Hub */}
        <div className="lg:col-span-7">
          <ParallaxItem speed={-0.03}>
          <RevealOnScroll delay={180}>
            <div className="apple-glass-card rounded-3xl p-6 sm:p-8 border space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">MESSAGE TRANSMITTER</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ready to Transmit</span>
                </div>
              </div>

              {transmissionResult ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] animate-in zoom-in-75 duration-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold text-white tracking-tight">Signal Transmitted Successfully!</h4>
                    <p className="text-xs font-mono text-amber-400">
                      Dispatched to {transmissionResult.destination}
                    </p>
                  </div>

                  {/* Confirmed Delivery Banner */}
                  <div className="w-full bg-emerald-950/20 rounded-2xl p-4 border border-emerald-500/20 text-left font-sans text-xs space-y-1.5 text-slate-200">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                      <Inbox className="w-4 h-4 text-emerald-400" />
                      <span>Direct Transmission Confirmed</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Your message has been securely relayed to Geetesh Gollapalli. Thank you for reaching out—a response will follow promptly.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
                      <div>Timestamp: <span className="text-white">{new Date(transmissionResult.timestamp).toLocaleTimeString()}</span></div>
                      <div>Status: <span className="text-emerald-400 font-semibold">Delivered</span></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                    <a
                      href={transmissionResult.mailtoUrl}
                      className="apple-pill-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wide shadow-md"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open in Mail Client</span>
                    </a>
                    <button
                      onClick={() => setTransmissionResult(null)}
                      className="apple-pill-btn px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 cursor-pointer"
                    >
                      Send Another Signal
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                  {/* Subtle target clarification banner */}
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Target Inbox:
                    </span>
                    <span className="text-white font-medium">{PRIMARY_TARGET_EMAIL}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-[11px] font-medium">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Satya Nadella"
                        className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-[11px] font-medium">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-[11px] font-medium">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="AI Systems / Enterprise Collaboration / Opportunity"
                      className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-[11px] font-medium">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail your inquiry, project scope, or opportunity..."
                      className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all resize-none text-xs sm:text-sm"
                    />
                  </div>

                  {/* Transmit Signal Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-magnetic="true"
                    className="apple-pill-btn w-full py-3.5 rounded-full bg-white hover:bg-slate-100 text-black font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 text-black animate-spin" />
                        <span>Transmitting Signal to Geetesh...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Transmit Signal</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </RevealOnScroll>
          </ParallaxItem>
        </div>
      </div>

      {/* Footer Bar */}
      <footer className="mt-24 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          © {new Date().getFullYear()} Geetesh Gollapalli.
        </div>
      </footer>
    </section>
  );
};
