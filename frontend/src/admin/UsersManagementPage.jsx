import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users, UserPlus, Search, Shield, ShieldCheck, Mail, Calendar,
  Trash2, Edit2, CheckCircle2, XCircle, AlertCircle, X, Check, Lock,
  Key, Award, Briefcase, Filter, Camera, UploadCloud, Info, Eye, EyeOff, Copy, RefreshCw
} from 'lucide-react';
import api from '../services/api';

const defaultStaff = [
  {
    id: 'user-1',
    fullName: 'Admin Administrator',
    username: 'admin',
    email: 'admin@sportsarenaafrika.com',
    role: 'ROLE_SUPER_ADMIN',
    desk: 'Chief Editor Desk',
    avatarUrl: '',
    articlesCount: 14,
    status: 'ACTIVE',
    createdAt: '2026-01-15',
    bio: 'Chief System Administrator & Senior Newsroom Director.'
  },
  {
    id: 'user-2',
    fullName: 'Kipchoge Ombati',
    username: 'kipchoge',
    email: 'kipchoge@sportsarenaafrika.com',
    role: 'ROLE_SUPER_ADMIN',
    desk: 'Senior International Football',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    articlesCount: 42,
    status: 'ACTIVE',
    createdAt: '2026-02-01',
    bio: 'Veteran sports correspondent covering English Premier League and African continental football.'
  },
  {
    id: 'user-3',
    fullName: 'Wanjiru Mwangi',
    username: 'wanjiru',
    email: 'wanjiru@sportsarenaafrika.com',
    role: 'ROLE_EDITOR',
    desk: 'Kenya FKF & National Teams',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    articlesCount: 38,
    status: 'ACTIVE',
    createdAt: '2026-02-10',
    bio: 'Senior editor overseeing Kenyan domestic leagues, Harambee Stars, and women’s sports.'
  },
  {
    id: 'user-4',
    fullName: 'Tariq El-Haddad',
    username: 'tariq',
    email: 'tariq@sportsarenaafrika.com',
    role: 'ROLE_JOURNALIST',
    desk: 'CAF Champions League & North Africa',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    articlesCount: 27,
    status: 'ACTIVE',
    createdAt: '2026-03-01',
    bio: 'North Africa football correspondent specializing in CAF tournaments and tactical analysis.'
  },
  {
    id: 'user-5',
    fullName: 'Amara Diop',
    username: 'amara',
    email: 'amara@sportsarenaafrika.com',
    role: 'ROLE_JOURNALIST',
    desk: 'West African Football & Transfer Radar',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    articlesCount: 19,
    status: 'ACTIVE',
    createdAt: '2026-03-15',
    bio: 'Specialist in West African talents, European transfer market rumblings, and youth academies.'
  }
];

export default function UsersManagementPage({ articles = [] }) {
  const currentRole = sessionStorage.getItem('arena_role') || '';
  const currentUsername = sessionStorage.getItem('arena_username') || 'admin';
  const isSuperAdmin = currentRole === 'ROLE_SUPER_ADMIN';

  const [users, setUsers] = useState([]);
  const [loadError, setLoadError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [permissionAlert, setPermissionAlert] = useState('');

  // Form State for Add User
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'ROLE_JOURNALIST',
    desk: 'General Sports',
    avatarUrl: '',
    bio: ''
  });
  const [formError, setFormError] = useState('');
  const addAvatarInputRef = useRef(null);
  const editAvatarInputRef = useRef(null);

  // The database is the source of truth for staff accounts, with local storage fallback when offline.
  useEffect(() => {
    let active = true;
    api.getUsers().then((records) => {
      if (!active) return;
      if (Array.isArray(records) && records.length > 0) {
        const mapped = records.map((user) => ({ ...user, desk: user.department || '', status: user.status || 'ACTIVE' }));
        setUsers(mapped);
        setLoadError('');
        try { localStorage.setItem('sportsarena_staff_users', JSON.stringify(mapped)); } catch {}
      } else {
        try {
          const cached = JSON.parse(localStorage.getItem('sportsarena_staff_users') || 'null');
          if (Array.isArray(cached) && cached.length > 0) {
            setUsers(cached);
          } else {
            setUsers(defaultStaff);
            localStorage.setItem('sportsarena_staff_users', JSON.stringify(defaultStaff));
          }
        } catch {
          setUsers(defaultStaff);
        }
        if (!Array.isArray(records)) {
          setLoadError('Operating in local mode. Start the Spring Boot backend to sync staff accounts across servers.');
        }
      }
    });
    return () => { active = false; };
  }, []);

  // Check if current user can edit a target user
  // RULE: "only admin can change editor profile"
  const canEditUser = (targetUser) => {
    if (isSuperAdmin) return true;
    if (targetUser.role === 'ROLE_EDITOR' || targetUser.role === 'ROLE_SUPER_ADMIN') {
      return false; // Only admin can edit editor or super admin profile!
    }
    return true; // Editor or staff can edit journalists
  };

  const handleStartEdit = (targetUser) => {
    if (!canEditUser(targetUser)) {
      setPermissionAlert(`Permission Denied: Only a Super Administrator can edit or change the profile of an Editor (${targetUser.fullName}).`);
      setTimeout(() => setPermissionAlert(''), 6000);
      return;
    }
    setEditingUser({ ...targetUser, newPassword: '', showPassword: false });
  };

  // Image Upload Handler with graceful offline fallback
  const handleAvatarFile = async (file, isEdit = false) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!file || !allowedTypes.includes(file.type)) {
      alert('Please choose a JPG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Profile photos must be 10 MB or smaller.');
      return;
    }

    const setLocalImage = () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result;
        if (dataUrl) {
          if (isEdit) setEditingUser(prev => ({ ...prev, avatarUrl: dataUrl }));
          else setFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
        }
      };
      reader.onerror = () => {
        alert('Could not read the selected image file.');
      };
      reader.readAsDataURL(file);
    };

    try {
      const upload = await api.uploadImage(file);
      if (upload?.url) {
        if (isEdit) setEditingUser(prev => ({ ...prev, avatarUrl: upload.url }));
        else setFormData(prev => ({ ...prev, avatarUrl: upload.url }));
        return;
      }
      setLocalImage();
    } catch (error) {
      const isNetworkError = error.message?.includes('Failed to fetch') || error.message?.includes('API');
      if (isNetworkError) {
        // Backend API is offline; smoothly load the image locally as a data URL
        setLocalImage();
      } else {
        alert(`Profile photo upload failed: ${error.message}`);
      }
    }
  };

  // Filter Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch = !term ||
        u.fullName.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.desk && u.desk.toLowerCase().includes(term));

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'articles') return (b.articlesCount || 0) - (a.articlesCount || 0);
      if (sortBy === 'lastActive') return new Date(b.lastLoginAt || 0) - new Date(a.lastLoginAt || 0);
      if (sortBy === 'joined') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return String(a.fullName || '').localeCompare(String(b.fullName || ''));
    });
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  // Metrics
  const totalCount = users.length;
  const superAdminCount = users.filter(u => u.role === 'ROLE_SUPER_ADMIN').length;
  const editorCount = users.filter(u => u.role === 'ROLE_EDITOR').length;
  const journalistCount = users.filter(u => u.role === 'ROLE_JOURNALIST').length;

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const cleanUsername = formData.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      setFormError(`Username "${cleanUsername}" is already taken.`);
      return;
    }

    if (users.some(u => u.email.toLowerCase() === formData.email.trim().toLowerCase())) {
      setFormError(`Email "${formData.email}" is already associated with another staff account.`);
      return;
    }

    // Role check: Only admin can create editors or super admins
    if ((formData.role === 'ROLE_EDITOR' || formData.role === 'ROLE_SUPER_ADMIN') && !isSuperAdmin) {
      setFormError('Only Super Administrators can create Editor or Administrator accounts.');
      return;
    }

    const newUser = {
      fullName: formData.fullName.trim(),
      username: cleanUsername,
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      desk: formData.desk.trim() || 'General Sports',
      avatarUrl: formData.avatarUrl || '',
      bio: formData.bio.trim() || '',
      status: 'ACTIVE',
      department: formData.desk.trim() || 'General Sports',
      phone: formData.phone?.trim() || '',
      socialProfiles: formData.socialProfiles?.trim() || ''
    };

    try {
      const created = await api.createUser({ ...newUser, password: formData.password });
      if (!created?.id) throw new Error('User could not be created. Check the API connection and account permissions.');
      const finalUser = { ...created, desk: created.department || '' };
      setUsers(prev => {
        const next = [finalUser, ...prev];
        try { localStorage.setItem('sportsarena_staff_users', JSON.stringify(next)); } catch {}
        return next;
      });
    } catch (err) {
      if (err.message?.includes('Failed to fetch')) {
        const localUser = {
          ...newUser,
          id: `local-user-${Date.now()}`,
          password: formData.password,
          articlesCount: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setUsers(prev => {
          const next = [localUser, ...prev];
          try { localStorage.setItem('sportsarena_staff_users', JSON.stringify(next)); } catch {}
          return next;
        });
      } else {
        setFormError(err.message || 'User could not be created.');
        return;
      }
    }

    setIsAddUserModalOpen(false);
    setFormData({
      fullName: '',
      username: '',
      email: '',
      password: '',
      role: 'ROLE_JOURNALIST',
      desk: 'General Sports',
      avatarUrl: '',
      bio: ''
    });
    alert(`Staff member ${newUser.fullName} (@${newUser.username}) added successfully!`);
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    // Security check: Only admin can change an editor profile
    if ((editingUser.role === 'ROLE_EDITOR' || editingUser.role === 'ROLE_SUPER_ADMIN') && !isSuperAdmin) {
      alert('Unauthorized: Only Super Administrators have permission to modify Editor or Administrator profiles.');
      return;
    }

    const updatedUser = { ...editingUser };
    const hasNewPassword = Boolean(editingUser.newPassword && editingUser.newPassword.trim());
    const passwordToSet = hasNewPassword ? editingUser.newPassword.trim() : '';
    delete updatedUser.newPassword;
    delete updatedUser.showPassword;

    try {
      const saved = await api.updateUser(updatedUser.id, {
        fullName: updatedUser.fullName, username: updatedUser.username, email: updatedUser.email,
        role: updatedUser.role, status: updatedUser.status, avatarUrl: updatedUser.avatarUrl,
        department: updatedUser.desk || updatedUser.department, phone: updatedUser.phone,
        bio: updatedUser.bio, socialProfiles: updatedUser.socialProfiles,
        password: passwordToSet
      });
      if (!saved?.id) throw new Error('Changes could not be saved. Check your connection and permissions.');
      Object.assign(updatedUser, saved, { desk: saved.department || '' });
    } catch (err) {
      if (err.message?.includes('Failed to fetch') || String(updatedUser.id).startsWith('local-user-') || String(updatedUser.id).startsWith('user-')) {
        if (passwordToSet) updatedUser.password = passwordToSet;
      } else {
        alert(err.message || 'User changes could not be saved.');
        return;
      }
    }

    setUsers(prev => {
      const next = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      try { localStorage.setItem('sportsarena_staff_users', JSON.stringify(next)); } catch {}
      return next;
    });
    const updatedName = updatedUser.fullName;
    const assignedPass = 'set securely; share it through a private channel';
    setEditingUser(null);

    if (hasNewPassword) {
      alert(`✓ Profile & Password for ${updatedName} updated successfully!\n\nAssigned Password: ${assignedPass}\n\nYou can now provide this password to ${updatedName} for signing into the newsroom.`);
    } else {
      alert(`✓ Profile for ${updatedName} updated successfully!`);
    }
  };

  const toggleUserStatus = async (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    if (!canEditUser(target)) {
      setPermissionAlert(`Permission Denied: Only a Super Administrator can change the account status of an Editor (${target.fullName}).`);
      setTimeout(() => setPermissionAlert(''), 6000);
      return;
    }
    const nextStatus = target.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const saved = await api.updateUser(id, {
        fullName: target.fullName, username: target.username, email: target.email, role: target.role,
        status: nextStatus, avatarUrl: target.avatarUrl, department: target.department || target.desk,
        phone: target.phone, bio: target.bio, socialProfiles: target.socialProfiles, password: ''
      });
      if (saved?.id) {
        setUsers(prev => {
          const next = prev.map(user => user.id === id ? { ...saved, desk: saved.department || '' } : user);
          try { localStorage.setItem('sportsarena_staff_users', JSON.stringify(next)); } catch {}
          return next;
        });
        return;
      }
    } catch (err) {
      console.warn('[UsersManagement] API offline, updating user status locally:', err.message);
    }

    // Local / Offline fallback
    setUsers(prev => {
      const next = prev.map(user => user.id === id ? { ...user, status: nextStatus } : user);
      try { localStorage.setItem('sportsarena_staff_users', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1"><Shield className="w-3 h-3 text-purple-400" /> Chief Editor</span>;
      case 'ROLE_EDITOR':
        return <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1"><Award className="w-3 h-3 text-blue-400" /> Editor</span>;
      case 'ROLE_JOURNALIST':
      default:
        return <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><Briefcase className="w-3 h-3 text-emerald-400" /> Contributor</span>;
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#0B0B0F] min-h-screen text-[#F9FAFB]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232332] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#EF233C]">NEWSROOM ACCESS CONTROL</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181822] text-gray-400 border border-[#232332]">
              Current Role: <strong className={isSuperAdmin ? 'text-purple-400' : 'text-blue-400'}>{isSuperAdmin ? 'Super Admin' : 'Editor'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1">Staff & User Management</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Manage journalist and editor profiles, profile images, and newsroom permissions.
            <span className="text-amber-400 font-bold ml-1">🔒 Note: Only Super Administrators can edit Editor profiles.</span>
          </p>
        </div>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition self-start sm:self-auto shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {loadError && <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-sm text-amber-200">{loadError}</div>}

      {/* Permission Denied Alert Banner */}
      {permissionAlert && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="font-semibold">{permissionAlert}</span>
          </div>
          <button onClick={() => setPermissionAlert('')} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#121218] border border-[#232332] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A1A1AA] uppercase">Total Staff</span>
            <Users className="w-4 h-4 text-[#A1A1AA]" />
          </div>
          <span className="text-2xl font-black text-white mt-2 block">{totalCount}</span>
        </div>
        <div className="bg-[#121218] border border-[#232332] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-400 uppercase">Chief Editors</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-black text-purple-400 mt-2 block">{superAdminCount}</span>
        </div>
        <div className="bg-[#121218] border border-[#232332] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-400 uppercase">Editors</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-black text-blue-400 mt-2 block">{editorCount}</span>
        </div>
        <div className="bg-[#121218] border border-[#232332] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase">Contributors</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400 mt-2 block">{journalistCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#121218] border border-[#232332] rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search staff by name, @username, email, or desk..."
              className="w-full bg-[#181822] border border-[#232332] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-[#181822] border border-[#232332] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Roles</option>
              <option value="ROLE_SUPER_ADMIN">Chief Editors</option>
              <option value="ROLE_EDITOR">Editors</option>
              <option value="ROLE_JOURNALIST">Contributors</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#181822] border border-[#232332] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-[#181822] border border-[#232332] rounded-xl px-3 py-2.5 text-xs text-white">
              <option value="name">Sort: Name</option><option value="joined">Date joined</option><option value="lastActive">Last active</option><option value="articles">Articles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#121218] border border-[#232332] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181822] text-[#A1A1AA] uppercase tracking-wider font-bold border-b border-[#232332]">
              <tr>
                <th className="py-3.5 px-5">Staff Member & Profile Photo</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Articles</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232332] text-gray-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#A1A1AA]">
                    <Users className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-white">No users found</p>
                    <p className="text-gray-500 text-xs mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const initials = user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  const isActive = user.status === 'ACTIVE';
                  const isSuspended = user.status === 'SUSPENDED';
                  const isProtectedAdmin = user.username === 'admin';
                  const isEditor = user.role === 'ROLE_EDITOR';
                  const allowedToEdit = canEditUser(user);

                  return (
                    <tr key={user.id} className="hover:bg-[#151520] transition">
                      {/* Name & Avatar Image */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-[#181822] border-2 border-[#232332] flex-shrink-0 flex items-center justify-center relative shadow">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#EF233C] text-white flex items-center justify-center font-bold text-sm">
                                {initials}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              <button type="button" onClick={() => setProfileUser(user)} className="text-left hover:text-blue-300">{user.fullName}</button>
                              {isEditor && !isSuperAdmin && (
                                <span title="Protected Editor Profile" className="text-amber-400">
                                  <Lock className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                              <span>@{user.username}</span>
                              <span>·</span>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Desk */}
                      <td className="py-4 px-4 font-semibold text-gray-200">
                        {user.department || user.desk || '—'}
                      </td>

                      {/* Articles Count */}
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        {user.articlesCount || 0}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isSuspended ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : isSuspended ? 'bg-red-400' : 'bg-amber-400'}`}></span>
                          <span>{user.status}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-gray-400 font-mono text-[11px]">
                        {user.lastLoginAt ? (() => { const ageDays = Math.floor((Date.now() - new Date(user.lastLoginAt).getTime()) / 86400000); return ageDays === 0 ? 'Today' : ageDays === 1 ? 'Yesterday' : new Date(user.lastLoginAt).toLocaleDateString(); })() : 'Never'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Edit Profile Button */}
                          <button
                            onClick={() => handleStartEdit(user)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                              allowedToEdit
                                ? 'bg-[#2563EB] hover:bg-blue-600 text-white shadow'
                                : 'bg-[#181822] text-gray-500 border border-[#232332] cursor-not-allowed opacity-60'
                            }`}
                            title={allowedToEdit ? "Edit Profile & Change Details" : "Only Super Admin can change an Editor's profile"}
                          >
                            {allowedToEdit ? <Edit2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
                            <span>Edit</span>
                          </button>

                          {/* Toggle Active / Suspended */}
                          {!isProtectedAdmin && allowedToEdit && (
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase transition border ${
                                isActive
                                  ? 'bg-[#181822] text-amber-400 border-amber-900/40 hover:bg-amber-950/20'
                                  : 'bg-[#181822] text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/20'
                              }`}
                              title={isActive ? 'Set account inactive' : 'Activate User'}
                            >
                              {isActive ? 'Set Inactive' : 'Activate'}
                            </button>
                          )}

                          {isProtectedAdmin && (
                            <span className="text-[10px] text-gray-500 font-mono font-bold uppercase px-2 py-1">
                              Master
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User / Profile Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121218] border border-[#232332] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#232332] flex items-center justify-between bg-[#181822]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <h3 className="text-base font-black uppercase text-white">Edit Staff Profile</h3>
                  <span className="text-[11px] text-gray-400 font-mono">@{editingUser.username}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Editor Protection Notice if target is Editor */}
              {editingUser.role === 'ROLE_EDITOR' && (
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800 text-blue-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-400" />
                  <span>Authorized Super Admin session: Modifying Editor profile for <strong>{editingUser.fullName}</strong>.</span>
                </div>
              )}

              {/* Avatar Upload / Change Profile Photo */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#181822] border border-[#232332]">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-black border-2 border-[#2563EB] flex-shrink-0 flex items-center justify-center shadow">
                  {editingUser.avatarUrl ? (
                    <img src={editingUser.avatarUrl} alt={editingUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-black text-white">
                      {editingUser.fullName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <span className="text-xs font-bold text-white block">Profile Photo</span>
                  <input
                    type="file"
                    ref={editAvatarInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={e => e.target.files?.[0] && handleAvatarFile(e.target.files[0], true)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editAvatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1.5 transition"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Upload New Photo</span>
                    </button>
                    {editingUser.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingUser(prev => ({ ...prev, avatarUrl: '' }))}
                        className="px-2.5 py-1.5 rounded-lg bg-[#121218] hover:bg-red-950/30 text-gray-400 hover:text-red-400 text-[11px] font-bold border border-[#232332] transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 block">JPG, PNG, or WebP from your computer</span>
                </div>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingUser.fullName}
                    onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Username *</label>
                  <input
                    type="text"
                    required
                    value={editingUser.username}
                    onChange={e => setEditingUser({ ...editingUser, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Role & Desk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Assigned Role</label>
                  <select
                    disabled={!isSuperAdmin}
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB] disabled:opacity-60"
                  >
                    <option value="ROLE_JOURNALIST">Contributor</option>
                    <option value="ROLE_EDITOR">Editor</option>
                    <option value="ROLE_SUPER_ADMIN">Chief Editor</option>
                  </select>
                  {!isSuperAdmin && (
                    <span className="text-[10px] text-gray-500 mt-1 block">Only Super Admin can change roles</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Account Status</label>
                  <select
                    value={editingUser.status}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Newsroom Desk */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Assigned Newsroom Desk / Beat</label>
                <input
                  type="text"
                  value={editingUser.desk || ''}
                  onChange={e => setEditingUser({ ...editingUser, desk: e.target.value })}
                  placeholder="e.g. Kenya FKF & National Teams, Transfers"
                  className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Newsroom Password (Assigned by Admin) */}
              <div className="p-4 rounded-xl bg-[#161622] border border-[#2B2B3D] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#EF233C]/20 border border-[#EF233C]/40 flex items-center justify-center text-[#EF233C]">
                      <Key className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-white font-['Montserrat'] tracking-wide">
                        Assign New Password
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        Admin will assign this user's password. Leave blank to keep existing password.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const randomPass = 'Arena@' + Math.floor(100000 + Math.random() * 900000);
                      setEditingUser(prev => ({ ...prev, newPassword: randomPass, showPassword: true }));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#232332] hover:bg-[#2F2F42] text-[10px] font-bold text-gray-300 hover:text-white border border-[#333348] flex items-center gap-1 transition"
                    title="Generate secure random temporary password"
                  >
                    <RefreshCw className="w-3 h-3 text-[#F59E0B]" />
                    <span>Auto Generate</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={editingUser.showPassword ? 'text' : 'password'}
                    value={editingUser.newPassword || ''}
                    onChange={e => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                    placeholder="Enter password to assign to this user..."
                    className="w-full bg-[#0B0B0F] border border-[#333348] rounded-xl pl-9 pr-20 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EF233C]"
                  />
                  <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center gap-1">
                    {editingUser.newPassword && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(editingUser.newPassword);
                            alert(`Password "${editingUser.newPassword}" copied to clipboard! You can now send it to ${editingUser.fullName}.`);
                          } catch (err) {
                            alert(`Password: ${editingUser.newPassword}`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#232332] transition"
                        title="Copy password to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingUser(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#232332] transition"
                      title={editingUser.showPassword ? "Hide password" : "Show password"}
                    >
                      {editingUser.showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {editingUser.newPassword && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      Ready to assign. After saving, provide this password (<strong>{editingUser.newPassword}</strong>) to {editingUser.fullName} for newsroom sign in.
                    </span>
                  </div>
                )}
              </div>

              {/* Staff Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-bold text-gray-300">Phone (optional)
                  <input value={editingUser.phone || ''} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} className="mt-1.5 w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white" />
                </label>
                <label className="block text-xs font-bold text-gray-300">Social profiles (optional)
                  <input value={editingUser.socialProfiles || ''} onChange={e => setEditingUser({ ...editingUser, socialProfiles: e.target.value })} placeholder="Profile URLs" className="mt-1.5 w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white" />
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Staff Bio / Byline</label>
                <textarea
                  rows={3}
                  value={editingUser.bio || ''}
                  onChange={e => setEditingUser({ ...editingUser, bio: e.target.value })}
                  placeholder="Short bio displayed on published articles..."
                  className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#232332] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#181822] text-xs font-bold text-gray-400 hover:text-white border border-[#232332]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121218] border border-[#232332] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#232332] flex items-center justify-between bg-[#181822]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-base font-black uppercase text-white">Add New Staff Member</h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Avatar Upload for New User */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#181822] border border-[#232332]">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-black border-2 border-dashed border-gray-600 flex-shrink-0 flex items-center justify-center shadow">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-gray-500" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <span className="text-xs font-bold text-white block">Profile Photo (Optional)</span>
                  <input
                    type="file"
                    ref={addAvatarInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={e => e.target.files?.[0] && handleAvatarFile(e.target.files[0], false)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addAvatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1.5 transition"
                    >
                      <UploadCloud className="w-3 h-3" />
                      <span>{formData.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>
                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                        className="px-2.5 py-1.5 rounded-lg bg-[#121218] hover:bg-red-950/30 text-gray-400 hover:text-red-400 text-[11px] font-bold border border-[#232332] transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 block">JPG, PNG, WebP, or GIF · max 10 MB</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Dennis Oliech"
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. doliech"
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. dennis@sportsarenaafrika.com"
                  className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Temporary Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Assigned Role *</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="ROLE_JOURNALIST">Contributor</option>
                    {isSuperAdmin && <option value="ROLE_EDITOR">Editor</option>}
                    {isSuperAdmin && <option value="ROLE_SUPER_ADMIN">Chief Editor</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-300 mb-1.5">Phone (Optional)</label><input type="tel" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white" /></div>
                <div><label className="block text-xs font-bold text-gray-300 mb-1.5">Social Profiles (Optional)</label><input value={formData.socialProfiles || ''} onChange={e => setFormData({ ...formData, socialProfiles: e.target.value })} placeholder="Profile URLs" className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white" /></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Assigned Newsroom Desk / Beat</label>
                <input
                  type="text"
                  value={formData.desk}
                  onChange={e => setFormData({ ...formData, desk: e.target.value })}
                  placeholder="e.g. Kenyan FKF Premier League, Transfers, Women's Sports"
                  className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Bio / Byline (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Staff bio displayed on published news articles..."
                  className="w-full bg-[#181822] border border-[#232332] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#232332] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#181822] text-xs font-bold text-gray-400 hover:text-white border border-[#232332]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {profileUser && (() => {
        const authored = articles.filter(article => (article.authorName || article.author) === profileUser.fullName);
        const countStatus = (...statuses) => authored.filter(article => statuses.includes(String(article.status || '').toUpperCase())).length;
        return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${profileUser.fullName} profile`}>
          <section className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#303044] bg-[#121218] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#232332] pb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-[#232332] flex items-center justify-center text-xl font-bold">{profileUser.avatarUrl ? <img src={profileUser.avatarUrl} alt="" className="h-full w-full object-cover"/> : profileUser.fullName.slice(0, 2).toUpperCase()}</div>
                <div><h2 className="text-xl font-bold">{profileUser.fullName}</h2><p className="text-sm text-gray-400">@{profileUser.username} · {profileUser.email}</p><div className="mt-2">{getRoleBadge(profileUser.role)} <span className="ml-2 text-xs text-gray-300">{profileUser.status}</span></div></div>
              </div>
              <button type="button" onClick={() => setProfileUser(null)} aria-label="Close profile" className="rounded p-2 text-gray-300 hover:bg-[#232332]"><X className="h-5 w-5"/></button>
            </div>
            <p className="py-4 text-sm text-gray-300">{profileUser.bio || 'No profile bio has been added.'}</p>
            <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              {[['Total articles', authored.length], ['Published', countStatus('PUBLISHED')], ['Drafts', countStatus('DRAFT')], ['Pending review', countStatus('PENDING_REVIEW', 'IN REVIEW')], ['Archived', countStatus('ARCHIVED')], ['Department', profileUser.department || profileUser.desk || '—'], ['Date joined', profileUser.createdAt ? new Date(profileUser.createdAt).toLocaleDateString() : '—'], ['Last login', profileUser.lastLoginAt ? new Date(profileUser.lastLoginAt).toLocaleString() : 'Never']].map(([label, value]) => <div key={label} className="rounded-lg border border-[#232332] bg-[#181822] p-3"><dt className="text-xs text-gray-400">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}
            </dl>
            <h3 className="mt-5 mb-2 text-sm font-bold">Recent articles</h3>
            <ul className="space-y-2">{authored.slice(0, 8).map(article => <li key={article.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#181822] px-3 py-2 text-sm"><span className="truncate">{article.title}</span><span className="shrink-0 text-xs text-gray-400">{article.status}</span></li>)}{authored.length === 0 && <li className="text-sm text-gray-400">No articles attributed to this user.</li>}</ul>
          </section>
        </div>;
      })()}

    </div>
  );
}
