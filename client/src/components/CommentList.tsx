import * as React from 'react';
import Comment from '../models/Comment';
import CommentElement from './Comment';

interface CommentListProps {
  comments: Comment[];
  parentId?: string;
}

const CommentList: React.FC<CommentListProps> = (props) => {
  return (
    <div id="comment-list">
      {props.comments.map((comment) =>
        comment.parent_comment_id === props.parentId ? (
          <CommentElement
            key={comment.id}
            comment={comment}
            childComments={props.comments.filter((v) => v.parent_comment_id === comment.id)}
          />
        ) : null
      )}
    </div>
  );
};

export default CommentList;
