const ACCESS_KEY = 'mc_access_token';
const REFRESH_KEY = 'mc_refresh_token';

let accessToken = localStorage.getItem(ACCESS_KEY) || '';
let refreshToken = localStorage.getItem(REFRESH_KEY) || '';

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export function setTokens(nextAccessToken, nextRefreshToken) {
  accessToken = nextAccessToken || '';
  refreshToken = nextRefreshToken || '';

  if (accessToken) {
    localStorage.setItem(ACCESS_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_KEY);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_KEY);
  }
}

export function clearTokens() {
  setTokens('', '');
}
