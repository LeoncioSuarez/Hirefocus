import React, { useState } from 'react';
import './CalendarPage.css';
import logoImg from './dashboard/assets/logo.svg';
import TopHeader from '../components/TopHeader';

const CalendarPage = ({ user, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, date: '2026-01-20', title: 'Interview with TechCorp', type: 'interview' },
    { id: 2, date: '2026-01-22', title: 'Update Resume', type: 'task' },
    { id: 3, date: '2026-01-25', title: 'Coffee Chat', type: 'meeting' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('interview');

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // 0=Sun, 1=Mon...6=Sat.
    // To make Monday first: 1->0, 2->1 ... 0->6.
    const startDayOffset = (firstDay === 0 ? 6 : firstDay - 1);

    const days = [];
    const headers = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Headers
    headers.forEach(h => days.push(
      <div key={`header-${h}`} className="calendar-day-header">{h}</div>
    ));

    // Empty cells before first day
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day-cell other-month"></div>);
    }

    // Days
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = isCurrentMonth && today.getDate() === d;
      const dayEvents = events.filter(e => e.date === dateStr);

      days.push(
        <div
          key={dateStr}
          className={`calendar-day-cell ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(dateStr)}
        >
          <div className="day-number">
            {isToday ? <span>{d}</span> : d}
          </div>
          {dayEvents.map(ev => (
            <div key={ev.id} className={`calendar-event event-${ev.type}`}>
              {ev.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setNewEventTitle('');
    setShowModal(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const newEvent = {
      id: Date.now(),
      date: selectedDate,
      title: newEventTitle,
      type: newEventType
    };

    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
          <div className="nav-btn active"><i className="bi bi-calendar3"></i><span>Calendar</span></div>
        </nav>
      </aside>

      <TopHeader user={user} onLogout={() => onNavigate('logout')} />

      <main className="main-content">
        <div className="calendar-page-container">
          <div className="calendar-header-controls">
            <h4 className="fw-bold m-0">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
            <div className="d-flex gap-2">
              <button className="calendar-nav-btn" onClick={prevMonth}><i className="bi bi-chevron-left"></i></button>
              <button className="calendar-nav-btn" onClick={goToToday}>Today</button>
              <button className="calendar-nav-btn" onClick={nextMonth}><i className="bi bi-chevron-right"></i></button>
            </div>
          </div>

          <div className="calendar-grid">
            {renderCalendarGrid()}
          </div>
        </div>
      </main>

      <aside className="calendar-panel" style={{ overflowY: 'auto' }}>
        <h5 className="fw-bold mb-4">Upcoming</h5>
        <div className="d-flex flex-column gap-3">
          {events
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .filter(e => new Date(e.date) >= new Date())
            .map(ev => (
              <div key={ev.id} className={`glass-card p-3 border-start border-4 ${ev.type === 'interview' ? 'border-primary' : ev.type === 'task' ? 'border-success' : 'border-warning'}`}>
                <small className="text-muted d-block mb-1">{ev.date}</small>
                <div className="fw-bold">{ev.title}</div>
                <span className="badge bg-light text-dark mt-2 text-capitalize">{ev.type}</span>
              </div>
            ))}
        </div>
      </aside>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add Event</div>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSaveEvent}>
              <div className="form-group">
                <label>Date</label>
                <input type="text" className="form-input" value={selectedDate} disabled />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Interview with HR"
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="form-select" value={newEventType} onChange={e => setNewEventType(e.target.value)}>
                  <option value="interview">Interview</option>
                  <option value="task">Task</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarPage;
