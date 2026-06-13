import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ImageIcon, Video, FileText, Send, ThumbsUp, Eye, Clock, Building2, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Post {
  id: number;
  content: string;
  image?: string;
  video?: string;
  createdAt: string;
  likes: number;
  author: {
    id: number;
    name: string;
    role: string;
    company?: string;
  };
  comments: any[];
}

const CommunityFeed: React.FC = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState<{ [postId: number]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [postId: number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.data, ...posts]);
        setNewPost('');
        toast.success('Post created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: data.data.likes } : p));
      }
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId: number) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: [...p.comments, data.data] };
          }
          return p;
        }));
        setNewComment(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading feed...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Share something with your network..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] border-0 bg-gray-50 focus:bg-white transition-colors resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <ImageIcon className="w-4 h-4 mr-2" /> Photo
                  </Button>
                </div>
                <Button 
                  onClick={handleCreatePost} 
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Send className="w-4 h-4 mr-2" /> Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
          <p className="text-muted-foreground">Be the first to start a discussion in the community!</p>
        </div>
      )}

      {/* Posts Feed */}
      {posts.map((post) => (
        <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {post.author.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{post.author.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="capitalize text-xs">{post.author.role}</Badge>
                    {post.author.company && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {post.author.company}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-4">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> {post.likes}
                </span>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <MessageCircle className="w-3 h-3" /> {post.comments.length}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost" size="sm"
                  onClick={() => handleLike(post.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Heart className="w-4 h-4 mr-2" /> Like
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => toggleComments(post.id)}
                  className="text-muted-foreground hover:text-blue-500"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Comment
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            {showComments[post.id] && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xs">
                      {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <Button size="sm" onClick={() => handleAddComment(post.id)} disabled={!newComment[post.id]?.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {post.comments.map((comment: any) => (
                  <div key={comment.id} className="flex items-start gap-3 ml-4">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-xs">
                        {comment.author.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.author.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">{comment.author.role}</Badge>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommunityFeed;