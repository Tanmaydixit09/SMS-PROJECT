// Lightweight Google Identity helper
export const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) return resolve(window.google);
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export const requestGoogleToken = async (onCredential) => {
  const google = await loadGoogleScript();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('Missing REACT_APP_GOOGLE_CLIENT_ID');

  return new Promise((resolve, reject) => {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          resolve(response.credential);
        } else reject(new Error('No credential returned'));
      },
    });

    // Use a prompt to show the One Tap / button flow
    google.accounts.id.prompt();
  });
};