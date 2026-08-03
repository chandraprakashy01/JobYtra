import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    // In production this would POST to an API
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accentBlue/10 border border-accentBlue/25 rounded-full text-accentBlue text-sm font-medium mb-6">
          <MessageSquare className="w-4 h-4" />
          Get in Touch
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4 leading-tight">
          Contact{' '}
          <span className="bg-gradient-to-r from-accentBlue to-blue-400 bg-clip-text text-transparent">
            Us
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          Questions, feedback, or partnership enquiries — we'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* Info panel */}
        <div className="lg:col-span-2 space-y-6">
          {[
            { icon: Mail,  label: 'Email',   value: 'placements@jobytra.edu.in', href: 'mailto:placements@jobytra.edu.in' },
            { icon: Phone, label: 'Phone',   value: '+91-761-XXXXXXX',        href: 'tel:+91761XXXXXXX' },
            { icon: MapPin,label: 'Address', value: 'JobYtra Campus, Ring Road No. 1, Jabalpur, MP – 482001', href: null },
            { icon: Clock, label: 'Hours',   value: 'Mon – Sat: 9:00 AM – 5:00 PM', href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="card flex items-start gap-4">
              <div className="p-2 rounded-lg bg-accentBlue/10 border border-accentBlue/20 shrink-0">
                <Icon className="w-5 h-5 text-accentBlue" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                {href ? (
                  <a href={href} className="text-gray-300 text-sm hover:text-accentBlue transition-colors duration-200">{value}</a>
                ) : (
                  <p className="text-gray-300 text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="card flex flex-col items-center justify-center text-center h-full py-16 gap-4">
              <CheckCircle className="w-14 h-14 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Thanks for reaching out. Our placement team will get back to you within 24–48 hours.
              </p>
              <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }} className="btn-secondary mt-2">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="card space-y-5">
              <h2 className="text-lg font-semibold text-white mb-1">Send a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Full Name</label>
                  <input name="name" value={form.name} onChange={handle} required placeholder="John Doe" className="input-field" />
                </div>
                <div>
                  <label className="label-text">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handle} required placeholder="you@jobytra.edu.in" className="input-field" />
                </div>
              </div>

              <div>
                <label className="label-text">Subject</label>
                <input name="subject" value={form.subject} onChange={handle} required placeholder="Placement query / Partnership" className="input-field" />
              </div>

              <div>
                <label className="label-text">Message</label>
                <textarea name="message" value={form.message} onChange={handle} required rows={5} placeholder="Tell us how we can help..." className="input-field resize-none" />
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
