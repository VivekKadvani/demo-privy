import React, { useCallback } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { useAuth0 } from '@auth0/auth0-react';
// import App from '../App';
import Action from './Action';

const CustomAuth = () => {
  const { getAccessTokenSilently, isLoading } = useAuth0();

  const getCustomToken = useCallback(
    () => getAccessTokenSilently(),
    [getAccessTokenSilently],
  );

  return (
    <PrivyProvider
      appId={process.env.REACT_APP_PRIVY_APP_ID}
      config={{
        // CUSTOM AUTH CONFIGURATION
        customAuth: {
          // The `isLoading` boolean from Auth0's `useAuth0` indicates if Auth0 is currently
          // updating the user's auth state on the client or not
          isLoading: isLoading,
          // The `getCustomToken` callback allows us to get the user's access/identity token
          // whenever their auth state changes
          getCustomAccessToken: getCustomToken,
        },
      }}
    >
      <Action />
    </PrivyProvider>
  );
};

export default CustomAuth;
