import React from 'react';
import './DashboardUser.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logoImg from './assets/logo.png';

const DashboardUser = ({ role = 'user', onNavigate = () => {} }) => {
  const projects = [];
  const hotlist = [];

  return (
    <div className="dashboard-grid">
      <aside className="sidebar-icons">
        <div className="brand-logo mb-5">
          <img src={logoImg} className="logo-small" alt="logo" />
        </div>
        <nav className="nav flex-column align-items-center gap-4">
          <div className="nav-btn" onClick={() => onNavigate('projects')}><i className="bi bi-grid"></i><span>Projects</span></div>
          <div className="nav-btn" onClick={() => onNavigate('candidates')}><i className="bi bi-people"></i><span>Candidates</span></div>
          <div className="nav-btn" onClick={() => onNavigate('contacts')}><i className="bi bi-person-badge"></i><span>Contacts</span></div>
          <div className="nav-btn" onClick={() => onNavigate('calendar')}><i className="bi bi-calendar3"></i><span>Calendar</span></div>
          <div className="nav-btn" onClick={() => onNavigate('search')}><i className="bi bi-search"></i><span>Search</span></div>
        </nav>
      </aside>

      <header className="top-header">
        <div className="header-actions">
          <i className="bi bi-chat-left-dots"></i>
          <i className="bi bi-envelope"></i>
          <i className="bi bi-bell"></i>
          <i className="bi bi-grid-3x3-gap"></i>
          <img src="https://i.pravatar.cc/150?u=me" className="user-img-nav" alt="user" />
        </div>
      </header>

      <main className="main-content">
        <section className="glass-card mb-4">
          <h6 className="fw-bold m-0">User dashboard (placeholder)</h6>
        </section>
      </main>

      <aside className="calendar-panel">
        <div className="calendar-container"></div>
      </aside>
    </div>
  );
};

export default DashboardUser;
