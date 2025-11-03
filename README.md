# You Decide

A simple and elegant application to help you make a decision between two choices. It presents a question and two options, allowing you to see your choice clearly.

This project was bootstrapped with [Vite](https://vitejs.dev/).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 18 or later) and npm installed on your machine.

### Installation

1.  Clone the repository.
2.  Install the project dependencies:
    ```sh
    npm install
    ```

### Backend Setup (Supabase)

This project uses Supabase for its backend database and authentication.

1.  **Create a Supabase Project**: Go to [supabase.com](https://supabase.com/), sign in, and create a new project.
2.  **Get API Keys**: In your Supabase project dashboard, go to "Project Settings" > "API". You will find your Project URL and your `anon` `public` key.
3.  **Run Schema Migration**: Go to the "SQL Editor" in your Supabase dashboard. Create a "New query" and paste the entire content of the `schema.sql` file from this repository. Click "RUN" to create the tables, functions, and security policies.

### Authentication Providers

To allow users to sign in with external services, you need to enable them in Supabase.

**Google Auth Setup:**

1.  Go to your Supabase Project Dashboard.
2.  Navigate to "Authentication" > "Providers".
3.  Click on "Google" and enable it.
4.  You will need to get a `Client ID` and `Client Secret` from the [Google Cloud Console](https://console.cloud.google.com/). Follow the official Supabase guide for [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google) for detailed instructions.
5.  Supabase will provide you with a "Redirect URI". You must add this to your authorized redirect URIs in your Google Cloud project credentials.
6.  Once configured, save the settings in Supabase.

### Environment Variables

This project requires environment variables to connect to external services.

1.  Create a local environment file by copying the example file:
    ```sh
    cp .env.example .env.local
    ```
2.  Open the `.env.local` file in your editor and add your specific credentials for each variable:
    -   `VITE_SUPABASE_URL`: Your Supabase project URL.
    -   `VITE_SUPABASE_KEY`: Your Supabase project anon key.
    -   `VITE_SPOTIFY_CLIENT_ID`: (Optional for now) Your Spotify application's Client ID.
    -   `VITE_REDIRECT_URI`: The redirect URI for OAuth flows (defaults to `http://localhost:5173`).

### Seeding Demo Data

A script is provided to seed your database with sample tasks and moods.

1.  Run the application (`npm run dev`) and sign up for a new account (using email or Google).
2.  In your Supabase Dashboard, navigate to "Authentication" and find the user you just created.
3.  Click on the user and copy their **User UID**.
4.  Open the `seed.sql` file in this project.
5.  Replace the placeholder text `PASTE_YOUR_USER_UID_HERE` with the User UID you copied.
6.  In the Supabase Dashboard, navigate to "SQL Editor", create a "New query", paste the entire modified content of `seed.sql`, and click **RUN**.
7.  Your new user account will now have sample data associated with it.

### Running the Development Server

Once you have installed the dependencies and configured your environment, start the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173`.

## License

This project is licensed under the MIT License.
