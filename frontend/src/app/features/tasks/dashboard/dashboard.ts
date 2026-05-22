import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskPayload, TaskStatus } from '../../../core/models/task.model';
import { AppShellComponent } from '../../../shared/components/app-shell/app-shell';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TaskColumnComponent } from '../task-column/task-column';
import { TaskDetailComponent } from '../task-detail/task-detail';
import { TaskFormComponent } from '../task-form/task-form';

@Component({
  selector: 'app-dashboard',
  imports: [
    AppShellComponent,
    TaskColumnComponent,
    TaskDetailComponent,
    TaskFormComponent,
    ConfirmDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  protected readonly isAdmin = this.auth.isAdmin;
  protected readonly loading = this.taskService.loading;
  protected readonly tasks = this.taskService.tasks;
  protected readonly counts = this.taskService.counts;

  protected readonly selectedTask = signal<Task | null>(null);
  protected readonly formOpen = signal(false);
  protected readonly formTask = signal<Task | null>(null);
  protected readonly formBusy = signal(false);
  protected readonly taskPendingDelete = signal<Task | null>(null);
  protected readonly deleteBusy = signal(false);

  protected readonly todoTasks = computed(() => this.byStatus('todo'));
  protected readonly inProgressTasks = computed(() => this.byStatus('in-progress'));
  protected readonly completedTasks = computed(() => this.byStatus('completed'));

  ngOnInit(): void {
    this.taskService.fetchAll().subscribe({
      error: (err) => this.toastr.error(err.message || 'Failed to load tasks'),
    });
  }

  protected onStatusChange(event: { taskId: string; status: TaskStatus }): void {
    this.taskService.updateStatus(event.taskId, event.status).subscribe({
      next: (res) => {
        this.toastr.success(`Moved to ${event.status.replace('-', ' ')}`);
        if (this.selectedTask()?._id === event.taskId) {
          this.selectedTask.set(res.task);
        }
      },
      error: (err) => this.toastr.error(err.message || 'Could not update status'),
    });
  }

  protected openTask(task: Task): void {
    this.selectedTask.set(task);
  }

  protected closeTask(): void {
    this.selectedTask.set(null);
  }

  protected openCreate(): void {
    this.formTask.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(task: Task): void {
    this.selectedTask.set(null);
    this.formTask.set(task);
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    if (this.formBusy()) return;
    this.formOpen.set(false);
  }

  protected onSave(payload: TaskPayload): void {
    const editing = this.formTask();
    this.formBusy.set(true);
    const obs = editing
      ? this.taskService.update(editing._id, payload)
      : this.taskService.create(payload);
    obs.pipe(finalize(() => this.formBusy.set(false))).subscribe({
      next: () => {
        this.toastr.success(editing ? 'Task updated' : 'Task created');
        this.formOpen.set(false);
      },
      error: (err) =>
        this.toastr.error(err.message || (editing ? 'Could not save changes' : 'Could not create task')),
    });
  }

  protected requestDelete(task: Task): void {
    this.selectedTask.set(null);
    this.taskPendingDelete.set(task);
  }

  protected cancelDelete(): void {
    if (this.deleteBusy()) return;
    this.taskPendingDelete.set(null);
  }

  protected confirmDelete(): void {
    const task = this.taskPendingDelete();
    if (!task) return;
    this.deleteBusy.set(true);
    this.taskService
      .remove(task._id)
      .pipe(finalize(() => this.deleteBusy.set(false)))
      .subscribe({
        next: () => {
          this.toastr.success('Task deleted');
          this.taskPendingDelete.set(null);
        },
        error: (err) => this.toastr.error(err.message || 'Could not delete task'),
      });
  }

  private byStatus(status: TaskStatus): Task[] {
    return this.tasks().filter((t) => t.status === status);
  }
}
