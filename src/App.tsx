// App.tsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Bell, MessageCircle, Image, SmilePlus, MapPin, Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [newPost, setNewPost] = useState('');

  const currentUser = {
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait',
    followers: 1234,
    following: 567,
    posts: 89
  };

  const stories = [
    { id: 1, username: 'user1', avatar: 'https://source.unsplash.com/random/100x100/?portrait' },
    { id: 2, username: 'user2', avatar: 'https://source.unsplash.com/random/100x100/?portrait' },
    { id: 3, username: 'user3', avatar: 'https://source.unsplash.com/random/100x100/?portrait' },
    { id: 4, username: 'user4', avatar: 'https://source.unsplash.com/random/100x100/?portrait' },
    { id: 5, username: 'user5', avatar: 'https://source.unsplash.com/random/100x100/?portrait' }
  ];

  const [posts, setPosts] = useState([
    {
      id: 1,
      name: 'Jane Smith',
      username: 'janesmith',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait',
      time: '2h',
      content: 'Just launched my new website! 🚀',
      image: 'https://source.unsplash.com/random/800x400/?technology',
      likes: 42,
      comments: 12,
      shares: 5,
      liked: false
    },
    {
      id: 2,
      name: 'Mike Johnson',
      username: 'mikej',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait',
      time: '4h',
      content: 'Beautiful sunset today! 🌅',
      image: 'https://source.unsplash.com/random/800x400/?sunset',
      likes: 156,
      comments: 24,
      shares: 8,
      liked: true
    }
  ]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prev => [{
        id: Date.now(),
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        time: 'now',
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      }, ...prev]);
      
      setNewPost('');
    } catch (error) {
      console.error('Post error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Login' : 'Sign Up'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
            />
            <Button type="submit" className="w-full">
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">SocialApp</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <Button onClick={() => setShowAuthModal(true)}>
                  Login
                </Button>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <img
                        src={currentUser.avatar}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Post */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex space-x-4">
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-grow">
                  <Textarea
                    placeholder="What's happening?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="icon">
                        <Image className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <SmilePlus className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MapPin className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button onClick={createPost}>Post</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-3">
                      <img
                        src={post.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{post.name}</span>
                          <span className="text-gray-500">@{post.username}</span>
                          <span className="text-gray-500">· {post.time}</span>
                        </div>
                        <p className="mt-2">{post.content}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="mt-4 rounded-lg w-full"
                    />
                  )}
                  
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={post.liked ? 'text-red-500' : ''}
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-5 w-5 mr-2" />
                      {post.shares}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}