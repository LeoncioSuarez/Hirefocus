import React, { useState } from 'react';
import './Contacts.css';
import logoImg from './dashboard/assets/logo.svg';
import { contactsData } from '../data/mockData';

import TopHeader from '../components/TopHeader';
import { useChat } from '../context/ChatContext';

const Contacts = ({ user, onNavigate }) => {
  const { startChatWithUser } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contactsData.filter(c => c.id <= 3));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactId, setNewContactId] = useState('');
  const [previewContact, setPreviewContact] = useState(null);

  const realUsers = {
    1: { name: "admin", role: "Main Administrator", company: "Hirefocus", avatar: "https://i.pravatar.cc/150?u=1" },
    2: { name: "admin1", role: "Admin Assistant", company: "Hirefocus", avatar: "https://i.pravatar.cc/150?u=2" },
    3: { name: "admin2", role: "Recruiter Admin", company: "Hirefocus", avatar: "https://i.pravatar.cc/150?u=3" }
  };

  const displayedContacts = filteredContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIdChange = (e) => {
    const id = parseInt(e.target.value);
    setNewContactId(e.target.value);

    if (realUsers[id]) {
      setPreviewContact({
        id: id,
        ...realUsers[id],
        status: "Online"
      });
    } else if (id && !isNaN(id)) {
      setPreviewContact({
        id: id,
        name: `User ${id}`,
        role: "Guest",
        company: "Unknown",
        avatar: `https://i.pravatar.cc/150?u=${id}`,
        status: "Offline"
      });
    } else {
      setPreviewContact(null);
    }
  };

  const handleAddContact = () => {
    if (previewContact && !filteredContacts.find(c => c.id === previewContact.id)) {
      setFilteredContacts([...filteredContacts, previewContact]);
      setShowAddModal(false);
      setNewContactId('');
      setPreviewContact(null);
    } else {
      alert("Este contacto ya está en tu lista o el ID es inválido.");
    }
  };

  const handleDeleteContact = (id) => {
    setFilteredContacts(filteredContacts.filter(c => c.id !== id));
  };

  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s === 'online' || s === 'active') return 'status-online';
    if (s === 'busy') return 'status-busy';
    return 'status-offline';
  };

  return (
    <div className="dashboard-grid contacts-layout">
      <aside className="sidebar-icons">
        <div className="brand-logo mb-5">
          <img src={logoImg} className="logo-small" alt="logo" />
        </div>
        <nav className="nav flex-column align-items-center gap-4">
          <div className="nav-btn" onClick={() => onNavigate('dashboard')}><i className="bi bi-grid"></i><span>Dashboard</span></div>
          <div className="nav-btn" onClick={() => onNavigate('projects')}><i className="bi bi-briefcase"></i><span>Projects</span></div>
          <div className="nav-btn active"><i className="bi bi-person-badge"></i><span>Contacts</span></div>
          <div className="nav-btn" onClick={() => onNavigate('calendar')}><i className="bi bi-calendar3"></i><span>Calendar</span></div>
        </nav>
      </aside>

      <TopHeader user={user} onLogout={() => onNavigate('logout')} />

      <main className="main-content">
        <div className="contacts-container">
          <div className="contacts-header">
            <h4 className="fw-bold m-0">Contacts ({displayedContacts.length})</h4>
            <div className="contacts-controls">
              <div className="contacts-search">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="contacts-grid">
            <div className="add-contact-card" onClick={() => setShowAddModal(true)}>
              <div className="add-contact-icon">+</div>
              <div className="add-contact-text">Add Contact</div>
            </div>

            {displayedContacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <button className="delete-contact-btn" onClick={() => handleDeleteContact(contact.id)} title="Delete Contact">
                  <i className="bi bi-trash"></i>
                </button>
                <div className={`contact-status ${getStatusClass(contact.status)}`}></div>
                <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                <div className="contact-name">{contact.name}</div>
                <div className="contact-role">{contact.role} at {contact.company}</div>

                <div className="contact-actions">
                  <button className="action-btn" onClick={() => startChatWithUser(contact.id)}>
                    <i className="bi bi-chat-dots"></i>
                  </button>
                  <button className="action-btn"><i className="bi bi-envelope"></i></button>
                  <button className="action-btn primary">Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {
        showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Add New Contact</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter user ID..."
                    value={newContactId}
                    onChange={handleIdChange}
                  />
                </div>

                {previewContact && (
                  <div className="preview-card">
                    <img src={previewContact.avatar} alt="Preview" className="preview-avatar" />
                    <div className="preview-info">
                      <h5>{previewContact.name}</h5>
                      <p>{previewContact.role} at {previewContact.company}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn-add" disabled={!previewContact} onClick={handleAddContact}>Add Contact</button>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default Contacts;
