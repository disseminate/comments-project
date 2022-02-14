import * as React from 'react';
import Comment from '../models/Comment';

interface SocketMessage {
  type: 'upvote' | 'comment';
  data: any;
}

export const useSocket = (onUpvote: (commentId: string) => void, onCommentSubmitted: (comment: Comment) => void) => {
  const [socket, setSocket] = React.useState<WebSocket>(null);

  React.useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const payload: SocketMessage = JSON.parse(event.data);

        if (payload.type === 'upvote') {
          onUpvote(payload.data.id);
        } else if (payload.type === 'comment') {
          onCommentSubmitted(payload.data);
        }
      };
    }
  }, [onUpvote, socket]);

  React.useEffect(() => {
    const sock = new WebSocket(process.env.SOCKET_BASE);
    setSocket(sock);

    return () => {
      sock.close();
      setSocket(null);
    };
  }, []);
};
