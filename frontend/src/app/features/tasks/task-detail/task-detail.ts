import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  Task,
} from '../../../core/models/task.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe, TimeAgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-detail.html',
})
export class TaskDetailComponent {
  readonly task = input.required<Task>();
  readonly isAdmin = input(false);

  readonly close = output<void>();
  readonly edit = output<void>();
  readonly delete = output<void>();

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
    if (this.task().status === 'completed') return { tone: 'done', label: 'Completed on time' };
    if (diff < 0) return { tone: 'overdue', label: `Overdue by ${Math.abs(diff)}d` };
    if (diff === 0) return { tone: 'soon', label: 'Due today' };
    if (diff === 1) return { tone: 'soon', label: 'Due tomorrow' };
    if (diff <= 2) return { tone: 'soon', label: `Due in ${diff}d` };
    return { tone: 'normal', label: `Due in ${diff}d` };
  });

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close.emit();
  }

  protected onBackdropClick(): void {
    this.close.emit();
  }

  protected onCloseClick(): void {
    this.close.emit();
  }
}
