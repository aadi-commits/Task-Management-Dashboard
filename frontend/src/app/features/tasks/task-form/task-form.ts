import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  TASK_PRIORITIES,
  TASK_STATUSES,
  Task,
  TaskPayload,
  TaskPriority,
  TaskStatus,
} from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-form.html',
})
export class TaskFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly task = input<Task | null>(null);
  readonly busy = input(false);

  readonly save = output<TaskPayload>();
  readonly close = output<void>();

  protected readonly priorities = TASK_PRIORITIES;
  protected readonly statuses = TASK_STATUSES;
  protected readonly priorityLabel = PRIORITY_LABEL;
  protected readonly statusLabel = STATUS_LABEL;

  protected readonly isEdit = computed(() => this.task() !== null);
  protected readonly heading = computed(() => (this.isEdit() ? 'Edit task' : 'New task'));

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(2000)]],
    priority: ['medium' as TaskPriority, [Validators.required]],
    status: ['todo' as TaskStatus, [Validators.required]],
    dueDate: [''],
  });

  constructor() {
    effect(() => {
      const t = this.task();
      this.form.reset({
        title: t?.title ?? '',
        description: t?.description ?? '',
        priority: t?.priority ?? 'medium',
        status: t?.status ?? 'todo',
        dueDate: t?.dueDate ? this.toInputDate(t.dueDate) : '',
      });
    });
  }

  protected get title() {
    return this.form.controls.title;
  }
  protected get description() {
    return this.form.controls.description;
  }

  protected hasError(c: AbstractControl, err: string): boolean {
    return c.touched && c.hasError(err);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (!this.busy()) this.close.emit();
  }

  protected onBackdropClick(): void {
    if (!this.busy()) this.close.emit();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: TaskPayload = {
      title: raw.title.trim(),
      description: raw.description.trim() || undefined,
      priority: raw.priority,
      status: raw.status,
      dueDate: raw.dueDate ? new Date(raw.dueDate).toISOString() : null,
    };
    this.save.emit(payload);
  }

  private toInputDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
