'use client';

import { useState, useEffect } from 'react';
import { FaMicrophone, FaUser, FaEdit, FaCog, FaBell, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState('English');
  
  const { darkMode, toggleDarkMode } = useTheme();

  // Stats for the user
  const stats = {
    totalRecordings: 24,
    totalMinutes: 142,
    longestRecording: '12:45',
    averageLength: '5:55',
  };

  const handleSaveProfile = () => {
    // In a real app, you would save to backend here
    setIsEditing(false);
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: darkMode ? '#000000' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      {/* Navigation Bar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <FaMicrophone style={{ color: '#F44336', marginRight: '0.5rem' }} />
            <span style={{ color: '#F44336', fontWeight: 'bold', fontSize: '1.25rem' }}>VoiceNote</span>
          </Link>
        </div>
        <Link 
          href="/"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: 'white', 
            textDecoration: 'none',
            gap: '0.5rem'
          }}
        >
          <FaArrowLeft /> Back to Home
        </Link>
      </nav>

      <div style={{ maxWidth: '64rem', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          backgroundColor: darkMode ? '#111827' : '#f3f4f6',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Profile Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '1.5rem'
          }}>
            <div style={{ 
              width: '6rem', 
              height: '6rem', 
              borderRadius: '50%', 
              backgroundColor: darkMode ? '#1F2937' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFA500',
              fontSize: '2rem',
              border: '2px solid #FFA500'
            }}>
              <FaUser />
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {name}
              </h1>
              <p style={{ color: '#AAAAAA', fontSize: '1rem' }}>
                {email}
              </p>
              <p style={{ color: '#AAAAAA', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            gap: '1rem'
          }}>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: activeTab === 'profile' ? darkMode ? '#1F2937' : '#ffffff' : 'transparent',
                color: activeTab === 'profile' ? darkMode ? 'white' : 'black' : '#AAAAAA',
                border: 'none',
                borderRadius: '0.5rem 0.5rem 0 0',
                cursor: 'pointer',
                fontWeight: activeTab === 'profile' ? 'bold' : 'normal',
                borderBottom: activeTab === 'profile' ? '2px solid #FFA500' : 'none'
              }}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: activeTab === 'stats' ? darkMode ? '#1F2937' : '#ffffff' : 'transparent',
                color: activeTab === 'stats' ? darkMode ? 'white' : 'black' : '#AAAAAA',
                border: 'none',
                borderRadius: '0.5rem 0.5rem 0 0',
                cursor: 'pointer',
                fontWeight: activeTab === 'stats' ? 'bold' : 'normal',
                borderBottom: activeTab === 'stats' ? '2px solid #FFA500' : 'none'
              }}
            >
              Stats
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: activeTab === 'settings' ? darkMode ? '#1F2937' : '#ffffff' : 'transparent',
                color: activeTab === 'settings' ? darkMode ? 'white' : 'black' : '#AAAAAA',
                border: 'none',
                borderRadius: '0.5rem 0.5rem 0 0',
                cursor: 'pointer',
                fontWeight: activeTab === 'settings' ? 'bold' : 'normal',
                borderBottom: activeTab === 'settings' ? '2px solid #FFA500' : 'none'
              }}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '1rem 0' }}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ color: 'white', fontSize: '1.25rem' }}>Personal Information</h2>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      backgroundColor: isEditing ? darkMode ? '#374151' : '#ffffff' : 'transparent',
                      color: isEditing ? darkMode ? 'white' : 'black' : '#F44336',
                      border: isEditing ? 'none' : '1px solid #F44336',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', color: '#AAAAAA', marginBottom: '0.5rem' }}>
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                          color: darkMode ? 'white' : 'black',
                          border: '1px solid #374151',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#AAAAAA', marginBottom: '0.5rem' }}>
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                          color: darkMode ? 'white' : 'black',
                          border: '1px solid #374151',
                          borderRadius: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <button 
                      onClick={handleSaveProfile}
                      style={{ 
                        backgroundColor: '#F44336',
                        color: 'black',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '1rem'
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                      borderRadius: '0.5rem'
                    }}>
                      <span style={{ color: '#AAAAAA' }}>Full Name</span>
                      <span style={{ color: 'white' }}>{name}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                      borderRadius: '0.5rem'
                    }}>
                      <span style={{ color: '#AAAAAA' }}>Email Address</span>
                      <span style={{ color: 'white' }}>{email}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                      borderRadius: '0.5rem'
                    }}>
                      <span style={{ color: '#AAAAAA' }}>Password</span>
                      <span style={{ color: '#F44336' }}>Change Password</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ color: 'white', fontSize: '1.25rem' }}>Your Recording Stats</h2>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ color: '#AAAAAA', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Total Recordings
                    </h3>
                    <p style={{ color: '#F44336', fontSize: '2rem', fontWeight: 'bold' }}>
                      {stats.totalRecordings}
                    </p>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ color: '#AAAAAA', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Total Minutes
                    </h3>
                    <p style={{ color: '#F44336', fontSize: '2rem', fontWeight: 'bold' }}>
                      {stats.totalMinutes}
                    </p>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ color: '#AAAAAA', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Longest Recording
                    </h3>
                    <p style={{ color: '#F44336', fontSize: '2rem', fontWeight: 'bold' }}>
                      {stats.longestRecording}
                    </p>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ color: '#AAAAAA', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Average Length
                    </h3>
                    <p style={{ color: '#F44336', fontSize: '2rem', fontWeight: 'bold' }}>
                      {stats.averageLength}
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  marginTop: '1rem'
                }}>
                  <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem' }}>
                    Monthly Activity
                  </h3>
                  <div style={{ 
                    display: 'flex',
                    height: '150px',
                    alignItems: 'flex-end',
                    gap: '0.5rem',
                    padding: '1rem 0'
                  }}>
                    {[35, 45, 30, 60, 75, 50, 40, 55, 65, 70, 80, 60].map((height, index) => (
                      <div key={index} style={{ 
                        flex: 1,
                        height: `${height}%`,
                        backgroundColor: index === 6 ? '#F44336' : 'rgba(244, 67, 54, 0.3)',
                        borderRadius: '0.25rem',
                        position: 'relative'
                      }}>
                        {index === 6 && (
                          <div style={{ 
                            position: 'absolute',
                            top: '-1.5rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#F44336',
                            color: 'black',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            Now
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#AAAAAA',
                    fontSize: '0.75rem',
                    marginTop: '0.5rem'
                  }}>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ color: 'white', fontSize: '1.25rem' }}>App Settings</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: darkMode ? '#1F2937' : '#f3f4f6',
                    borderRadius: '0.5rem'
                  }}>
                    <div>
                      <h3 style={{ color: darkMode ? 'white' : 'black', fontSize: '1rem', marginBottom: '0.25rem' }}>
                        Notifications
                      </h3>
                      <p style={{ color: darkMode ? '#AAAAAA' : '#666666', fontSize: '0.875rem' }}>
                        Receive alerts about your recordings
                      </p>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                      <input 
                        type="checkbox" 
                        checked={notificationsEnabled}
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{ 
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: notificationsEnabled ? '#F44336' : '#374151',
                        borderRadius: '34px',
                        transition: '0.4s'
                      }}>
                        <span style={{ 
                          position: 'absolute',
                          content: '""',
                          height: '26px',
                          width: '26px',
                          left: '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.4s',
                          transform: notificationsEnabled ? 'translateX(26px)' : 'translateX(0)'
                        }}></span>
                      </span>
                    </label>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: darkMode ? '#1F2937' : '#f3f4f6',
                    borderRadius: '0.5rem'
                  }}>
                    <div>
                      <h3 style={{ color: darkMode ? 'white' : 'black', fontSize: '1rem', marginBottom: '0.25rem' }}>
                        Dark Mode
                      </h3>
                      <p style={{ color: darkMode ? '#AAAAAA' : '#666666', fontSize: '0.875rem' }}>
                        Use dark theme for the app
                      </p>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      style={{
                        width: '60px',
                        height: '34px',
                        position: 'relative',
                        backgroundColor: darkMode ? '#FFA500' : '#D1D5DB',
                        borderRadius: '34px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '""',
                          height: '26px',
                          width: '26px',
                          left: darkMode ? '30px' : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: 'left 0.3s'
                        }}
                      />
                    </button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: darkMode ? '#1F2937' : '#f3f4f6',
                    borderRadius: '0.5rem'
                  }}>
                    <div>
                      <h3 style={{ color: darkMode ? 'white' : 'black', fontSize: '1rem', marginBottom: '0.25rem' }}>
                        Auto-Save
                      </h3>
                      <p style={{ color: darkMode ? '#AAAAAA' : '#666666', fontSize: '0.875rem' }}>
                        Automatically save recordings
                      </p>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                      <input 
                        type="checkbox" 
                        checked={autoSave}
                        onChange={() => setAutoSave(!autoSave)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{ 
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: autoSave ? '#F44336' : '#374151',
                        borderRadius: '34px',
                        transition: '0.4s'
                      }}>
                        <span style={{ 
                          position: 'absolute',
                          content: '""',
                          height: '26px',
                          width: '26px',
                          left: '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.4s',
                          transform: autoSave ? 'translateX(26px)' : 'translateX(0)'
                        }}></span>
                      </span>
                    </label>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: darkMode ? '#1F2937' : '#f3f4f6',
                    borderRadius: '0.5rem'
                  }}>
                    <div>
                      <h3 style={{ color: darkMode ? 'white' : 'black', fontSize: '1rem', marginBottom: '0.25rem' }}>
                        Language
                      </h3>
                      <p style={{ color: darkMode ? '#AAAAAA' : '#666666', fontSize: '0.875rem' }}>
                        Choose your preferred language
                      </p>
                    </div>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{ 
                        backgroundColor: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? 'white' : 'black',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <button style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'transparent',
                    color: '#F44336',
                    border: '1px solid #F44336',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}>
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        color: '#777777'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaMicrophone style={{ color: '#FFA500', marginRight: '0.5rem' }} />
          <span style={{ color: '#FFA500', fontWeight: 'bold' }}>VoiceNote</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</Link>
        </div>
      </footer>
    </main>
  );
} 