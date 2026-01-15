import React from 'react';
import './DashboardCompany.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logoImg from './assets/logo.svg';

const DashboardCompany = ({ role = 'admin', onNavigate = () => {} }) => {
  const projects = [
    { id: 1, name: "Senior .NET Developer", company: "Flying Free", activity: "20.10.2025 17:56", stats: 18 },
    { id: 2, name: "Project Manager", company: "Colorful Investments", activity: "20.10.2025 17:54", stats: 7 },
  ];

  const hotlist = [
    { id: 1, name: "Borys", role: "Tester", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Anastazja", role: "Analyst", img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Anastazja", role: "Analyst", img: "https://i.pravatar.cc/150?u=5" },
    { id: 4, name: "Antoni", role: "Developer", img: "https://i.pravatar.cc/150?u=3" },
  ];

  return (
    <div className="dashboard-grid">
      {/* AZUL: SIDEBAR COMPACTA CON ICONOS */}
      <aside className="sidebar-icons">
        <div className="brand-logo mb-5">
            <img src={logoImg} className="logo-small" alt="logo" />
          </div>
        <nav className="nav flex-column align-items-center gap-4">
          <div className="nav-btn" onClick={() => onNavigate('projects')}><i className="bi bi-grid"></i><span>Projects</span></div>
          <div className="nav-btn active" onClick={() => onNavigate('candidates')}><i className="bi bi-people"></i><span>Candidates</span></div>
          <div className="nav-btn" onClick={() => onNavigate('contacts')}><i className="bi bi-person-badge"></i><span>Contacts</span></div>
          <div className="nav-btn" onClick={() => onNavigate('calendar')}><i className="bi bi-calendar3"></i><span>Calendar</span></div>
          <div className="nav-btn" onClick={() => onNavigate('search')}><i className="bi bi-search"></i><span>Search</span></div>
        </nav>
      </aside>

      {/* RECUADRO 1: NAVBAR SUPERIOR */}
      <header className="top-header">
        <div className="header-actions">
          <i className="bi bi-chat-left-dots"></i>
          <i className="bi bi-envelope"></i>
          <i className="bi bi-bell"></i>
          <i className="bi bi-grid-3x3-gap"></i>
          <img src="https://i.pravatar.cc/150?u=me" className="user-img-nav" alt="user" />
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        
        {/* VERDE: TABLA ESTILO "NEGRO" (ORGANIZADA) */}
        <section className="glass-card projects-card mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <h6 className="fw-bold m-0">My current projects</h6>
            <span className="badge-count">17</span>
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
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="p-name">{p.name}</div>
                    <div className="p-company">{p.company}</div>
                  </td>
                  <td className="text-muted small">{p.activity}</td>
                  <td>
                    <div className="avatar-group">
                      <img src="https://i.pravatar.cc/30?u=1" alt="a" />
                      <img src="https://i.pravatar.cc/30?u=2" alt="b" />
                    </div>
                  </td>
                  <td><span className="stats-pill">{p.stats}</span></td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </section>

        {/* ROJO: HOT LIST HORIZONTAL */}
        <section className="glass-card hotlist-card mb-4">
          <h6 className="fw-bold mb-4"  >recent activity</h6>
          <div className="hotlist-row">
            {hotlist.map(user => (
              <div key={user.id} className="hotlist-item">
                <img src={user.img} alt={user.name} />
                <div className="item-name">{user.name}</div>
                <div className="item-role">{user.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* VERDE ABAJO: CONTADORES ADMIN */}
        {role === 'admin' && (
          <div className="admin-stats-row">
            <div className="stat-card"><span className="stat-label">Applications</span><small className="stat-period">This month</small><strong>15</strong></div>
            <div className="stat-card"><span className="stat-label">Interviews</span><small className="stat-period">This week</small><strong>20</strong></div>
            <div className="stat-card"><span className="stat-label">Hires</span><small className="stat-period">Today</small><strong>20</strong></div>
          </div>
        )}
      </main>

      {/* RECUADRO 4: CALENDARIO DERECHA */}
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