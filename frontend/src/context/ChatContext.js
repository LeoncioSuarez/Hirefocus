import React, { createContext, useContext, useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children, authUser }) => {
    const [client, setClient] = useState(null);
    const [isWidgetOpen, setIsWidgetOpen] = useState(false);
    const [activeChannel, setActiveChannel] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [view, setView] = useState('list'); // 'list' or 'channel'
    const [isExpanded, setIsExpanded] = useState(false);
    const [pinnedChannels, setPinnedChannels] = useState(() => {
        const saved = localStorage.getItem('hirefocus_pinned_chats');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const initChat = async () => {
            const userId = authUser?.id || authUser?.user;
            if (!userId) {
                console.log("ChatContext: No userId available yet", authUser);
                return;
            }

            console.log("ChatContext: Initializing chat for user", userId);

            try {
                // Fetch token from backend
                const response = await fetch(`http://localhost:8000/integrations/stream/token?user_id=${userId}&name=${authUser.user}`, {
                    method: 'POST'
                });

                if (!response.ok) {
                    throw new Error(`Token fetch failed: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("ChatContext: Received token data", data);

                const chatClient = StreamChat.getInstance(data.api_key, {
                    timeout: 10000,
                });

                const handleEvent = (event) => {
                    if (event.type === 'message.new' && event.user.id !== String(userId)) {
                        console.log("ChatContext: New message notification", event.message);
                        setNotifications(prev => {
                            const newNotif = {
                                id: event.message.id,
                                user: event.user.name || event.user.id,
                                text: event.message.text,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                channelId: event.channel_id,
                                avatar: event.user.image,
                                read: false
                            };
                            // Keep last 5, avoid duplicates
                            if (prev.find(n => n.id === newNotif.id)) return prev;
                            return [newNotif, ...prev].slice(0, 5);
                        });
                    }
                };

                await chatClient.connectUser(
                    {
                        id: String(data.user_id),
                        name: data.user_name,
                        image: `https://i.pravatar.cc/150?u=${data.user_id}`,
                    },
                    data.token
                );

                chatClient.on(handleEvent);

                console.log("ChatContext: Stream Chat connected successfully");
                setClient(chatClient);
            } catch (error) {
                console.error("ChatContext: Failed to connect Stream Chat", error);
            }
        };

        if (authUser && !client) {
            initChat();
        }

        return () => {
            if (client) {
                client.off();
                client.disconnectUser();
            }
        }
    }, [authUser, client]);

    const toggleWidget = () => setIsWidgetOpen(!isWidgetOpen);
    const clearNotifications = () => setNotifications([]);
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const togglePin = (channelId) => {
        setPinnedChannels(prev => {
            const isPinned = prev.includes(channelId);
            const newList = isPinned ? prev.filter(id => id !== channelId) : [...prev, channelId];
            localStorage.setItem('hirefocus_pinned_chats', JSON.stringify(newList));
            return newList;
        });
    };

    const clearChat = async (channel) => {
        if (!channel) return;
        try {
            // Use hide with clear_history: true as truncate requires admin permissions
            await channel.hide({ clear_history: true });
            setActiveChannel(null);
            setView('list');
            console.log("ChatContext: Channel cleared and hidden successfully");
        } catch (error) {
            console.error("ChatContext: Error clearing channel", error);
            throw error;
        }
    };

    const startChatWithUser = async (targetUserId) => {
        if (!client) return;

        try {
            console.log(`ChatContext: Starting chat with ${targetUserId}`);
            const channel = client.channel('messaging', {
                members: [client.userID, String(targetUserId)],
            });

            await channel.watch();
            setActiveChannel(channel);
            if (!isWidgetOpen) setIsWidgetOpen(true);
            return true;
        } catch (error) {
            console.error("ChatContext: Error watching channel", error);
            // We return false or rethrow to let the UI know
            throw error;
        }
    };

    return (
        <ChatContext.Provider value={{
            client,
            isWidgetOpen,
            toggleWidget,
            activeChannel,
            setActiveChannel,
            startChatWithUser,
            notifications,
            clearNotifications,
            markAsRead,
            view,
            setView,
            pinnedChannels,
            togglePin,
            clearChat,
            isExpanded,
            setIsExpanded
        }}>
            {children}
        </ChatContext.Provider>
    );
};
