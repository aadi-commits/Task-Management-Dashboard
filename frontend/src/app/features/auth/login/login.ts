import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <p class="text-slate-500 dark:text-slate-400">Login page coming next…</p>
    </div>
  `,
})
export class LoginComponent {}
