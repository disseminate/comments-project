import * as React from 'react';
import Comment from '../models/Comment';
import { DateTime } from 'luxon';
import CommentList from './CommentList';

interface CommentProps {
  comment: Comment;
  childComments: Comment[];
}

const CommentElement: React.FC<CommentProps> = (props) => {
  const upvote = React.useCallback(async () => {
    const resp = await fetch(`http://localhost:4321/comments/${props.comment.id}/upvote`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  }, [props.comment.id]);

  const now = DateTime.local();
  const then = DateTime.fromJSDate(new Date(props.comment.created_at));
  const diff = now.diff(then, 'minutes');
  const hourDiff = now.diff(then, 'hours');

  let timestamp = '';
  if (hourDiff.hours > 1) {
    timestamp = `a while ago`;
  } else {
    timestamp = `${Math.floor(diff.minutes)} min ago`;
  }

  return (
    <>
      <div className="comment">
        <div className="comment-image">
          <img src={props.comment.user_avatar} className="profile-photo" />
        </div>
        <div className="comment-contents">
          <div className="comment-author-line">
            <span className="comment-author">{props.comment.user_name}</span>
            &nbsp; &bull; &nbsp;
            <span className="comment-timestamp">{timestamp}</span>
          </div>
          <div className="comment-body">{props.comment.body}</div>
          <div className="comment-controls">
            <button type="button" className="comment-button" onClick={upvote}>
              ^ Upvote
            </button>
            <button type="button" className="comment-button">
              Reply
            </button>
          </div>
        </div>
      </div>

      <div className="comment-children">
        <CommentList comments={props.childComments} parentId={props.comment.id} />
      </div>
    </>
  );
};

export default CommentElement;
