import { supabase } from './supabaseClient.js';

const LIKED_KEY = 'cosmic_letters_liked';
const ANON_KEY = 'cosmic_letters_anon_id';
const EXPIRY_CUTOFF_MS = 30 * 24 * 60 * 60 * 1000;

function getAnonId() {
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

function getLikedIds() {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLikedIds(ids) {
  localStorage.setItem(LIKED_KEY, JSON.stringify(ids));
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function generateAccessToken() {
  return crypto.randomUUID?.() || generateId() + generateId();
}

export async function createMessage({ messageText, category, visibility }) {
  const message = {
    id: generateId(),
    message_text: messageText.trim(),
    category: category || 'random',
    created_at: new Date().toISOString(),
    visibility,
    likes: 0,
    anonymous_id: getAnonId(),
    access_token: visibility === 'private' ? generateAccessToken() : null,
    star_x: Math.random() * 0.8 + 0.1,
    star_y: Math.random() * 0.8 + 0.1,
  };

  const { data, error } = await supabase.from('messages').insert(message).select().single();
  if (error) throw error;
  return data;
}

export async function getPublicMessages({ category, search, limit = 20, offset = 0, includeExpired = false } = {}) {
  let query = supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (!includeExpired) {
    query = query.gte('created_at', new Date(Date.now() - EXPIRY_CUTOFF_MS).toISOString());
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.ilike('message_text', `%${search}%`);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);
  if (error) throw error;

  return {
    messages: data || [],
    total: count || 0,
    hasMore: offset + limit < (count || 0),
  };
}

export async function getMessageById(id) {
  const { data, error } = await supabase.from('messages').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMessageByToken(token) {
  const { data, error } = await supabase.rpc('get_message_by_token', { p_token: token });
  if (error) throw error;
  return data?.[0] || null;
}

export async function getRandomMessage(category) {
  const { messages } = await getPublicMessages({ category, limit: 200 });
  if (!messages.length) return null;
  return messages[Math.floor(Math.random() * messages.length)];
}

export async function toggleLike(messageId) {
  const liked = getLikedIds();
  const wasLiked = liked.includes(messageId);
  const delta = wasLiked ? -1 : 1;

  const { data, error } = await supabase.rpc('adjust_likes', { p_id: messageId, p_delta: delta });
  if (error) throw error;

  saveLikedIds(wasLiked ? liked.filter(id => id !== messageId) : [...liked, messageId]);
  return { message: data?.[0], liked: !wasLiked };
}

export function isLiked(messageId) {
  return getLikedIds().includes(messageId);
}

export async function getAllForStarMap() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(300);
  if (error) throw error;
  return data || [];
}
