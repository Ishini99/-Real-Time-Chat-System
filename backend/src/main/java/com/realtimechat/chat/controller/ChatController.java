package com.realtimechat.chat.controller;

import com.realtimechat.chat.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
public class ChatController {
    @MessageMapping("/chat")
    @SendTo("/topic/message")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage){
        chatMessage.setTimestamp(new Date());
        return chatMessage;
    }
}
