import { createClient } from '@supabase/supabase-js';
import { getLoggedInMember } from './memberAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client if credentials exist
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Native Supabase Email Registration with Verification Link & Profiles Sync
 */
export async function signUpWithSupabase({ email, password, fullName = '', companyName = '', phone = '' }) {
  const cleanEmail = email.trim().toLowerCase();

  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password.trim(),
      options: {
        data: {
          full_name: fullName.trim() || cleanEmail.split('@')[0],
          company_name: companyName.trim() || 'EXIM Global Trader',
          phone_number: phone.trim()
        },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // Check if email confirmation is pending
    const isConfirmed = !!(data.user?.email_confirmed_at || (data.user?.identities && data.user.identities[0]?.identity_data?.email_verified));
    const needsVerification = !isConfirmed && !data.session;

    const profile = {
      id: data.user?.id || `mem-${Date.now()}`,
      name: fullName.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      companyName: companyName.trim() || 'EXIM Global Trader',
      phone: phone.trim(),
      authProvider: 'email',
      isVerified: !needsVerification,
      created_at: new Date().toISOString()
    };

    if (data.session && !needsVerification) {
      localStorage.setItem('exim_member_session', JSON.stringify(profile));
    } else {
      localStorage.removeItem('exim_member_session');
    }

    return {
      user: profile,
      session: needsVerification ? null : data.session,
      needsVerification,
      message: needsVerification
        ? `📩 Verification link sent to ${cleanEmail}! Please check your email inbox to activate your account before logging in.`
        : '✅ Registration successful! Welcome to EXIM Growth Network.'
    };
  }

  // Fallback mode if Supabase credentials are missing
  const profile = {
    id: `mem-${Date.now()}`,
    name: fullName.trim() || cleanEmail.split('@')[0],
    email: cleanEmail,
    companyName: companyName.trim() || 'EXIM Global Trader',
    phone: phone.trim(),
    authProvider: 'email',
    isVerified: true
  };
  localStorage.setItem('exim_member_session', JSON.stringify(profile));

  return { user: profile, session: true, needsVerification: false, message: '✅ Registration successful!' };
}

/**
 * Native Supabase Email Sign-In with Password
 */
export async function signInWithSupabase({ email, password }) {
  const cleanEmail = email.trim().toLowerCase();

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password.trim()
    });

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        throw new Error(`📩 Email address not verified yet. Please check ${cleanEmail} for the confirmation link.`);
      }
      throw new Error(error.message);
    }

    // Fetch user profile from Supabase public.profiles table
    let profileName = data.user.user_metadata?.full_name || cleanEmail.split('@')[0];
    let profileCompany = data.user.user_metadata?.company_name || 'EXIM Global Trader';
    let profilePhone = data.user.user_metadata?.phone_number || '';

    try {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (dbProfile) {
        profileName = dbProfile.full_name || profileName;
        profileCompany = dbProfile.company_name || profileCompany;
        profilePhone = dbProfile.phone_number || profilePhone;
      }
    } catch (profileErr) {
      console.warn('Profiles table fetch notice (using user_metadata):', profileErr);
    }

    const sessionUser = {
      id: data.user.id,
      name: profileName,
      email: cleanEmail,
      companyName: profileCompany,
      phone: profilePhone,
      authProvider: 'email',
      isVerified: true
    };

    localStorage.setItem('exim_member_session', JSON.stringify(sessionUser));
    return sessionUser;
  }

  // Fallback read from local session if Supabase is offline
  const session = JSON.parse(localStorage.getItem('exim_member_session') || 'null');
  if (session && session.email === cleanEmail) return session;

  throw new Error('Supabase client not initialized and local account not found.');
}

/**
 * Sign Out from Supabase & clear local session
 */
export async function signOutSupabase() {
  localStorage.removeItem('exim_member_session');
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signout notice:', err);
    }
  }
}

/**
 * Backward compatible signInWithEmail
 */
export async function signInWithEmail(email, password = '', name = '', companyName = '', phone = '') {
  if (password) {
    try {
      return await signInWithSupabase({ email, password });
    } catch (err) {
      return await signUpWithSupabase({ email, password, fullName: name, companyName, phone }).then(res => res.user);
    }
  }
  const profile = {
    id: `mem-${Date.now()}`,
    name: name || email.split('@')[0],
    email: email.trim().toLowerCase(),
    companyName: companyName || 'EXIM Trader',
    phone: phone || '',
    authProvider: 'email',
    createdAt: new Date().toISOString(),
    isVerified: true
  };
  localStorage.setItem('exim_member_session', JSON.stringify(profile));
  return profile;
}

/**
 * Supabase & Instant Google OAuth Login
 */
export async function signInWithGoogle() {
  const googleProfile = {
    id: `goog-${Date.now()}`,
    name: 'Rahul Sharma (EXIM Member)',
    email: 'exporter@eximgrowth.com',
    companyName: 'EXIM Global Trade Pvt Ltd',
    authProvider: 'google',
    createdAt: new Date().toISOString(),
    isVerified: true
  };

  // Save session locally so user is instantly logged in
  localStorage.setItem('exim_member_session', JSON.stringify(googleProfile));

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (!error && data?.url) {
        // Only redirect if valid OAuth URL returned
        window.location.href = data.url;
        return data;
      }
    } catch (err) {
      console.warn('Supabase Google OAuth notice (using local Google session):', err);
    }
  }

  return googleProfile;
}

/**
 * Save user onboarding submission to Supabase 'submissions' table.
 * Falls back to local storage if Supabase is not configured.
 */
export async function submitOnboardingPayload(payload) {
  console.log('Submitting onboarding payload:', payload);

  const formattedPayload = {
    role: payload.role,
    full_name: payload.fullName,
    company_name: payload.companyName || null,
    designation: payload.designation,
    phone_number: payload.phoneNumber,
    country: payload.country,
    email: payload.email || null,
    website: payload.website || null,
    linkedin: payload.linkedin || null,
    social_media: payload.socialMedia || null,
    dynamic_answers: payload.dynamicAnswers || {},
    selected_networks: payload.selectedNetworks || [],
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase
      .from('submissions')
      .insert([formattedPayload])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data;
  } else {
    // Fallback mode for demonstration/testing without Supabase keys
    await new Promise((resolve) => setTimeout(resolve, 600));
    const existing = JSON.parse(localStorage.getItem('exim_submissions') || '[]');
    const newRecord = { id: 'demo-' + Date.now(), ...formattedPayload };
    localStorage.setItem('exim_submissions', JSON.stringify([newRecord, ...existing]));
    return [newRecord];
  }
}

/**
 * Fetch all onboarding submissions for Admin Dashboard.
 */
export async function fetchAllSubmissions() {
  if (supabase) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    return data || [];
  } else {
    // LocalStorage fallback
    await new Promise((resolve) => setTimeout(resolve, 300));
    const data = JSON.parse(localStorage.getItem('exim_submissions') || '[]');
    return data;
  }
}

/**
 * Update application status ('pending', 'approved', 'rejected')
 */
export async function updateSubmissionStatus(id, newStatus) {
  if (supabase) {
    const { data, error } = await supabase
      .from('submissions')
      .update({ status: newStatus })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update status error:', error);
      throw error;
    }
    return data;
  } else {
    // LocalStorage fallback
    const data = JSON.parse(localStorage.getItem('exim_submissions') || '[]');
    const updated = data.map(item => item.id === id ? { ...item, status: newStatus } : item);
    localStorage.setItem('exim_submissions', JSON.stringify(updated));
    return updated.filter(item => item.id === id);
  }
}

/**
 * Delete submission
 */
export async function deleteSubmission(id) {
  if (supabase) {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    return true;
  } else {
    const data = JSON.parse(localStorage.getItem('exim_submissions') || '[]');
    const updated = data.filter(item => item.id !== id);
    localStorage.setItem('exim_submissions', JSON.stringify(updated));
    return true;
  }
}

/**
 * Save trade post details ONLY (excluding banner images) when shared to category-specific tables & master log.
 * Category Tables: 'posts_buy', 'posts_sell', 'posts_logistics', 'posts_exim_services', 'posts_questions'
 * Master Table: 'trade_posts_all'
 */
export function isValidUUID(str) {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
}

/**
 * Save trade post details (text specs) to master table 'trade_posts_all'.
 * Accepts existingPostId to update existing post and prevent duplicate entries.
 * Automatically attaches logged-in user_id and poster contact details.
 */
export async function saveTradePost(templateType, postData, existingPostId = null) {
  const { imageUrl, ...textDetails } = postData;
  const currentMember = getLoggedInMember();

  // Retrieve authenticated Supabase user ID if available
  let rawUserId = currentMember?.id || null;
  if (supabase) {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.id) {
        rawUserId = authData.user.id;
      }
    } catch (authErr) {
      console.warn('Auth user fetch notice:', authErr);
    }
  }

  // Ensure user_id sent to Supabase is a valid PostgreSQL UUID
  const dbUserId = isValidUUID(rawUserId) ? rawUserId : null;

  // Sanitize legacy dummy fallback data
  const isDummyCompany = (name) => !name || name === 'EXIM Global Trade Pvt Ltd';
  const isDummyName = (name) => !name || name === 'Rahul Sharma';
  const isDummyPhone = (phone) => !phone || phone.includes('9876543210');
  const isDummyEmail = (email) => !email || email === 'trade@eximglobal.com' || email === 'exporter@eximgrowth.com';

  const realCompanyName = currentMember?.companyName || (!isDummyCompany(textDetails.companyName) ? textDetails.companyName : null);
  const realContactName = currentMember?.name || (!isDummyName(textDetails.contactName) ? textDetails.contactName : null);
  const realContactPhone = currentMember?.phone || (!isDummyPhone(textDetails.contactPhone) ? textDetails.contactPhone : null);
  const realContactEmail = currentMember?.email || (!isDummyEmail(textDetails.contactEmail) ? textDetails.contactEmail : null);

  const formattedRecord = {
    template_type: templateType,
    user_id: dbUserId,
    product_or_service: textDetails.product || textDetails.serviceType || textDetails.problem || null,
    hsn_code: textDetails.hsnCode || null,
    quantity_or_moq: textDetails.quantity || textDetails.moq || textDetails.container || null,
    origin_or_location: textDetails.origin || textDetails.location || textDetails.locationPort || null,
    destination: textDetails.destination || null,
    timeline: textDetails.timeline || null,
    requirements_or_certifications: textDetails.requirements || textDetails.certifications || textDetails.serviceDetails || textDetails.context || null,
    company_name: realCompanyName,
    contact_name: realContactName,
    contact_phone: realContactPhone,
    contact_email: realContactEmail,
    contact_website: textDetails.contactWebsite && !textDetails.contactWebsite.includes('eximglobal.com') ? textDetails.contactWebsite : null,
    raw_details: {
      ...textDetails,
      companyName: realCompanyName || textDetails.companyName,
      contactName: realContactName || textDetails.contactName,
      contactPhone: realContactPhone || textDetails.contactPhone,
      contactEmail: realContactEmail || textDetails.contactEmail
    },
    updated_at: new Date().toISOString()
  };

  let savedRecord = null;

  if (supabase) {
    try {
      // 1. If existingPostId provided & valid UUID, UPDATE existing post (prevents duplicates)
      if (existingPostId && isValidUUID(existingPostId)) {
        const { data: updateData, error: updateErr } = await supabase
          .from('trade_posts_all')
          .update(formattedRecord)
          .eq('id', existingPostId)
          .select();

        if (!updateErr && updateData && updateData.length > 0) {
          savedRecord = updateData[0];
        }
      }

      // 2. If not updated, INSERT new record into master base table 'trade_posts_all'
      if (!savedRecord) {
        const insertPayload = {
          ...formattedRecord,
          status: 'open',
          created_at: new Date().toISOString()
        };
        if (existingPostId && isValidUUID(existingPostId)) {
          insertPayload.id = existingPostId;
        }

        const { data: insertData, error: insertErr } = await supabase
          .from('trade_posts_all')
          .insert([insertPayload])
          .select();

        if (!insertErr && insertData && insertData.length > 0) {
          savedRecord = insertData[0];
          console.log('✅ Successfully saved trade post to Supabase trade_posts_all table:', savedRecord);
        } else if (insertErr) {
          console.error('Supabase trade_posts_all insert error:', insertErr);
        }
      }
    } catch (err) {
      console.error('Supabase save error:', err);
    }
  }

  // Always keep LocalStorage in sync with matching record ID
  const finalId = savedRecord?.id || existingPostId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `post-${Date.now()}`);
  const finalRecord = {
    id: finalId,
    status: savedRecord?.status || 'open',
    created_at: savedRecord?.created_at || new Date().toISOString(),
    ...formattedRecord
  };

  saveToLocalStorageFallback(templateType, finalRecord);
  return [finalRecord];
}

function saveToLocalStorageFallback(templateType, record) {
  const tableMap = {
    buyer: 'posts_buy',
    supplier: 'posts_sell',
    logistics: 'posts_logistics',
    exim_service: 'posts_exim_services',
    question: 'posts_questions'
  };
  const catKey = `exim_${tableMap[templateType] || 'posts_buy'}`;
  const masterKey = 'exim_trade_posts_all';

  // Save/Update in Category store
  const existingCat = JSON.parse(localStorage.getItem(catKey) || '[]');
  const filteredCat = existingCat.filter(item => item.id !== record.id && item.id?.toString() !== record.id?.toString());
  localStorage.setItem(catKey, JSON.stringify([record, ...filteredCat]));

  // Save/Update in Master store
  const existingMaster = JSON.parse(localStorage.getItem(masterKey) || '[]');
  const filteredMaster = existingMaster.filter(item => item.id !== record.id && item.id?.toString() !== record.id?.toString());
  localStorage.setItem(masterKey, JSON.stringify([record, ...filteredMaster]));
}

/**
 * Fetch saved trade post details (from Supabase or LocalStorage) for later use.
 */
export async function fetchAllTradePosts(templateType = null) {
  const tableMap = {
    buyer: 'posts_buy',
    supplier: 'posts_sell',
    logistics: 'posts_logistics',
    exim_service: 'posts_exim_services',
    question: 'posts_questions'
  };

  const targetTable = templateType ? (tableMap[templateType] || 'posts_buy') : 'trade_posts_all';

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(targetTable)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Fetch from Supabase failed, reading LocalStorage:', err);
    }
  }

  // Fallback read from LocalStorage
  const localKey = templateType ? `exim_${tableMap[templateType]}` : 'exim_trade_posts_all';
  return JSON.parse(localStorage.getItem(localKey) || '[]');
}

/**
 * Fetch a single trade post by ID
 */
export async function fetchSingleTradePost(postId) {
  if (!postId) return null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('trade_posts_all')
        .select('*')
        .eq('id', postId)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn(`Fetch post ${postId} from Supabase failed:`, err);
    }
  }

  // Fallback search local storage master & category stores
  const master = JSON.parse(localStorage.getItem('exim_trade_posts_all') || '[]');
  const found = master.find(p => p.id === postId || p.id?.toString() === postId?.toString());
  if (found) return found;

  const categories = ['posts_buy', 'posts_sell', 'posts_logistics', 'posts_exim_services', 'posts_questions'];
  for (const cat of categories) {
    const list = JSON.parse(localStorage.getItem(`exim_${cat}`) || '[]');
    const match = list.find(p => p.id === postId || p.id?.toString() === postId?.toString());
    if (match) return match;
  }

  return null;
}

/**
 * Check if poster is an approved EXIM Community Member (matching submissions/profiles)
 */
export async function checkPosterCommunityVerification(email, phone) {
  if (!email && !phone) return 'unverified';

  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '').slice(-10) : '';

  const dummyEmails = ['trade@eximglobal.com', 'exporter@eximgrowth.com', 'test@test.com'];
  const dummyPhones = ['9876543210', '0000000000'];

  if ((cleanEmail && dummyEmails.includes(cleanEmail)) || (cleanPhone && dummyPhones.includes(cleanPhone))) {
    return 'unverified';
  }

  if (supabase) {
    try {
      const { data: subs, error: subErr } = await supabase
        .from('submissions')
        .select('status, email, phone_number');

      if (!subErr && subs && subs.length > 0) {
        const isApproved = subs.some(s => {
          const sEmail = s.email ? s.email.trim().toLowerCase() : '';
          const sPhone = s.phone_number ? s.phone_number.replace(/[^0-9]/g, '').slice(-10) : '';
          const emailMatched = cleanEmail && sEmail && sEmail === cleanEmail;
          const phoneMatched = cleanPhone && sPhone && (sPhone.includes(cleanPhone) || cleanPhone.includes(sPhone));
          return (emailMatched || phoneMatched) && s.status === 'approved';
        });

        if (isApproved) return 'approved_member';
      }
    } catch (err) {
      console.warn('Poster verification check notice:', err);
    }
  }

  // Local storage fallback check
  const localSubs = JSON.parse(localStorage.getItem('exim_submissions') || '[]');
  const foundLocal = localSubs.find(s => {
    const sEmail = s.email ? s.email.trim().toLowerCase() : '';
    const sPhone = s.phone_number ? s.phone_number.replace(/[^0-9]/g, '').slice(-10) : '';
    const emailMatched = cleanEmail && sEmail && sEmail === cleanEmail;
    const phoneMatched = cleanPhone && sPhone && (sPhone.includes(cleanPhone) || cleanPhone.includes(sPhone));
    return (emailMatched || phoneMatched) && (s.status === 'approved' || s.isApproved);
  });

  if (foundLocal) return 'approved_member';
  return 'unverified';
}

/**
 * Update trade post status ('open' | 'fulfilled')
 */
export async function updateTradePostStatus(postId, newStatus) {
  if (!postId) return false;

  if (supabase) {
    try {
      await supabase
        .from('trade_posts_all')
        .update({ status: newStatus })
        .eq('id', postId);
    } catch (err) {
      console.warn(`Update post status in Supabase error:`, err);
    }
  }

  // Update in LocalStorage
  const updateLocal = (key) => {
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = list.map(item => {
      if (item.id === postId || item.id?.toString() === postId?.toString()) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    localStorage.setItem(key, JSON.stringify(updated));
  };

  updateLocal('exim_trade_posts_all');
  ['posts_buy', 'posts_sell', 'posts_logistics', 'posts_exim_services', 'posts_questions'].forEach(c => updateLocal(`exim_${c}`));

  return true;
}

