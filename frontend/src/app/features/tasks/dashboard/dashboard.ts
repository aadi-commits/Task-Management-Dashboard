import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { AppShellComponent } from '../../../shared/components/app-shell/app-shell';
import { TaskColumnComponent } from '../task-column/task-column';
import { TaskDetailComponent } from '../task-detail/task-detail';

@Component({
  selector: 'app-dashboard',
  imports: [AppShellComponent, TaskColumnComponent, TaskDetailComponent],
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

  protected readonly columns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: 'To Do' },
    { status: 'in-progress', label: 'In Progress' },
    { status: 'completed', label: 'Completed' },
  ];

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

  private byStatus(status: TaskStatus): Task[] {
    return this.tasks().filter((t) => t.status === status);
  }
}
