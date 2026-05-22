import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

type QuickLinkIcon = 'docs' | 'keyboard' | 'github';

interface QuickLink {
  label: string;
  href: string;
  icon: QuickLinkIcon;
}

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.html',
})
export class AppShellComponent {
  protected readonly auth = inject(AuthService);
  protected readonly themeService = inject(ThemeService);

  protected readonly drawerOpen = signal(false);
  protected readonly userMenuOpen = signal(false);

  protected readonly user = this.auth.currentUser;
  protected readonly isAdmin = this.auth.isAdmin;
  protected readonly theme = this.themeService.theme;
  protected readonly initials = computed(() => {
    const name = this.user()?.name ?? '';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  });

  protected readonly quickLinks: QuickLink[] = [
    { label: 'Documentation', href: '#', icon: 'docs' },
    { label: 'Keyboard shortcuts', href: '#', icon: 'keyboard' },
    { label: 'GitHub repo', href: '#', icon: 'github' },
  ];

  protected toggleDrawer(): void {
    this.drawerOpen.update((v) => !v);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  protected closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }

  protected logout(): void {
    this.userMenuOpen.set(false);
    this.auth.logout();
  }
}
