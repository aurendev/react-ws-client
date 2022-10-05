import { useEffect, useState } from "react"
import { Manager, Socket } from "socket.io-client"
import { EventsType } from "../interfaces/events"

type Status  = 'connected' | 'disconnected'

interface IMessage {
  fullname: string;
  body: string;
}

export const useConnectSocket = () => {

  
  const [status, setStatus] = useState<Status>('disconnected')

  const [clientsConnected, setClientsConnected] = useState<string[]>([])

  const [socketServer, setSocketServer] = useState<Socket>()

  const [messages, setMessages] = useState<IMessage[]>([])

  let socket : Socket

  const connectToServer = (token: string) => {
    const manager = new Manager('https://teslo-nest-auren.herokuapp.com/socket.io/socket.io.js',{
      extraHeaders: {
        authentication :token
      },
    })

    socket?.removeAllListeners()

    socket = manager.socket('/')

    setSocketServer(socket)

    console.log('[Socket]', socket)

    addListeners()
  }

  const addListeners = () => {

    socket.on('connect', ()=> {
      setStatus('connected')
    })

    socket.on('disconnect', ()=> {
      setStatus('disconnected')
    })

    socket.on(EventsType.clientsUpdated, (data)=>{
      setClientsConnected(data)
    })

    socket.on(EventsType.messageFromServer, (message : IMessage)=> {

     
      setMessages((oldMessages)=> [...oldMessages, message])
    })

  }

  return {
    status,
    clientsConnected,
    socketServer,
    messages,
    connectToServer
  }
}
