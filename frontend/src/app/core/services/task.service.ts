import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Task,
  TaskListResponse,
  TaskPayload,
  TaskResponse,
  TaskStatus,
} from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tasks`;

  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(false);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly counts = computed(() => {
    const t = this._tasks();
    return {
      total: t.length,
      todo: t.filter((x) => x.status === 'todo').length,
      'in-progress': t.filter((x) => x.status === 'in-progress').length,
      completed: t.filter((x) => x.status === 'completed').length,
    };
  });

  fetchAll(): Observable<TaskListResponse> {
    this._loading.set(true);
    return this.http.get<TaskListResponse>(this.base).pipe(
      tap({
        next: (res) => {
          this._tasks.set(res.tasks);
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      }),
    );
  }

  create(payload: TaskPayload): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.base, payload).pipe(
      tap((res) => this._tasks.update((list) => [res.task, ...list])),
    );
  }

  update(id: string, payload: Partial<TaskPayload>): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.base}/${id}`, payload).pipe(
      tap((res) =>
        this._tasks.update((list) => list.map((t) => (t._id === id ? res.task : t))),
      ),
    );
  }

  updateStatus(id: string, status: TaskStatus): Observable<TaskResponse> {
    return this.update(id, { status });
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`).pipe(
      tap(() => this._tasks.update((list) => list.filter((t) => t._id !== id))),
    );
  }

  clear(): void {
    this._tasks.set([]);
  }
}
