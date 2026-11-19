import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbStatus } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../.data');
const DATA_FILE = path.join(DATA_DIR, 'conversations.json');

// --- 1. Mongoose Schema for MongoDB ---
const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    enum: ['Professional', 'Casual', 'Concise'],
    default: 'Professional',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
    },
    tone: {
      type: String,
      enum: ['Professional', 'Casual', 'Concise'],
      default: 'Professional',
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt
  }
);

export const MongoConversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

// --- 2. Local Fallback Document Store (used when MongoDB daemon is not running) ---
function ensureFallbackStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readFallbackData() {
  ensureFallbackStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading fallback file:', err);
    return [];
  }
}

function writeFallbackData(data) {
  ensureFallbackStorage();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// --- 3. Unified Conversation Service Interface ---
export const ConversationRepository = {
  async getAll() {
    if (dbStatus.isConnected) {
      return await MongoConversation.find().sort({ updatedAt: -1 }).lean();
    }
    const data = readFallbackData();
    return data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async getById(id) {
    if (dbStatus.isConnected) {
      return await MongoConversation.findById(id).lean();
    }
    const data = readFallbackData();
    return data.find((c) => String(c._id) === String(id)) || null;
  },

  async create({ title = 'New Conversation', tone = 'Professional', messages = [] }) {
    if (dbStatus.isConnected) {
      const conv = new MongoConversation({ title, tone, messages });
      return await conv.save();
    }
    const data = readFallbackData();
    const newConv = {
      _id: 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title,
      tone,
      messages: messages.map((m) => ({
        ...m,
        id: m.id || 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        timestamp: m.timestamp || new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.unshift(newConv);
    writeFallbackData(data);
    return newConv;
  },

  async addMessages(id, newMessages) {
    if (dbStatus.isConnected) {
      const conv = await MongoConversation.findById(id);
      if (!conv) return null;
      for (const msg of newMessages) {
        conv.messages.push(msg);
      }
      conv.updatedAt = new Date();
      return await conv.save();
    }

    const data = readFallbackData();
    const index = data.findIndex((c) => String(c._id) === String(id));
    if (index === -1) return null;

    const formatted = newMessages.map((m) => ({
      ...m,
      id: m.id || 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      timestamp: m.timestamp || new Date().toISOString(),
    }));

    data[index].messages.push(...formatted);
    data[index].updatedAt = new Date().toISOString();
    writeFallbackData(data);
    return data[index];
  },

  async updateTone(id, tone) {
    if (dbStatus.isConnected) {
      return await MongoConversation.findByIdAndUpdate(
        id,
        { tone, updatedAt: new Date() },
        { new: true }
      ).lean();
    }

    const data = readFallbackData();
    const conv = data.find((c) => String(c._id) === String(id));
    if (!conv) return null;
    conv.tone = tone;
    conv.updatedAt = new Date().toISOString();
    writeFallbackData(data);
    return conv;
  },

  async updateTitle(id, title) {
    if (dbStatus.isConnected) {
      return await MongoConversation.findByIdAndUpdate(
        id,
        { title, updatedAt: new Date() },
        { new: true }
      ).lean();
    }

    const data = readFallbackData();
    const conv = data.find((c) => String(c._id) === String(id));
    if (!conv) return null;
    conv.title = title;
    conv.updatedAt = new Date().toISOString();
    writeFallbackData(data);
    return conv;
  },

  async delete(id) {
    if (dbStatus.isConnected) {
      return await MongoConversation.findByIdAndDelete(id);
    }

    const data = readFallbackData();
    const filtered = data.filter((c) => String(c._id) !== String(id));
    writeFallbackData(filtered);
    return true;
  },

  async deleteAll() {
    if (dbStatus.isConnected) {
      return await MongoConversation.deleteMany({});
    }
    writeFallbackData([]);
    return true;
  },
};
