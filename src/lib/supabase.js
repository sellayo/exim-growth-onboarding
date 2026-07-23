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

/**
 * Save trade post details ONLY (excluding banner images) when shared to category-specific tables & master log.
 * Category Tables: 'posts_buy', 'posts_sell', 'posts_logistics', 'posts_exim_services', 'posts_questions'
 * Master Table: 'trade_posts_all'
 */
export async function saveTradePost(templateType, postData) {
  const tableMap = {
    buyer: 'posts_buy',
    supplier: 'posts_sell',
    logistics: 'posts_logistics',
    exim_service: 'posts_exim_services',
    question: 'posts_questions'
  };

  const tableName = tableMap[templateType] || 'posts_buy';

  // Exclude heavy banner image file data / URLs - save text details ONLY
  const { imageUrl, ...textDetails } = postData;

  const formattedRecord = {
    template_type: templateType,
    product_or_service: textDetails.product || textDetails.serviceType || textDetails.problem || null,
    hsn_code: textDetails.hsnCode || null,
    quantity_or_moq: textDetails.quantity || textDetails.moq || textDetails.container || null,
    origin_or_location: textDetails.origin || textDetails.location || textDetails.locationPort || null,
    destination: textDetails.destination || null,
    timeline: textDetails.timeline || null,
    requirements_or_certifications: textDetails.requirements || textDetails.certifications || textDetails.serviceDetails || textDetails.context || null,
    company_name: textDetails.companyName || null,
    contact_name: textDetails.contactName || null,
    contact_phone: textDetails.contactPhone || null,
    contact_email: textDetails.contactEmail || null,
    contact_website: textDetails.contactWebsite || null,
    raw_details: textDetails,
    created_at: new Date().toISOString()
  };

  console.log(`[DB Persistence] Saving text details (no banner image) to table '${tableName}' & master table:`, formattedRecord);

  if (supabase) {
    try {
      // 1. Insert into category-specific table (e.g. posts_buy, posts_sell)
      const { data: categoryData, error: categoryErr } = await supabase
        .from(tableName)
        .insert([formattedRecord])
        .select();

      // 2. Also insert into master table 'trade_posts_all' for unified queries later
      try {
        await supabase.from('trade_posts_all').insert([formattedRecord]);
      } catch (masterErr) {
        console.warn(`Master table write notice (non-fatal):`, masterErr);
      }

      if (categoryErr) {
        console.warn(`Supabase category table '${tableName}' write error (falling back to LocalStorage):`, categoryErr);
        return saveToLocalStorageFallback(tableName, formattedRecord);
      }
      return categoryData;
    } catch (err) {
      console.warn(`Supabase write failed, falling back to LocalStorage:`, err);
      return saveToLocalStorageFallback(tableName, formattedRecord);
    }
  } else {
    return saveToLocalStorageFallback(tableName, formattedRecord);
  }
}

function saveToLocalStorageFallback(tableName, record) {
  const catKey = `exim_${tableName}`;
  const masterKey = 'exim_trade_posts_all';
  const newRecord = { id: `post-${Date.now()}`, ...record };

  // Save to Category table store
  const existingCat = JSON.parse(localStorage.getItem(catKey) || '[]');
  localStorage.setItem(catKey, JSON.stringify([newRecord, ...existingCat]));

  // Save to Master table store
  const existingMaster = JSON.parse(localStorage.getItem(masterKey) || '[]');
  localStorage.setItem(masterKey, JSON.stringify([newRecord, ...existingMaster]));

  return [newRecord];
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

