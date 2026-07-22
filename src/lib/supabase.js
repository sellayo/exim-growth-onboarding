import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client if credentials exist
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
