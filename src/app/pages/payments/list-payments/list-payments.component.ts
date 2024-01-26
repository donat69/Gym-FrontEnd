import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { InteractDatabaseService } from 'src/app/services/interact-database.service';
import { Payment } from 'src/app/models/payment.model';

@Component({
  selector: 'app-list-payments',
  templateUrl: './list-payments.component.html',
  styleUrls: ['./list-payments.component.css']
})
export class ListPaymentsComponent implements OnInit, OnDestroy {
  @ViewChild('ticket', { static: false })

  ticket!: ElementRef;
  private deleteSubscription: Subscription | undefined;

  loading: boolean | undefined;
  results: any;

  payments: Payment[] = [];

  cols: any[] = [];
  exportColumns: any[] = [];

  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public interact: InteractDatabaseService,
    public crud: CrudService
  ) {}

  ngOnInit() {
    this.getList();
    this.subscribeToDeleteEvent();

    this.cols = [
      { field: "id", header: "#" },
      { field: "memberName", header: "Member" },
      { field: "membershipName", header: "Membership" },
      { field: "amount", header: "Amount" },
      { field: "paymentMethod", header: "Payment Method" },
      { field: "startDate", header: "Start" },
      { field: "endDate", header: "End" },
      { field: "gymName", header: "Gym" },
      { field: "isActive", header: "Active" },
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  ngOnDestroy() {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  getList() {
    this.loading = true;

    this.crud.getList('payments').subscribe((response: any) => {
      this.results = response;
      
      this.results.forEach((result: any) => {
        result.startDate = this.fun.transformDateTime(result.startDate);
        result.endDate = this.fun.transformDateTime(result.endDate);
      });

      this.loading = false;
    });
  }
  
  confirmDelete(item: any) {
    this.crud.confirmDelete(item, 'payments');
  }
  
  delete(item: any) {
    this.crud.delete(item, 'payments');
  }

  subscribeToDeleteEvent() {
    this.deleteSubscription = this.crud.getDeleteObservable().subscribe(() => {
      this.getList();
    });
  }

  getPayment(member: any) {
    const button = document.getElementById('exampleModalToggle');
    if (button) {
      button.click();
      this.getPaymentTicket(member);
    }
  }

  getPaymentTicket(member: any) {
    this.crud.getList(`payments/${member.id}`).subscribe((response: any) => {
      this.payments = [{
        amount: response.amount,
        memberName: response.memberName,
        membershipName: response.membershipName,
        gymName: response.gymName,
        gymAddress: response.gymAddress,
        gymEmail: response.gymEmail,
        gymPhone: response.gymPhone,
        paymentMethod: response.paymentMethod,
        createdAt: this.fun.transformDateTime(response.createdAt)
      }];
    });
  }
  
  printTicket() {
    const content = this.ticket.nativeElement.innerHTML;
    const windowPrint = window.open('', '_blank');
    
    if (windowPrint) {
      windowPrint.document.write('<html><head><title>Payment Ticket</title></head><body>');
      windowPrint.document.write(content);
      windowPrint.document.write('</body></html>');
      windowPrint.document.close();
      windowPrint.print();
    } else {
      console.error('Error has occurred while printing the ticket.');
    }
  }

}
