import * as React from 'react';
import Comment from '../models/Comment';
import CommentElement from './Comment';

interface CommentListProps {
  comments: Comment[];
  onUpvote: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = (props) => {
  return (
    <div id="comment-list">
      {props.comments.map((comment) => (
        <CommentElement key={comment.id} comment={comment} onUpvote={() => props.onUpvote(comment.id)} />
      ))}
    </div>
  );
};

export default CommentList;
