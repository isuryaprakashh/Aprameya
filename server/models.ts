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
    citations: { type: Number, default: 0 },
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
});

export const Event = mongoose.model('Event', eventSchema);

const eventRegistrationSchema = new mongoose.Schema({
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: String,
    created_at: { type: Date, default: Date.now },
});

export const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);



const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Message = mongoose.model('Message', messageSchema);
