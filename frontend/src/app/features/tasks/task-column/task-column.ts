import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { STATUS_LABEL, Task, TaskStatus } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card';

@Component({
  selector: 'app-task-column',
  imports: [TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-column.html',
})
export class TaskColumnComponent {
  readonly status = input.required<TaskStatus>();
  readonly tasks = input.required<Task[]>();
  readonly isAdmin = input(false);

  readonly statusChange = output<{ taskId: string; status: TaskStatus }>();
  readonly view = output<Task>();

  protected readonly statusLabel = STATUS_LABEL;

  protected onStatusChange(taskId: string, status: TaskStatus): void {
    this.statusChange.emit({ taskId, status });
  }

  protected onView(task: Task): void {
    this.view.emit(task);
  }
}
