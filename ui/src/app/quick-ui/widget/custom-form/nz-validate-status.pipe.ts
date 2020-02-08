import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'nzValidateStatus'
})
export class NzValidateStatusPipe implements PipeTransform {

  transform(ctrl: AbstractControl, args?: any): string {
    if (ctrl.pending) {
        return 'validating';
    }
    if (ctrl.errors && ctrl.touched) {
        return 'error';
    }
    return null;
  }

}
