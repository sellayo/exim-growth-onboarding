import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ProgressBar from './components/ProgressBar';
import LandingPage from './components/LandingPage';
import StepRoleSelection from './components/StepRoleSelection';
import StepBasicInfo from './components/StepBasicInfo';
import StepDynamicQuestions from './components/StepDynamicQuestions';
import StepNetworkSelection from './components/StepNetworkSelection';
import StepSubmission from './components/StepSubmission';
import StepSuccess from './components/StepSuccess';
import AdminPortal from './components/admin/AdminPortal';
import PostTemplatePortal from './components/postTemplate/PostTemplatePortal';
import PostDetailView from './components/postTemplate/PostDetailView';
import MemberDashboard from './components/dashboard/MemberDashboard';
import MemberSidebar from './components/dashboard/MemberSidebar';
import AnalyticsView from './components/dashboard/AnalyticsView';
import MemberProfileView from './components/dashboard/MemberProfileView';
import PublicProfileView from './components/profile/PublicProfileView';
import GuestAuthGate from './components/auth/GuestAuthGate';
import { submitOnboardingPayload } from './lib/supabase';
import { getLoggedInMember } from './lib/memberAuth';

const TOTAL_STEPS = 5;

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname.toLowerCase());
  const [hash, setHash] = useState(window.location.hash.toLowerCase());
  const [editingPostData, setEditingPostData] = useState(null);
  const [member, setMember] = useState(getLoggedInMember());

  // Sync member authentication state dynamically across tabs & windows
  useEffect(() => {
    const checkMember = () => {
      setMember(getLoggedInMember());
    };
    window.addEventListener('storage', checkMember);
    const interval = setInterval(checkMember, 1000);
    return () => {
      window.removeEventListener('storage', checkMember);
      clearInterval(interval);
    };
  }, []);

  // Extract post ID if navigating to /post/:postId (ignoring /post-template)
  const getPostIdFromUrl = () => {
    if (pathname.startsWith('/post/') && !pathname.startsWith('/post-template')) {
      const id = pathname.replace('/post/', '').trim();
      return id || null;
    }
    if (hash.startsWith('#post/') && !hash.startsWith('#post-template')) {
      const id = hash.replace('#post/', '').trim();
      return id || null;
    }
    return null;
  };

  // Extract public profile ID/slug if navigating to /profile/:profileId
  const getPublicProfileIdFromUrl = () => {
    if (pathname.startsWith('/profile/') && !pathname.startsWith('/dashboard')) {
      const id = pathname.replace('/profile/', '').trim();
      return id || null;
    }
    if (pathname.startsWith('/company/')) {
      const id = pathname.replace('/company/', '').trim();
      return id || null;
    }
    if (hash.startsWith('#profile/') && !hash.startsWith('#dashboard')) {
      const id = hash.replace('#profile/', '').trim();
      return id || null;
    }
    return null;
  };

  const currentPostId = getPostIdFromUrl();
  const publicProfileId = getPublicProfileIdFromUrl();
  const isAdminRoute = pathname.startsWith('/admin') || hash === '#admin';
  const isPostTemplateRoute = pathname.startsWith('/post-template') || hash === '#post-template';
  const isDashboardRoute = (pathname === '/dashboard' || pathname === '/dashboard/') || hash === '#dashboard';
  const isAnalyticsRoute = pathname.includes('analytics') || hash.includes('analytics');
  const isMemberProfileEditRoute = pathname === '/dashboard/profile' || hash === '#dashboard/profile';
  const isPublicProfileRoute = !!publicProfileId;
  const isPostDetailRoute = !!currentPostId;

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    designation: '',
    phoneNumber: '',
    country: 'India',
    companyName: '',
    email: '',
    website: '',
    linkedin: '',
    socialMedia: '',
    dynamicAnswers: {},
    selectedNetworks: ['marketplace', 'services'],
  });

  // Handle URL history / hash changes
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname.toLowerCase());
      setHash(window.location.hash.toLowerCase());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setPathname('/admin');
  };

  const navigateToPostTemplate = (initialData = null) => {
    if (initialData) setEditingPostData(initialData);
    window.history.pushState({}, '', '/post-template');
    setPathname('/post-template');
  };

  const navigateToDashboard = () => {
    window.history.pushState({}, '', '/dashboard');
    setPathname('/dashboard');
  };

  const navigateToAnalytics = () => {
    window.history.pushState({}, '', '/dashboard/analytics');
    setPathname('/dashboard/analytics');
  };

  const navigateToProfile = () => {
    window.history.pushState({}, '', '/dashboard/profile');
    setPathname('/dashboard/profile');
  };

  const navigateToPostDetail = (postId) => {
    window.history.pushState({}, '', `/post/${postId}`);
    setPathname(`/post/${postId}`);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setPathname('/');
    setHash('');
  };

  const handleSidebarNavigate = (target) => {
    if (target === 'dashboard') navigateToDashboard();
    else if (target === 'generator') navigateToPostTemplate();
    else if (target === 'analytics') navigateToAnalytics();
    else if (target === 'profile') navigateToProfile();
    else if (target === 'home') navigateToHome();
  };

  const handleUpdateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateDynamicAnswer = (questionKey, answerArray) => {
    setFormData(prev => ({
      ...prev,
      dynamicAnswers: {
        ...prev.dynamicAnswers,
        [questionKey]: answerArray,
      }
    }));
  };

  const handleToggleNetwork = (networkId) => {
    setFormData(prev => {
      const current = prev.selectedNetworks;
      const updated = current.includes(networkId)
        ? current.filter(id => id !== networkId)
        : [...current, networkId];
      return { ...prev, selectedNetworks: updated };
    });
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(6, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitApplication = async () => {
    await submitOnboardingPayload(formData);
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData({
      role: '',
      fullName: '',
      designation: '',
      phoneNumber: '',
      country: 'India',
      companyName: '',
      email: '',
      website: '',
      linkedin: '',
      socialMedia: '',
      dynamicAnswers: {},
      selectedNetworks: ['marketplace', 'services'],
    });
    setCurrentStep(0);
  };

  // Route 1: Admin Portal
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-gold-500 selection:text-white py-4">
        <AdminPortal onExitAdmin={navigateToHome} />
      </div>
    );
  }

  // Route 2: Live Trade Post Detail View (Public Verification Link)
  if (isPostDetailRoute) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-gold-500 selection:text-white py-4">
        <PostDetailView
          postId={currentPostId}
          onBackToGenerator={navigateToPostTemplate}
        />
      </div>
    );
  }

  // Route 3: Public Business Profile Page (/profile/:profileId)
  if (isPublicProfileRoute) {
    return (
      <PublicProfileView
        profileId={publicProfileId}
        onBack={navigateToProfile}
      />
    );
  }

  // Route 4: Member Dashboard
  if (isDashboardRoute) {
    return (
      <MemberSidebar activeTab="dashboard" onNavigate={handleSidebarNavigate}>
        {member ? (
          <MemberDashboard
            onNavigateToGenerator={navigateToPostTemplate}
            onEditPost={(postDetails) => navigateToPostTemplate(postDetails)}
            onInspectPost={(postId) => navigateToPostDetail(postId)}
          />
        ) : (
          <GuestAuthGate
            targetFeature="dashboard"
            onAuthSuccess={(user) => setMember(user)}
            onNavigateToGenerator={navigateToPostTemplate}
          />
        )}
      </MemberSidebar>
    );
  }

  // Route 5: Dedicated Lead Analytics
  if (isAnalyticsRoute) {
    return (
      <MemberSidebar activeTab="analytics" onNavigate={handleSidebarNavigate}>
        {member ? (
          <AnalyticsView
            onInspectPost={(postId) => navigateToPostDetail(postId)}
            onNavigateToGenerator={navigateToPostTemplate}
          />
        ) : (
          <GuestAuthGate
            targetFeature="analytics"
            onAuthSuccess={(user) => setMember(user)}
            onNavigateToGenerator={navigateToPostTemplate}
          />
        )}
      </MemberSidebar>
    );
  }

  // Route 6: EXIM Business Profile Management (/dashboard/profile)
  if (isMemberProfileEditRoute || (pathname.includes('profile') && !isPublicProfileRoute)) {
    return (
      <MemberSidebar activeTab="profile" onNavigate={handleSidebarNavigate}>
        {member ? (
          <MemberProfileView />
        ) : (
          <GuestAuthGate
            targetFeature="profile"
            onAuthSuccess={(user) => setMember(user)}
            onNavigateToGenerator={navigateToPostTemplate}
          />
        )}
      </MemberSidebar>
    );
  }

  // Route 6: WhatsApp Post Template Generator
  if (isPostTemplateRoute) {
    return (
      <MemberSidebar activeTab="generator" onNavigate={handleSidebarNavigate}>
        <PostTemplatePortal
          onExit={navigateToHome}
          initialData={editingPostData}
        />
      </MemberSidebar>
    );
  }

  // Route 5: Default Onboarding & Landing Page
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-gold-500 selection:text-white">
      {/* Header Navbar */}
      <Navbar
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        isLanding={currentStep === 0}
        onReset={handleReset}
      />

      {/* Persistent Progress Bar at top of screens 1-5 */}
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <LandingPage key="landing" onStart={() => setCurrentStep(1)} />
          )}

          {currentStep === 1 && (
            <StepRoleSelection
              key="step1"
              selectedRole={formData.role}
              onSelectRole={(roleId) => handleUpdateField('role', roleId)}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <StepBasicInfo
              key="step2"
              formData={formData}
              onChange={handleUpdateField}
              roleId={formData.role}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 3 && (
            <StepDynamicQuestions
              key="step3"
              roleId={formData.role}
              dynamicAnswers={formData.dynamicAnswers}
              onUpdateAnswer={handleUpdateDynamicAnswer}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 4 && (
            <StepNetworkSelection
              key="step4"
              selectedNetworks={formData.selectedNetworks}
              onToggleNetwork={handleToggleNetwork}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 5 && (
            <StepSubmission
              key="step5"
              formData={formData}
              onSubmit={handleSubmitApplication}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 6 && (
            <StepSuccess
              key="success"
              formData={formData}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/50 flex flex-wrap items-center justify-between gap-2 max-w-5xl mx-auto w-full">
        <p>© {new Date().getFullYear()} EXIM Growth Network. All rights reserved.</p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={navigateToDashboard}
            className="text-[11px] font-bold text-slate-600 hover:text-ocean-950 cursor-pointer"
          >
            <span>📊 Member Dashboard</span>
          </button>
          
          <button
            onClick={navigateToPostTemplate}
            className="text-[11px] font-bold text-ocean-950 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>📢 Post Generator</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
