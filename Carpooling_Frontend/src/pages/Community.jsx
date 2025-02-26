import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmojiPicker from "emoji-picker-react";
import {
  Send,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Car,
  Smile,
  Trash2,
  UserRound,
  AlertTriangle,
  Cloud,
  Navigation,
} from "lucide-react";

function Community() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Thought");
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState({});
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

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
        "https://carpoolingsystem-production.up.railway.app/api/v1/community/posts",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      toast.error("Couldn't load posts. Try again later.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.warning("Please write something!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://carpoolingsystem-production.up.railway.app/api/v1/community/posts",
        { content, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data.post, ...posts]);
      setContent("");
      toast.success("Post shared!");
    } catch (error) {
      toast.error("Failed to share post.");
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://carpoolingsystem-production.up.railway.app/api/v1/community/posts/react",
        { postId, reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.post : post))
      );
    } catch (error) {
      toast.error("Couldn't add reaction.");
    }
  };

  const handleComment = async (postId) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim()) {
      toast.warning("Please write a comment!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://carpoolingsystem-production.up.railway.app/api/v1/community/posts/comment",
        { postId, content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.post : post))
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  const onEmojiClick = (emojiObject) => {
    setContent((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
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
        `https://carpoolingsystem-production.up.railway.app/api/v1/community/posts/${deletePostId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.filter((post) => post._id !== deletePostId));
      setShowDeletePostModal(false);
      toast.success("Post deleted!");
    } catch (error) {
      toast.error("Failed to delete post.");
    }
  };

  const handleDeleteComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://carpoolingsystem-production.up.railway.app/api/v1/community/posts/${deletePostId}/comments/${deleteCommentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === deletePostId ? response.data.post : post
        )
      );
      setShowDeleteCommentModal(false);
      toast.success("Comment deleted!");
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Traffic Update":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
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
    { emoji: "👍", type: "like", icon: <ThumbsUp className="w-5 h-5" /> },
    { emoji: "👎", type: "dislike", icon: <ThumbsDown className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RideBuddy Community
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Connect, share, and ride together with the community!
          </p>
        </div>

        {/* Post Creation Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-200 transition-shadow hover:shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share your ride story..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 min-h-[120px] text-sm sm:text-base shadow-inner resize-none"
                maxLength="500"
                required
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute bottom-3 right-3 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Smile className="w-6 h-6" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-14 right-0 z-50 shadow-lg">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base shadow-sm"
              >
                <option value="Thought">💭 Thought</option>
                <option value="Traffic Update">🚦 Traffic</option>
                <option value="Ride Experience">🚗 Ride</option>
                <option value="Weather">☁️ Weather</option>
                <option value="Route Share">🗺️ Route</option>
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Send className="w-5 h-5" />
                <span>Post</span>
              </button>
            </div>
          </form>
        </div>

        {/* Delete Post Modal */}
        {showDeletePostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Delete Post?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure? This action is permanent.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeletePostModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors font-medium text-sm shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Comment Modal */}
        {showDeleteCommentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Delete Comment?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure? This action is permanent.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteCommentModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors font-medium text-sm shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Community Feed */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <Car className="w-14 h-14 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 text-base sm:text-lg font-medium">
                Start the conversation in the RideBuddy community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {post.user && post.user.profilePicture ? (
                      <img
                        src={post.user.profilePicture}
                        alt={`${post.user.firstName} ${post.user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                      />
                    ) : (
                      <UserRound className="w-12 h-12 text-gray-600 bg-gray-100 rounded-full p-3 border border-gray-200" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        {post.user
                          ? `${post.user.firstName} ${post.user.lastName}`
                          : "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(post.category)}
                          <span className="font-medium">{post.category}</span>
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
                <p className="text-gray-800 text-base sm:text-lg mb-6 leading-relaxed">
                  {post.content}
                </p>

                {/* Reactions */}
                <div className="flex items-center gap-4 mb-6">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.type}
                      onClick={() => handleReaction(post._id, reaction.type)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shadow-sm text-sm sm:text-base"
                    >
                      {reaction.icon}
                      <span className="font-medium">
                        {post.reactions[reaction.type]?.length || 0}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Comments Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={commentInputs[post._id] || ""}
                        onChange={(e) =>
                          handleCommentInputChange(post._id, e.target.value)
                        }
                        placeholder="Add a comment..."
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCommentEmojiPicker(post._id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Smile className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      {showCommentEmojiPicker[post._id] && (
                        <div className="absolute bottom-12 right-0 z-50 shadow-lg">
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
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {post.comments.length > 0 ? (
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="flex items-start gap-3"
                        >
                          {comment.user && comment.user.profilePicture ? (
                            <img
                              src={comment.user.profilePicture}
                              alt={`${comment.user.firstName} ${comment.user.lastName}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                            />
                          ) : (
                            <UserRound className="w-10 h-10 text-gray-600 bg-gray-100 rounded-full p-2 border border-gray-200" />
                          )}
                          <div className="flex-1 bg-gray-100 p-3 sm:p-4 rounded-xl shadow-sm">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                              {comment.user
                                ? `${comment.user.firstName} ${comment.user.lastName}`
                                : "Anonymous"}
                            </p>
                            <p className="text-gray-700 text-sm sm:text-base mt-1 leading-relaxed">
                              {comment.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
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
                    <p className="text-center text-gray-600 text-sm sm:text-base py-4 font-medium">
                      No comments yet—start the conversation!
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
