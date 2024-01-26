import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.css'],
})
export class RealTimeComponent implements OnInit {
  @ViewChild('memberKey') input!: ElementRef | undefined;
  formattedTime: string = '';
  member: any = {};
  gym: any = {};
  key: any;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public fun: FunctionsService,
    public crud: CrudService,
    private msgs: MessageService
  ) {
  }

  async ngOnInit() {
    this.updateTime();
    this.crud.getList(`gyms/gym/${this.auth.user.tenantId}`).subscribe((response: any) => {
      this.gym = response;
    });
  }

  onInputChange(event: any) {
    this.key = event?.target.value;

    if (this.key.length === 10){
      this.getMember(this.key);
    }
  }

  updateTime() {
    const timeFormatter: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    this.formattedTime = new Date().toLocaleTimeString('en-US', timeFormatter);

    setInterval(() => {
      const currentTime = new Date();
      this.formattedTime = currentTime.toLocaleTimeString(
        'en-US',
        timeFormatter
      );
    }, 1000);
  }

  getFormattedDateTime(): { date: string; time: string } {
    const date = new Date();

    const dateFormatter: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-US', dateFormatter);

    return { date: formattedDate, time: this.formattedTime };
  }

  getMember(key: any) {
    this.crud.getList(`members/member/${key}`).subscribe((response: any) => {
      this.member = response;
      if (this.member) {
        if (this.input)
          this.input.nativeElement.disabled = true;

        this.showAlert(this.member);
        this.saveVisit();
        this.clearMember();
      }
    });

    this.key = "";
  }

  showAlert(member: any) {
    const endDate = moment(member.endDate);
    const startDate = moment();
    const daysRemaining = endDate.diff(startDate, 'days');

    if (daysRemaining > 7){
      this.fun.presentMessage('success', `Days remaining for the membership: ${daysRemaining}`);
    } else if (daysRemaining <= 7 && daysRemaining > 0) {
      this.fun.presentMessage('warn', `Days remaining for the membership: ${daysRemaining}`);
    } else {
      this.fun.presentMessage('error', `You need pay your membership`);
    }
  }

  saveVisit() {
    if (this.member) {
      const visitData = {
        memberId: this.member.id,
        tenantId: this.auth.user.tenantId,
        visitDate: new Date(),
      };

      this.crud.save('visits/visits', visitData).subscribe(() => {
        this.fun.presentAlert("Saved");
      });
    } else {
      this.fun.presentAlert("Error");
    }
  }

  clearMember() {
    setTimeout(() => {
      this.member = {};
      if (this.input) {
        this.input.nativeElement.disabled = false;
        this.input.nativeElement.focus();
      }
    }, 5000);
  }

}
