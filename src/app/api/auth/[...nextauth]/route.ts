export const authOptions: NextAuthOptions = {
  // ... other options ...

  callbacks: {
    // ... existing callbacks ...
    redirect({ url, baseUrl }) {
      // Determine the base URL based on the environment
      const productionUrl =
        process.env.NEXTAUTH_URL || "https://till-debt.vercel.app";
      const environmentBaseUrl =
        process.env.NODE_ENV === "production" ? productionUrl : baseUrl;

      // If the URL starts with the base URL, return it as is
      if (url.startsWith(environmentBaseUrl)) return url;
      // Otherwise, make it relative to the base URL
      if (url.startsWith("/")) return `${environmentBaseUrl}${url}`;
      return environmentBaseUrl;
    },
  },

  // ... existing code ...
};
