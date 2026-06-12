// pages/seller/SellerRegister.jsx


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Personal Info',  icon: '👤' },
  { id: 2, label: 'Business Info',  icon: '🏪' },
  { id: 3, label: 'Address',        icon: '📍' },
  { id: 4, label: 'Bank & Payment', icon: '💳' },
];

const DIVISIONS = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna',
                   'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'];
const CATEGORIES = ['Food & GI Products', 'Fashion & Clothing', 'Handicrafts',
                    'Pottery & Ceramics', 'Leather Goods', 'Jewelry', 'Other'];

const INITIAL = {
  // Step 1
  full_name: '', email: '', phone: '', nid_number: '',
  password: '', confirm_password: '',
  // Step 2
  company_name: '', business_type: 'individual', trade_license: '',
  tin_number: '', business_phone: '', category: '', tagline: '',
  // Step 3
  division: '', district: '', upazila: '', full_address: '',
  // Step 4
  bank_name: '', bank_account_no: '', bank_account_name: '',
  bank_branch: '', bkash_number: '', nagad_number: '',
};

export default function SellerRegister() {
  const { register } = useSellerAuth();
  const navigate     = useNavigate();

  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState(INITIAL);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  // ── Per-step validation ──────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.full_name)      e.full_name      = 'Full name is required.';
      if (!form.email)          e.email          = 'Email is required.';
      if (!form.phone)          e.phone          = 'Phone is required.';
      if (!form.nid_number)     e.nid_number     = 'NID number is required.';
      if (form.password.length < 8) e.password  = 'Password must be at least 8 characters.';
      if (form.password !== form.confirm_password)
        e.confirm_password = 'Passwords do not match.';
    }
    if (step === 2) {
      if (!form.company_name)   e.company_name   = 'Company/shop name is required.';
      if (!form.business_type)  e.business_type  = 'Business type is required.';
      if (!form.category)       e.category       = 'Category is required.';
    }
    if (step === 3) {
      if (!form.division)       e.division       = 'Division is required.';
      if (!form.district)       e.district       = 'District is required.';
      if (!form.full_address)   e.full_address   = 'Address is required.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      setDone(true);
    } catch (err) {
      const d = err.response?.data || {};
      if (typeof d === 'object') setErrors(d);
      else setErrors({ general: 'Registration failed. Please try again.' });
      // Go back to relevant step
      if (d.email || d.phone || d.nid_number || d.password) setStep(1);
      else if (d.company_name) setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (done) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-10 text-center rounded shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Application Submitted!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Your seller application has been received. Our team will review it within
          <strong> 2–3 business days</strong>. We'll send an email once approved.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded p-4 text-sm text-amber-800 mb-6 text-left">
          <strong>While you wait:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Complete your seller profile</li>
            <li>Prepare your product photos</li>
            <li>Check your email for updates</li>
          </ul>
        </div>
        <button onClick={() => navigate('/seller/dashboard')}
          className="w-full bg-[#A33B26] text-white py-3 text-sm font-bold uppercase tracking-widest rounded hover:bg-[#8B2F1D]">
          Go to Dashboard
        </button>
        <Link to="/" className="block mt-3 text-sm text-gray-400 hover:text-gray-600">
          Back to main site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <div className="border-[1.5px] border-[#A33B26] inline-block px-4 py-1.5 mb-4">
              <span className="text-[#A33B26] text-lg font-bold tracking-[0.2em] uppercase">SOMAGOAM</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Seller Registration</h1>
          <p className="text-gray-500 text-sm mt-1">Apply to sell on Somagoam marketplace</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  step > s.id
                    ? 'bg-green-500 border-green-500 text-white'
                    : step === s.id
                    ? 'bg-[#A33B26] border-[#A33B26] text-white'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step > s.id ? <Check size={16} /> : s.id}
                </div>
                <span className={`text-[10px] mt-1 font-semibold uppercase tracking-wider hidden sm:block ${
                  step === s.id ? 'text-[#A33B26]' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 mx-1 ${step > s.id ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <span className="text-2xl">{STEPS[step - 1].icon}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Step {step}: {STEPS[step - 1].label}
              </h2>
              <p className="text-xs text-gray-400">
                {step === 1 && "Your personal details for account verification"}
                {step === 2 && "Details about your business or shop"}
                {step === 3 && "Your business location and address"}
                {step === 4 && "Payment info for receiving your earnings"}
              </p>
            </div>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>

            {/* ── Step 1: Personal ─────────────────────────────────────── */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Full Name *"       name="full_name"         value={form.full_name}         onChange={handleChange} error={errors.full_name}         span={2} />
                <F label="Email Address *"   name="email"             value={form.email}             onChange={handleChange} error={errors.email}             type="email" />
                <F label="Phone Number *"    name="phone"             value={form.phone}             onChange={handleChange} error={errors.phone}             placeholder="+880 1XXX XXXXXX" />
                <F label="NID / Passport No *" name="nid_number"      value={form.nid_number}        onChange={handleChange} error={errors.nid_number}        span={2} />
                <F label="Password *"        name="password"          value={form.password}          onChange={handleChange} error={errors.password}          type="password" placeholder="Min. 8 characters" />
                <F label="Confirm Password *" name="confirm_password" value={form.confirm_password}  onChange={handleChange} error={errors.confirm_password}  type="password" />
              </div>
            )}

            {/* ── Step 2: Business ─────────────────────────────────────── */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Shop / Company Name *" name="company_name" value={form.company_name} onChange={handleChange} error={errors.company_name} span={2} />
                
                <div>
                  <label className={labelClass}>Business Type *</label>
                  <select name="business_type" value={form.business_type} onChange={handleChange} className={inputClass}>
                    <option value="individual">Individual / Sole Proprietor</option>
                    <option value="company">Registered Company</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Main Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className={errorClass}>{errors.category}</p>}
                </div>

                <F label="Trade License No" name="trade_license" value={form.trade_license} onChange={handleChange} placeholder="Optional" />
                <F label="TIN / VAT No"     name="tin_number"    value={form.tin_number}    onChange={handleChange} placeholder="Optional" />
                <F label="Business Phone"   name="business_phone" value={form.business_phone} onChange={handleChange} placeholder="Optional" />
                <F label="Tagline"          name="tagline"        value={form.tagline}       onChange={handleChange} placeholder="e.g. Handmade with love" span={2} />
              </div>
            )}

            {/* ── Step 3: Address ──────────────────────────────────────── */}
            {step === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Division *</label>
                  <select name="division" value={form.division} onChange={handleChange} className={inputClass}>
                    <option value="">Select division</option>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.division && <p className={errorClass}>{errors.division}</p>}
                </div>
                <F label="District *" name="district" value={form.district} onChange={handleChange} error={errors.district} />
                <F label="Upazila"    name="upazila"  value={form.upazila}  onChange={handleChange} />
                <F label="Full Address *" name="full_address" value={form.full_address} onChange={handleChange} error={errors.full_address} span={2} />
              </div>
            )}

            {/* ── Step 4: Bank / Payment ───────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Bank Account (for payments)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <F label="Bank Name"           name="bank_name"          value={form.bank_name}          onChange={handleChange} />
                    <F label="Account Number"      name="bank_account_no"    value={form.bank_account_no}    onChange={handleChange} />
                    <F label="Account Holder Name" name="bank_account_name"  value={form.bank_account_name}  onChange={handleChange} />
                    <F label="Branch Name"         name="bank_branch"        value={form.bank_branch}        onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Mobile Banking (optional)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <F label="bKash Number" name="bkash_number" value={form.bkash_number} onChange={handleChange} placeholder="01XXXXXXXXX" />
                    <F label="Nagad Number" name="nagad_number" value={form.nagad_number} onChange={handleChange} placeholder="01XXXXXXXXX" />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded p-4 text-xs text-amber-800">
                  ℹ️ Payment info can be updated later from your dashboard. At least one payment method is recommended.
                </div>
              </div>
            )}

            {/* ── Navigation buttons ───────────────────────────────────── */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button type="button" onClick={handleBack}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded hover:bg-gray-50">
                  ← Back
                </button>
              ) : (
                <Link to="/seller/login" className="text-sm text-gray-400 hover:text-gray-600">
                  Already have an account?
                </Link>
              )}

              <button type="submit" disabled={loading}
                className="bg-[#A33B26] text-white px-8 py-2.5 text-sm font-bold uppercase tracking-widest rounded hover:bg-[#8B2F1D] disabled:opacity-60">
                {step < 4
                  ? 'Next →'
                  : loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By registering you agree to Somagoam's{' '}
          <a href="/terms" className="underline">Seller Terms</a>
        </p>
      </div>
    </div>
  );
}

// ── Reusable field ────────────────────────────────────────────────────────────
const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5";
const inputClass = "w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#A33B26]";
const errorClass = "text-red-500 text-xs mt-1";

function F({ label, name, value, onChange, error, type = 'text', placeholder = '', span }) {
  return (
    <div className={span === 2 ? 'sm:col-span-2' : ''}>
      <label className={labelClass}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
      />
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
