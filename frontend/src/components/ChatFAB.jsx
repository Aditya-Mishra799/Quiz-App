import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatFAB.module.css';

const ChatFAB = ({ participants = [], chats = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const chatContainerRef = useRef(null);

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  const handleKickOut = (participantId) => {
    console.log('Kick out participant:', participantId);
  };

  // Auto scroll to bottom when new chats are added
  useEffect(() => {
    if (chatContainerRef.current && activeTab === 'chat') {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats, activeTab, isOpen]);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={toggleFAB} />}
      
      <div className={`${styles.fabContainer} ${isOpen ? styles.fabOpen : ''}`}>
        {isOpen && (
          <div className={styles.chatWindow}>
            <div className={styles.tabHeader}>
              <button
                className={`${styles.tab} ${activeTab === 'chat' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Chat
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'participants' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('participants')}
              >
                Participants
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'chat' && (
                <div className={styles.chatContainer} ref={chatContainerRef}>
                  {chats.map((chat) => (
                    <div key={chat.id} className={styles.chatMessage}>
                      <div className={styles.chatUser}>{chat.user}</div>
                      <div className={styles.chatText}>{chat.message}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'participants' && (
                <div className={styles.participantsContainer}>
                  <div className={styles.participantHeader}>
                    <span className={styles.nameColumn}>Name</span>
                    <span className={styles.actionColumn}>Action</span>
                  </div>
                  {participants.map((participant) => (
                    <div key={participant.id} className={styles.participantRow}>
                      <span className={styles.participantName}>{participant.name}</span>
                      <button
                        className={styles.kickoutButton}
                        onClick={() => handleKickOut(participant.id)}
                      >
                        Kick out
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button className={styles.fab} onClick={toggleFAB}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>
      </div>
    </>
  );
};

export default ChatFAB;