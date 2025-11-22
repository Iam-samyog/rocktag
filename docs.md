
Last updated 10/24/2025.

# Installation

### 1. **Clone the Repository**

```bash
git clone https://github.com/ghiyascode/rocktags.git  
cd rocktags
```

### 2. **Install Dependencies**

```bash
npm i

# if you also want to write and deploy your own cloud functions, do the following
cd rocktags/functions/
npm i
```

### 3. **Set up Environment Variables**

In the `rocktags`, create an `.env` file and add the following fields to it:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY = ""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = ""
NEXT_PUBLIC_FIREBASE_PROJECT_ID = ""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = ""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = ""
NEXT_PUBLIC_FIREBASE_APP_ID = ""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = ""
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = ""
```

### 4. Run the Project

You can start the project by running the following:

```bash
npm run dev
```


Ensure your Firebase workspace is on a Blaze plan, or some parts of this project may not work properly.


# rocktags
Explanation for the file structure of ``rocktags``, as well as how some components work.

<details>
<summary>functions</summary>

## functions
``rocktags/functions/``

All the cloud functions used by this project can be found under this folder, and more specifically in ``rocktags/functions/src/index.ts``. 

Cloud Functions in Firebase allow you to automatically run back-end code in response to certain events. This code is hosted on Firebase.

After writing a cloud function, you can deploy your function by running one of the following:

```bash
# to deploy all functions:
firebase deploy --only functions

# to deploy only one function:
firebase deploy --only functions:{functionName}
```

Documentation for Cloud Functions can be found [here](https://firebase.google.com/docs/functions).
</details>

<details>
<summary>src</summary>

## src
``rocktags/src/``

<details>
<summary>app</summary>

### app
``rocktags/src/app``

---

This is where all of the front-end lives. In Next.js, [all routes are defined by this structure](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts):
``` bash
routeName/        # url/routeName 
└- nested-route/  # url/routeName/nested-route/
└- page.tsx       # this is what is displayed when you visit this route
└- layout.tsx     # see below
```
Although this is a somewhat simplified version of how you can do routing in Next.js, this pattern is how most of the pages will be made in this project.

Layouts are components that wrap the page (and any page underneath it). We can use this to have consistent page structure (e.g. all pages can share a header and footer). 

More info on Layouts can be found [here by Next.js](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern) or [here by GeeksForGeeks](https://www.geeksforgeeks.org/reactjs/next-js-layouts/).

---

#### layout.tsx
``rocktags/app/src/main/layout.tsx``

This layout protects every route underneath `/main/`. As a server component, this code will run on the server before any HTML from a page within `/main/` is displayed to a user.

It checks the user cookie to ensure that the user is valid, and then checks that the user is verified. If either of these checks fail, they are redirected back to `/login/`. If not, they can proceed to any page under `/main/`.

More information about server components [can be found here](https://nextjs.org/docs/app/getting-started/server-and-client-components).

</details>

<details>
<summary>components</summary>

### components
``rocktags/src/components``

This is where all of our reusable components live. The folder and components inside are somewhat self-explanatory, so I will only go into detail for what I consider more important components.

---

#### CatProfileDetails.tsx
This component is responsible for displaying cat information on the map page. Although incomplete right now, the plan is to for this to be a static shell and to implement [Partial Prerendering](https://nextjs.org/docs/app/getting-started/cache-components).

---

#### signin-form.tsx

This component is responsible for handling user sign-ins.

When a user signs in, their auth-token is saved as a cookie for later usage and to persist even after leaving the website. 

Later, when a user visits any page under the ``/main/`` route, their cookie will be used to verify they are a valid user and that they have verified their email.

---

#### signup-form.tsx

This component is responsible for the user sign up flow.

When a user clicks the submit button, ``createUserWithEmailAndPassword`` is fed the email and password to request the creation of a user from the Firebase back-end.

Before the user can be made, a blocking function (``enforceMavsEmail``) ensures that users can only sign up using emails that end with ``@mavs.uta.edu``. After passing this check, users are successfully created in Firebase.

When ``createUserWithEmailAndPassword`` finds that a user was successfully created, it logs in so that we can send a verification email through ``sendVerificationEmail``. We must be logged in before running this.

More information on blocking functions [can be found here](https://firebase.google.com/docs/auth/extend-with-blocking-functions).

</details>

<details>
<summary>config</summary>

### config
``rocktags/config/``

---

#### firebase.ts

This is our Client SDK. ``firebase.ts`` exports ``auth`` and ``db`` already set up for convenience.

``firebase.ts`` is safe to import to client components as all of the Firebase client keys are meant to be public, with the ``NEXT_PUBLIC`` in front of each variable denoting it's use in client-facing code.

Documentation for this can be found [here](https://firebase.google.com/docs/reference/node).

---

#### firebase-admin.ts

This is our Admin SDK. `firebase-admin.ts` exports `admin_auth` and `admin_db`, both which should **only be used in server components**. **Do not import this module into any front-end code, or any files with "use client"; at the top**.

The main difference between this and `firebase.ts` is that we can run privileged operations using a logged-in service account. Some examples of this are setting user claims (essentially roles) or checking user auth tokens.

``admin_db`` is also able to run while bypassing database rules; we can use this whenever we need to read/write indiscriminately (e.g. in a cloud function that we know a user cannot invoke).

Documentation for this can be found [here](https://firebase.google.com/docs/reference/admin).

</details>
</details>
