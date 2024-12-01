import React, { useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

// import Button from "@mui/mater/Button";
import { Button } from "@mui/mater/Button";

import {
  List,
  ListItem,
  Avatar,
  ListItemText,
  Typography,
  TextField,
} from "@material-ui/core";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http:localhost:8080/ws");
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe("/topic/messages", (messege) => {
        const receivedMessages = JSON.parse(message.body);
        setMessage((prevMessages) => [...prevMessages, receivedMessages]);
      });
    });
    setStompClient(client);

    return () => {
      client.disconnect();
    };
  }, []);

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        nickname,
        content: message,
      };
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      sendMessage("");
    }
  };

  return (
    <div>
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            {/* <ListItemAvatar> */}
            <Avatar>{msg.nickname.charAt(0)}</Avatar>
            {/* </ListItemAvatar> */}
            <ListItemText>
              primary=
              {
                <Typography variant="subtitle1" gutterBottom>
                  {msg.nickname}
                </Typography>
              }
              secondary ={msg.content}
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Enter your nickname"
          value={nickname}
          onChange={handleNicknameChange}
          autoFocus
        />
        <TextField
          placeholder="Type a message"
          value={message}
          onChange={handleMessageChange}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disable={!message.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default App;
