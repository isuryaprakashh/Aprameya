import {
  User,
  Project,
  Blog,
  Research,
  Event,
  EventRegistration,
  Comment,
  Message
} from "./models";
import {
  type User as UserType,
  type InsertUser,
  type UpdateUserProfile,
  type Project as ProjectType,
  type InsertProject,
  type Blog as BlogType,
  type InsertBlog,
  type Research as ResearchType,
  type InsertResearch,
  type Event as EventType,
  type InsertEvent,
  type EventRegistration as EventRegistrationType,
  type InsertEventRegistration,
  type Comment as CommentType,
  type InsertComment,
  type Message as MessageType,
  type InsertMessage,
  UserRole,
  type UserRoleType
} from "./shared/schema";

export interface IStorage {
  // User Operations
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  updateUserRole(userId: string, newRole: UserRoleType): Promise<UserType | undefined>;
  updateUserProfile(userId: string, profileData: UpdateUserProfile): Promise<UserType | undefined>;
  getAllUsers(): Promise<UserType[]>;
  getUsersByRole(role: UserRoleType): Promise<UserType[]>;

  // Project Operations
  getProject(id: string): Promise<ProjectType | undefined>;
  getAllProjects(): Promise<ProjectType[]>;
  createProject(project: InsertProject): Promise<ProjectType>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<ProjectType | undefined>;
  setFeaturedProject(id: string): Promise<void>;
  deleteProject(id: string): Promise<boolean>;

  // Blog Operations
  getBlog(id: string): Promise<BlogType | undefined>;
  getAllBlogs(): Promise<BlogType[]>;
  createBlog(blog: InsertBlog): Promise<BlogType>;
  updateBlog(id: string, blog: Partial<InsertBlog>): Promise<BlogType | undefined>;
  deleteBlog(id: string): Promise<boolean>;

  // Research Operations
  getResearch(id: string): Promise<ResearchType | undefined>;
  getAllResearch(): Promise<ResearchType[]>;
  createResearch(research: InsertResearch): Promise<ResearchType>;
  updateResearch(id: string, research: Partial<InsertResearch>): Promise<ResearchType | undefined>;
  deleteResearch(id: string): Promise<boolean>;

  // Event Operations
  getEvent(id: string): Promise<EventType | undefined>;
  getAllEvents(): Promise<EventType[]>;
  createEvent(event: InsertEvent): Promise<EventType>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<EventType | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // EventRegistration Operations
  getEventRegistration(id: string): Promise<EventRegistrationType | undefined>;
  getEventRegistrationByUserAndEvent(userId: string, eventId: string): Promise<EventRegistrationType | undefined>;
  getAllEventRegistrations(): Promise<EventRegistrationType[]>;
  getEventRegistrationsByUser(userId: string): Promise<EventRegistrationType[]>;
  getEventRegistrationsByEvent(eventId: string): Promise<EventRegistrationType[]>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistrationType>;
  deleteEventRegistration(id: string): Promise<boolean>;

  // Comment Operations
  getComment(id: string): Promise<CommentType | undefined>;
  getCommentsByUser(userId: string): Promise<CommentType[]>;
  getCommentsByProject(projectId: string): Promise<CommentType[]>;
  getCommentsByBlog(blogId: string): Promise<CommentType[]>;
  getCommentsByResearch(researchId: string): Promise<CommentType[]>;
  createComment(comment: InsertComment): Promise<CommentType>;
  updateComment(id: string, comment: Partial<InsertComment>): Promise<CommentType | undefined>;
  deleteComment(id: string): Promise<boolean>;

  // Message Operations (Core Team Chat)
  getMessage(id: string): Promise<MessageType | undefined>;
  getAllMessages(): Promise<MessageType[]>;
  createMessage(message: InsertMessage): Promise<MessageType>;
  deleteMessage(id: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  // Helper to map Mongo document to interface
  private mapDoc<T>(doc: any): T {
    if (!doc) return doc;
    const obj = doc.toObject ? doc.toObject() : doc;
    obj.id = obj._id.toString();
    obj._id = obj._id.toString();
    return obj as T;
  }

  // User Operations
  async getUser(id: string): Promise<UserType | undefined> {
    const user = await User.findById(id);
    return user ? this.mapDoc<UserType>(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    const user = await User.findOne({ username });
    return user ? this.mapDoc<UserType>(user) : undefined;
  }

  async getUsersByRole(role: UserRoleType): Promise<UserType[]> {
    const users = await User.find({ role });
    return users.map(u => this.mapDoc<UserType>(u));
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const user = new User({
      ...insertUser,
      role: UserRole.ASPIRANT
    });
    await user.save();
    return this.mapDoc<UserType>(user);
  }

  async updateUserRole(userId: string, newRole: UserRoleType): Promise<UserType | undefined> {
    const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    return user ? this.mapDoc<UserType>(user) : undefined;
  }

  async updateUserProfile(userId: string, profileData: UpdateUserProfile): Promise<UserType | undefined> {
    const user = await User.findByIdAndUpdate(userId, profileData, { new: true });
    return user ? this.mapDoc<UserType>(user) : undefined;
  }

  async getAllUsers(): Promise<UserType[]> {
    const users = await User.find();
    return users.map(u => this.mapDoc<UserType>(u));
  }

  // Project Operations
  async getProject(id: string): Promise<ProjectType | undefined> {
    const project = await Project.findById(id);
    return project ? this.mapDoc<ProjectType>(project) : undefined;
  }

  async getAllProjects(): Promise<ProjectType[]> {
    const projects = await Project.find();
    return projects.map(p => this.mapDoc<ProjectType>(p));
  }

  async createProject(project: InsertProject): Promise<ProjectType> {
    const newProject = new Project({ ...project, is_featured: false });
    await newProject.save();
    return this.mapDoc<ProjectType>(newProject);
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<ProjectType | undefined> {
    const updatedProject = await Project.findByIdAndUpdate(id, project, { new: true });
    return updatedProject ? this.mapDoc<ProjectType>(updatedProject) : undefined;
  }

  async setFeaturedProject(id: string): Promise<void> {
    // Unset featured for all projects
    await Project.updateMany({}, { is_featured: false });
    // Set featured for the specified project
    await Project.findByIdAndUpdate(id, { is_featured: true });
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  }

  // Blog Operations
  async getBlog(id: string): Promise<BlogType | undefined> {
    const blog = await Blog.findById(id);
    return blog ? this.mapDoc<BlogType>(blog) : undefined;
  }

  async getAllBlogs(): Promise<BlogType[]> {
    const blogs = await Blog.find();
    return blogs.map(b => this.mapDoc<BlogType>(b));
  }

  async createBlog(blog: InsertBlog): Promise<BlogType> {
    const newBlog = new Blog(blog);
    await newBlog.save();
    return this.mapDoc<BlogType>(newBlog);
  }

  async updateBlog(id: string, blog: Partial<InsertBlog>): Promise<BlogType | undefined> {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
    return updatedBlog ? this.mapDoc<BlogType>(updatedBlog) : undefined;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await Blog.findByIdAndDelete(id);
    return !!result;
  }

  // Research Operations
  async getResearch(id: string): Promise<ResearchType | undefined> {
    const research = await Research.findById(id);
    return research ? this.mapDoc<ResearchType>(research) : undefined;
  }

  async getAllResearch(): Promise<ResearchType[]> {
    const research = await Research.find();
    return research.map(r => this.mapDoc<ResearchType>(r));
  }

  async createResearch(research: InsertResearch): Promise<ResearchType> {
    const newResearch = new Research(research);
    await newResearch.save();
    return this.mapDoc<ResearchType>(newResearch);
  }

  async updateResearch(id: string, research: Partial<InsertResearch>): Promise<ResearchType | undefined> {
    const updatedResearch = await Research.findByIdAndUpdate(id, research, { new: true });
    return updatedResearch ? this.mapDoc<ResearchType>(updatedResearch) : undefined;
  }

  async deleteResearch(id: string): Promise<boolean> {
    const result = await Research.findByIdAndDelete(id);
    return !!result;
  }

  // Event Operations
  async getEvent(id: string): Promise<EventType | undefined> {
    const event = await Event.findById(id);
    return event ? this.mapDoc<EventType>(event) : undefined;
  }

  async getAllEvents(): Promise<EventType[]> {
    const events = await Event.find();
    return events.map(e => this.mapDoc<EventType>(e));
  }

  async createEvent(event: InsertEvent): Promise<EventType> {
    const newEvent = new Event(event);
    await newEvent.save();
    return this.mapDoc<EventType>(newEvent);
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<EventType | undefined> {
    const updatedEvent = await Event.findByIdAndUpdate(id, event, { new: true });
    return updatedEvent ? this.mapDoc<EventType>(updatedEvent) : undefined;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await Event.findByIdAndDelete(id);
    return !!result;
  }

  // EventRegistration Operations
  async getEventRegistration(id: string): Promise<EventRegistrationType | undefined> {
    const registration = await EventRegistration.findById(id);
    return registration ? this.mapDoc<EventRegistrationType>(registration) : undefined;
  }

  async getEventRegistrationByUserAndEvent(userId: string, eventId: string): Promise<EventRegistrationType | undefined> {
    const registration = await EventRegistration.findOne({ user_id: userId, event_id: eventId });
    return registration ? this.mapDoc<EventRegistrationType>(registration) : undefined;
  }

  async getAllEventRegistrations(): Promise<EventRegistrationType[]> {
    const registrations = await EventRegistration.find();
    return registrations.map(r => this.mapDoc<EventRegistrationType>(r));
  }

  async getEventRegistrationsByUser(userId: string): Promise<EventRegistrationType[]> {
    const registrations = await EventRegistration.find({ user_id: userId });
    return registrations.map(r => this.mapDoc<EventRegistrationType>(r));
  }

  async getEventRegistrationsByEvent(eventId: string): Promise<EventRegistrationType[]> {
    const registrations = await EventRegistration.find({ event_id: eventId });
    return registrations.map(r => this.mapDoc<EventRegistrationType>(r));
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistrationType> {
    const newRegistration = new EventRegistration(registration);
    await newRegistration.save();
    return this.mapDoc<EventRegistrationType>(newRegistration);
  }

  async deleteEventRegistration(id: string): Promise<boolean> {
    const result = await EventRegistration.findByIdAndDelete(id);
    return !!result;
  }

  // Comment Operations
  async getComment(id: string): Promise<CommentType | undefined> {
    const comment = await Comment.findById(id);
    return comment ? this.mapDoc<CommentType>(comment) : undefined;
  }

  async getCommentsByUser(userId: string): Promise<CommentType[]> {
    const comments = await Comment.find({ user_id: userId });
    return comments.map(c => this.mapDoc<CommentType>(c));
  }

  async getCommentsByProject(projectId: string): Promise<CommentType[]> {
    const comments = await Comment.find({ project_id: projectId });
    return comments.map(c => this.mapDoc<CommentType>(c));
  }

  async getCommentsByBlog(blogId: string): Promise<CommentType[]> {
    const comments = await Comment.find({ blog_id: blogId });
    return comments.map(c => this.mapDoc<CommentType>(c));
  }

  async getCommentsByResearch(researchId: string): Promise<CommentType[]> {
    const comments = await Comment.find({ research_id: researchId });
    return comments.map(c => this.mapDoc<CommentType>(c));
  }

  async createComment(comment: InsertComment): Promise<CommentType> {
    const newComment = new Comment(comment);
    await newComment.save();
    return this.mapDoc<CommentType>(newComment);
  }

  async updateComment(id: string, comment: Partial<InsertComment>): Promise<CommentType | undefined> {
    const updatedComment = await Comment.findByIdAndUpdate(id, comment, { new: true });
    return updatedComment ? this.mapDoc<CommentType>(updatedComment) : undefined;
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await Comment.findByIdAndDelete(id);
    return !!result;
  }

  // Message Operations (Core Team Chat)
  async getMessage(id: string): Promise<MessageType | undefined> {
    const message = await Message.findById(id);
    return message ? this.mapDoc<MessageType>(message) : undefined;
  }

  async getAllMessages(): Promise<MessageType[]> {
    const messages = await Message.find();
    return messages.map(m => this.mapDoc<MessageType>(m));
  }

  async createMessage(message: InsertMessage): Promise<MessageType> {
    const newMessage = new Message(message);
    await newMessage.save();
    return this.mapDoc<MessageType>(newMessage);
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await Message.findByIdAndDelete(id);
    return !!result;
  }
}

export const storage = new MongoStorage();
