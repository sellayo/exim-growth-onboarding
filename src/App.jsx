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
import { submitOnboardingPayload } from './lib/supabase';

const TOTAL_STEPS = 5;

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    window.location.pathname.toLowerCase().startsWith('/admin') ||
    window.location.hash.toLowerCase() === '#admin'
  );

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
      setIsAdminRoute(
        window.location.pathname.toLowerCase().startsWith('/admin') ||
        window.location.hash.toLowerCase() === '#admin'
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
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

  // If user navigated to /admin route, render Admin Portal
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-gold-500 selection:text-white py-4">
        <AdminPortal onExitAdmin={navigateToHome} />
      </div>
    );
  }

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
        
        {/* Subtle Admin Shortcut Link */}
        <button
          onClick={navigateToAdmin}
          className="text-[11px] text-slate-400 hover:text-ocean-950 hover:underline transition-colors cursor-pointer"
        >
          🔒 Admin Portal
        </button>
      </footer>
    </div>
  );
}
