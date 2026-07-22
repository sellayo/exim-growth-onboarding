import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client if credentials exist
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Save user onboarding submission to Supabase 'submissions' table.
 * Falls back to local storage and simulates network submission if Supabase is not configured.
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
    await new Promise((resolve) => setTimeout(resolve, 800));
    const existing = JSON.parse(localStorage.getItem('exim_submissions') || '[]');
    const newRecord = { id: 'demo-' + Date.now(), ...formattedPayload };
    localStorage.setItem('exim_submissions', JSON.stringify([...existing, newRecord]));
    return [newRecord];
  }
}
