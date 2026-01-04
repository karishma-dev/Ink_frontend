"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setPresence, updateUserCursor, setContent } from "@/store/editorSlice";

export function useCollaboration(draftId: number | null) {
	const socketRef = useRef<WebSocket | null>(null);
	const dispatch = useAppDispatch();

	const connect = useCallback(() => {
		if (!draftId) return;

		const token = localStorage.getItem("access_token");
		if (!token) return;

		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
		const host = process.env.NEXT_PUBLIC_WS_URL || "localhost:8000";
		const wsUrl = `${protocol}//${host}/api/collab/ws/draft/${draftId}?token=${token}`;

		const socket = new WebSocket(wsUrl);
		socketRef.current = socket;

		socket.onopen = () => {
			console.log("WebSocket connected");
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			switch (data.type) {
				case "room_state":
					dispatch(setPresence(data.users));
					if (data.content) dispatch(setContent(data.content));
					break;
				case "user_joined":
				case "user_left":
					dispatch(setPresence(data.users));
					break;
				case "cursor_update":
					dispatch(
						updateUserCursor({
							user_id: data.user_id,
							position: data.position,
						})
					);
					break;
				case "content_update":
					if (data.user_id !== "me") {
						// Backend should handle this or we track self
						dispatch(setContent(data.content));
					}
					break;
				case "pong":
					break;
			}
		};

		socket.onclose = () => {
			console.log("WebSocket disconnected");
			// Optional: Reconnect logic
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
	}, [draftId, dispatch]);

	useEffect(() => {
		connect();
		return () => {
			socketRef.current?.close();
		};
	}, [connect]);

	const sendCursor = useCallback((position: number) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(
				JSON.stringify({
					type: "cursor",
					position,
				})
			);
		}
	}, []);

	const sendContent = useCallback((content: string, cursorPosition: number) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(
				JSON.stringify({
					type: "content",
					content,
					cursor_position: cursorPosition,
				})
			);
		}
	}, []);

	return {
		sendCursor,
		sendContent,
	};
}
