import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg animate-pulse"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 space-y-1.5">
          <div class="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div class="h-3.5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div class="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div class="mt-4 flex items-center gap-1.5">
        <div class="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div class="h-4 w-14 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
  `,
})
export class SkeletonCardComponent {}
