import { Session, Message } from '../types';

export class SessionManager {
  private sessions: Map<string, Session> = new Map();

  getSession(sessionId: string): Session {
    if (!this.sessions.has(sessionId)) {
      const newSession: Session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.sessions.set(sessionId, newSession);
    }
    return this.sessions.get(sessionId)!;
  }

  addMessage(sessionId: string, message: Message): void {
    const session = this.getSession(sessionId);
    session.messages.push(message);
    session.updatedAt = new Date();
  }

  getRecentMessages(sessionId: string, count: number = 2): Message[] {
    const session = this.getSession(sessionId);
    return session.messages.slice(-count);
  }

  getAllMessages(sessionId: string): Message[] {
    const session = this.getSession(sessionId);
    return [...session.messages];
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  getSessionCount(): number {
    return this.sessions.size;
  }
} 