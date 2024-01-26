import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { PasswordComponent } from './pages/password/password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EmailsComponent } from './pages/emails/emails.component';
import { ListUsersComponent } from './pages/users/list-users/list-users.component';
import { NewUserComponent } from './pages/users/new-user/new-user.component';
import { ListMembershipsComponent } from './pages/memberships/list-memberships/list-memberships.component';
import { NewMembershipComponent } from './pages/memberships/new-membership/new-membership.component';
import { ListGymsComponent } from './pages/gyms/list-gyms/list-gyms.component';
import { NewGymComponent } from './pages/gyms/new-gym/new-gym.component';
import { ListOwnersComponent } from './pages/owners/list-owners/list-owners.component';
import { NewOwnerComponent } from './pages/owners/new-owner/new-owner.component';
import { ListMembersComponent } from './pages/members/list-members/list-members.component';
import { NewMemberComponent } from './pages/members/new-member/new-member.component';
import { ListPaymentsComponent } from './pages/payments/list-payments/list-payments.component';
import { NewPaymentComponent } from './pages/payments/new-payment/new-payment.component';
import { ListVisitsComponent } from './pages/visits/list-visits/list-visits.component';
import { NewVisitComponent } from './pages/visits/new-visit/new-visit.component';
import { ListLicencesComponent } from './pages/licences/list-licences/list-licences.component';
import { NewLicenceComponent } from './pages/licences/new-licence/new-licence.component';
import { ListTypeLicencesComponent } from './pages/licences/type/list-type-licences/list-type-licences.component';
import { NewTypeLicenceComponent } from './pages/licences/type/new-type-licence/new-type-licence.component';
import { AuthGuard } from './guard/auth.guard';
import { SettingsComponent } from './pages/settings/settings.component';
import { ExpiredMembersComponent } from './pages/expired-members/expired-members.component';
import { ExpiredLicencesComponent } from './pages/licences/expired-licences/expired-licences.component';
import { MembersReportComponent } from './pages/reports/members-report/members-report.component';
import { PaymentsReportComponent } from './pages/reports/payments-report/payments-report.component';
import { RealTimeComponent } from './pages/real-time/real-time.component';
import { ListCategoriesComponent } from './pages/store/categories/list-categories/list-categories.component';
import { NewCategoryComponent } from './pages/store/categories/new-category/new-category.component';
import { ListSubcategoriesComponent } from './pages/store/subcategories/list-subcategories/list-subcategories.component';
import { NewSubcategoryComponent } from './pages/store/subcategories/new-subcategory/new-subcategory.component';
import { ListProductsComponent } from './pages/store/products/list-products/list-products.component';
import { NewProductComponent } from './pages/store/products/new-product/new-product.component';
import { PosComponent } from './pages/store/pos/pos.component';
import { ListSalesComponent } from './pages/store/sales/list-sales/list-sales.component';
import { NewSaleComponent } from './pages/store/sales/new-sale/new-sale.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ForgotPasswordComponent },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF', 'MEMBER'] }
  },
  {
    path: 'password',
    component: PasswordComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF', 'MEMBER'] }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF', 'MEMBER'] }
  },
  {
    path: 'emails',
    component: EmailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  /* {
    path: 'files',
    component: FilesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  }, */
  {
    path: 'users/list',
    component: ListUsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'users/new',
    component: NewUserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'users/new/:id',
    component: NewUserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'memberships/list',
    component: ListMembershipsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'memberships/new',
    component: NewMembershipComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'memberships/new/:id',
    component: NewMembershipComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'gyms/list',
    component: ListGymsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'gyms/new',
    component: NewGymComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'gyms/new/:id',
    component: NewGymComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'owners/list',
    component: ListOwnersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'owners/new',
    component: NewOwnerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'owners/new/:id',
    component: NewOwnerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'members/list',
    component: ListMembersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'members/new',
    component: NewMemberComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'members/new/:id',
    component: NewMemberComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'members/expired',
    component: ExpiredMembersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'payments/list',
    component: ListPaymentsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'payments/new',
    component: NewPaymentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'payments/new/:id',
    component: NewPaymentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'visits/list',
    component: ListVisitsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'visits/new',
    component: NewVisitComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'visits/new/:id',
    component: NewVisitComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'licences/list',
    component: ListLicencesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'licences/new',
    component: NewLicenceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'licences/new/:id',
    component: NewLicenceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'licences/types/list',
    component: ListTypeLicencesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'licences/types/new',
    component: NewTypeLicenceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'licences/types/new/:id',
    component: NewTypeLicenceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'licences/expired',
    component: ExpiredLicencesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN'] }
  },
  {
    path: 'reports/members',
    component: MembersReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'reports/payments',
    component: PaymentsReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },

  {
    path: 'store/categories/list',
    component: ListCategoriesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/categories/new',
    component: NewCategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/categories/new/:id',
    component: NewCategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/subcategories/list',
    component: ListSubcategoriesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/subcategories/new',
    component: NewSubcategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/subcategories/new/:id',
    component: NewSubcategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/products/list',
    component: ListProductsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/products/new',
    component: NewProductComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/products/new/:id',
    component: NewProductComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN', 'STAFF'] }
  },
  {
    path: 'store/sales/list',
    component: ListSalesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'store/sales/new',
    component: NewSaleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'store/sales/new/:id',
    component: NewSaleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] }
  },
  {
    path: 'pos',
    component: PosComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'STAFF'] }
  },
  {
    path: 'realtime',
    component: RealTimeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'STAFF'] }
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }