'use strict';

(function () {
  const commentForm = document.getElementById('comment-form');
  const commentButton = document.getElementById('comment-button');
  const commentEntry = document.getElementById('comment-entry');

  const submit = async (value) => {
    commentEntry.value = '';
    commentButton.setAttribute('disabled', 'true');

    try {
      await fetch(`http://localhost:4321/comments`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ body: value }),
      });
    } catch (err) {
      // todo - print message to user
      console.error(err);
    }

    commentButton.setAttribute('disabled', 'false');
  };

  commentEntry.onkeydown = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      submit(evt.target.value);
    }
  };

  commentForm.onsubmit = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const value = commentEntry.value;
    await submit(value);
  };
})();
