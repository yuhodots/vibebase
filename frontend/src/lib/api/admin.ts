/** Admin API client functions — calls backend /api/v1/admin/* endpoints. */

import type {
  AdminDashboardStats,
  AdminUser,
  AdminUserRoleRequest,
  PaginatedResponse,
} from "@/types/admin";
import { apiClient } from "./client";

const PREFIX = "/api/v1/admin";

// -- Dashboard --

export function fetchDashboardStats(token: string) {
  return apiClient.get<AdminDashboardStats>(`${PREFIX}/stats`, { token });
}

// -- Users --

interface UserListParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export function fetchUsers(params: UserListParams, token: string) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.role) qs.set("role", params.role);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiClient.get<PaginatedResponse<AdminUser>>(
    `${PREFIX}/users${query ? `?${query}` : ""}`,
    { token },
  );
}

export function updateUserRole(
  userId: number,
  data: AdminUserRoleRequest,
  token: string,
) {
  return apiClient.put<AdminUser>(
    `${PREFIX}/users/${userId}/role`,
    data,
    { token },
  );
}

export function deleteUser(userId: number, token: string) {
  return apiClient.delete<{ success: boolean; message: string }>(
    `${PREFIX}/users/${userId}`,
    { token },
  );
}
