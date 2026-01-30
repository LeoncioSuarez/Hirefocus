import React from 'react';
import './DashboardUser.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logoImg from './assets/logo.svg';
import TopHeader from '../../components/TopHeader';

const DashboardUser = ({ user, onNavigate = () => { } }) => {
  const projects = [
    { id: 1, name: "Senior .NET Developer", company: "Flying Free", activity: "20.10.2025 17:56", stats: 'Applied' },
    { id: 2, name: "React Frontend", company: "TechCorp", activity: "18.10.2025 10:30", stats: 'Interview' },
  ];

  const recentActivity = [
    { id: 1, name: "Recruiter", role: "Viewed your profile", img: "https://i.pravatar.cc/150?u=10" },
    { id: 2, name: "System", role: "Application received", img: "https://i.pravatar.cc/150?u=11" },
  ];

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
            <h6 className="fw-bold m-0">My Applications</h6>
            <span className="badge-count">2</span>
          </div>
          <div className="table-container">
            <table className="table custom-styled-table">
              <thead>
                <tr>
                  <th>JOB TITLE</th>
                  <th>LAST ACTIVITY</th>
                  <th>HR CONTACT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="p-name">{p.name}</div>
                      <div className="p-company">{p.company}</div>
                    </td>
                    <td className="text-muted small">{p.activity}</td>
                    <td>
                      <div className="avatar-group">
                        <img src="https://i.pravatar.cc/30?u=hr" alt="hr" />
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
          <h6 className="fw-bold mb-4">Recent Activity</h6>
          <div className="hotlist-row">
            {recentActivity.map(item => (
              <div key={item.id} className="hotlist-item">
                <img src={item.img} alt={item.name} />
                <div className="item-name">{item.name}</div>
                <div className="item-role">{item.role}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="applications-group">
          <div className="applications-header">Applications</div>
          <div className="admin-stats-row mt-0">
            <div className="stat-card">
              <small className="stat-period">This month</small>
              <strong>15</strong>
            </div>
            <div className="stat-card">
              <small className="stat-period">This week</small>
              <strong>20</strong>
            </div>
            <div className="stat-card">
              <small className="stat-period">Today</small>
              <strong>20</strong>
            </div>
          </div>
        </div>

      </main>

      <aside className="calendar-panel">
        <div className="calendar-container">
          <h5 className="fw-bold mb-4"><span className="text-success">20</span> Tuesday</h5>
          <div className="timeline-entry">
            <span className="time">09:00</span>
            <div className="event blue-ev">Update Profile</div>
          </div>
          <div className="timeline-entry">
            <span className="time">14:00</span>
            <div className="event normal-ev">Interview at TechCorp</div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DashboardUser;
