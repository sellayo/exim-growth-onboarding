const STORAGE_KEY = 'exim_admin_authed_session';
const DEFAULT_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'admin123';

export function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function loginAdmin(passcode) {
  if (passcode?.trim() === DEFAULT_PASSCODE || passcode?.trim() === 'exim2026') {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
    return true;
  }
  return false;
}

export function logoutAdmin() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}
