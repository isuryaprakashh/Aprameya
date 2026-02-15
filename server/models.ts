import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true, length: 10 },
    role: { type: String, default: 'ASPIRANT', enum: ['ASPIRANT', 'CORE', 'ADMIN'] },
    created_at: { type: Date, default: Date.now },
    display_name: String,
    profile_image: String,
    department: String,
    year: String,
    role_title: String,
    tags: String,
    linkedin: String,
    github: String,
    bio: String,
});

export const User = mongoose.model('User', userSchema);

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    technologies: { type: String, required: true },
    team: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Project = mongoose.model('Project', projectSchema);

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Blog = mongoose.model('Blog', blogSchema);

const researchSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    authors: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Research = mongoose.model('Research', researchSchema);

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    capacity: { type: Number, default: null },
    registrationOpen: { type: Boolean, default: true },
    ticketEnabled: { type: Boolean, default: false },
});

export const Event = mongoose.model('Event', eventSchema);

const eventRegistrationSchema = new mongoose.Schema({
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: String,
    created_at: { type: Date, default: Date.now },
});

export const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

const ticketRegistrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    rollNumber: { type: String, required: true, match: /^\d{10}$/ },
    year: { type: Number, required: true, enum: [1, 2, 3, 4] },
    qrToken: { type: String, required: true },
    entryCode: { type: String, required: true },
    scanned: { type: Boolean, default: false },
    scannedAt: { type: Date, default: null },
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    scannedByName: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
});

// Compound unique index: one roll number per event
ticketRegistrationSchema.index({ eventId: 1, rollNumber: 1 }, { unique: true });
ticketRegistrationSchema.index({ eventId: 1, entryCode: 1 }, { unique: true });

export const TicketRegistration = mongoose.model('TicketRegistration', ticketRegistrationSchema);



const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Message = mongoose.model('Message', messageSchema);
