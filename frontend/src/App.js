import React, { useState } from 'react';
import { DashboardCompany, DashboardUser, Candidates, Projects, Contacts, CalendarPage, SearchPage, Login } from './pages';
import { ChatProvider } from './context/ChatContext';
import ChatWidget from './components/ChatWidget';

function App() {
  const [page, setPage] = useState('dashboard');
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null, // 'admin' or 'user'
    token: null,
    user: null
  });

  const handleLogin = (userData) => {
    setAuth({
      isAuthenticated: true,
      id: userData.id,
      role: userData.role,
      token: userData.token,
      user: userData.username
    });
    setPage('dashboard');
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      role: null,
      token: null,
      user: null
    });
    setPage('login');
  };

  const handleNavigate = (to) => {
    switch (to) {
      case 'projects': setPage('projects'); break;
      case 'candidates': setPage('candidates'); break;
      case 'contacts': setPage('contacts'); break;
      case 'calendar': setPage('calendar'); break;
      case 'search': setPage('search'); break;
      case 'logout': handleLogout(); break;
      default: setPage('dashboard');
    }
  }

  // If not authenticated, show Login page
  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ChatProvider authUser={auth}>
      <div className="App">
        {page === 'dashboard' && auth.role === 'admin' && (
          <DashboardCompany user={auth} onNavigate={handleNavigate} />
        )}
        {page === 'dashboard' && auth.role === 'user' && (
          <DashboardUser user={auth} onNavigate={handleNavigate} />
        )}

        {/* Shared pages */}
        {page === 'projects' && <Projects user={auth} onNavigate={handleNavigate} />}
        {page === 'candidates' && <Candidates user={auth} onNavigate={handleNavigate} />}
        {page === 'contacts' && <Contacts user={auth} onNavigate={handleNavigate} />}
        {page === 'calendar' && <CalendarPage user={auth} onNavigate={handleNavigate} />}
        {page === 'search' && <SearchPage user={auth} onNavigate={handleNavigate} />}

        <ChatWidget />
      </div>
    </ChatProvider>
  );
}

export default App;