# Firebase Admin SDK Setup Guide

## For Team Members

When you clone this repository, you need to set up your Firebase Admin credentials to access the admin dashboard.

### Step 1: Get Your Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the **rocktags-testing** project
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file

### Step 2: Create `.env.local` File

1. In the `rocktags/` folder, create a file named `.env.local`
2. Copy the following template and fill in your credentials:

```env
# Firebase Admin SDK Credentials (Server-side only)
FIREBASE_ADMIN_PROJECT_ID="your-project-id"
FIREBASE_ADMIN_CLIENT_EMAIL="your-service-account-email"
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### Step 3: Fill in Your Credentials

Open the downloaded JSON file and copy the values:

- `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
- `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
- `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

**Important:** Keep the private key exactly as it appears in the JSON file, including all `\n` characters.

### Step 4: Verify Setup

1. Run `npm install` (if you haven't already)
2. Run `npm run dev`
3. Visit `http://localhost:3000/admin`
4. The admin dashboard should load with data from Firestore

## Security Notes

- ✅ `.env.local` is already in `.gitignore` - it will NOT be committed to GitHub
- ⚠️ NEVER share your `.env.local` file or credentials publicly
- ⚠️ NEVER commit credentials to version control
- ✅ Each team member should have their own `.env.local` file

## Troubleshooting

If you see errors about missing credentials:

1. Make sure `.env.local` is in the `rocktags/` folder (same level as `package.json`)
2. Restart your development server after creating `.env.local`
3. Check that all three environment variables are set correctly
4. Verify the private key includes `\n` characters (not actual line breaks)

## What Changed?

Previously, we used a JSON file (`rocktags-testing-firebase-adminsdk-fbsvc-e48f186959.json`) that had to be renamed by each team member. Now we use environment variables which is:

- ✅ More secure
- ✅ Easier to manage for teams
- ✅ Industry best practice
- ✅ No file renaming needed
