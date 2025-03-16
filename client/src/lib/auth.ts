import { createAuth0Client, Auth0Client, User } from '@auth0/auth0-spa-js';

// Auth0 configuration
const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "dev-iciyt2qbbo0n5lki.us.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "CRRdV4gp222Ek0c4CDzDRYgBxQu4ffYH",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || "https://whatsapp-analyzer/api",
  },
  cacheLocation: "localstorage",
};

// Auth0 client instance
let authClient: Auth0Client | null = null;

// Initialize Auth0 client
export async function initializeAuth0Client(): Promise<Auth0Client> {
  if (authClient) return authClient;

  const client = await createAuth0Client(auth0Config);
  authClient = client;
  return client;
}

// Get Auth0 client
export async function getAuth0Client(): Promise<Auth0Client> {
  if (!authClient) {
    return initializeAuth0Client();
  }
  return authClient;
}

// Login with redirect
export async function loginWithRedirect(): Promise<void> {
  const client = await getAuth0Client();
  await client.loginWithRedirect();
}

// Logout
export async function logout(): Promise<void> {
  const client = await getAuth0Client();
  await client.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
}

// Get user
export async function getUser(): Promise<User | undefined> {
  const client = await getAuth0Client();
  
  try {
    const isAuthenticated = await client.isAuthenticated();
    
    if (!isAuthenticated) {
      return undefined;
    }
    
    return await client.getUser();
  } catch (error) {
    console.error("Error getting user:", error);
    return undefined;
  }
}

// Get token
export async function getToken(): Promise<string | null> {
  const client = await getAuth0Client();
  
  try {
    const isAuthenticated = await client.isAuthenticated();
    
    if (!isAuthenticated) {
      return null;
    }
    
    return await client.getTokenSilently();
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

// Handle authentication callback
export async function handleAuthCallback(): Promise<void> {
  const client = await getAuth0Client();
  
  // If it's an auth callback, handle it
  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    try {
      // Handle the auth callback
      await client.handleRedirectCallback();
      
      // Remove the query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error handling auth callback:", error);
    }
  }
}
