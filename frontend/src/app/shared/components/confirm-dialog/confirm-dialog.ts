import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';

export type ConfirmTone = 'default' | 'danger';

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialogComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input<string>('Confirm');
  readonly cancelLabel = input<string>('Cancel');
  readonly tone = input<ConfirmTone>('default');
  readonly busy = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (!this.busy()) this.cancel.emit();
  }

  protected onBackdropClick(): void {
    if (!this.busy()) this.cancel.emit();
  }
}
