import React from 'react';
import './DashboardCompany.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logoImg from './assets/logo.svg';
import { contactsData, projectsData, userActivities } from '../../data/mockData';

import TopHeader from '../../components/TopHeader';

const DashboardCompany = ({ user, role = 'admin', onNavigate = () => { } }) => {

  const getContact = (id) => contactsData.find(c => c.id === id);

  return (
    <div className="dashboard-grid">
      <aside className="sidebar-icons">
        <div className="brand-logo mb-5">
          <img src={logoImg} className="logo-small" alt="logo" />
        </div>
        <nav className="nav flex-column align-items-center gap-4">
          <div className="nav-btn" onClick={() => onNavigate('dashboard')}><i className="bi bi-grid"></i><span>Dashboard</span></div>
          <div className="nav-btn" onClick={() => onNavigate('projects')}><i className="bi bi-briefcase"></i><span>Projects</span></div>
          <div className="nav-btn" onClick={() => onNavigate('contacts')}><i className="bi bi-person-badge"></i><span>Contacts</span></div>
          <div className="nav-btn" onClick={() => onNavigate('calendar')}><i className="bi bi-calendar3"></i><span>Calendar</span></div>
        </nav>
      </aside>

      <TopHeader user={user} onLogout={() => onNavigate('logout')} />

      <main className="main-content">

        <section className="glass-card projects-card mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <h6 className="fw-bold m-0">My current projects</h6>
            <span className="badge-count">{projectsData.length}</span>
          </div>
          <div className="table-container">
            <table className="table custom-styled-table">
              <thead>
                <tr>
                  <th>PROJECT NAME</th>
                  <th>LAST ACTIVITY</th>
                  <th>ASSIGNED</th>
                  <th>STATS</th>
                </tr>
              </thead>
              <tbody>
                {projectsData.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="p-name">{p.name}</div>
                      <div className="p-company">{p.company}</div>
                    </td>
                    <td className="text-muted small">{p.activity}</td>
                    <td>
                      <div className="avatar-group">
                        {p.assignedTo.map(contactId => {
                          const contact = getContact(contactId);
                          return contact ? <img key={contact.id} src={contact.avatar} alt={contact.name} title={contact.name} /> : null;
                        })}
                      </div>
                    </td>
                    <td><span className="stats-pill">{p.stats}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card hotlist-card mb-4">
          <h6 className="fw-bold mb-4">recent activity</h6>
          <div className="hotlist-row">
            {userActivities.map(activity => {
              const contact = getContact(activity.contactId);
              return contact ? (
                <div key={activity.id} className="hotlist-item">
                  <img src={contact.avatar} alt={contact.name} />
                  <div className="item-name">{contact.name}</div>
                  <div className="item-role">{contact.role}</div>
                </div>
              ) : null;
            })}
          </div>
        </section>

        {role === 'admin' && (
          <div className="applications-group">
            <div className="applications-header">Hires</div>
            <div className="admin-stats-row">
              <div className="stat-card"><span className="stat-label">Applications</span><small className="stat-period">This month</small><strong>15</strong></div>
              <div className="stat-card"><span className="stat-label">Interviews</span><small className="stat-period">This week</small><strong>20</strong></div>
              <div className="stat-card"><span className="stat-label">Hires</span><small className="stat-period">Today</small><strong>20</strong></div>
            </div>
          </div>
        )}
      </main>

      <aside className="calendar-panel">
        <div className="calendar-container">
          <h5 className="fw-bold mb-4"><span className="text-success">20</span> Tuesday</h5>
          <div className="timeline-entry">
            <span className="time">12:30</span>
            <div className="event blue-ev">Call with client</div>
          </div>
          <div className="timeline-entry">
            <span className="time">14:00</span>
            <div className="event normal-ev">Interview</div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DashboardCompany;