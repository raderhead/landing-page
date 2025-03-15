# 🚀 Abilene Commercial Website - First-Time Deployment Guide

Welcome, Josh!  
This guide will walk you through deploying your website to Netlify directly from GitHub for the first time. Once set up, Netlify will automatically update your site whenever you push changes to GitHub.

---

## Project Overview

Your website is built using:
- **Vite + React + TailwindCSS** (frontend)
- **Supabase** (for backend services like the contact form)
- **Netlify** (for hosting)

### What You’ll Accomplish
- Connect your GitHub repository to Netlify  
- Deploy your website live on the internet  
- Enable automatic updates with GitHub pushes

---

## Step 1: Create a Netlify Account

1. Go to [Netlify](https://www.netlify.com/) and click **Sign Up**.
2. Sign up using **GitHub** (recommended) or your email.
3. Complete the sign-up process and access your Netlify dashboard.

---

## Step 2: Connect Your GitHub Repository

1. In the Netlify dashboard, click **"Add a new site"** then **"Import an existing project"**.
2. Choose **GitHub** as your Git provider.
3. Authorize Netlify to access your GitHub repositories.
4. Select your repository: `AbileneCommercial.com`.
5. Click **Deploy Site**.

---

## Step 3: Configure Deployment Settings

1. In the build settings, enter the following:
   - **Build command:**  
     ```sh
     npm run build
     ```
   - **Publish directory:**  
     ```
     dist
     ```
   - **Branch to deploy:**  
     ```
     main
     ```
2. Click **Deploy Site** to begin the deployment process.

---

## Step 4: Wait for Deployment

1. Monitor the progress in the **Deploys** tab.
2. Once the build and deployment are complete, Netlify will generate a temporary URL for your website.
3. Click the temporary URL to view your live site.

---

## Step 5: (Optional) Set a Custom Domain

1. In the Netlify dashboard, go to **Domain Settings**.
2. Click **Add Custom Domain** and enter `AbileneCommercial.com`.
3. Follow the instructions to update your DNS settings with your domain provider.
4. If you haven’t purchased a domain yet, you can continue using the temporary Netlify URL.

---

## Step 6: Making Updates

1. Make edits to your website files locally.
2. Commit and push your changes to GitHub using:
   ```sh
   git add .
   git commit -m "Updated website"
   git push origin main



## Troubleshooting

### Deployment Fails
- Verify that your **build command** is set to `npm run build`.
- Ensure that your **publish directory** is set to `dist`.
- Clear the cache in Netlify and try redeploying from the **Deploys** tab.

### Site Not Updating
- Make sure your changes are committed and pushed to the `main` branch.
- Check the **Deploys** tab for any errors.
- If necessary, trigger a manual deploy from the Netlify dashboard.
  

## Need Help?

If you have any questions or run into issues, feel free to reach out:
-	Email: theJohnWJohnson@gmail.com
-	Phone: (325) 249-5191



# Congratulations! Your website is now live!

## Thank you for trusting me to help with your site!
