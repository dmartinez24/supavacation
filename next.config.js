module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['divpaquleawymvflmwlp.supabase.co', 'lh3.googleusercontent.com'],
  },
};

// Since we are leveraging the next/image component in our app and storing our images in a remote location, we must add Supabase to the list of image provider domains in our next.config.js file.

// lh3... It is used for the profile's pictures of the users who sign in with their Google account.
