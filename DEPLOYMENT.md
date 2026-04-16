# 🚀 Deployment Guide

This guide will help you deploy your Invoice Generator app to production.

## Quick Deploy to Vercel (Recommended)

The fastest way to deploy is using Vercel:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Invoice Generator"
   git branch -M main
   git remote add origin https://github.com/yourusername/invoice-generator.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Your app is live!**
   - Vercel will automatically deploy your app
   - You'll get a URL like `https://invoice-generator.vercel.app`

## Manual Deployment

### Build the Project

```bash
cd invoice-generator
npm install
npm run build
```

### Deploy to Static Hosting

#### Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   netlify deploy --prod
   ```

#### GitHub Pages

To deploy to GitHub Pages, you need to configure your project for static export and set up a GitHub Actions workflow.

1.  **Add a `gh-pages` script to `package.json`**:
    ```json
    "scripts": {
      // ... other scripts
      "gh-pages": "gh-pages -d out"
    }
    ```

2.  **Install `gh-pages`**:
    ```bash
    npm install gh-pages --save-dev
    ```

3.  **Update `next.config.ts`**:
    Make sure your `next.config.ts` has `output: 'export'`. I have already made this change for you.

4.  **Deploy**:
    Run the build command, then the deploy command:
    ```bash
    npm run build
    npm run gh-pages
    ```
    This will build your static site to the `out` directory and then push it to the `gh-pages` branch on your GitHub repository.

5.  **Configure GitHub Pages in repository settings**:
    - Go to your repository settings on GitHub.
    - Go to the "Pages" section.
    - Under "Build and deployment", for "Source", select "Deploy from a branch".
    - For "Branch", select `gh-pages` and the `/ (root)` folder, then click "Save".

Your site will be available at `https://<your-username>.github.io/<your-repo-name>`.

#### Other Options

- **Cloudflare Pages**: Connect your Git repository
- **AWS Amplify**: Use the Amplify Console
- **Heroku**: Deploy as a Node.js app
- **DigitalOcean App Platform**: Connect your repository

## Environment Variables

This app doesn't require any environment variables. All data is stored in localStorage.

## Post-Deployment Checklist

- [ ] Test invoice creation
- [ ] Test PDF export
- [ ] Test admin login (password: `Sealteam1@`)
- [ ] Test dark mode toggle
- [ ] Verify responsive design on mobile
- [ ] Test localStorage persistence
- [ ] Verify all features work in production

## Custom Domain (Optional)

### With Vercel

1. Go to project settings in Vercel
2. Add your custom domain
3. Update DNS records as instructed

### With Other Platforms

Follow your hosting provider's instructions for adding custom domains.

## Performance Tips

1. **Optimize Images**: Compress logo images before uploading
2. **Enable Caching**: Configure CDN caching rules
3. **Monitor Performance**: Use analytics tools to track performance

## Security Considerations

⚠️ **Important**: Remember that:
- This is a client-side only app
- Admin password is visible in source code
- Only suitable for personal/internal use
- Not for public-facing applications
- For production security, implement backend authentication

## Backup and Data

Since this uses localStorage:
- Data is stored on user's browser
- Clearing browser data will delete invoices
- Export invoices as PDFs for permanent records
- Consider implementing cloud sync for business use

## Monitoring

Set up monitoring to track:
- User engagement
- Performance metrics
- Error rates
- CDN usage

Most hosting platforms provide built-in analytics.

## Updates and Maintenance

To update the app:

1. Make changes to your code
2. Test locally: `npm run dev`
3. Build and test: `npm run build && npm start`
4. Deploy to your hosting platform

## Troubleshooting

### Build Fails

- Check Node.js version (18+ required)
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Try building again

### Deploy Fails

- Check build logs for specific errors
- Verify all dependencies are installed
- Ensure TypeScript errors are resolved
- Check platform-specific requirements

### Issues in Production

- Check browser console for JavaScript errors
- Verify localStorage is enabled
- Test in different browsers
- Clear browser cache and try again

## Support

For deployment issues:
- Check platform-specific documentation
- Review error messages carefully
- Test locally before deploying
- Use platform support channels

---

Your Invoice Generator is now ready to deploy! 🎉