/** Admin page TypeScript types — mirrors backend schemas/api/admin.py */

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  image: string | null;
  provider: string;
  role: string;
  bio: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface AdminUserRoleRequest {
  role: "user" | "admin";
}

export type AdminTab = "users";
