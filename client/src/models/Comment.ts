interface Comment {
  id: string;
  user_avatar: string;
  user_name: string;
  created_at: number;
  body: string;
  upvotes: number;
}

export default Comment;
