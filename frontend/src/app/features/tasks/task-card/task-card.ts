import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  TASK_STATUSES,
  Task,
  TaskStatus,
} from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-card.html',
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly isAdmin = input(false);

  readonly statusChange = output<TaskStatus>();
  readonly view = output<void>();

  protected readonly menuOpen = signal(false);
  protected readonly statuses = TASK_STATUSES;
  protected readonly statusLabel = STATUS_LABEL;
  protected readonly priorityLabel = PRIORITY_LABEL;

  protected readonly dueState = computed(() => {
    const due = this.task().dueDate;
    if (!due) return null;
    const d = new Date(due);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(d);
    dueDay.setHours(0, 0, 0, 0);
    const diff = Math.floor((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (this.task().status === 'completed') return 'done';
    if (diff < 0) return 'overdue';
    if (diff <= 2) return 'soon';
    return 'normal';
  });

  protected readonly ownerInitial = computed(() => {
    const uid = this.task().userId;
    if (typeof uid === 'string') return uid.slice(-2).toUpperCase();
    return '??';
  });

  protected openCard(): void {
    if (this.menuOpen()) return;
    this.view.emit();
  }

  protected toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected changeStatus(status: TaskStatus, event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    if (status !== this.task().status) {
      this.statusChange.emit(status);
    }
  }
}
