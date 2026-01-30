import React, { useState, useEffect } from 'react';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, ChannelList } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import './ChatWidget.css';
import { useChat } from '../context/ChatContext';

const CustomPreview = (props) => {
    const { channel, setActiveChannel, setView, client } = props;
    const { pinnedChannels, togglePin } = useChat();
    const isPinned = pinnedChannels.includes(channel.id);

    const handleSelect = () => {
        setActiveChannel(channel);
        setView('channel');
    };

    const handleArchive = async (e) => {
        e.stopPropagation();
        if (channel.data.hidden) {
            await channel.show();
        } else {
            await channel.hide();
        }
    };

    const handlePin = async (e) => {
        e.stopPropagation();
        togglePin(channel.id);
    };

    // Find the other member to display their name/avatar in 1:1 chats
    const otherMember = Object.values(channel.state.members).find(m => m.user.id !== client.userID)?.user;
    const name = channel.data.name || otherMember?.name || otherMember?.id || "Chat";
    const image = channel.data.image || otherMember?.image || `https://i.pravatar.cc/150?u=${otherMember?.id || channel.id}`;

    return (
        <div className={`custom-preview-item ${isPinned ? 'pinned' : ''}`} onClick={handleSelect}>
            <div className="preview-avatar">
                <img src={image} alt="avatar" />
            </div>
            <div className="preview-info">
                <div className="preview-name">
                    {name}
                    {isPinned && <i className="bi bi-pin-angle-fill ms-1 text-primary"></i>}
                </div>
                <div className="preview-last-msg truncate">
                    {channel.state.messages[channel.state.messages.length - 1]?.text || "No messages yet"}
                </div>
            </div>
            <div className="preview-actions">
                <button className={`btn-icon ${isPinned ? 'active' : ''}`} onClick={handlePin} title={isPinned ? "Unpin" : "Pin"}>
                    <i className={`bi ${isPinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'}`}></i>
                </button>
                <button className={`btn-icon ${channel.data.hidden ? 'text-primary' : ''}`} onClick={handleArchive} title={channel.data.hidden ? "Unarchive" : "Archive"}>
                    <i className={`bi ${channel.data.hidden ? 'bi-arrow-up-circle' : 'bi-archive'}`}></i>
                </button>
            </div>
        </div>
    );
};

const ChatWidget = () => {
    const {
        client, isWidgetOpen, toggleWidget, activeChannel, setActiveChannel,
        startChatWithUser, view, setView, clearChat, isExpanded, setIsExpanded
    } = useChat();
    const [newChatId, setNewChatId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [listType, setListType] = useState('active'); // 'active' or 'archived'

    useEffect(() => {
        if (client) {
            console.log("ChatWidget: Stream client connected as:", client.userID);
        }
    }, [client]);

    if (!client) return null;

    const filters = listType === 'active'
        ? { type: 'messaging', members: { $in: [client.userID] } }
        : { type: 'messaging', members: { $in: [client.userID] }, hidden: true };

    const sort = { last_message_at: -1 };
    const options = { state: true, watch: true, presence: true };

    const otherMember = activeChannel ? Object.values(activeChannel.state.members).find(m => m.user.id !== client.userID) : null;
    const otherUser = otherMember?.user;

    const handleBackToList = () => {
        setActiveChannel(null);
        setView('list');
    };

    const handleStartNew = async (e) => {
        e.preventDefault();
        if (newChatId && !isLoading) {
            setIsLoading(true);
            try {
                await startChatWithUser(newChatId);
                setView('channel');
                setNewChatId('');
            } catch (err) {
                alert("Error: No se pudo conectar con el usuario. Verifica que el ID sea correcto.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`chat-widget-container ${isWidgetOpen ? 'open' : 'minimized'} ${isExpanded ? 'expanded' : ''}`}>
            <div className="chat-widget-header" onClick={toggleWidget}>
                <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-chat-dots-fill"></i>
                    <span>Messaging</span>
                </div>
                <div className="header-actions">
                    {isWidgetOpen && (
                        <i
                            className={`bi ${isExpanded ? 'bi-fullscreen-exit' : 'bi-fullscreen'} action-icon`}
                            onClick={toggleExpand}
                            title={isExpanded ? "Restore" : "Expand"}
                        ></i>
                    )}
                    <i className={`bi ${isWidgetOpen ? 'bi-dash-lg' : 'bi-chevron-up'} action-icon`}></i>
                </div>
            </div>

            {isWidgetOpen && (
                <div className="chat-widget-body">
                    <Chat client={client} theme="messaging light">
                        {view === 'list' && (
                            <div className="channel-list-view">
                                <div className="search-bar-container">
                                    <form onSubmit={handleStartNew} className="search-form">
                                        <i className="bi bi-person-plus search-icon"></i>
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Enter User ID to start chat..."
                                            value={newChatId}
                                            onChange={e => setNewChatId(e.target.value)}
                                        />
                                        <button className="search-btn" type="submit" disabled={isLoading}>
                                            {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Start'}
                                        </button>
                                    </form>
                                </div>

                                <div className="list-tabs">
                                    <button
                                        className={`list-tab ${listType === 'active' ? 'active' : ''}`}
                                        onClick={() => setListType('active')}
                                    >
                                        Active
                                    </button>
                                    <button
                                        className={`list-tab ${listType === 'archived' ? 'active' : ''}`}
                                        onClick={() => setListType('archived')}
                                    >
                                        Archived
                                    </button>
                                </div>

                                <div className="channel-list-scroller">
                                    <ChannelList
                                        filters={filters}
                                        sort={sort}
                                        options={options}
                                        Preview={(props) => (
                                            <CustomPreview
                                                {...props}
                                                setActiveChannel={setActiveChannel}
                                                setView={setView}
                                                client={client}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {view === 'channel' && activeChannel && (
                            <Channel channel={activeChannel}>
                                <Window>
                                    <div className="channel-header-resigned">
                                        <div className="header-left">
                                            <button className="back-btn" onClick={handleBackToList}>
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                            <div className="header-user-info d-flex align-items-center gap-2">
                                                {otherUser?.image && (
                                                    <img src={otherUser.image} alt={otherUser.name || 'Avatar'} className="header-avatar" />
                                                )}
                                                <span className="header-user-name">
                                                    {activeChannel.data.name || otherUser?.name || otherUser?.id || "Chat"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="header-right">
                                            <button
                                                className="clear-btn"
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to clear this chat history? This will also hide the chat.")) {
                                                        clearChat(activeChannel);
                                                    }
                                                }}
                                                title="Clear and Hide Chat"
                                            >
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <MessageList />
                                    <MessageInput focus />
                                </Window>
                                <Thread />
                            </Channel>
                        )}
                    </Chat>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
