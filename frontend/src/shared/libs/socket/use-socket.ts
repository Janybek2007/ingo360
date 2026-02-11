import { useCallback, useEffect, useRef, useState } from 'react';

import { FULL_API_SOCKET_URL } from '#/shared/constants/environment';

interface UseSocketResult<T = any | string | null> {
  connected: boolean;

  lastMessage: T;
  send: (data: string | Record<string, unknown>) => void;
  disconnect: () => void;
}

export const useSocket = <T = any | string | null>(
  endpoint: string,
  isConnect = true
): UseSocketResult<T> => {
  const wsRef = useRef<WebSocket | null>(null);
  const fullURL = FULL_API_SOCKET_URL + endpoint;

  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] =
    useState<UseSocketResult['lastMessage']>(null);

  const send = useCallback((data: string | Record<string, unknown>) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      ws.send(payload);
    } else {
      console.warn('[WS] Cannot send: WebSocket is not connected');
    }
  }, []);

  const connect = useCallback(() => {
    const ws = new WebSocket(fullURL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log('[WS] Connected');
    };

    ws.onmessage = event => {
      try {
        const parsed: UseSocketResult['lastMessage'] = JSON.parse(event.data);
        setLastMessage(parsed);
      } catch {
        setLastMessage(event.data);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.warn('[WS] Disconnected');
    };

    ws.onerror = error => {
      console.error('[WS] Error:', error);
      ws.close();
    };
  }, [fullURL]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    if (isConnect) connect();
    return () => disconnect();
  }, [connect, disconnect, isConnect]);

  return {
    connected,
    lastMessage,
    send,
    disconnect,
  };
};
