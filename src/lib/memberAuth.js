// Member Authentication & Local User Database Management

const SESSION_KEY = 'exim_member_session';
const USERS_DB_KEY = 'exim_registered_users_db';
const PROFILES_KEY = 'exim_member_profiles_list';

/**
 * Get current logged in member profile (if any)
 */
export function getLoggedInMember() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

/**
 * Get list of all registered users from database
 */
export function getAllRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Register a new user with Email, Password & Profile info into User Database
 */
export function registerUserWithEmail({ email, password, name = '', companyName = '', phone = '' }) {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password || password.trim().length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const allUsers = getAllRegisteredUsers();

  const existingUser = allUsers.find(u => u.email?.toLowerCase() === cleanEmail);
  if (existingUser) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    password: password.trim(), // Stored in local DB
    name: name?.trim() || cleanEmail.split('@')[0],
    companyName: companyName?.trim() || 'EXIM Global Trader',
    phone: phone?.trim() || '',
    authProvider: 'email',
    createdAt: new Date().toISOString(),
    isVerified: true
  };

  // Save to User DB
  const updatedUsers = [newUser, ...allUsers];
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsers));

  // Save current active session (excluding password string for security)
  const { password: _p, ...sessionUser } = newUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

  // Also update directory store
  const allProfiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
  localStorage.setItem(PROFILES_KEY, JSON.stringify([sessionUser, ...allProfiles.filter(p => p.id !== sessionUser.id)]));

  return sessionUser;
}

/**
 * Log In an existing user with Email & Password
 */
export function loginUserWithEmail(email, password) {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password || !password.trim()) {
    throw new Error('Please enter your password.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const allUsers = getAllRegisteredUsers();

  const user = allUsers.find(u => u.email?.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('No registered account found with this email. Please sign up first.');
  }

  if (user.password !== password.trim()) {
    throw new Error('Incorrect password. Please verify your password and try again.');
  }

  // Save current active session
  const { password: _p, ...sessionUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

  return sessionUser;
}

/**
 * Backward compatible helper for existing flows
 */
export function registerMemberWithEmail(params) {
  if (params.password) {
    return registerUserWithEmail(params);
  }
  
  // Check if existing user in DB
  const cleanEmail = params.email?.trim().toLowerCase();
  const allUsers = getAllRegisteredUsers();
  const existing = allUsers.find(u => u.email?.toLowerCase() === cleanEmail);
  if (existing) {
    const { password: _p, ...sessionUser } = existing;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }

  return registerUserWithEmail({
    ...params,
    password: 'password123'
  });
}

/**
 * Check if the currently logged in member is the owner of a trade post
 */
export function isPostOwner(post, currentMember = getLoggedInMember()) {
  if (!post || !currentMember) return false;

  const memId = currentMember.id?.toString();
  const memEmail = currentMember.email?.toLowerCase().trim();
  const memPhone = currentMember.phone ? currentMember.phone.replace(/[^0-9]/g, '') : null;

  // 1. Match by user_id
  if (post.user_id && post.user_id.toString() === memId) return true;

  // 2. Match by email
  const postEmail = (post.contact_email || post.raw_details?.contactEmail || '').toLowerCase().trim();
  if (memEmail && postEmail && postEmail === memEmail) return true;

  // 3. Match by normalized 10-digit phone number
  const postPhone = (post.contact_phone || post.raw_details?.contactPhone || '').replace(/[^0-9]/g, '');
  if (memPhone && postPhone) {
    const cleanMemPhone = memPhone.slice(-10);
    const cleanPostPhone = postPhone.slice(-10);
    if (cleanMemPhone.length >= 8 && cleanPostPhone.length >= 8 && cleanMemPhone === cleanPostPhone) {
      return true;
    }
  }

  return false;
}

/**
 * Register / Login a member locally (Phone or Email)
 */
export function loginMember(phoneOrEmail, name = '', companyName = '', extraPhone = '') {
  const isEmail = phoneOrEmail.includes('@');
  const emailVal = isEmail ? phoneOrEmail.trim().toLowerCase() : `${phoneOrEmail.replace(/[^0-9]/g, '')}@exim-user.com`;

  try {
    return loginUserWithEmail(emailVal, 'password123');
  } catch (err) {
    return registerUserWithEmail({
      email: emailVal,
      password: 'password123',
      name: name || (isEmail ? emailVal.split('@')[0] : 'EXIM Member'),
      companyName: companyName || 'EXIM Trader',
      phone: isEmail ? extraPhone : phoneOrEmail
    });
  }
}

/**
 * Logout current member session
 */
export function logoutMember() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if a member is currently logged in
 */
export function isMemberAuthenticated() {
  return !!getLoggedInMember();
}


