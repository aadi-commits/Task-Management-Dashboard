import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  protected readonly submitting = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly year = new Date().getFullYear();
  protected readonly features = [
    'Plan tasks across Todo, In Progress and Completed',
    'Filter and search across everything you own',
    'Role-based access for admins and members',
  ];

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected get email() {
    return this.form.controls.email;
  }
  protected get password() {
    return this.form.controls.password;
  }

  protected hasError(c: AbstractControl, err: string): boolean {
    return c.touched && c.hasError(err);
  }

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected fillDemo(role: 'admin' | 'user'): void {
    const demo =
      role === 'admin'
        ? { email: 'admin@tmd.dev', password: 'admin@123' }
        : { email: 'user@tmd.dev', password: 'user@123' };
    this.form.setValue(demo);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(`Welcome back, ${res.user.name}!`);
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          this.toastr.error(err.message || 'Login failed');
        },
      });
  }
}
