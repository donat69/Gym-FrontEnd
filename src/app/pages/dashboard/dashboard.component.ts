import { Component, OnInit, ViewChild } from '@angular/core';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { __awaiter } from 'tslib';
import { LicenceKeyModalComponent } from 'src/app/utils/licence-key-modal/licence-key-modal.component';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loading: boolean | undefined;
  visits: any[] = [];

  // Variables de gráficas
  data: any;
  dato: any;
  dataSP: any;
  datoSPA: any;
  opcion: any;
  optionSP: any;
  optionsSPA: any;

  // Variables de conteo
  gymCount: number = 0;
  ownerCount: number = 0;
  totalSales: number = 0;
  memberCount: number = 0;
  membersJoinedThisMonth: number = 0;
  monthlyEarnings: number = 0;
  totalSalesByMonth: { [key: number]: number } = {};
  formattedTime: string = '';

  licenceExpirationDate: any;

  // Modal
  displayModal = false;

  @ViewChild(LicenceKeyModalComponent, { static: true })
  licenceKeyModalComponent!: LicenceKeyModalComponent;

  constructor(
    public fun: FunctionsService,
    public auth: AuthService,
    public crud: CrudService,
    private api: ApiService,
  ) {}

  async ngOnInit() {
    this.auth.openDialogEvent.subscribe(() => {
      this.openLicenceKeyDialog();
    });

    this.getDataFromDashboard(); // new
    
    this.updateTime();
  }

  openLicenceKeyDialog() {
    this.licenceKeyModalComponent.openModal();
  }

  updateTime() {
    const timeFormatter: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
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

  getDataFromDashboard() {
    this.api.getWithTenantID('dashboard', this.auth.user.tenantId).subscribe((response: any) => {
      this.gymCount = response.gyms;
      this.ownerCount = response.owners;
      this.totalSales = response.totalLicencesSold;
      this.licenceExpirationDate = response.endDate;
      this.memberCount = response.membersCount;
      this.membersJoinedThisMonth = response.membersJoined;
      this.monthlyEarnings = response.totalPaymentsSoldByMonth;
      this.totalSalesByMonth = response.totalSalesByMonth;

      if (Array.isArray(response.visits)) {
        this.visits = response.visits;

        this.visits.forEach((result: any) => {
          result.visitDate = this.fun.transformDateTime(result.visitDate);
        });

        this.visits.sort((a: any, b: any) => {
          const dateA = new Date(a.visitDate);
          const dateB = new Date(b.visitDate);
          return dateB.getTime() - dateA.getTime() || b.sort - a.sort;
        });
      }

      this.updateChartData();
    });
  }

  closeModal() {
    this.displayModal = false;
  }

  updateChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary2 = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder2 = documentStyle.getPropertyValue('--surface-border');
    
    // Gráfica pastel de ADMIN
    this.data = {
      labels: ['MEMBERS', 'UNIDOS ESTE MES'],
      datasets: [
        {
          data: [this.memberCount, this.membersJoinedThisMonth],
          backgroundColor: [
            documentStyle.getPropertyValue('--red-600'),
            documentStyle.getPropertyValue('--orange-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--red-400'),
            documentStyle.getPropertyValue('--orange-400'),
          ],
        },
      ],
    };

    // Gráfica pastel de SUPERADMIN
    this.datoSPA = {
      labels: ['GYMS', 'OWNERS'],
      datasets: [
        {
          data: [this.gymCount, this.ownerCount],
          backgroundColor: [
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--purple-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--purple-400')
          ],
        },
      ],
    };

    this.optionsSPA = {
      cutout: '50%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };

    const hourCountsMale = Array(24).fill(0);
    const hourCountsFemale = Array(24).fill(0);
    const hourCountsOther = Array(24).fill(0);

    this.visits.forEach((result: any) => {
      const visitDate = moment(result.visitDate, 'MMM DD, YYYY - hh:mm:ss A');
      
      if (visitDate.isValid()) {
        const visitHour = visitDate.hour();
        const gender = result.memberGender ? result.memberGender.trim().toUpperCase() : null;
    
        if (gender == 'MALE') {
          hourCountsMale[visitHour]++;
        } else if (gender == 'FEMALE') {
          hourCountsFemale[visitHour]++;
        } else {
          hourCountsOther[visitHour]++;
        }
      } else {
        console.log('Invalid date format:', result.visitDate);
      }
    });    
    
    this.dato = {
      labels: [
        '12 AM',
        '1 AM',
        '2 AM',
        '3 AM',
        '4 AM',
        '5 AM',
        '6 AM',
        '7 AM',
        '8 AM',
        '9 AM',
        '10 AM',
        '11 AM',
        '12 PM',
        '1 PM',
        '2 PM',
        '3 PM',
        '4 PM',
        '5 PM',
        '6 PM',
        '7 PM',
        '8 PM',
        '9 PM',
        '10 PM',
        '11 PM',
      ],
      datasets: [
        {
          label: 'Men',
          data: hourCountsMale,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
        {
          label: 'Women',
          data: hourCountsFemale,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4,
        },
        {
          label: 'Other',
          data: hourCountsOther,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          tension: 0.4,
        }
      ],
    };

    this.opcion = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary2,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder2,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary2,
          },
          grid: {
            color: surfaceBorder2,
            drawBorder: false,
          },
        },
      },
    };

    // Gráfica de barras de SUPERADMIN
    this.dataSP = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemver', 'December'],
      datasets: [
        {
          label: 'Total Sales this year',
            backgroundColor: documentStyle.getPropertyValue('--green-500'),
            borderColor: documentStyle.getPropertyValue('--green-500'),
            data: Object.values(this.totalSalesByMonth)
        }
      ]
    };
    
    this.optionSP = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
          legend: {
              labels: {
                  color: "textColor"
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary2,
                  font: {
                      weight: 200
                  }
              },
              grid: {
                  color: surfaceBorder2,
                  drawBorder: false
              }
          }
      }
    };
  }

}
