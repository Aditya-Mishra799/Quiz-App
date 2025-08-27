import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatFAB.module.css";
import commentIcon from "../assets/Comment.svg";
import socket from "../socket";

const ChatFAB = ({}) => {
  const [participants, setParticipants] = useState([]);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const storedChats = sessionStorage.getItem("chats");
    if (storedChats) {
      setChats(JSON.parse(storedChats) || []);
    }
    socket.on("chat-message-success", (newChat) => {
      setLoading(false);
      setChats((prev) => [...prev, newChat]);
    });
    socket.on("chat-message-error", ({ message }) => {
      setLoading(false);
      alert(message);
    });
    socket.on("new-chat", (newChat) => {
      setChats((prev) => [...prev, newChat]);
    });
  }, []);

  useEffect(() => {
    if (chats.length == 0) return;
    sessionStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);
  const sendMessage = () => {
    setLoading(true);
    const student = sessionStorage.getItem("student");
    if (student) {
      const uuid = JSON.parse(student)?.uuid;
      socket.emit("chat-message", { message, uuid });
    }
  };
  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  const handleKickOut = (participantId) => {
    console.log("Kick out participant:", participantId);
  };

  useEffect(() => {
    if (chatContainerRef.current && activeTab === "chat") {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats, activeTab, isOpen]);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={toggleFAB} />}

      <div className={`${styles.fabContainer} ${isOpen ? styles.fabOpen : ""}`}>
        {isOpen && (
          <div className={styles.chatWindow}>
            <div className={styles.tabHeader}>
              <button
                className={`${styles.tab} ${
                  activeTab === "chat" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("chat")}
              >
                Chat
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "participants" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("participants")}
              >
                Participants
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === "chat" && (
                <div className={styles.container}>
                  <div className={styles.chatContainer} ref={chatContainerRef}>
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`${styles.chatMessage} ${
                          chat?.self ? styles.self : ""
                        }`}
                      >
                        <div className={styles.chatUser}>{chat.user}</div>
                        <div className={styles.chatText}>{chat.message}</div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.input}>
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>{">"}</button>
                  </div>
                </div>
              )}

              {activeTab === "participants" && (
                <div className={styles.participantsContainer}>
                  <div className={styles.participantHeader}>
                    <span className={styles.nameColumn}>Name</span>
                    <span className={styles.actionColumn}>Action</span>
                  </div>
                  {participants.map((participant) => (
                    <div key={participant.id} className={styles.participantRow}>
                      <span className={styles.participantName}>
                        {participant.name}
                      </span>
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
          <img src={commentIcon} alt="comment" />
        </button>
      </div>
    </>
  );
};

export default ChatFAB;
