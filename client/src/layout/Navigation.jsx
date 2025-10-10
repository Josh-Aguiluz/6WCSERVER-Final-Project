import React, { useState, useRef, useEffect } from 'react';
import {
  Menu, X, User, LogOut, Shield, Trash2, Trophy,
  ChevronDown, BookOpen, MessageCircle, Crown, Home, Sparkles, Bell
} from 'lucide-react';
import { useUser } from "../context/UserContext";
import { notificationAPI } from "../utils/api";

export function Navigation({ currentPage, onPageChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const { user, logout: userLogout, deleteAccount } = useUser() || {};

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const result = await deleteAccount();
      if (result.success) {
        alert('Account deleted successfully');
        onPageChange('home');
      } else {
        alert('Failed to delete account');
      }
    }
  };

  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch unread notifications
  useEffect(() => {
    if (user) {
      fetchUnreadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadNotifications = async () => {
    try {
      console.log('Fetching notifications...');
      const notificationsData = await notificationAPI.getNotifications();
      console.log('Notifications data:', notificationsData);
      const unreadCount = notificationsData.filter(n => !n.is_read).length;
      console.log('Unread count:', unreadCount);
      setUnreadNotifications(unreadCount);
      setNotifications(notificationsData.slice(0, 5)); // Show only 5 most recent for dropdown
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const navItems = user ? [
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
  ] : [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
  ];

  const avatars = [
    { name: "Girl Avatar 1", gender: "Female", color: "text-pink-500", bg: "bg-pink-100" },
    { name: "Girl Avatar 2", gender: "Female", color: "text-pink-400", bg: "bg-pink-50" },
    { name: "Boy Avatar 1", gender: "Male", color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Boy Avatar 2", gender: "Male", color: "text-blue-400", bg: "bg-blue-50" },
  ];
  const selectedAvatar = avatars.find((a) => a.name === (user?.avatar || "Girl Avatar 1"));
  const defaultAvatarStyle = { bg: "bg-pink-100", color: "text-pink-500" };
  const currentAvatarStyle = selectedAvatar || defaultAvatarStyle;

  const getProfileDropdown = () => {
    if (!user) return null;

    const points = user.points || 0;
    const level = Math.floor(points / 100) + 1;
    const roleIcon = user.role === 'admin' ? '👑' : user.role === 'partner' ? '🤝' : '⭐';

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center gap-3 bg-white hover:bg-gray-50 rounded-full px-3 py-2 transition-all shadow-md border border-gray-200"
        >
          <div className="relative">
            <div className={`w-10 h-10 ${currentAvatarStyle.bg} rounded-full flex items-center justify-center`}>
              <User className={`w-6 h-6 ${currentAvatarStyle.color}`} />
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
              {level}
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-900">{user.username || 'User'}</span>
              <span>{roleIcon}</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {points.toLocaleString()} pts
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {profileDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50">
            <button
              onClick={() => { onPageChange('profile'); setProfileDropdownOpen(false); }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full rounded-lg mx-1"
            >
              <User className="w-4 h-4" /> View Profile
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => { userLogout?.(); onPageChange('home'); setProfileDropdownOpen(false); }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full rounded-lg mx-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => { handleDeleteAccount(); setProfileDropdownOpen(false); }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg mx-1"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => onPageChange('home')} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">HAU Eco-Quest</span>
          </button>

          {/* FIX: Desktop Navigation Links. 'hidden' on mobile, 'flex' on medium screens and up. */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            
            {/* Notification Icon */}
            {user && (
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <div className="flex gap-2">
                          {unreadNotifications > 0 && (
                            <button
                              onClick={async () => {
                                try {
                                  await notificationAPI.markAllAsRead();
                                  fetchUnreadNotifications();
                                } catch (error) {
                                  console.error('Error marking all as read:', error);
                                }
                              }}
                              className="text-sm text-green-600 hover:text-green-700 font-semibold"
                            >
                              Mark all as read
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              try {
                                console.log('Creating test notification...');
                                const token = localStorage.getItem('token');
                                console.log('Token exists:', !!token);
                                
                                const response = await fetch('/api/notifications/test', {
                                  method: 'POST',
                                  headers: { 'x-auth-token': token }
                                });
                                
                                console.log('Test notification response status:', response.status);
                                const result = await response.json();
                                console.log('Test notification result:', result);
                                
                                if (response.ok) {
                                  console.log('Test notification created successfully, fetching notifications...');
                                  // Wait a moment then fetch notifications
                                  setTimeout(() => {
                                    fetchUnreadNotifications();
                                  }, 1000);
                                }
                              } catch (error) {
                                console.error('Error creating test notification:', error);
                              }
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 border border-blue-600 rounded"
                          >
                            Test
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                console.log('Testing direct API call...');
                                const token = localStorage.getItem('token');
                                console.log('Token:', token ? 'exists' : 'missing');
                                
                                const response = await fetch('/api/notifications', {
                                  headers: { 'x-auth-token': token }
                                });
                                console.log('Direct API response status:', response.status);
                                const result = await response.json();
                                console.log('Direct API result:', result);
                                console.log('Number of notifications found:', result.length);
                              } catch (error) {
                                console.error('Error with direct API call:', error);
                              }
                            }}
                            className="text-xs text-red-600 hover:text-red-700 px-2 py-1 border border-red-600 rounded"
                          >
                            Direct
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.is_read ? 'bg-blue-50' : ''
                            }`}
                            onClick={async () => {
                              // Mark as read
                              if (!notification.is_read) {
                                try {
                                  await notificationAPI.markAsRead(notification._id);
                                  fetchUnreadNotifications();
                                } catch (error) {
                                  console.error('Error marking as read:', error);
                                }
                              }
                              
                              // Navigate based on notification type
                              if (notification.type === 'post_liked' || notification.type === 'post_commented') {
                                // Navigate to community page for post notifications
                                onPageChange('community');
                                setNotificationDropdownOpen(false);
                              } else if (notification.type === 'submission_approved' || notification.type === 'submission_rejected') {
                                // Navigate to quests page for quest notifications
                                onPageChange('quests');
                                setNotificationDropdownOpen(false);
                              } else if (notification.type === 'role_approved') {
                                // Navigate to profile page for role approval
                                onPageChange('profile');
                                setNotificationDropdownOpen(false);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${!notification.is_read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button
                          onClick={() => {
                            setNotificationDropdownOpen(false);
                            // Navigate to dashboard notifications tab
                            if (user.role === 'admin') {
                              onPageChange('admin-dashboard');
                            } else if (user.role === 'partner') {
                              onPageChange('partner-dashboard');
                            } else {
                              onPageChange('dashboard');
                            }
                            // Trigger notifications tab after navigation
                            setTimeout(() => {
                              const notificationsTab = document.querySelector('[data-tab="notifications"]');
                              if (notificationsTab) {
                                notificationsTab.click();
                              }
                            }, 100);
                          }}
                          className="text-sm text-green-600 hover:text-green-700 font-semibold"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FIX: Desktop User/Auth section. 'hidden' on mobile, 'flex' on medium screens and up. */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {!user.requested_role && user.role === 'user' && (
                  <button onClick={() => onPageChange('dashboard')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    Dashboard
                  </button>
                )}
                {!user.requested_role && user.role === 'partner' && (
                  <button onClick={() => onPageChange('partner-dashboard')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Shield className="w-4 h-4" /> Partner
                  </button>
                )}
                {!user.requested_role && user.role === 'admin' && (
                  <button onClick={() => onPageChange('admin-dashboard')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Shield className="w-4 h-4" /> Admin
                  </button>
                )}
                {user.requested_role && !user.is_approved && (
                  <div className="flex items-center gap-2 bg-amber-100 text-amber-700 border border-amber-300 px-4 py-2 rounded-full font-bold text-sm">
                    <Shield className="w-4 h-4" /> Pending Approval
                  </div>
                )}
                {getProfileDropdown()}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={() => onPageChange('login')} className="font-bold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                  Login
                </button>
                <button onClick={() => onPageChange('signup')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* FIX: Mobile Burger Menu Button. Hidden on medium screens and up. */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onPageChange(item.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      isActive ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              {user ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {!user.requested_role && (user.role === 'user' || user.role === 'partner' || user.role === 'admin') && (
                    <button
                      onClick={() => {
                        const page = user.role === 'admin' ? 'admin-dashboard' :
                          user.role === 'partner' ? 'partner-dashboard' :
                            'dashboard';
                        onPageChange(page);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                    >
                      <Shield className="w-5 h-5" /> Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { onPageChange('profile'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                  >
                    <User className="w-5 h-5" /> Profile
                  </button>
                  <button
                    onClick={() => { userLogout?.(); onPageChange('home'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => { onPageChange('login'); setMobileMenuOpen(false); }}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-bold"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { onPageChange('signup'); setMobileMenuOpen(false); }}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}