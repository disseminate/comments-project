import * as React from 'react';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';
import Comment from './models/Comment';

const App: React.FC = () => {
  const [comments, setComments] = React.useState<Comment[]>([]);

  React.useEffect(() => {
    let mounted = true;

    fetch(`http://localhost:4321/comments`).then((resp) => {
      resp.json().then((data) => {
        if (mounted) {
          setComments(data.comments);
        }
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const onCommentSubmitted = React.useCallback(
    (data: Comment) => {
      const newComments = [...comments, data];
      newComments.sort((a, b) => {
        if (a.upvotes === b.upvotes) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return b.upvotes - a.upvotes;
      });

      setComments(newComments);
    },
    [comments]
  );

  const onUpvote = React.useCallback(
    (id: string) => {
      const newComments = [...comments];
      newComments[newComments.findIndex((v) => v.id === id)].upvotes++;
      newComments.sort((a, b) => {
        if (a.upvotes === b.upvotes) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return b.upvotes - a.upvotes;
      });
      setComments(newComments);
    },
    [comments]
  );

  return (
    <>
      <h1>Discussion</h1>
      <CommentForm onSubmitted={onCommentSubmitted} />
      <hr />
      <CommentList comments={comments} onUpvote={onUpvote} />
    </>
  );
};

export default App;
