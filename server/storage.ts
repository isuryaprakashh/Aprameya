import {
  User,
  Project,
  Blog,
  Research,
  Event,
  EventRegistration,
  TicketRegistration,
  RecruitmentApplication,
  RecruitmentSettings,
  PasswordResetOtp,
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

  type Message as MessageType,
  type InsertMessage,
  type TicketRegistration as TicketRegistrationType,
  type InsertTicketRegistration,
  type RecruitmentApplication as RecruitmentApplicationType,
  type InsertRecruitmentApplication,
  type ApplicationDecision,
  type RecruitmentSettings as RecruitmentSettingsType,
  UserRole,
  type UserRoleType
} from "./shared/schema";

export interface IStorage {
  // User Operations
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  getUserByEmail(email: string): Promise<UserType | undefined>;
  getUserByIdentifier(identifier: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  updateUserPassword(userId: string, newPassword: string): Promise<boolean>;
  updateUserRole(userId: string, newRole: UserRoleType): Promise<UserType | undefined>;
  updateUserProfile(userId: string, profileData: UpdateUserProfile): Promise<UserType | undefined>;
  updateUserDomainTitle(userId: string, domain: string, title: string): Promise<UserType | undefined>;
  getAllUsers(): Promise<UserType[]>;
  getUsersByRole(role: UserRoleType): Promise<UserType[]>;
  deleteUser(userId: string): Promise<boolean>;

  // Password Reset OTP Operations
  createPasswordResetOtp(userId: string, email: string, otp: string): Promise<any>;
  getValidPasswordResetOtp(email: string, otp: string): Promise<any | null>;
  markPasswordResetOtpUsed(otpId: string): Promise<void>;

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



  // Ticket Operations
  createTicketRegistration(ticket: InsertTicketRegistration & { userId: string, qrToken: string, entryCode: string }): Promise<TicketRegistrationType>;
  getTicketRegistrationByToken(token: string): Promise<TicketRegistrationType | undefined>;
  getTicketRegistrationByEntryCode(entryCode: string): Promise<TicketRegistrationType | undefined>;
  getTicketRegistrationsByEvent(eventId: string): Promise<TicketRegistrationType[]>;
  updateTicketScanStatus(id: string, scanned: boolean, scannedBy?: string, scannedByName?: string): Promise<TicketRegistrationType | undefined>;
  getTicketRegistrationByUserAndEvent(userId: string, eventId: string): Promise<TicketRegistrationType | undefined>;
  getTicketRegistrationsByUser(userId: string): Promise<TicketRegistrationType[]>;

  // Message Operations (Core Team Chat)
  getMessage(id: string): Promise<MessageType | undefined>;
  getAllMessages(): Promise<MessageType[]>;
  createMessage(message: InsertMessage): Promise<MessageType>;
  deleteMessage(id: string): Promise<boolean>;

  // Recruitment Operations
  getRecruitmentSettings(): Promise<RecruitmentSettingsType | undefined>;
  upsertRecruitmentSettings(isOpen: boolean, updatedBy: string): Promise<RecruitmentSettingsType>;
  createRecruitmentApplication(data: InsertRecruitmentApplication & { userId: string }): Promise<RecruitmentApplicationType>;
  getRecruitmentApplicationByUser(userId: string): Promise<RecruitmentApplicationType | undefined>;
  getAllRecruitmentApplications(filters?: { status?: string; domain?: string }): Promise<RecruitmentApplicationType[]>;
  getRecruitmentApplication(id: string): Promise<RecruitmentApplicationType | undefined>;
  decideRecruitmentApplication(id: string, decision: ApplicationDecision, reviewedBy: string): Promise<RecruitmentApplicationType | undefined>;
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

  async getUserByEmail(email: string): Promise<UserType | undefined> {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    return user ? this.mapDoc<UserType>(user) : undefined;
  }

  async getUserByIdentifier(identifier: string): Promise<UserType | undefined> {
    const cleanId = identifier.trim();
    const user = await User.findOne({
      $or: [
        { username: cleanId },
        { rollNumber: cleanId },
        { email: cleanId.toLowerCase() }
      ]
    });
    return user ? this.mapDoc<UserType>(user) : undefined;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    const result = await User.findByIdAndUpdate(userId, { password: newPassword });
    return !!result;
  }

  async createPasswordResetOtp(userId: string, email: string, otp: string): Promise<any> {
    // Invalidate previous active OTPs for this user/email
    await PasswordResetOtp.updateMany(
      { email: email.toLowerCase().trim(), used: false },
      { used: true }
    );

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const record = new PasswordResetOtp({
      userId,
      email: email.toLowerCase().trim(),
      otp,
      expiresAt,
      used: false
    });
    await record.save();
    return record;
  }

  async getValidPasswordResetOtp(email: string, otp: string): Promise<any | null> {
    const record = await PasswordResetOtp.findOne({
      email: email.toLowerCase().trim(),
      otp: otp.trim(),
      used: false,
      expiresAt: { $gt: new Date() }
    });
    return record;
  }

  async markPasswordResetOtpUsed(otpId: string): Promise<void> {
    await PasswordResetOtp.findByIdAndUpdate(otpId, { used: true });
  }

  async getUsersByRole(role: UserRoleType): Promise<UserType[]> {
    const users = await User.find({ role });
    return users.map(u => this.mapDoc<UserType>(u));
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const rollNo = (insertUser.rollNumber || insertUser.username).trim();
    const user = new User({
      ...insertUser,
      username: insertUser.username.trim(),
      rollNumber: rollNo,
      email: insertUser.email.toLowerCase().trim(),
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

  async updateUserDomainTitle(userId: string, domain: string, title: string): Promise<UserType | undefined> {
    const user = await User.findByIdAndUpdate(userId, { domain, title }, { new: true });
    return user ? this.mapDoc<UserType>(user) : undefined;
  }

  async getAllUsers(): Promise<UserType[]> {
    const users = await User.find();
    return users.map(u => this.mapDoc<UserType>(u));
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(userId);
    return !!result;
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
  // Ticket Operations
  async createTicketRegistration(ticket: InsertTicketRegistration & { userId: string, qrToken: string, entryCode: string }): Promise<TicketRegistrationType> {
    const newTicket = new TicketRegistration(ticket);
    await newTicket.save();
    return this.mapDoc<TicketRegistrationType>(newTicket);
  }

  async getTicketRegistrationByToken(token: string): Promise<TicketRegistrationType | undefined> {
    const ticket = await TicketRegistration.findOne({ qrToken: token });
    return ticket ? this.mapDoc<TicketRegistrationType>(ticket) : undefined;
  }

  async getTicketRegistrationByEntryCode(entryCode: string): Promise<TicketRegistrationType | undefined> {
    const ticket = await TicketRegistration.findOne({ entryCode });
    return ticket ? this.mapDoc<TicketRegistrationType>(ticket) : undefined;
  }

  async getTicketRegistrationsByEvent(eventId: string): Promise<TicketRegistrationType[]> {
    const tickets = await TicketRegistration.find({ eventId });
    return tickets.map(t => this.mapDoc<TicketRegistrationType>(t));
  }

  async updateTicketScanStatus(id: string, scanned: boolean, scannedBy?: string, scannedByName?: string): Promise<TicketRegistrationType | undefined> {
    const update = scanned
      ? { scanned: true, scannedAt: new Date(), scannedBy: scannedBy || null, scannedByName: scannedByName || null }
      : { scanned: false, scannedAt: null, scannedBy: null, scannedByName: null };

    const ticket = await TicketRegistration.findByIdAndUpdate(id, update, { new: true });
    return ticket ? this.mapDoc<TicketRegistrationType>(ticket) : undefined;
  }

  async getTicketRegistrationByUserAndEvent(userId: string, eventId: string): Promise<TicketRegistrationType | undefined> {
    const ticket = await TicketRegistration.findOne({ userId, eventId });
    return ticket ? this.mapDoc<TicketRegistrationType>(ticket) : undefined;
  }

  async getTicketRegistrationsByUser(userId: string): Promise<TicketRegistrationType[]> {
    const tickets = await TicketRegistration.find({ userId });
    return tickets.map(t => this.mapDoc<TicketRegistrationType>(t));
  }

  // Recruitment Operations
  async getRecruitmentSettings(): Promise<RecruitmentSettingsType | undefined> {
    const settings = await RecruitmentSettings.findOne();
    return settings ? this.mapDoc<RecruitmentSettingsType>(settings) : undefined;
  }

  async upsertRecruitmentSettings(isOpen: boolean, updatedBy: string): Promise<RecruitmentSettingsType> {
    const update = {
      isOpen,
      updatedBy,
      ...(isOpen ? { openedAt: new Date() } : { closedAt: new Date() }),
    };
    const settings = await RecruitmentSettings.findOneAndUpdate({}, update, { new: true, upsert: true });
    return this.mapDoc<RecruitmentSettingsType>(settings);
  }

  async createRecruitmentApplication(data: InsertRecruitmentApplication & { userId: string }): Promise<RecruitmentApplicationType> {
    const app = new RecruitmentApplication(data);
    await app.save();
    return this.mapDoc<RecruitmentApplicationType>(app);
  }

  async getRecruitmentApplicationByUser(userId: string): Promise<RecruitmentApplicationType | undefined> {
    const app = await RecruitmentApplication.findOne({ userId });
    return app ? this.mapDoc<RecruitmentApplicationType>(app) : undefined;
  }

  async getAllRecruitmentApplications(filters?: { status?: string; domain?: string }): Promise<RecruitmentApplicationType[]> {
    const query: Record<string, any> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.domain) query.domainPreferences = { $in: [filters.domain] };
    const apps = await RecruitmentApplication.find(query).sort({ appliedAt: -1 });
    return apps.map(a => this.mapDoc<RecruitmentApplicationType>(a));
  }

  async getRecruitmentApplication(id: string): Promise<RecruitmentApplicationType | undefined> {
    const app = await RecruitmentApplication.findById(id);
    return app ? this.mapDoc<RecruitmentApplicationType>(app) : undefined;
  }

  async decideRecruitmentApplication(id: string, decision: ApplicationDecision, reviewedBy: string): Promise<RecruitmentApplicationType | undefined> {
    const update: Record<string, any> = {
      status: decision.status,
      reviewedBy,
      reviewNotes: decision.reviewNotes ?? null,
      reviewedAt: new Date(),
    };
    if (decision.interviewDetails) {
      update.interviewDetails = decision.interviewDetails;
    }
    if (decision.status === 'accepted') {
      update.assignedDomain = decision.assignedDomain ?? null;
      update.assignedTitle = decision.assignedTitle ?? null;
      // Atomically update user domain/title on acceptance
      const app = await RecruitmentApplication.findById(id);
      if (app && (decision.assignedDomain || app.wing)) {
        await User.findByIdAndUpdate(app.userId, {
          domain: decision.assignedDomain || app.wing,
          title: decision.assignedTitle || 'Core Member',
        });
      }
    }
    const result = await RecruitmentApplication.findByIdAndUpdate(id, update, { new: true });
    return result ? this.mapDoc<RecruitmentApplicationType>(result) : undefined;
  }
}

export const storage = new MongoStorage();
