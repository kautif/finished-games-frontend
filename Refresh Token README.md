# Refresh Token Functionality

Refresh token functionality is successfully implemented.
When a user logs in, the backend returns both an access token and a refresh token. The access token is valid for 60 minutes, while the refresh token lasts for one day.

When the user accesses any protected route (e.g., /protected/userid), the backend checks the validity of the access token. If the access token has expired, the backend automatically generates a new one using the refresh token. However, if the refresh token has also expired (after 24 hours), the user is logged out and needs to log in again.

Additionally, I’ve implemented functionality to synchronize login and logout actions across different tabs. If a user logs out in one tab, they will automatically be logged out in all other open tabs. Similarly, if they log in from one tab, the authentication state will reflect across all tabs to ensure a consistent experience.
Furthermore, even if the user is not accessing any protected route, the system will refresh the access token as needed. I've stored an expiry timestamp in the local storage name authToken_expiry, and upon returning to the site, the system checks that timestamp, an interval is set to refresh the token when necessary, ensuring uninterrupted access. Even if the user logs in, closes the tab, and opens a new one later, the system uses the expiry timestamp from local storage to manage the refresh process efficiently in the active tab.
