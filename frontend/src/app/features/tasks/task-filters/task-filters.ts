import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import {
  PRIORITY_LABEL,
  TASK_PRIORITIES,
  TaskPriority,
} from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-task-filters',
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-filters.html',
})
export class TaskFiltersComponent {
  private readonly taskService = inject(TaskService);

  readonly refresh = output<void>();

  protected readonly search = this.taskService.search;
  protected readonly priorityFilter = this.taskService.priorityFilter;
  protected readonly hasActiveFilters = this.taskService.hasActiveFilters;
  protected readonly loading = this.taskService.loading;
  protected readonly priorities = TASK_PRIORITIES;
  protected readonly priorityLabel = PRIORITY_LABEL;

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.taskService.setSearch(value);
  }

  protected clearSearch(): void {
    this.taskService.setSearch('');
  }

  protected setPriority(p: TaskPriority | null): void {
    this.taskService.setPriorityFilter(p);
  }

  protected clearAll(): void {
    this.taskService.clearFilters();
  }
}
