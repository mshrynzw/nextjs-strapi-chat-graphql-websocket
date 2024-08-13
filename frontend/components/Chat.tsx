// components/Chat.tsx
import { useEffect, useState } from "react"
import { useMutation, useSubscription } from "@apollo/client"
import gql from "graphql-tag"

const CREATE_CHAT = gql`
  mutation CreateChat($userId: String!, $text: String!) {
    createChat(input: { data: { userId: $userId, text: $text } }) {
      chat {
        id
        attributes {
          userId
          text
        }
      }
    }
  }
`

const CHAT_SUBSCRIPTION = gql`
  subscription {
    chat {
      id
      userId
      text
    }
  }
`

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [userId] = useState("user1") // ユーザーIDを設定

  const [createChat] = useMutation(CREATE_CHAT)

  useSubscription(CHAT_SUBSCRIPTION, {
    onSubscriptionData : ({ subscriptionData }) => {
      const newMessage = subscriptionData.data.chat
      setMessages((prevMessages) => [...prevMessages, newMessage])
    }
  })

  const handleSend = async () => {
    if (text.trim() === "") return

    await createChat({ variables : { userId, text } })
    setText("")
  }

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.userId}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

export default Chat