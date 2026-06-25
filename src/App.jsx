import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';

const starterPosts = [
  {
    id: 1,
    title: 'Building a calm design system',
    category: 'Design',
    author: 'Navodita',
    authorUsername: 'navodita',
    date: '2026-06-20',
    content: 'Design systems help teams ship consistent interfaces faster. Start small with color, spacing, and typography tokens.',
    published: true,
  },
  {
    id: 2,
    title: 'Why content planning matters',
    category: 'Writing',
    author: 'Navodita',
    authorUsername: 'navodita',
    date: '2026-06-22',
    content: 'A clear editorial calendar keeps your articles focused and improves publishing consistency.',
    published: false,
  },
];

const starterUsers = [{ id: 1, username: 'admin', password: 'admin123', name: 'Admin' }];

const emptyForm = {
  title: '',
  category: 'Design',
  date: new Date().toISOString().slice(0, 10),
  content: '',
  published: true,
};

function Home({ posts }) {
  const publishedPosts = posts.filter((post) => post.published);

  return (
    <div className="container">
      <section className="hero">
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.2rem', color: '#4f46e5', fontWeight: 600 }}>Studio Blog</p>
          <h1>Publish thoughtful stories with a polished editorial workflow.</h1>
          <p>Every author can share posts with the community, and every published article appears in the public feed for everyone to discover.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#/admin">Open admin dashboard</a>
            <a className="btn btn-secondary" href="#/new">Create article</a>
          </div>
        </div>
        <div className="card">
          <h3>What you can do</h3>
          <ul>
            <li>Sign up and log in securely</li>
            <li>Create and edit your own articles</li>
            <li>View the shared public feed from every author</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <h2>Community articles</h2>
        <div className="grid posts-grid">
          {publishedPosts.map((post) => (
            <article key={post.id} className="article-card">
              <p className="meta">{post.category} • {post.date}</p>
              <h3>{post.title}</h3>
              <p className="meta">By {post.author}</p>
              <p className="article-content">{post.content.slice(0, 120)}...</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Admin({ posts, currentUser, onDelete, onEdit, onTogglePublish }) {
  const totalPosts = posts.length;
  const publishedCount = posts.filter((post) => post.published).length;
  const draftCount = totalPosts - publishedCount;

  return (
    <div className="container">
      <section className="card">
        <h2>Admin dashboard</h2>
        <p className="meta">Welcome back, {currentUser.name}. Your shared posts and drafts are all managed here.</p>
        <div className="grid dashboard-grid">
          <div className="dashboard-card">
            <h3>{totalPosts}</h3>
            <p>Total articles</p>
          </div>
          <div className="dashboard-card">
            <h3>{publishedCount}</h3>
            <p>Published</p>
          </div>
          <div className="dashboard-card">
            <h3>{draftCount}</h3>
            <p>Drafts</p>
          </div>
        </div>
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <h2>All articles</h2>
          <a className="btn btn-primary" href="#/new">+ New article</a>
        </div>
        <div className="grid posts-grid">
          {posts.map((post) => {
            const canManage = currentUser.username === 'admin' || post.authorUsername === currentUser.username;
            return (
              <article key={post.id} className="article-card">
                <p className="meta">{post.category} • {post.date}</p>
                <h3>{post.title}</h3>
                <p className="meta">By {post.author} • {post.published ? 'Published' : 'Draft'}</p>
                <p className="article-content">{post.content.slice(0, 100)}...</p>
                {canManage && (
                  <div className="article-actions">
                    <button className="btn btn-secondary" onClick={() => onEdit(post.id)}>Edit</button>
                    <button className="btn btn-primary" onClick={() => onTogglePublish(post.id)}>{post.published ? 'Unpublish' : 'Publish'}</button>
                    <button className="btn btn-danger" onClick={() => onDelete(post.id)}>Delete</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ArticleEditor({ posts, currentUser, onSave, editingId, onCancel }) {
  const currentPost = posts.find((post) => post.id === editingId) || null;
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentPost) {
      setForm({ ...emptyForm, ...currentPost });
    } else {
      setForm(emptyForm);
    }
  }, [currentPost]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...form, author: currentUser.name, authorUsername: currentUser.username });
    navigate('/admin');
  };

  return (
    <div className="container">
      <section className="editor-card">
        <h2>{editingId ? 'Edit article' : 'Create article'}</h2>
        <p className="meta">Write for the community and publish when you're ready.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            placeholder="Article title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            <option value="Design">Design</option>
            <option value="Writing">Writing</option>
            <option value="Tech">Tech</option>
            <option value="Culture">Culture</option>
          </select>
          <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
          <textarea
            placeholder="Write your story here..."
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            required
          />
          <label style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
            <input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
            Publish immediately
          </label>
          <div className="article-actions">
            <button className="btn btn-primary" type="submit">Save article</button>
            <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function AuthPage({ mode, onSubmit, error }) {
  const [form, setForm] = useState({ name: '', username: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="container">
      <section className="auth-card">
        <h2>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h2>
        <p className="meta">{mode === 'signup' ? 'Join the platform and start publishing.' : 'Log in to manage articles and post to the shared feed.'}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          )}
          <input
            placeholder="Username"
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button className="btn btn-primary" type="submit">{mode === 'signup' ? 'Sign up' : 'Log in'}</button>
        </form>
      </section>
    </div>
  );
}

function ProfilePage({ authUser, posts }) {
  const userPosts = posts.filter((post) => post.authorUsername === authUser.username);

  return (
    <div className="container">
      <section className="card">
        <h2>Profile</h2>
        <p className="meta">Your account details and your published work.</p>
        <div className="profile-box">
          <div className="profile-avatar">{authUser.name.charAt(0).toUpperCase()}</div>
          <div>
            <h3>{authUser.name}</h3>
            <p className="meta">@{authUser.username}</p>
          </div>
        </div>
        <div className="grid posts-grid" style={{ marginTop: '1rem' }}>
          {userPosts.length > 0 ? userPosts.map((post) => (
            <article key={post.id} className="article-card">
              <p className="meta">{post.category} • {post.date}</p>
              <h3>{post.title}</h3>
              <p className="meta">{post.published ? 'Published' : 'Draft'}</p>
              <p className="article-content">{post.content.slice(0, 100)}...</p>
            </article>
          )) : <p className="meta">No articles yet.</p>}
        </div>
      </section>
    </div>
  );
}

function App() {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('studio-blog-posts');
    return savedPosts ? JSON.parse(savedPosts) : starterPosts;
  });
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('studio-blog-users');
    return savedUsers ? JSON.parse(savedUsers) : starterUsers;
  });
  const [authUser, setAuthUser] = useState(() => {
    const savedAuth = localStorage.getItem('studio-blog-auth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });
  const [editingId, setEditingId] = useState(null);
  const [authError, setAuthError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('studio-blog-posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('studio-blog-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('studio-blog-auth', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('studio-blog-auth');
    }
  }, [authUser]);

  const handleLogin = ({ username, password }) => {
    const foundUser = users.find((user) => user.username === username && user.password === password);
    if (foundUser) {
      setAuthUser(foundUser);
      setAuthError('');
      navigate('/admin');
    } else {
      setAuthError('Invalid username or password.');
    }
  };

  const handleSignup = ({ name, username, password }) => {
    if (!name || !username || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }

    const duplicate = users.some((user) => user.username.toLowerCase() === username.toLowerCase());
    if (duplicate) {
      setAuthError('That username is already taken.');
      return;
    }

    const newUser = { id: Date.now(), name, username, password };
    setUsers((current) => [...current, newUser]);
    setAuthUser(newUser);
    setAuthError('');
    navigate('/admin');
  };

  const handleLogout = () => {
    setAuthUser(null);
    navigate('/');
  };

  const handleSave = (form) => {
    if (editingId) {
      setPosts((current) => current.map((post) => (post.id === editingId ? { ...post, ...form } : post)));
    } else {
      const nextPost = {
        id: Date.now(),
        ...form,
      };
      setPosts((current) => [nextPost, ...current]);
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setPosts((current) => current.filter((post) => post.id !== id));
  };

  const handleEdit = (id) => {
    setEditingId(id);
    navigate('/new');
  };

  const handleTogglePublish = (id) => {
    setPosts((current) => current.map((post) => (post.id === id ? { ...post, published: !post.published } : post)));
  };

  const handleCancel = () => {
    setEditingId(null);
    navigate('/admin');
  };

  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="app-shell">
      <nav className="navbar">
        <a className="brand" href="#/">
          <span className="brand-mark">SB</span>
          <span>Studio Blog</span>
        </a>
        <div className="nav-actions">
          <div className="nav-search-wrap">
            <input
              className="navbar-search"
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="nav-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/admin">Admin</NavLink>
            <NavLink to="/new">New</NavLink>
            {authUser ? (
              <>
                <NavLink to="/profile">Profile</NavLink>
                <span className="nav-user">{authUser.name}</span>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Signup</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
      {searchTerm && (
        <div className="search-results">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="search-result-item">
                <strong>@{user.username}</strong>
                <span>{user.name}</span>
              </div>
            ))
          ) : (
            <div className="search-result-item">No user found</div>
          )}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/login" element={authUser ? <Navigate to="/admin" replace /> : <AuthPage mode="login" onSubmit={handleLogin} error={authError} />} />
        <Route path="/signup" element={authUser ? <Navigate to="/admin" replace /> : <AuthPage mode="signup" onSubmit={handleSignup} error={authError} />} />
        <Route path="/admin" element={authUser ? <Admin posts={posts} currentUser={authUser} onDelete={handleDelete} onEdit={handleEdit} onTogglePublish={handleTogglePublish} /> : <Navigate to="/login" replace />} />
        <Route path="/new" element={authUser ? <ArticleEditor posts={posts} currentUser={authUser} onSave={handleSave} editingId={editingId} onCancel={handleCancel} /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={authUser ? <ProfilePage authUser={authUser} posts={posts} /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
