'use strict';

const createElementHelper = (tag, parent, attrs) => {
  const element = document.createElement(tag);
  if (parent) {
    parent.appendChild(element);
  }
  if (attrs) {
    for (const key in attrs) {
      element.setAttribute(key, attrs[key]);
    }
  }
  return element;
};

(function () {
  const commentForm = document.getElementById('comment-form');
  const commentButton = document.getElementById('comment-button');
  const commentEntry = document.getElementById('comment-entry');
  const commentList = document.getElementById('comment-list');

  let commentsList = [];

  const upvoteComment = async (id) => {
    const resp = await fetch(`http://localhost:4321/comments/${id}/upvote`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (resp.status === 200) {
      commentsList[commentsList.findIndex((v) => v.id === id)].upvotes++;
      renderComments();
    }
  };

  const renderComments = async () => {
    commentList.innerHTML = '';

    commentsList.sort((a, b) => {
      if (a.upvotes === b.upvotes) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return b.upvotes - a.upvotes;
    });

    for (const comment of commentsList) {
      const commentObj = createElementHelper('div', null, { class: 'comment' });

      createElementHelper('img', commentObj, { class: 'profile-photo', src: comment.user_avatar });
      const commentContents = createElementHelper('div', commentObj, { class: 'comment-contents' });

      const commentAuthorLine = createElementHelper('div', commentContents, { class: 'comment-author-line' });
      const commentAuthor = createElementHelper('span', commentAuthorLine, { class: 'comment-author' });
      commentAuthor.innerHTML = comment.user_name;
      commentAuthorLine.appendChild(document.createTextNode('\xa0•\xa0'));
      const commentTimestamp = createElementHelper('span', commentAuthorLine, { class: 'comment-timestamp' });

      const now = luxon.DateTime.local();
      const then = luxon.DateTime.fromJSDate(new Date(comment.created_at));
      const diff = now.diff(then, 'minutes');
      const hourDiff = now.diff(then, 'hours');

      if (hourDiff.hours > 1) {
        commentTimestamp.innerHTML = `a while ago`;
      } else {
        commentTimestamp.innerHTML = `${Math.floor(diff.minutes)} min ago`;
      }

      const commentBody = createElementHelper('div', commentContents, { class: 'comment-body' });
      commentBody.appendChild(document.createTextNode(comment.body));

      const commentControls = createElementHelper('div', commentContents, { class: 'comment-controls' });
      const upvoteButton = createElementHelper('button', commentControls, { type: 'button', class: 'comment-button' });
      upvoteButton.appendChild(document.createTextNode('^ Upvote'));

      upvoteButton.onclick = (evt) => {
        evt.preventDefault();
        upvoteComment(comment.id);
      };

      const replyButton = createElementHelper('button', commentControls, { type: 'button', class: 'comment-button' });
      replyButton.appendChild(document.createTextNode('Reply'));

      commentList.appendChild(commentObj);
    }
  };

  const fetchComments = async () => {
    let comments;
    try {
      const commentsResp = await fetch(`http://localhost:4321/comments`);
      comments = await commentsResp.json();
    } catch (err) {
      // todo - print message to user
      console.error(err);
    }

    if (comments) {
      commentsList = comments.comments;
      renderComments();
    }
  };

  fetchComments();

  const submit = async (value) => {
    commentEntry.value = '';
    commentButton.setAttribute('disabled', 'true');

    try {
      const resp = await fetch(`http://localhost:4321/comments`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ body: value }),
      });
      const data = await resp.json();
      commentsList.unshift(data);
      await renderComments();
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
