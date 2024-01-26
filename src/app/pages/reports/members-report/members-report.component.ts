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
  selector: 'app-members-report',
  templateUrl: './members-report.component.html',
  styleUrls: ['./members-report.component.css']
})
export class MembersReportComponent implements OnInit, OnChanges {
  form: any;
  loading: boolean | undefined;
  results: any;
  
  // Toggles the form and report
  showForm: boolean = true;
  showReport: boolean = false;

  // Date range for the description of the report
  startDate: Date = new Date();
  endDate: Date = new Date();

  // Knobs
  total: number = 0;
  maleCount: number = 0;
  femaleCount: number = 0;
  otherCount: number = 0;

  // Table Columns and Export Data
  cols: any[] = [];
  exportColumns: any[] = [];

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private crud: CrudService
  ) {}

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
      { field: "name", header: "Member" },
      { field: "createdAt", header: "Created At" },
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
        table: 'members',
        tenantId: this.auth.user.tenantId
      };

      this.crud.save('reports', reportData).subscribe((response: any) => {
        this.results = response.report;

        this.fun.presentAlert(response.message);

        this.maleCount = 0;
        this.femaleCount = 0;
        this.otherCount = 0;

        this.results.forEach((result: any) => {
          result.createdAt = this.fun.transformDate(result.createdAt);

          if (result.gender === 'MALE') {
            this.maleCount++;
          } else if (result.gender === 'FEMALE') {
            this.femaleCount++;
          } else if (result.gender === 'OTHER') {
            this.otherCount++;
          }
        });

        this.total = this.results.length; // Set the total number of records

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
  
    doc.save('members.pdf');
  }

}
