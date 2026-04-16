'use client';

import React, { useState, useEffect, useRef } from 'react';

// We'll import html2pdf dynamically when needed to avoid SSR issues
let html2pdf: any = null;

const loadHtml2pdf = async () => {
  if (!html2pdf) {
    const module = await import('html2pdf.js');
    html2pdf = module.default || module;
  }
  return html2pdf;
};

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  id?: string;
  companyName: string;
  clientName: string;
  address: string;
  email: string;
  contact: string;
  billedBy: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  billedTo: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  invoiceNumber: number;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  lineItems: LineItem[];
  taxRate: number;
  discount: number;
  notes: string;
  bankDetails: string;
}

const CURRENCIES = ['USD', 'CAD', 'INR', 'EUR', 'GBP', 'AUD', 'SGD', 'JPY'];

interface InvoiceGeneratorProps {
  // Add future props here
}

export default function InvoiceGenerator({}: InvoiceGeneratorProps = {}) {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPreviousInvoices, setShowPreviousInvoices] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState<InvoiceData[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceData | null>(null);
  const [logo, setLogo] = useState<string>('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [invoice, setInvoice] = useState<InvoiceData>({
    companyName: 'Root Node Studio',
    clientName: '',
    address: '389 Bridge Ave, Windsor ON, N9B 2M3',
    email: '',
    contact: '',
    billedBy: {
      name: 'Chetan Thakur',
      address: '389 Bridge Ave, Windsor ON, N9B 2M3',
      email: 'tchetan308@gmail.com',
      phone: '5199657469',
    },
    billedTo: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    invoiceNumber: 1,
    invoiceDate: '',
    dueDate: '',
    currency: 'USD',
    lineItems: [
      { id: '1', description: '', quantity: 1, rate: 0 }
    ],
    taxRate: 0,
    discount: 0,
    notes: '',
    bankDetails: '',
  });

  useEffect(() => {
    setMounted(true);

    // Load admin status
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');

    // Load saved invoices
    const invoices = localStorage.getItem('invoices');
    if (invoices) {
      setSavedInvoices(JSON.parse(invoices));
    }

    // Load invoice counter
    const counter = localStorage.getItem('invoiceCounter');
    if (counter && !editingInvoice) {
      setInvoice(prev => ({ ...prev, invoiceNumber: parseInt(counter) }));
    }

    // Load bank details
    const bankDetails = localStorage.getItem('bankDetails');
    if (bankDetails) {
      setInvoice(prev => ({ ...prev, bankDetails }));
    }

    // Load logo
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }

    // Initialize dates only on client side
    const now = new Date();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    setInvoice(prev => ({
      ...prev,
      invoiceDate: prev.invoiceDate || now.toISOString().split('T')[0],
      dueDate: prev.dueDate || dueDate.toISOString().split('T')[0]
    }));
  }, [editingInvoice]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        localStorage.setItem('companyLogo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwap = () => {
    setInvoice(prev => ({
      ...prev,
      billedBy: prev.billedTo,
      billedTo: prev.billedBy,
    }));
  };

  const addLineItem = () => {
    setInvoice(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }
      ]
    }));
  };

  const removeLineItem = (id: string) => {
    if (invoice.lineItems.length > 1) {
      setInvoice(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter(item => item.id !== id)
      }));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateSubtotal = () => {
    return invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoice.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - invoice.discount;
  };

  const saveInvoice = () => {
    const invoiceToSave = {
      ...invoice,
      id: editingInvoice?.id || Date.now().toString(),
      savedAt: new Date().toISOString(),
    };

    const updatedInvoices = editingInvoice
      ? savedInvoices.map(inv => inv.id === editingInvoice.id ? invoiceToSave : inv)
      : [invoiceToSave, ...savedInvoices];

    setSavedInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

    if (!editingInvoice) {
      const newCounter = invoice.invoiceNumber + 1;
      localStorage.setItem('invoiceCounter', newCounter.toString());
      setInvoice(prev => ({ ...prev, invoiceNumber: newCounter }));
    }

    // Save bank details
    if (invoice.bankDetails) {
      localStorage.setItem('bankDetails', invoice.bankDetails);
    }

    alert('Invoice saved successfully!');
    setEditingInvoice(null);
  };

  const deleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      const updatedInvoices = savedInvoices.filter(inv => inv.id !== id);
      setSavedInvoices(updatedInvoices);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    }
  };

  const duplicateInvoice = (inv: InvoiceData) => {
    const newCounter = parseInt(localStorage.getItem('invoiceCounter') || '0') + 1;
    const duplicated = {
      ...inv,
      id: Date.now().toString(),
      invoiceNumber: newCounter,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    localStorage.setItem('invoiceCounter', newCounter.toString());
    setInvoice(duplicated);
    setEditingInvoice(null);
    setShowPreviousInvoices(false);
  };

  const editInvoice = (inv: InvoiceData) => {
    setInvoice(inv);
    setEditingInvoice(inv);
    setShowPreviousInvoices(false);
  };

  const exportToPDF = async () => {
    try {
      const html2pdfLib = await loadHtml2pdf();
      const element = document.getElementById('invoice-preview');
      if (element) {
        const opt = {
          margin: [15, 15, 15, 15],
          filename: `Invoice_${invoice.invoiceNumber}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, windowWidth: 650 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        html2pdfLib().set(opt).from(element).save();
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const resetInvoice = () => {
    const counter = parseInt(localStorage.getItem('invoiceCounter') || '0') + 1;
    setInvoice({
      companyName: 'Root Node Studio',
      clientName: '',
      address: '389 Bridge Ave, Windsor ON, N9B 2M3',
      email: '',
      contact: '',
      billedBy: { name: 'Chetan Thakur', address: '389 Bridge Ave, Windsor ON, N9B 2M3', email: 'tchetan308@gmail.com', phone: '5199657469' },
      billedTo: { name: '', address: '', email: '', phone: '' },
      invoiceNumber: counter,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: 'USD',
      lineItems: [{ id: '1', description: '', quantity: 1, rate: 0 }],
      taxRate: 0,
      discount: 0,
      notes: '',
      bankDetails: localStorage.getItem('bankDetails') || '',
    });
    setEditingInvoice(null);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-primary text-xl font-sans-tight">Loading...</div>
      </div>
    );
  }

  if (showPreviousInvoices && isAdmin) {
    return (
      <div className="min-h-screen bg-primary-dark p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold font-sans-tight text-primary">Previous Invoices</h1>
            <button
              onClick={() => setShowPreviousInvoices(false)}
              className="button-magnetic bg-accent-blue hover:bg-accent-indigo text-white px-6 py-3 rounded-smooth font-semibold font-sans-tight transition-all"
            >
              ← Back to Generator
            </button>
          </div>

          {savedInvoices.length === 0 ? (
            <div className="text-center py-20 modern-card rounded-medium">
              <p className="text-2xl text-secondary font-serif-drama">No invoices saved yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedInvoices.map((inv) => (
                <div key={inv.id} className="modern-card rounded-medium p-6 border border-slate hover:border-accent-blue transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-sans-tight text-primary">Invoice #{inv.invoiceNumber}</h3>
                      <p className="text-secondary mt-1">{inv.clientName || 'No client name'}</p>
                      <p className="text-muted text-sm mt-1">{inv.invoiceDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent-blue font-serif-drama">
                        {inv.currency} {inv.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 justify-end">
                    <button
                      onClick={() => editInvoice(inv)}
                      className="button-magnetic bg-accent-blue hover:bg-accent-indigo text-white px-4 py-2 rounded-smooth font-semibold font-sans-tight transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => duplicateInvoice(inv)}
                      className="button-magnetic bg-success hover:bg-green-600 text-white px-4 py-2 rounded-smooth font-semibold font-sans-tight transition-all"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => deleteInvoice(inv.id!)}
                      className="button-magnetic bg-danger hover:bg-red-600 text-white px-4 py-2 rounded-smooth font-semibold font-sans-tight transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="w-full px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-sans-tight text-primary">Invoice Generator</h1>
          <div className="flex gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowPreviousInvoices(true)}
                className="button-magnetic bg-accent-blue hover:bg-accent-indigo text-white px-4 py-2 rounded-smooth font-semibold font-sans-tight transition-all"
              >
                Previous Invoices
              </button>
            )}
            <button
              onClick={resetInvoice}
              className="button-magnetic bg-secondary-slate hover:bg-gray-600 text-white px-4 py-2 rounded-smooth font-semibold font-sans-tight transition-all"
            >
              New Invoice
            </button>
          </div>
        </div>

        {/* Invoice Form - Full Width Modern Card */}
        <div className="modern-card rounded-medium p-6 shadow-2xl w-full">
          {/* Logo Upload - Separate Section */}
          <div className="mb-6">
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              className="button-magnetic bg-accent-blue hover:bg-accent-indigo text-white px-4 py-2 rounded-smooth font-semibold font-sans-tight transition-all"
            >
              {logo ? 'Change Logo' : 'Upload Logo'}
            </button>
            {logo && (
              <img src={logo} alt="Company Logo" className="mt-3 h-16 object-contain" />
            )}
          </div>

          {/* Company Name */}
          <div className="mb-6 pb-4 border-b border-slate">
            <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Company Name</label>
            <input
              type="text"
              value={invoice.companyName}
              onChange={(e) => setInvoice({ ...invoice, companyName: e.target.value })}
              className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans"
            />
          </div>

          {/* Billed By / Billed To Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-bold font-sans-tight text-primary mb-4">Billed By</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={invoice.billedBy.name}
                  onChange={(e) => setInvoice({
                    ...invoice,
                    billedBy: { ...invoice.billedBy, name: e.target.value }
                  })}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                />
                <textarea
                  placeholder="Address"
                  value={invoice.billedBy.address}
                  onChange={(e) => setInvoice({
                    ...invoice,
                    billedBy: { ...invoice.billedBy, address: e.target.value }
                  })}
                  rows={2}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={invoice.billedBy.email}
                  onChange={(e) => setInvoice({
                    ...invoice,
                    billedBy: { ...invoice.billedBy, email: e.target.value }
                  })}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={invoice.billedBy.phone}
                  onChange={(e) => setInvoice({
                    ...invoice,
                    billedBy: { ...invoice.billedBy, phone: e.target.value }
                  })}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold font-sans-tight text-primary mb-4">Billed To</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={invoice.billedTo.name}
                  onChange={(e) => setInvoice({
                    ...invoice,
                    billedTo: { ...invoice.billedTo, name: e.target.value }
                  })}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                />
                <textarea
                  placeholder="Address"
                  value={invoice.billedTo.address}
                  onChange={(e) => setInvoice({
                    ...invoice,
                    billedTo: { ...invoice.billedTo, address: e.target.value }
                  })}
                  rows={2}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={invoice.billedTo.email}
                  onChange={(e) => setInvoice({
                    ...invoice,
                    billedTo: { ...invoice.billedTo, email: e.target.value }
                  })}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={invoice.billedTo.phone}
                  onChange={(e) => setInvoice({
                    ...invoice,
                    billedTo: { ...invoice.billedTo, phone: e.target.value }
                  })}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="button-magnetic w-full bg-accent-indigo hover:bg-accent-blue text-white py-2 rounded-smooth font-semibold font-sans-tight transition-all mb-4"
          >
            ⇄ Swap Billed By / Billed To
          </button>

          {/* Invoice Details */}
          <div className="grid md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Invoice #</label>
              <input
                type="number"
                value={invoice.invoiceNumber}
                onChange={(e) => setInvoice({ ...invoice, invoiceNumber: parseInt(e.target.value) })}
                className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
            </div>
            <div>
              <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Invoice Date</label>
              <input
                type="date"
                value={invoice.invoiceDate}
                onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
                className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
            </div>
            <div>
              <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Due Date</label>
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
            </div>
            <div>
              <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Currency</label>
              <select
                value={invoice.currency}
                onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
                className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr} value={curr} className="text-gray-900">{curr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-6">
            <h3 className="text-lg font-bold font-sans-tight text-primary mb-4">Line Items</h3>
            <div className="flex flex-col gap-3">
              {invoice.lineItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="col-span-6 bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue placeholder:text-muted"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="col-span-2 bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                  />
                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="col-span-2 bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue placeholder:text-muted"
                  />
                  <div className="col-span-1 text-primary text-center font-semibold font-sans-tight py-2">
                    {(item.quantity * item.rate).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeLineItem(item.id)}
                    className="col-span-1 bg-danger hover:bg-red-700 text-white px-1 py-2 rounded-smooth button-magnetic transition-all"
                    disabled={invoice.lineItems.length === 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 mb-6">
              <button
                onClick={addLineItem}
                className="button-magnetic w-full block bg-accent-blue hover:bg-accent-indigo text-white px-4 py-3 rounded-smooth font-semibold font-sans-tight transition-all"
              >
                + Add Line Item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="modern-card rounded-medium p-4 mb-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Tax Rate (%)</label>
                <input
                  type="number"
                  value={invoice.taxRate}
                  onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans"
                />
              </div>
              <div>
                <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Discount</label>
                <input
                  type="number"
                  value={invoice.discount}
                  onChange={(e) => setInvoice({ ...invoice, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans"
                />
              </div>
              <div className="md:col-span-2 flex items-end justify-end">
                <div className="text-right">
                  <div className="flex justify-between text-primary mb-1">
                    <span>Subtotal:</span>
                    <span className="font-semibold ml-3">{invoice.currency} {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-primary mb-1">
                    <span>Tax ({invoice.taxRate}%):</span>
                    <span className="font-semibold ml-3">{invoice.currency} {calculateTax().toFixed(2)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-danger mb-1">
                      <span>Discount:</span>
                      <span className="font-semibold ml-3">-{invoice.currency} {invoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-primary font-bold border-t border-slate pt-1">
                    <span>Total:</span>
                    <span className="text-accent-blue ml-3">{invoice.currency} {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Bank Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Notes</label>
              <textarea
                value={invoice.notes}
                onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                rows={3}
                placeholder="Payment terms, thank you note, etc."
                className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue placeholder:text-muted"
              />
            </div>
            <div>
              <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide">Bank / Payment Details</label>
              <textarea
                value={invoice.bankDetails}
                onChange={(e) => setInvoice({ ...invoice, bankDetails: e.target.value })}
                rows={3}
                placeholder="Enter bank details for payment..."
                className="w-full bg-input border border-slate text-primary px-3 py-2 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue placeholder:text-muted"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={saveInvoice}
              className="button-magnetic flex-1 bg-success hover:bg-green-600 text-white py-2 rounded-smooth font-semibold font-sans-tight transition-all"
            >
              💾 Save Invoice
            </button>
            <button
              onClick={exportToPDF}
              className="button-magnetic flex-1 bg-accent-blue hover:bg-accent-indigo text-white py-2 rounded-smooth font-semibold font-sans-tight transition-all"
            >
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* Invoice Preview — 100% inline styles for html2canvas compatibility */}
        <div className="mt-12 shadow-2xl max-w-4xl mx-auto overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px' }}>
          <div id="invoice-preview" style={{
            backgroundColor: '#ffffff',
            width: '620px',
            margin: '0 auto',
            padding: '36px',
            boxSizing: 'border-box',
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            color: '#111111',
            fontSize: '12px',
            lineHeight: '1.6',
          }}>

            {/* Logo */}
            {logo && (
              <div style={{ marginBottom: '40px' }}>
                <img src={logo} alt="Company Logo" style={{ height: '48px', objectFit: 'contain' }} />
              </div>
            )}

            {/* Header: INVOICE + Company Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', margin: '0 0 6px 0', letterSpacing: '-0.03em' }}>INVOICE</h1>
                <p style={{ fontSize: '15px', color: '#555555', margin: 0 }}>#{invoice.invoiceNumber}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111111', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>{invoice.companyName}</h2>
                <p style={{ fontWeight: 600, color: '#111111', margin: '0 0 4px 0', fontSize: '13px' }}>{invoice.billedBy.name}</p>
                <p style={{ color: '#555555', margin: '0 0 4px 0', fontSize: '12px', whiteSpace: 'pre-line' }}>{invoice.billedBy.address}</p>
                <p style={{ color: '#555555', margin: '0 0 4px 0', fontSize: '12px' }}>{invoice.billedBy.email}</p>
                <p style={{ color: '#555555', margin: 0, fontSize: '12px' }}>{invoice.billedBy.phone}</p>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ backgroundColor: '#f7f7f5', border: '1px solid #eeeeee', borderRadius: '8px', padding: '24px', marginBottom: '36px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>Bill To</h3>
              <p style={{ fontWeight: 600, color: '#111111', fontSize: '15px', margin: '0 0 6px 0' }}>{invoice.billedTo.name}</p>
              <p style={{ color: '#555555', fontSize: '12px', margin: '0 0 4px 0', whiteSpace: 'pre-line' }}>{invoice.billedTo.address}</p>
              <p style={{ color: '#555555', fontSize: '12px', margin: '0 0 4px 0' }}>{invoice.billedTo.email}</p>
              <p style={{ color: '#555555', fontSize: '12px', margin: 0 }}>{invoice.billedTo.phone}</p>
            </div>

            {/* Dates */}
            <div style={{ display: 'flex', marginBottom: '36px' }}>
              <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px 20px', width: '320px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, color: '#111111', fontSize: '12px' }}>Invoice Date</span>
                  <span style={{ color: '#555555', fontSize: '12px' }}>{invoice.invoiceDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#111111', fontSize: '12px' }}>Due Date</span>
                  <span style={{ color: '#555555', fontSize: '12px' }}>{invoice.dueDate}</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '36px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 10px', fontSize: '11px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #111111' }}>Description</th>
                  <th style={{ textAlign: 'center', padding: '12px 10px', fontSize: '11px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #111111', width: '70px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '12px 10px', fontSize: '11px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #111111', width: '120px' }}>Rate</th>
                  <th style={{ textAlign: 'right', padding: '12px 10px', fontSize: '11px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '2px solid #111111', width: '130px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px 10px', fontSize: '13px', color: '#333333', borderBottom: '1px solid #eeeeee' }}>{item.description}</td>
                    <td style={{ padding: '14px 10px', fontSize: '13px', color: '#333333', textAlign: 'center', borderBottom: '1px solid #eeeeee' }}>{item.quantity}</td>
                    <td style={{ padding: '14px 10px', fontSize: '13px', color: '#333333', textAlign: 'right', borderBottom: '1px solid #eeeeee' }}>{invoice.currency} {item.rate.toFixed(2)}</td>
                    <td style={{ padding: '14px 10px', fontSize: '13px', color: '#111111', fontWeight: 700, textAlign: 'right', borderBottom: '1px solid #eeeeee' }}>{invoice.currency} {(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '48px' }}>
              <div style={{ width: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', color: '#555555' }}>
                  <span>Subtotal</span>
                  <span>{invoice.currency} {calculateSubtotal().toFixed(2)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', color: '#555555' }}>
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span>{invoice.currency} {calculateTax().toFixed(2)}</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', color: '#cc0000' }}>
                    <span>Discount</span>
                    <span>-{invoice.currency} {invoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0 0', marginTop: '8px', borderTop: '2px solid #111111', fontSize: '18px', fontWeight: 700, color: '#111111' }}>
                  <span>Total</span>
                  <span>{invoice.currency} {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div style={{ marginBottom: '28px', paddingTop: '20px', borderTop: '1px solid #eeeeee' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>Notes</h4>
                <p style={{ fontSize: '12px', color: '#555555', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.7' }}>{invoice.notes}</p>
              </div>
            )}

            {/* Payment Details */}
            {invoice.bankDetails && (
              <div style={{ marginBottom: '20px', paddingTop: '20px', borderTop: '1px solid #eeeeee' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>Payment Details</h4>
                <p style={{ fontSize: '12px', color: '#555555', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.7' }}>{invoice.bankDetails}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
