import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import './TopHeader.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const TopHeader = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState(null);
    const wrapperRef = useRef(null);
    const { toggleWidget, isWidgetOpen, notifications, clearNotifications, setActiveChannel, client, markAsRead, setView } = useChat();

    const unreadCount = notifications.filter(n => !n.read).length;

    // Removed mock chatContacts and notifications array

    const apps = [
        { id: 1, name: "Slack", icon: "bi-slack" },
        { id: 2, name: "Jira", icon: "bi-kanban" },
        { id: 3, name: "Drive", icon: "bi-hdd-network" },
        { id: 4, name: "Zoom", icon: "bi-camera-video" },
        { id: 5, name: "Cal", icon: "bi-calendar-event" },
        { id: 6, name: "HR", icon: "bi-people" },
        { id: 7, name: "Github", icon: "bi-github" },
    ];

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setActiveTab(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const toggle = (tab) => {
        setActiveTab(activeTab === tab ? null : tab);
    };

    // Emails Mock
    const emails = [
        { id: 1, from: "HR Department", subject: "New Policy Update", time: "10:30 AM", unread: true },
        { id: 2, from: "Jira Notifications", subject: "[JIRA] Issue assigned to you", time: "Yesterday", unread: false },
        { id: 3, from: "Sarah Smith", subject: "Re: Project Sync", time: "Yesterday", unread: false },
    ];

    return (
        <header className="top-header" ref={wrapperRef}>
            <div className="header-actions">
                {/* Email */}
                <div
                    className={`header-icon-btn ${activeTab === 'email' ? 'active' : ''}`}
                    onClick={() => toggle('email')}
                    title="Email (Gmail)"
                >
                    <i className="bi bi-envelope"></i>
                </div>

                {/* Notifications */}
                <div
                    className={`header-icon-btn ${activeTab === 'notif' ? 'active' : ''}`}
                    onClick={() => toggle('notif')}
                    title="Notifications"
                >
                    <i className={`bi ${unreadCount > 0 ? 'bi-bell-fill' : 'bi-bell'}`}></i>
                    {unreadCount > 0 && <div className="notif-badge"></div>}
                </div>

                {/* Apps Grid */}
                <div
                    className={`header-icon-btn ${activeTab === 'apps' ? 'active' : ''}`}
                    onClick={() => toggle('apps')}
                    title="Apps"
                >
                    <i className="bi bi-grid-3x3-gap"></i>
                </div>

                {/* User Profile */}
                <div className="user-nav-container" onClick={() => toggle('profile')} style={{ cursor: 'pointer' }}>
                    <img
                        src={user?.id <= 3 ? `https://i.pravatar.cc/150?u=${user.id}` : (user?.avatar || "https://i.pravatar.cc/150?u=me")}
                        className="user-img-nav"
                        alt={user?.user || "user"}
                        title={user?.user || "Profile"}
                    />
                </div>
            </div>

            {/* DROPDOWNS */}



            {/* Email Dropdown (Native List) */}
            {activeTab === 'email' && (
                <div className="header-dropdown" style={{ width: '320px' }}>
                    <div className="dropdown-header">
                        <span>Inbox</span>
                        <i className="bi bi-envelope-open"></i>
                    </div>
                    <div className="dropdown-body">
                        {emails.map(email => (
                            <div key={email.id} className={`dropdown-item ${email.unread ? 'unread' : ''}`}>
                                <div className="email-icon"><i className="bi bi-person-circle"></i></div>
                                <div className="item-info">
                                    <div className="item-title">{email.from}</div>
                                    <div className="item-subtitle text-dark">{email.subject}</div>
                                </div>
                                <div className="item-meta">{email.time}</div>
                            </div>
                        ))}
                    </div>
                    <div className="dropdown-header" style={{ fontSize: '0.8rem', justifyContent: 'center', color: 'var(--primary-600)', cursor: 'pointer' }}>
                        Go to Inbox
                    </div>
                </div>
            )}

            {/* Notifications Dropdown */}
            {activeTab === 'notif' && (
                <div className="header-dropdown" style={{ width: '340px' }}>
                    <div className="dropdown-header">
                        <span>Notifications</span>
                        {notifications.length > 0 ? (
                            <span className="badge-count" onClick={clearNotifications} style={{ cursor: 'pointer', color: 'var(--primary-600)' }}>Clear all</span>
                        ) : (
                            <span className="badge-count">Empty</span>
                        )}
                    </div>
                    <div className="dropdown-body">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className={`dropdown-item ${!n.read ? 'unread-item' : ''}`} onClick={async () => {
                                    if (!client) return;
                                    markAsRead(n.id);
                                    const channel = client.channel('messaging', n.channelId);
                                    await channel.watch();
                                    setActiveChannel(channel);
                                    setView('channel');
                                    if (!isWidgetOpen) toggleWidget();
                                    setActiveTab(null);
                                }} style={{ cursor: 'pointer' }}>
                                    <div className="avatar-small">
                                        <img src={n.avatar || "https://i.pravatar.cc/30?u=anon"} alt="user" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                    </div>
                                    <div className="item-info">
                                        <div className="item-title">{n.user}</div>
                                        <div className="item-subtitle text-truncate" style={{ maxWidth: '180px' }}>{n.text}</div>
                                    </div>
                                    <div className="item-meta">{n.time}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-muted">
                                <i className="bi bi-bell-slash d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                                <span>No new messages</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Apps Dropdown */}
            {activeTab === 'apps' && (
                <div className="header-dropdown" style={{ width: '340px' }}>
                    <div className="dropdown-header">
                        <span>Related Apps</span>
                    </div>
                    <div className="apps-grid">
                        {apps.map(app => (
                            <div key={app.id} className="app-item">
                                <div className="app-icon"><i className={`bi ${app.icon}`}></i></div>
                                <div className="app-name">{app.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Profile Dropdown */}
            {activeTab === 'profile' && (
                <div className="header-dropdown profile-menu">
                    <div className="menu-item">
                        <i className="bi bi-person"></i>
                        <span>{user?.user || 'Profile'}</span>
                    </div>
                    <div className="menu-item">
                        <i className="bi bi-gear"></i>
                        <span>Settings</span>
                    </div>
                    <div className="menu-item logout" onClick={onLogout}>
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Log Out</span>
                    </div>
                </div>
            )}


        </header>
    );
};

export default TopHeader;
