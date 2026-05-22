import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-50 dark:bg-slate-950">
      <p class="text-slate-500 dark:text-slate-400">Dashboard coming next…</p>
      @if (user(); as u) {
        <p class="text-xs text-slate-400">Logged in as {{ u.name }} ({{ u.role }})</p>
      }
      <button
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        (click)="auth.logout()"
      >
        Logout
      </button>
    </div>
  `,
})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);
  protected readonly user = this.auth.currentUser;
}
