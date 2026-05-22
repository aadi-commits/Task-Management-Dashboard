import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card';

@Component({
  selector: 'app-skeleton-column',
  imports: [SkeletonCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="flex flex-col bg-slate-100/70 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60"
    >
      <header class="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse"></div>
          <div class="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          <div class="h-4 w-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
      </header>
      <div class="flex-1 p-2.5 space-y-2 min-h-[200px]">
        @for (i of placeholders; track i) {
          <app-skeleton-card />
        }
      </div>
    </section>
  `,
})
export class SkeletonColumnComponent {
  protected readonly placeholders = [0, 1, 2];
}
