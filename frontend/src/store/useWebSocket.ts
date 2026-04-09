import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useStore } from './useStore';

export const useWebSocket = () => {
  const setHepaticState = useStore((state) => state.setHepaticState);

  useEffect(() => {
    const socket = new SockJS('http://127.0.0.1:8080/ws/hepatic-stream');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str);
      },
      onConnect: () => {
        client.subscribe('/topic/liver-status', (message) => {
          if (message.body) {
            const data = JSON.parse(message.body);
            setHepaticState({
              steatosis: data.steatosis ?? 0,
              inflammation: data.inflammation ?? 0,
              fibrosis: data.fibrosis ?? 0,
              fib4Score: data.fib4Score ?? 0,
              qtcInterval: data.qtcInterval ?? 420,
            });
          }
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [setHepaticState]);
};