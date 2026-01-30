import React, { useState } from 'react';
import './Projects.css';
import logoImg from './dashboard/assets/logo.svg';
import TopHeader from '../components/TopHeader';

const Projects = ({ user, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [savedProjects, setSavedProjects] = useState([]);

  const projectList = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechFlow Solutions",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2h ago",
      tags: ["React", "Redux", "TypeScript"],
      logo: "TS",
      category: "Engineering"
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Creative Pulse",
      location: "San Francisco, CA",
      type: "Contract",
      salary: "$90k - $110k",
      posted: "5h ago",
      tags: ["Figma", "Prototyping", "Mobile"],
      logo: "CP",
      category: "Design"
    },
    {
      id: 3,
      title: "Backend Engineer (Go)",
      company: "Streamline Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$130k - $160k",
      posted: "1d ago",
      tags: ["Go", "PostgreSQL", "AWS"],
      logo: "SI",
      category: "Engineering"
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateX",
      location: "New York, NY",
      type: "Full-time",
      salary: "$140k - $180k",
      posted: "2d ago",
      tags: ["Agile", "Strategy", "SaaS"],
      logo: "IX",
      category: "Product"
    },
    {
      id: 5,
      title: "Data Scientist",
      company: "DataMinds",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$115k - $145k",
      posted: "3d ago",
      tags: ["Python", "ML", "Pandas"],
      logo: "DM",
      category: "Engineering"
    }
  ];

  const filters = ["All", "Remote", "Full-time", "Contract", "Engineering", "Design"];

  const toggleSave = (id) => {
    setSavedProjects(prev => {
      if (prev.includes(id)) {
        return prev.filter(pId => pId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const filteredProjects = projectList.filter(project => {
    // 1. Filter by Category/Tab
    const matchesFilter = activeFilter === 'All'
      || project.type === activeFilter
      || project.location === activeFilter
      || project.category === activeFilter;

    // 2. Filter by Search Term (Title, Company, Tags)
    const lowerTerm = searchTerm.toLowerCase();
    const matchesSearch = project.title.toLowerCase().includes(lowerTerm)
      || project.company.toLowerCase().includes(lowerTerm)
      || project.tags.some(tag => tag.toLowerCase().includes(lowerTerm));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-grid">
      <aside className="sidebar-icons">
        <div className="brand-logo mb-5">
          <img src={logoImg} className="logo-small" alt="logo" />
        </div>
        <nav className="nav flex-column align-items-center gap-4">
          <div className="nav-btn" onClick={() => onNavigate('dashboard')}><i className="bi bi-grid"></i><span>Dashboard</span></div>
          <div className="nav-btn active"><i className="bi bi-briefcase"></i><span>Projects</span></div>
          <div className="nav-btn" onClick={() => onNavigate('contacts')}><i className="bi bi-person-badge"></i><span>Contacts</span></div>
          <div className="nav-btn" onClick={() => onNavigate('calendar')}><i className="bi bi-calendar3"></i><span>Calendar</span></div>
        </nav>
      </aside>

      <TopHeader user={user} onLogout={() => onNavigate('logout')} />

      <main className="main-content">
        <div className="projects-container">

          <div>
            <h4 className="fw-bold mb-4">Explore Projects</h4>

            <div className="search-filter-section">
              <div className="search-row">
                <div className="search-bar-wrapper">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for projects, stacks, or companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="filters-wrapper">
                {filters.map(filter => (
                  <button
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => {
                const isSaved = savedProjects.includes(project.id);
                return (
                  <div key={project.id} className="project-card">
                    <div>
                      <div className="project-card-header">
                        <div className="company-logo">{project.logo}</div>
                        <i
                          className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} project-save-btn ${isSaved ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(project.id);
                          }}
                        ></i>
                      </div>
                      <h5 className="project-title">{project.title}</h5>
                      <div className="project-company">
                        <i className="bi bi-building"></i> {project.company}
                      </div>
                      <div className="project-tags">
                        {project.tags.map(tag => (
                          <span key={tag} className="project-tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="project-footer">
                      <div className="posted-time">
                        <i className="bi bi-clock"></i> {project.posted}
                      </div>
                      <div className="salary-range">{project.salary}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center w-100 py-5 text-muted">
                No projects found matching your criteria.
              </div>
            )}
          </div>

        </div>
      </main>

      <aside className="calendar-panel" style={{ background: 'transparent', border: 'none' }}>
        <div className="glass-card h-100">
          <h6 className="fw-bold mb-3">Recommended</h6>
          <p className="text-muted small">Based on your profile, here are some quick matches.</p>
          <div className="d-flex flex-column gap-3 mt-4">
            {projectList.slice(0, 2).map(p => (
              <div key={p.id} className="d-flex gap-2 align-items-center">
                <div className="company-logo" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{p.logo}</div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{p.title}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{p.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Projects;
