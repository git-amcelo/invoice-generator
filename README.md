# 📄 Invoice Generator Web App

A professional, client-side invoice generator with admin mode, built with Next.js, React, and Tailwind CSS.

## ✨ Features

### Core Features
- **Invoice Generation**: Create professional invoices with company details, client information, and line items
- **PDF Export**: Download invoices as PDF files with clean formatting
- **Local Storage**: All data persists in your browser's local storage (no backend required)
- **Auto-incrementing Invoice Numbers**: Automatically manages invoice numbering
- **Currency Support**: Multiple currency options (USD, CAD, INR, EUR, GBP, AUD, SGD, JPY)
- **Logo Upload**: Add your company logo to invoices
- **Bank Details**: Store and reuse payment/bank information
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Mode
- **Password Protected**: Simple admin access with password `Sealteam1@`
- **Previous Invoices Dashboard**: View all saved invoices
- **Edit Invoices**: Modify existing saved invoices
- **Delete Invoices**: Remove unwanted invoices
- **Duplicate Invoices**: Quickly create new invoices from existing ones
- **Invoice Management**: Complete control over your invoice history

### User Interface
- **Modern Design**: Clean, gradient-based UI with glassmorphism effects
- **Smooth Transitions**: Polished animations and interactions
- **Intuitive Layout**: Easy-to-use form structure
- **Real-time Calculations**: Automatic subtotal, tax, and total calculations
- **Swap Function**: Instantly interchange "Billed By" and "Billed To" sections

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd invoice-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Click Deploy

The app will be deployed as a static site with no backend required.

### Other Static Hosting

You can also deploy to:
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any static hosting service

Build the project:
```bash
npm run build
```

The output will be in the `.next` directory.

## 🔐 Admin Access

### Login
1. Click the "🔐 Admin" button in the top right
2. Enter password: `Sealteam1@`
3. Access admin features including previous invoices dashboard

### Security Note
⚠️ **Important**: This is a client-side only application. The admin password is visible in the frontend code. This is suitable only for:
- Personal use
- Internal team use
- Situations where you trust all users with access to the application

Do not use this for public-facing applications requiring real security.

## 📱 Usage Guide

### Creating an Invoice

1. **Company Details**: Fill in your company name and billing information
2. **Client Information**: Enter client details in "Billed To" section
3. **Invoice Details**: Set invoice number, date, and due date
4. **Line Items**: Add products/services with descriptions and quantities
5. **Calculate Totals**: Tax and discount calculations are automatic
6. **Payment Details**: Add bank/payment information for the client
7. **Save/Export**: Save invoice to local storage or export as PDF

### Using Admin Mode

1. **Previous Invoices**: View all saved invoices in a dashboard
2. **Edit**: Modify any saved invoice
3. **Duplicate**: Create new invoice from existing one
4. **Delete**: Remove invoices you no longer need
5. **New Invoice**: Start fresh with auto-incremented number

### Tips

- **Logo Upload**: Click "Upload Logo" to add your company branding
- **Bank Details**: Enter once, they'll be saved for future invoices
- **Swap Button**: Quickly interchange billing information
- **Dark Mode**: Toggle using the 🌙/☀️ button in the header
- **PDF Export**: Professional formatting with all invoice details

## 🗂️ LocalStorage Keys

The app uses the following localStorage keys:

- `invoiceCounter`: Stores the next invoice number
- `invoices`: Array of all saved invoices
- `bankDetails`: Default bank/payment information
- `isAdmin`: Admin login status
- `companyLogo`: Base64 encoded company logo
- `darkMode`: Dark mode preference

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **PDF Generation**: html2pdf.js
- **TypeScript**: Full type safety
- **Storage**: localStorage API

## 📄 Project Structure

```
invoice-generator/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── InvoiceGenerator.tsx    # Main invoice component
│   │   │   ├── AdminModal.tsx          # Admin authentication modal
│   │   │   └── DarkModeToggle.tsx      # Dark mode toggle button
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Main page
│   │   └── globals.css                 # Global styles
│   └── ...
├── public/                             # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Customization

### Change Admin Password
Edit `src/app/components/AdminModal.tsx`:
```typescript
const ADMIN_PASSWORD = 'YourNewPassword';
```

### Add More Currencies
Edit `src/app/components/InvoiceGenerator.tsx`:
```typescript
const CURRENCIES = ['USD', 'EUR', 'GBP', 'YOUR_CURRENCY'];
```

### Modify Theme Colors
Update Tailwind classes in components to match your branding.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Adding Features

The modular structure makes it easy to add new features:

1. Add new components in `src/app/components/`
2. Update state management in `InvoiceGenerator.tsx`
3. Extend localStorage keys as needed
4. Maintain TypeScript types for type safety

## 🐛 Troubleshooting

### PDF Export Issues
- Ensure all form fields are filled
- Check browser permissions for downloads
- Try a different browser if issues persist

### localStorage Not Persisting
- Check browser settings for local storage
- Ensure cookies and site data are enabled
- Try clearing browser cache

### Admin Mode Not Working
- Verify password is exactly `Sealteam1@`
- Check browser console for errors
- Clear localStorage and try again

## 📝 License

This project is free to use for personal and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📧 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Open an issue in the repository

---

**Note**: This is a client-side only application suitable for personal and internal use. For production-grade invoice management with real security, consider implementing a proper backend with authentication and database.