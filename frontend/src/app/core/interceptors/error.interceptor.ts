import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = err.error?.message || err.message || 'Something went wrong';

      if (err.status === 401 && auth.isAuthenticated()) {
        toastr.error('Session expired. Please log in again.');
        auth.logout();
      } else if (err.status >= 500) {
        toastr.error('Server error. Please try again later.');
      }

      return throwError(() => ({ ...err, message }));
    }),
  );
};
