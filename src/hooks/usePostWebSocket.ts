"use client";

import { useEffect, useRef, useState } from "react";
import { getWebSocketUrl } from "@/src/lib/api";
import type { RealtimeEvent } from "@/src/lib/types";

const supportedEvents = new Set([
  "post:created",
  "post:updated",
  "post:deleted",
  "post:published",
  "comment:created",
  "comment:updated",
  "comment:deleted",
]);

export function usePostWebSocket(
  postId: string,
  enabled: boolean,
  onEvent: (event: RealtimeEvent) => void,
): boolean {
  const onEventRef = useRef(onEvent);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const numericPostId = Number(postId);
    if (
      !enabled ||
      !Number.isSafeInteger(numericPostId) ||
      numericPostId < 1
    ) {
      setConnected(false);
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let closed = false;
    let retryDelay = 1_000;

    let connect = () => {};
    const scheduleReconnect = () => {
      if (closed || reconnectTimer) return;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = undefined;
        connect();
      }, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 30_000);
    };

    connect = () => {
      if (closed) return;
      let connection: WebSocket;
      try {
        connection = new WebSocket(getWebSocketUrl());
        socket = connection;
      } catch {
        scheduleReconnect();
        return;
      }

      connection.addEventListener("open", () => {
        if (closed) {
          connection.close();
          return;
        }
        retryDelay = 1_000;
        setConnected(true);
        connection.send(
          JSON.stringify({
            event: "post:subscribe",
            payload: { postId: numericPostId },
          }),
        );
      });

      connection.addEventListener("message", (message) => {
        if (typeof message.data !== "string") return;
        try {
          const parsed: unknown = JSON.parse(message.data);
          if (
            !parsed ||
            typeof parsed !== "object"
          ) {
            return;
          }
          const eventMessage = parsed as {
            event?: unknown;
            payload?: unknown;
          };
          if (
            typeof eventMessage.event !== "string" ||
            !supportedEvents.has(eventMessage.event) ||
            !("payload" in eventMessage)
          ) {
            return;
          }
          onEventRef.current(eventMessage as RealtimeEvent);
        } catch {
          // Ignore malformed or unrelated messages without closing the socket.
        }
      });

      connection.addEventListener("close", () => {
        if (socket === connection) socket = null;
        setConnected(false);
        scheduleReconnect();
      });

      connection.addEventListener("error", () => {
        if (connection.readyState === WebSocket.OPEN) connection.close();
      });
    };

    connect();

    return () => {
      closed = true;
      setConnected(false);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      const activeSocket = socket;
      socket = null;
      if (activeSocket?.readyState === WebSocket.OPEN) {
        activeSocket.send(
          JSON.stringify({
            event: "post:unsubscribe",
            payload: { postId: numericPostId },
          }),
        );
        activeSocket.close();
      }
    };
  }, [enabled, postId]);

  return connected;
}
