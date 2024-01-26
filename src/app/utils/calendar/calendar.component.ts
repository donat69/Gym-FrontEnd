import { Component, ElementRef, Renderer2, ChangeDetectorRef, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Event } from 'src/app/models/event.model';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  loading: boolean | undefined;
  calendarVisible = true;
  isMobile: boolean; // Nueva propiedad para detectar dispositivos móviles
  calendarOptions: CalendarOptions;
  results: any;
  events: any;
  form: any;
  event: any = {};
  dropdownOptions = [
    { label: 'ANYBODY', value: 'ANYBODY' },
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'STAFF', value: 'STAFF' },
    { label: 'MEMBER', value: 'MEMBER' },
  ]

  dialogVisible = false;
  dialogFormVisible = false;
  dialogIsEditable: boolean | undefined;


  constructor(private changeDetector: ChangeDetectorRef,
    public auth: AuthService,
    private translocoService: TranslocoService,
    private api: ApiService, private crud: CrudService,
    private fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    private el: ElementRef,
    private renderer: Renderer2
    ) {
    this.isMobile = window.innerWidth <= 768; // Puedes ajustar el valor según tus necesidades

    // this.calendarButtons = this.getButtonTranslation();
    // console.log(this.calendarButtons);
    this.calendarOptions = {
      locale: 'es',
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        center: 'title',
        start: 'prev,next today',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      initialView: 'dayGridMonth',
      // buttonText: this.calendarButtons,
      // events:
      // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
      weekends: true,
      editable: false,
      droppable: false,
      selectable: false,
      selectMirror: true,
      dayMaxEvents: true,
      // select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      // eventsSet: this.handleEvents.bind(this)
      /* you can update a remote database when these fire:
      eventAdd:
      eventChange:
      eventRemove:
      */
    };
    this.getEvents();
  }

  currentEvents: EventApi[] = [];

  ngOnInit() {
    // Detectar cambios en el tamaño de la ventana para actualizar isMobile
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768; // Actualiza el valor cuando cambie el tamaño de la ventana
    });

    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      color: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  // Método que muestra los eventos en fullcalendar con la ruta events
  getEvents() {
    this.loading = true;

    this.crud.getList('events').subscribe((response: any) => {
      this.events = response;
      const calendarApi = this.calendarComponent.getApi();

      calendarApi.removeAllEventSources();
      // Agrega los eventos al calendario
      calendarApi.addEventSource(this.events);

      // Refresca los eventos en el calendario
      calendarApi.refetchEvents();

      this.loading = false;
    });
  }

  // Methods for open and close dynamic dialog
  showDialogForm() {
    this.form.reset();
    this.dialogFormVisible = true;
  }

  showDialog() {
    this.dialogVisible = true;
  }

  closeDialog() {
    this.event = {};
    this.dialogFormVisible = false;
    this.dialogVisible = false;
    this.form.reset();
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.loading = true;

    this.crud.getList(`crud/events/${clickInfo.event.id}`).subscribe((response: any) => {
      this.event = {
        id: response.id,
        title: response.title,
        color: response.color,
        start: new Date(response.start),
        end: new Date(response.end),
        role: response.role,
        createdBy: response.createdBy,
        tenantId: response.tenantId
      };

      if (this.auth.user.role == "ADMIN") {
        this.showDialogForm();
        this.form.patchValue(this.event);
      } else if (this.event.createdBy == this.auth.user.id) {
        this.showDialogForm();
        this.form.patchValue(this.event);
      } else {
        this.showDialog();
      }
    });
    this.loading = false;
  }

  submit() {
    if (!this.form.get('id').valid)
      this.form.get('id').setValue(0);
    if (!this.form.get('role').valid && this.auth.user.role == "SUPERADMIN")
      this.form.get('role').setValue('SUPERADMIN');
    if (this.form.dirty && this.form.valid) {
      if (this.event.id != null && this.event.id != 0) {
        this.update();
      } else {
        this.save();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  save() {
    this.loading = true;

    const eventData = {
      ...this.form.value,
      createdBy: this.auth.user.id,
      tenantId: this.auth.user.tenantId
    };

    this.crud.save('crud/events', eventData).subscribe(() => {
      this.fun.presentAlert("Saved");
      this.getEvents();
      this.closeDialog();
      this.loading = false;
    });
  }

  update() {
    this.loading = true;

    this.crud.update(`events/${this.event.id}`, this.form.value).subscribe(() => {
      this.fun.presentAlert("Updated");
      this.getEvents();
      this.closeDialog();
      this.loading = false;
    });
  }

  delete(item: any) {
    this.crud.confirmDelete(item, 'events');
    this.getEvents();
    this.closeDialog();
  }
}
