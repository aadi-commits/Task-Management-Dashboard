import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppShellComponent } from '../../../shared/components/app-shell/app-shell';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [AppShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);
  protected readonly isAdmin = this.auth.isAdmin;
}
