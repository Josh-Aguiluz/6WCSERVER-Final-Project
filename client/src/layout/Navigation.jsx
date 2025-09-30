import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, Shield, Award, Plus, Star, Trophy, Zap, Calendar, Users, Home, BookOpen, MessageCircle, Crown, Settings, ChevronDown } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Note: The original interface is removed as it's a TypeScript-only feature.
// PropTypes (or similar) would be used for type checking in a pure JS environment.

export function Navigation({ currentPage, onPageChange, isLoggedIn = false, onLogin, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  // Assuming useUser returns the same object shape
  const { user, logout: userLogout, canSubmitProposals, canManageContent } = useUser();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Type casting (as Node) is removed
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    // MouseEvent is removed from the addEventListener call
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
  ];

  const getProfileDropdown = () => {
    if (!user) return null;

    const level = Math.floor(user.points / 100) + 1;
    const roleIcon = user.role === 'admin' ? '👑' : user.role === 'partner' ? '🤝' : '⭐';

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="relative group eco-interactive"
        >
          <div className="flex items-center gap-3 bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {user.name.charAt(0)}
              </div>
              {/* Level Badge */}
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-accent to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-md">
                {level}
              </div>
            </div>

            {/* User Info (Desktop) */}
            <div className="hidden lg:block text-left">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">{user.name}</span>
                <span className="text-sm">{roleIcon}</span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {user.points.toLocaleString()} pts
              </div>
            </div>

            {/* Role Indicator & Dropdown Arrow */}
            <div className="flex items-center gap-2">
              {user.role === 'admin' && <Shield className="w-4 h-4 text-red-500" />}
              {user.role === 'partner' && <Award className="w-4 h-4 text-blue-500" />}
              {user.role === 'user' && <Star className="w-4 h-4 text-green-500" />}
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {profileDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl py-2 z-50">
            <button
              onClick={() => {
                onPageChange('profile');
                setProfileDropdownOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors w-full text-left rounded-xl mx-2"
            >
              <User className="w-4 h-4" />
              View Profile
            </button>
            <button
              onClick={() => {
                onPageChange('dashboard');
                setProfileDropdownOpen(false);
                // Navigate to settings tab in dashboard
                setTimeout(() => {
                  const dashboardEvent = new CustomEvent('setDashboardTab', { detail: 'settings' });
                  window.dispatchEvent(dashboardEvent);
                }, 100);
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors w-full text-left rounded-xl mx-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <div className="border-t border-border/30 my-2 mx-2"></div>
            <button
              onClick={() => {
                userLogout();
                onLogout?.();
                setProfileDropdownOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left rounded-xl mx-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-3 eco-interactive p-2 rounded-xl"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-600 rounded-xl flex items-center justify-center shadow-md eco-float">
              <span className="text-white font-bold text-lg">🌱</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">HAU Eco-Quest</h1>
              <p className="text-xs text-muted-foreground">Join the Green Adventure</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  } eco-interactive`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Role-specific buttons */}
                {canManageContent && (
                  <button
                    onClick={() => onPageChange('dashboard')}
                    className="flex items-center gap-2 bg-purple-100 text-purple-600 border border-purple-200 hover:bg-purple-600 hover:text-white px-3 py-2 rounded-xl font-semibold transition-all duration-200 eco-interactive shadow-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Manage
                  </button>
                )}

                {!canManageContent && (
                  <button
                    onClick={() => onPageChange('dashboard')}
                    className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground px-3 py-2 rounded-xl font-semibold transition-all duration-200 eco-interactive shadow-sm"
                  >
                    <Zap className="w-4 h-4" />
                    Dashboard
                  </button>
                )}

                {/* Profile Dropdown */}
                {getProfileDropdown()}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onPageChange('login')}
                  className="flex items-center gap-2 bg-card text-foreground border border-border/50 hover:bg-muted px-4 py-2 rounded-xl font-semibold transition-all duration-200 eco-interactive shadow-sm"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => onPageChange('signup')}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold transition-all duration-200 eco-interactive shadow-lg hover:shadow-xl"
                >
                  <Star className="w-4 h-4" />
                  Join Adventure
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors eco-interactive"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/30 bg-card/95 backdrop-blur-sm rounded-b-2xl shadow-lg">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-border/20 space-y-2">
                {user ? (
                  <>
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-r from-primary/10 to-green-100 border border-primary/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-accent to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                            {Math.floor(user.points / 100) + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{user.name}</span>
                            {user.role === 'admin' && <span>👑</span>}
                            {user.role === 'partner' && <span>🤝</span>}
                            {user.role === 'user' && <span>⭐</span>}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {user.points.toLocaleString()} eco-points
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile action buttons */}
                    {canManageContent && (
                      <button
                        onClick={() => {
                          onPageChange('dashboard');
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
                      >
                        <Shield className="w-5 h-5" />
                        Admin Dashboard
                      </button>
                    )}

                    {!canManageContent && (
                      <button
                        onClick={() => {
                          onPageChange('dashboard');
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
                      >
                        <Zap className="w-5 h-5" />
                        My Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onPageChange('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
                    >
                      <User className="w-5 h-5" />
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        userLogout();
                        onLogout?.();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onPageChange('login');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
                    >
                      <User className="w-5 h-5" />
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onPageChange('signup');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold transition-colors w-full shadow-md"
                    >
                      <Star className="w-5 h-5" />
                      Join Adventure
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}