interface Comment {
  id: string;
  parent_comment_id?: string;
  user_avatar: string;
  user_name: string;
  created_at: number;
  body: string;
  upvotes: number;
}

export default Comment;
