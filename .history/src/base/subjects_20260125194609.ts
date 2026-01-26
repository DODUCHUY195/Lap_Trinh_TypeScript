import { http } from "./http";
import type { Subject } from "../types/Subject";

export type SubjectQuery = {
  q?: string;
  teacher?: string;
  page?: number;
  limit?: number;
};

export type SubjectPayload = Omit<Subject, "id">;

export async function getTeachers(): Promise<string[]> {
  const res = await http.get<string[]>("/teachers");
  return res.data;
}

export async function listSubjects(
  query: SubjectQuery
): Promise<{ items: Subject[]; total: number }> {
  const params = new URLSearchParams();
  if (query.q) params.set("q", String(query.q));
  if (query.teacher) params.set("teacher", String(query.teacher));
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const res = await http.get<Subject[]>(`/subjects?${params.toString()}`);
  const total = Number(res.headers["x-total-count"] || "0");
  return { items: res.data, total };
}

export async function getSubject(id: number): Promise<Subject> {
  const res = await http.get<Subject>(`/subjects/${id}`);
  return res.data;
}

export async function createSubject(payload: SubjectPayload): Promise<Subject> {
  const res = await http.post<Subject>("/subjects", payload);
  return res.data;
}

export async function updateSubject(
  id: number,
  payload: SubjectPayload
): Promise<Subject> {
  const res = await http.put<Subject>(`/subjects/${id}`, payload);
  return res.data;
}

export async function deleteSubject(id: number): Promise<void> {
  await http.delete(`/subjects/${id}`);
}
