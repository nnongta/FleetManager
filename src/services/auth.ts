export type User = {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "user" | "approver";
  avatar?: string;
};

const STORAGE_KEY = "currentUser";

export const authService = {
  login(email: string, password: string): User | null {
    const mockUsers: User[] = [
      { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
      { id: 2, name: "Bob", email: "bob@example.com", role: "approver" },
    ];

    const user = mockUsers.find(u => u.email === email);
    if (user && password === "Passw0rd") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  },
};
