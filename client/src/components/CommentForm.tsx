import * as React from 'react';

interface CommentFormProps {}

const CommentForm: React.FC<CommentFormProps> = (props) => {
  const [value, setValue] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>();

  const onValueChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
  }, []);

  const submitComment = React.useCallback(async () => {
    setSubmitting(true);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    try {
      const resp = await fetch(`http://localhost:4321/comments`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ body: value }),
      });
      const data = await resp.json();
    } catch (err) {
      // todo - print message to user
      console.error(err);
    }
    setSubmitting(false);
    setValue('');
  }, [value]);

  const onSubmit = React.useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      submitComment();
    },
    [value, submitComment]
  );

  const onKeyDown = React.useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();

        submitComment();
      }
    },
    [value, submitComment]
  );

  return (
    <form id="comment-form" className="comment-box" onSubmit={onSubmit}>
      <img src="https://randomuser.me/api/portraits/women/29.jpg" className="profile-photo" />
      <input
        type="text"
        placeholder="What are your thoughts?"
        id="comment-entry"
        onChange={onValueChange}
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
      <button type="submit" className="button" id="comment-button" disabled={submitting}>
        Comment
      </button>
    </form>
  );
};

export default CommentForm;
