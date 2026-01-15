import React, { useState } from 'react';
import { DashboardCompany, DashboardUser, Candidates, Projects, Contacts, CalendarPage, SearchPage } from './pages';

function App() {
  const [page, setPage] = useState('dashboard');
  const [role] = useState('admin');

  const handleNavigate = (to) => {
    switch (to) {
      case 'projects': setPage('projects'); break;
      case 'candidates': setPage('candidates'); break;
      case 'contacts': setPage('contacts'); break;
      case 'calendar': setPage('calendar'); break;
      case 'search': setPage('search'); break;
      default: setPage('dashboard');
    }
  }

  return (
    <div className="App">
      {page === 'dashboard' && <DashboardCompany role={role} onNavigate={handleNavigate} />}
      {page === 'projects' && <Projects />}
      {page === 'candidates' && <Candidates />}
      {page === 'contacts' && <Contacts />}
      {page === 'calendar' && <CalendarPage />}
      {page === 'search' && <SearchPage />}
    </div>
  );
}

export default App;