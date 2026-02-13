# Cloudinary Setup Guide for Hey Students

This guide will walk you through setting up a Cloudinary account for managing images in the Hey Students application.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- Image storage and hosting
- Image optimization and transformation
- Fast CDN delivery
- Free tier for small to medium projects

---

## Step 1: Create a Cloudinary Account

1. **Go to Cloudinary Website**
   - Visit: [https://cloudinary.com/](https://cloudinary.com/)

2. **Sign Up for Free**
   - Click on "Sign Up for Free" button (top right)
   - Choose one of these options:
     - Sign up with email
     - Sign up with Google
     - Sign up with GitHub

3. **Fill in Registration Details**
   - **Email**: Enter your email address
   - **Password**: Create a strong password
   - **Cloud Name**: Choose a unique cloud name (this will be used in your configuration)
     - Example: `heystudents` or `heystudents-du`
     - Note: This cannot be changed later, so choose carefully!

4. **Verify Your Email**
   - Check your email inbox
   - Click the verification link sent by Cloudinary
   - This activates your account

---

## Step 2: Access Your Dashboard

1. **Login to Cloudinary**
   - Go to [https://cloudinary.com/console](https://cloudinary.com/console)
   - Login with your credentials

2. **Navigate to Dashboard**
   - After login, you'll see your dashboard
   - This shows your usage statistics and quick links

---

## Step 3: Get Your Credentials

Your Cloudinary credentials are on the Dashboard homepage:

1. **Cloud Name**
   - Located at the top of the dashboard
   - Example: `heystudents`

2. **API Key**
   - Found in the "Account Details" section
   - Example: `123456789012345`

3. **API Secret**
   - Click the "eye" icon to reveal it
   - Example: `abcdefghijklmnopqrstuvwxyz123`
   - ⚠️ **IMPORTANT**: Keep this secret! Never share it publicly or commit it to GitHub

---

## Step 4: Configure Your Application

### Backend Configuration

Add these environment variables to your **Backend `.env`** file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=heystudents
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

### Update Your .env File

1. Open `Backend/.env`
2. Add the three Cloudinary variables shown above
3. Replace the placeholder values with your actual credentials from the dashboard
4. Save the file

---

## Step 5: Verify Installation

The backend already has Cloudinary installed. You can verify by checking:

```bash
cd Backend
npm list cloudinary
```

If not installed, run:
```bash
npm install cloudinary multer multer-storage-cloudinary
```

---

## Step 6: Test Your Setup

1. **Restart Your Backend Server**
   ```bash
   cd Backend
   npm start
   ```

2. **Check Console for Errors**
   - Look for any Cloudinary-related errors
   - If configured correctly, you shouldn't see any errors

3. **Test Image Upload** (if you're an admin)
   - Login to your admin panel
   - Try adding/editing an accommodation with images
   - Images should upload to Cloudinary

---

## Step 7: Configure Upload Presets (Optional)

For better organization and security:

1. **Go to Settings**
   - Click the gear icon (⚙️) in the top right
   - Navigate to "Upload" tab

2. **Create Upload Preset**
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Name it: `heystudents_accommodations`
   - Set "Signing Mode" to "Signed" (more secure)
   - Set folder: `accommodations`
   - Click "Save"

3. **Create Folders** (for organization)
   - Go to "Media Library" in the sidebar
   - Create folders:
     - `accommodations` - for accommodation images
     - `profiles` - for user profile pictures
     - `alumni` - for alumni photos

---

## Step 8: Monitor Usage

1. **Check Your Dashboard Regularly**
   - Free tier includes:
     - 25 GB storage
     - 25 GB bandwidth/month
     - 25,000 transformations/month

2. **View Usage Stats**
   - Dashboard shows current usage
   - Monitor to avoid exceeding free tier limits

3. **Optimize Images**
   - Cloudinary automatically optimizes images
   - Use transformations wisely to stay within limits

---

## Important Security Notes

### ✅ DO:
- Keep your API Secret in `.env` file only
- Add `.env` to `.gitignore`
- Use environment variables in production
- Enable signed uploads for better security
- Regularly rotate your API credentials

### ❌ DON'T:
- Never commit `.env` files to Git
- Never share your API Secret publicly
- Don't hardcode credentials in your code
- Don't expose API Secret in frontend code

---

## Troubleshooting

### Problem: "Invalid API credentials"
**Solution**: 
- Double-check your credentials in `.env`
- Ensure no extra spaces in the values
- Restart your backend server after updating `.env`

### Problem: "Upload failed"
**Solution**:
- Check your internet connection
- Verify you haven't exceeded free tier limits
- Check Cloudinary dashboard for errors

### Problem: "Cannot find module 'cloudinary'"
**Solution**:
```bash
cd Backend
npm install cloudinary multer-storage-cloudinary
```

### Problem: Images not displaying
**Solution**:
- Check the image URL in the database
- Verify Cloudinary delivery settings
- Check browser console for CORS errors

---

## Backend Code Reference

Your backend already includes Cloudinary integration. Here's where it's used:

1. **Configuration**: Check `Backend/config/cloudinary.js` (if exists)
2. **Upload Middleware**: Check `Backend/middleware/upload.js` or similar
3. **Controllers**: Accommodation controller handles image uploads

---

## Useful Cloudinary Features

1. **Image Transformations**
   - Automatic resizing
   - Format conversion (JPEG, WebP, etc.)
   - Quality optimization
   - Cropping and filters

2. **CDN Delivery**
   - Fast global delivery
   - Automatic optimization
   - Responsive images

3. **Media Library**
   - Browse all uploaded images
   - Organize in folders
   - Search and filter
   - Delete unused images

---

## Next Steps

1. ✅ Create Cloudinary account
2. ✅ Get your credentials
3. ✅ Update `.env` file with credentials
4. ✅ Restart backend server
5. ✅ Test image uploads
6. ✅ Monitor usage periodically

---

## Support

- **Cloudinary Documentation**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Cloudinary Support**: [https://support.cloudinary.com](https://support.cloudinary.com)
- **API Reference**: [https://cloudinary.com/documentation/image_upload_api_reference](https://cloudinary.com/documentation/image_upload_api_reference)

---

## Free Tier Limits

| Resource | Free Tier Limit |
|----------|----------------|
| Storage | 25 GB |
| Bandwidth | 25 GB/month |
| Transformations | 25,000/month |
| API Calls | No limit |

Perfect for development and small to medium applications!

---

**Ready to go!** Once you've completed these steps, your application will be able to upload, store, and serve images through Cloudinary. 🎉
