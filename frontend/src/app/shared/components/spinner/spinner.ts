import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="animate-spin"
      [class.w-3]="size() === 'xs'"
      [class.h-3]="size() === 'xs'"
      [class.w-4]="size() === 'sm'"
      [class.h-4]="size() === 'sm'"
      [class.w-5]="size() === 'md'"
      [class.h-5]="size() === 'md'"
      [class.w-8]="size() === 'lg'"
      [class.h-8]="size() === 'lg'"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"></path>
    </svg>
  `,
})
export class SpinnerComponent {
  readonly size = input<SpinnerSize>('sm');
}
