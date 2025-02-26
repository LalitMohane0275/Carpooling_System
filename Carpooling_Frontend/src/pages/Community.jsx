import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmojiPicker from "emoji-picker-react";
import {
  Send,
  MessageCircle,
  ThumbsUp,
  Heart,
  Award,
  Star,
  Smile,
  Frown,
  Car,
  AlertTriangle,
  MapPin,
  Sun,
  Cloud,
  Navigation,
  UserRound,
  Trash2,
} from "lucide-react";

function Community() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Thought");
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState({});

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(decoded.userId);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/v1/community/posts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      toast.error("Oops! Couldn't load community posts. Try again later.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.warning("Please write something before posting!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/v1/community/posts",
        { content, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data.post, ...posts]);
      setContent("");
      setSelectedEmoji(null);
      toast.success("Your post is live! 🎉");
    } catch (error) {
      toast.error("Something went wrong. Couldn't share your post.");
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/v1/community/posts/react",
        { postId, reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.post : post))
      );
    } catch (error) {
      toast.error("Couldn't add your reaction. Try again!");
    }
  };

  const handleComment = async (postId) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim()) {
      toast.warning("Please write something before commenting!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/v1/community/posts/comment",
        { postId, content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.post : post))
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment posted! 💬");
    } catch (error) {
      toast.error("Failed to post your comment. Please try again.");
    }
  };

  const onCommentEmojiClick = (postId, emojiObject) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: (prev[postId] || "") + emojiObject.emoji,
    }));
    setShowCommentEmojiPicker((prev) => ({ ...prev, [postId]: false }));
  };

  const toggleCommentEmojiPicker = (postId) => {
    setShowCommentEmojiPicker((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/v1/community/posts/${deletePostId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(posts.filter((post) => post._id !== deletePostId));
      setShowDeletePostModal(false);
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const handleDeleteComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3000/api/v1/community/posts/${deletePostId}/comments/${deleteCommentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === deletePostId ? response.data.post : post
        )
      );
      setShowDeleteCommentModal(false);
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const onEmojiClick = (emojiObject) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Traffic Update":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "Ride Experience":
        return <Car className="w-5 h-5 text-blue-500" />;
      case "Weather":
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case "Route Share":
        return <Navigation className="w-5 h-5 text-green-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
    }
  };

  const reactions = [
    { emoji: "👍", type: "like", icon: <ThumbsUp className="w-4 h-4" /> },
    { emoji: "❤️", type: "love", icon: <Heart className="w-4 h-4" /> },
    { emoji: "⭐", type: "star", icon: <Star className="w-4 h-4" /> },
    { emoji: "🏆", type: "award", icon: <Award className="w-4 h-4" /> },
    { emoji: "😊", type: "smile", icon: <Smile className="w-4 h-4" /> },
    { emoji: "😢", type: "sad", icon: <Frown className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            RideBuddy Community Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your journey, connect with fellow riders, and stay updated
            with the community! 🚗 ✨
          </p>
        </div>

        {/* Post Creation Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share your thoughts, experiences, or updates with the community..."
                className="w-full p-6 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 min-h-[120px] bg-gray-50"
                maxLength="500"
                required
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute bottom-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Smile className="w-6 h-6" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-auto p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Thought">💭 General Thought</option>
                <option value="Traffic Update">🚦 Traffic Update</option>
                <option value="Ride Experience">🚗 Ride Experience</option>
                <option value="Weather">☁️ Weather Update</option>
                <option value="Route Share">🗺️ Route Share</option>
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
                <span>Share with Community</span>
              </button>
            </div>
          </form>
        </div>

        {/* Delete Post Confirmation Modal */}
        {showDeletePostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Delete Post
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeletePostModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Comment Confirmation Modal */}
        {showDeleteCommentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Delete Comment
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteCommentModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Community Feed */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-3xl shadow-lg border border-gray-100">
              <Car className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 text-xl">
                Be the first to share something amazing with the RideBuddy
                community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    {post.user && post.user.profilePicture ? (
                      <img
                        src={post.user.profilePicture}
                        alt={`${post.user.firstName} ${post.user.lastName}`}
                        className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full mr-4 flex items-center justify-center font-bold text-xl">
                        {post.user && post.user.firstName
                          ? post.user.firstName[0]
                          : "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {post.user
                          ? `${post.user.firstName} ${post.user.lastName}`
                          : "Anonymous"}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          {getCategoryIcon(post.category)}
                          <span>{post.category}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {post.user && post.user._id === currentUserId && (
                    <button
                      onClick={() => {
                        setDeletePostId(post._id);
                        setShowDeletePostModal(true);
                      }}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
                <p className="text-gray-800 text-lg mb-6 leading-relaxed">
                  {post.content}
                </p>

                {/* Reactions */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.type}
                      onClick={() => handleReaction(post._id, reaction.type)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-xl">{reaction.emoji}</span>
                      <span className="font-medium text-gray-600">
                        {post.reactions[reaction.type]?.length || 0}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Comments Section */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={commentInputs[post._id] || ""}
                        onChange={(e) =>
                          handleCommentInputChange(post._id, e.target.value)
                        }
                        placeholder="Add your thoughts to the discussion..."
                        className="w-full p-4 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCommentEmojiPicker(post._id)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Smile className="w-6 h-6" />
                      </button>
                      {showCommentEmojiPicker[post._id] && (
                        <div className="absolute bottom-full right-0 mb-2 z-50">
                          <EmojiPicker
                            onEmojiClick={(emojiObject) =>
                              onCommentEmojiClick(post._id, emojiObject)
                            }
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleComment(post._id)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Comments List */}
                  {post.comments.length > 0 ? (
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="flex items-start justify-between space-x-3"
                        >
                          <div className="flex items-start space-x-3">
                            {comment.user && comment.user.profilePicture ? (
                              <img
                                src={comment.user.profilePicture}
                                alt={`${comment.user.firstName} ${comment.user.lastName}`}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-full flex items-center justify-center font-bold">
                                {comment.user && comment.user.firstName
                                  ? comment.user.firstName[0]
                                  : "U"}
                              </div>
                            )}
                            <div className="flex-1 bg-gray-50 p-4 rounded-2xl">
                              <p className="font-semibold text-gray-900">
                                {comment.user
                                  ? `${comment.user.firstName} ${comment.user.lastName}`
                                  : "Anonymous"}
                              </p>
                              <p className="text-gray-700 mt-1">
                                {comment.content}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {comment.user &&
                            comment.user._id === currentUserId && (
                              <button
                                onClick={() => {
                                  setDeletePostId(post._id);
                                  setDeleteCommentId(comment._id);
                                  setShowDeleteCommentModal(true);
                                }}
                                className="text-red-500 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No comments yet. Start the conversation! 💭
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Community;
