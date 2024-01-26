// Components
import { AppComponent } from './app.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { PasswordComponent } from './pages/password/password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FooterComponent } from './pages/layout/footer/footer.component';
import { LeftmenuComponent } from './pages/layout/leftmenu/leftmenu.component';
import { EmailsComponent } from './pages/emails/emails.component';
import { FilesComponent } from './pages/files/files.component';
import { NewUserComponent } from './pages/users/new-user/new-user.component';
import { ListUsersComponent } from './pages/users/list-users/list-users.component';
import { ListMembershipsComponent } from './pages/memberships/list-memberships/list-memberships.component';
import { NewMembershipComponent } from './pages/memberships/new-membership/new-membership.component';
import { ListOwnersComponent } from './pages/owners/list-owners/list-owners.component';
import { NewOwnerComponent } from './pages/owners/new-owner/new-owner.component';
import { ListGymsComponent } from './pages/gyms/list-gyms/list-gyms.component';
import { NewGymComponent } from './pages/gyms/new-gym/new-gym.component';
import { ListMembersComponent } from './pages/members/list-members/list-members.component';
import { NewMemberComponent } from './pages/members/new-member/new-member.component';
import { ListPaymentsComponent } from './pages/payments/list-payments/list-payments.component';
import { NewPaymentComponent } from './pages/payments/new-payment/new-payment.component';
import { NavComponent } from './pages/layout/nav/nav.component';
import { ListVisitsComponent } from './pages/visits/list-visits/list-visits.component';
import { NewVisitComponent } from './pages/visits/new-visit/new-visit.component';
import { ListLicencesComponent } from './pages/licences/list-licences/list-licences.component';
import { NewLicenceComponent } from './pages/licences/new-licence/new-licence.component';
import { ListTypeLicencesComponent } from './pages/licences/type/list-type-licences/list-type-licences.component';
import { NewTypeLicenceComponent } from './pages/licences/type/new-type-licence/new-type-licence.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CalculatorComponent } from './utils/calculator/calculator.component';
import { ExpiredMembersComponent } from './pages/expired-members/expired-members.component';
import { LicenceKeyModalComponent } from './utils/licence-key-modal/licence-key-modal.component';
import { ExpiredLicencesComponent } from './pages/licences/expired-licences/expired-licences.component';
import { CalendarComponent } from './utils/calendar/calendar.component';
import { MembersReportComponent } from './pages/reports/members-report/members-report.component';
import { PaymentsReportComponent } from './pages/reports/payments-report/payments-report.component';
import { RealTimeComponent } from './pages/real-time/real-time.component';
import { ListCategoriesComponent } from './pages/store/categories/list-categories/list-categories.component';
import { NewCategoryComponent } from './pages/store/categories/new-category/new-category.component';
import { ListSubcategoriesComponent } from './pages/store/subcategories/list-subcategories/list-subcategories.component';
import { NewSubcategoryComponent } from './pages/store/subcategories/new-subcategory/new-subcategory.component';
import { ListProductsComponent } from './pages/store/products/list-products/list-products.component';
import { NewProductComponent } from './pages/store/products/new-product/new-product.component';
import { ListSalesComponent } from './pages/store/sales/list-sales/list-sales.component';
import { NewSaleComponent } from './pages/store/sales/new-sale/new-sale.component';
import { PosComponent } from './pages/store/pos/pos.component';
import { DynamicDialogComponent } from './utils/dynamic-dialog/dynamic-dialog.component';

// Modules
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { QRCodeModule } from 'angularx-qrcode';
import { WebcamModule } from 'ngx-webcam';
import { TranslocoRootModule } from './transloco-root.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';

// PrimeNG modules
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DockModule } from 'primeng/dock';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpeedDialModule } from 'primeng/speeddial';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { AnimateModule } from 'primeng/animate';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Pipes
import { DatePipe } from '@angular/common';
import { TruncatePipe, TruncateProductPipe } from './pipes/truncate.pipe';
import { ConfirmationService } from 'primeng/api';
import { LoadingService } from './services/loading.service';
import { HttpLoadingInterceptor } from './services/http-interceptor.service';

@NgModule({
  declarations: [
    TruncatePipe,
    TruncateProductPipe,
    AppComponent,
    DashboardComponent,
    NotfoundComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    PasswordComponent,
    ProfileComponent,
    FooterComponent,
    LeftmenuComponent,
    EmailsComponent,
    FilesComponent,
    NewUserComponent,
    ListUsersComponent,
    ListMembershipsComponent,
    NewMembershipComponent,
    ListOwnersComponent,
    NewOwnerComponent,
    ListGymsComponent,
    NewGymComponent,
    ListMembersComponent,
    NewMemberComponent,
    ListPaymentsComponent,
    NewPaymentComponent,
    NavComponent,
    ListVisitsComponent,
    NewVisitComponent,
    ListLicencesComponent,
    NewLicenceComponent,
    ListTypeLicencesComponent,
    NewTypeLicenceComponent,
    SettingsComponent,
    CalculatorComponent,
    ExpiredMembersComponent,
    LicenceKeyModalComponent,
    ExpiredLicencesComponent,
    CalendarComponent,
    MembersReportComponent,
    PaymentsReportComponent,
    RealTimeComponent,
    ListCategoriesComponent,
    NewCategoryComponent,
    ListSubcategoriesComponent,
    NewSubcategoryComponent,
    ListProductsComponent,
    NewProductComponent,
    ListSalesComponent,
    NewSaleComponent,
    PosComponent,
    DynamicDialogComponent
  ],
  imports: [
    AvatarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BadgeModule,
    BreadcrumbModule,
    BlockUIModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    CascadeSelectModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    ChipModule,
    ColorPickerModule,
    ConfirmDialogModule,
    ContextMenuModule,
    VirtualScrollerModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DockModule,
    DropdownModule,
    DynamicDialogModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    ImageModule,
    KnobModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    SelectButtonModule,
    SidebarModule,
    ScrollerModule,
    ScrollPanelModule,
    ScrollTopModule,
    SkeletonModule,
    SlideMenuModule,
    SliderModule,
    SpeedDialModule,
    SpinnerModule,
    SplitterModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TagModule,
    TerminalModule,
    TieredMenuModule,
    TimelineModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TriStateCheckboxModule,
    TreeModule,
    TreeSelectModule,
    TreeTableModule,
    AnimateModule,
    CardModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    QRCodeModule,
    WebcamModule,
    FullCalendarModule,
    TranslocoRootModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center'
    }),
    TranslocoRootModule,
    GoogleTagManagerModule.forRoot({
      id: '' // ID de Google Tag Manager
    })
  ],
  providers: [
    DatePipe,
    DialogService,
    ConfirmationService,
    MessageService,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
