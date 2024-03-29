import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MessageService, Message } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {

  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private msgs: MessageService,
  ) {}

  currentDate() {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss');
  }

  transformDate(date: string | number | Date, sequence = 'MMM dd, yyyy') {
    // MySql format - 'y-MM-dd'
    return this.datePipe.transform(date, sequence);
  }

  transformTime(time: string): string {
    let hours = parseInt(time.substr(0, 2));
    let minutes = time.substr(3, 2);
    let ampm = hours < 12 ? 'AM' : 'PM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  transformDateTime(
    date: string | number | Date,
    sequence = 'MMM dd, yyyy',
    time = 'h:mm:ss a'
  ) {
    return (
      this.datePipe.transform(date, sequence) +
      ' - ' +
      this.datePipe.transform(date, time)
    );
  }

  presentAlert(title: string | undefined, message = 'Success') {
    this.toastr.success(title, message);
  }

  presentAlertError(title: string | undefined, message = 'Error') {
    this.toastr.error(title, message);
  }

  presentMessage(severity: string, detail: string) {
    this.msgs.add({ severity: severity, detail: detail, life: 4990 });
  }

  presentConfirm(fn: (arg0: boolean) => void, title: any, message = '') {
    if (confirm(title)) {
      fn(true);
    } else {
      fn(false);
    }
  }

  remove_object_from_array(array: any[], object: any) {
    return array.splice(array.indexOf(object), 1);
  }

  nameInitial(e: any) {
    return e.substring(0, 1);
  }

}
