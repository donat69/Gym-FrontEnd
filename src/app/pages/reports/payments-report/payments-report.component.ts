import { Component, OnChanges, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./payments-report.component.css']
})
export class PaymentsReportComponent implements OnInit, OnChanges{
  form: any;
  loading: boolean | undefined;
  results: any;
  
  // Toggles the form and report
  showForm: boolean = true;
  showReport: boolean = false;

  // Date range for the description of the report
  startDate: Date = new Date();
  endDate: Date = new Date();

  // Knob
  total: number = 0;
  percentage: number = 0;
  members: any[] = [];

  // Table Columns and Export Data
  cols: any[] = [];
  exportColumns: any[] = [];

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private crud: CrudService
  ) {
    this.api.get(`crud/members`).subscribe((data: any) => {
      this.members = Object.keys(data).map(key => data[key]);
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges() {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.form.get('endDate').setValue(this.fun.transformDate(new Date(), 'yyyy-MM-dd'));

    this.cols = [
      { field: "id", header: "#" },
      { field: "memberName", header: "Miembro" },
      { field: "membershipName", header: "Membresía" },
      { field: "amount", header: "Cantidad" },
      { field: "createdAt", header: "Fecha de pago" },
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  toggleContent() {
    this.showForm = !this.showForm;
    this.showReport = !this.showReport;
  }

  submit() {
    this.loading = true;

    this.startDate = this.form.value.startDate;
    this.endDate = this.form.value.endDate;

    if (this.form.dirty && this.form.valid) {
      const startDate = moment(this.form.value.startDate, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss[Z]');
      const endDate = moment(this.form.value.endDate, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss[Z]');
      
      const reportData = {
        startDate: startDate,
        endDate: endDate,
        table: 'payments',
        tenantId: this.auth.user.tenantId
      };

      this.crud.save('reports', reportData).subscribe((response: any) => {
        this.results = response.report;

        this.fun.presentAlert(response.message);

        this.results.forEach((result: any) => {
          result.createdAt = this.fun.transformDate(result.createdAt);
        });

        this.total = this.results.reduce((sum: any, current: any) => sum + current.amount, 0); // Set the total amount
        this.percentage = (this.total / this.members.length) * 100;

        this.loading = false;
        this.showForm = false;
        this.showReport = true;
      });
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  exportPdf() {
    const doc = new jsPDF('p', 'px', 'a4');
    const headers = this.exportColumns.map(column => column.title);
    const data = this.results.map((result: any) =>
      this.exportColumns.map(column => result[column.dataKey])
    );
  
    (doc as any).autoTable({
      head: [headers],
      body: data
    });
  
    doc.save('payments.pdf');
  }

}
