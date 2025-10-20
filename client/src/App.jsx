// Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react'; // <--- Import useEffect
import { Navigation } from './layout/Navigation';
import SignUp from './pages/SignUp';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import QuestsPage from './pages/QuestsPage';
import CommunityPage from './pages/CommunityPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ContactQuestMasters from './pages/ContactQuestMasters';
import AlliancePartners from './pages/AlliancePartners';
import ChallengeDetailsPage from './pages/ChallengeDetailsPage';
import QuestDetailsPage from './pages/QuestDetailsPage';
import PostDetailsPage from './pages/PostDetailsPage';

import { UserProvider, useUser } from './context/UserContext';
import { CheckCircle, Info, X } from 'lucide-react';
import { questAPI } from './utils/api';

// Notification Component
const Notification = ({ notification, onDismiss }) => {
  if (!notification) return null;

  const { type, title, message, duration = 5000 } = notification;
  
  // Auto-dismiss after duration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [notification, duration, onDismiss]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-blue-500';
  const icon = type === 'success' ? <CheckCircle className="w-6 h-6" /> : <Info className="w-6 h-6" />;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className={`${bgColor} text-white p-4 rounded-lg shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm text-white/90 mt-1">{message}</p>
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Quest Details Page Wrapper Component
const QuestDetailsPageWrapper = ({ onPageChange, questId }) => {
  const { user } = useUser();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        setLoading(true);
        console.log('Fetching quest with ID:', questId);
        const questData = await questAPI.getQuestById(questId);
        console.log('Quest data received:', questData);
        setQuest(questData);
      } catch (err) {
        console.error('Error fetching quest:', err);
        setError('Failed to load quest details');
      } finally {
        setLoading(false);
      }
    };

    if (questId) {
      fetchQuest();
    } else {
      console.error('No quest ID provided to QuestDetailsPageWrapper');
      setError('No quest ID provided - cannot load quest details');
      setLoading(false);
    }
  }, [questId]);

  const handleBack = () => {
    onPageChange('quests');
  };

  const handleSubmissionSuccess = () => {
    // Refresh quest data after successful submission
    if (questId) {
      questAPI.getQuestById(questId).then(setQuest).catch(console.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quest details...</p>
        </div>
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Quest Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || 'The quest you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            {questId && (
              <p className="text-sm text-gray-500 mb-4">
                Quest ID: {questId}
              </p>
            )}
          </div>
          <button 
            onClick={handleBack}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  // Simple quest details page that will definitely work
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
          >
            <span>←</span>
            Back to Quests
          </button>
        </div>

        {/* Quest Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {quest.difficulty || 'Easy'}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {quest.category || 'General Quest'}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {quest.title || 'Quest Details'}
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              {quest.description || 'No description available.'}
            </p>
          </div>

          {/* Quest Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {quest.points || 200}
              </div>
              <div className="text-sm text-gray-600">Reward Points</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {quest.duration || '2 weeks'}
              </div>
              <div className="text-sm text-gray-600">Estimated Time</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {quest.participants || 7}
              </div>
              <div className="text-sm text-gray-600">Participants</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                HAU
              </div>
              <div className="text-sm text-gray-600">Location</div>
            </div>
          </div>

          {/* Status */}
          <div className="mb-8">
            <div className="flex items-center gap-2 p-4 bg-green-100 rounded-lg">
              <span className="text-green-600">✓</span>
              <span className="text-green-700 font-semibold">Current Status: Completed</span>
            </div>
          </div>

          {/* Quest Objectives */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quest Objectives</h2>
            <div className="space-y-3">
              {(quest.objectives || [
                'Set up recycling bins in designated areas',
                'Create educational materials about recycling',
                'Collect recyclables for one week'
              ]).map((objective, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Requirements */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Submission Requirements</h2>
            <div className="space-y-3">
              {(quest.submissionRequirements || [
                'Photos of recycling bins setup',
                'Weight/volume of recyclables collected',
                'Educational material created'
              ]).map((requirement, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-orange-600">⚠</span>
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quest Completed */}
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-green-600">⏰</span>
              <span className="text-green-800 font-bold text-lg">Quest Completed</span>
            </div>
            <p className="text-green-700 mb-2">
              Congratulations! Your quest has been approved and points awarded.
            </p>
            <p className="text-green-600 text-sm">
              Submitted on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// App Content Component (inside UserProvider)
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState(null);
  const { notification, dismissNotification } = useUser();

  // Initialize page from URL on first load
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get('page') || 'home';
    const paramsFromUrl = urlParams.get('params');
    
    setCurrentPage(pageFromUrl);
    setPageParams(paramsFromUrl ? JSON.parse(decodeURIComponent(paramsFromUrl)) : null);
    
    // Set initial state in browser history if not already set
    if (!window.history.state) {
      const state = { page: pageFromUrl, params: paramsFromUrl ? JSON.parse(decodeURIComponent(paramsFromUrl)) : null };
      window.history.replaceState(state, '', window.location.href);
    }
  }, []);

  // Listen for browser back/forward button
  React.useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setCurrentPage(event.state.page);
        setPageParams(event.state.params);
        console.log(`Browser navigation to: ${event.state.page}`, event.state.params ? `with params: ${event.state.params}` : '');
      } else {
        // Handle direct URL navigation (like refresh or direct link)
        const urlParams = new URLSearchParams(window.location.search);
        const pageFromUrl = urlParams.get('page') || 'home';
        const paramsFromUrl = urlParams.get('params');
        
        setCurrentPage(pageFromUrl);
        setPageParams(paramsFromUrl ? JSON.parse(decodeURIComponent(paramsFromUrl)) : null);
        console.log(`Direct URL navigation to: ${pageFromUrl}`, paramsFromUrl ? `with params: ${paramsFromUrl}` : '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- FIX: Scroll to top on page change ---
  React.useEffect(() => {
    window.scrollTo(0, 0);
    
  }, [currentPage, pageParams]);
  // --- END FIX ---

  const handlePageChange = (page, params = null) => {
    setCurrentPage(page);
    setPageParams(params);
    
    // Push state to browser history
    const state = { page, params };
    const urlParams = new URLSearchParams();
    urlParams.set('page', page);
    if (params) {
      urlParams.set('params', encodeURIComponent(JSON.stringify(params)));
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState(state, '', newUrl);
    
    console.log(`Navigating to: ${page}`, params ? `with params: ${params}` : '');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'login':
        return <LoginPage onPageChange={handlePageChange} />;
      case 'signup':
        return <SignUp onPageChange={handlePageChange} />;
      case 'quests':
        return <QuestsPage onPageChange={handlePageChange} pageParams={pageParams} />;
      case 'community':
        return <CommunityPage onPageChange={handlePageChange} pageParams={pageParams} />;
      case 'leaderboard':
        return <LeaderboardPage onPageChange={handlePageChange} />;
      case 'profile':
        return <ProfilePage onPageChange={handlePageChange} userId={pageParams?.userId} />;
      case 'dashboard':
        return <DashboardPage onPageChange={handlePageChange} />;
      case 'partner-dashboard':
        return <PartnerDashboard onPageChange={handlePageChange} />;
      case 'admin-dashboard':
        return <AdminDashboard onPageChange={handlePageChange} />;
      case 'contactquestmasters':
        return <ContactQuestMasters onPageChange={handlePageChange} />;
      case 'alliancepartners':
        return <AlliancePartners onPageChange={handlePageChange} />;
      case 'challenge-details':
        return <ChallengeDetailsPage onPageChange={handlePageChange} challengeId={pageParams} />;
      case 'quest-details':
        return <QuestDetailsPageWrapper onPageChange={handlePageChange} questId={pageParams} />;
      case 'post-details':
        return <PostDetailsPage onPageChange={handlePageChange} postId={pageParams} />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <div>
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <main>
        {renderPage()}
      </main>
      <Notification notification={notification} onDismiss={dismissNotification} />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;