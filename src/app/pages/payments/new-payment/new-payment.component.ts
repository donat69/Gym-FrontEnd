import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.css'],
})
export class NewPaymentComponent implements OnInit {
  form: any;
  loading: boolean | undefined;

  payment: any = {
    id: '',
  };
  members: any[] = [];
  memberships: any[] = [];
  dateNow = new Date();
  showAmount: boolean = false;
  showAmountInput: boolean = true;

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crud: CrudService
  ) {
    this.api
      .getWithTenantID(`crud/members`, this.auth.user.tenantId)
      .subscribe((data: any) => {
        this.members = Object.keys(data).map((key) => data[key]);
      });

    this.api
      .getWithTenantID(`crud/memberships`, this.auth.user.tenantId)
      .subscribe((data: any) => {
        this.memberships = Object.keys(data).map((key) => data[key]);
      });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      memberId: ['', Validators.required],
      membershipId: ['', Validators.required],
      amount: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      startDate: ['', Validators.required],
    });

    this.form
      .get('startDate')
      .setValue(this.fun.transformDate(this.dateNow, 'yyyy-MM-dd'));

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getPayment(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  onMembershipChange() {
    const membershipId = this.form.get('membershipId').value;
    this.showAmount = membershipId !== null && membershipId !== '';
  }

  getSelectedMembershipPrice() {
    const membershipId = this.form.value.membershipId;
    const membership = this.memberships.find(
      (membership) => membership.id === Number(membershipId)
    );

    if (membership) {
      this.showAmount = true;
      this.form.get('amount').setValue(membership.price);
    }
  }

  /*
   * Función que obtiene el precio de la membresía seleccionada y lo muestra en pantalla
   * @returns string con el precio de la membresía seleccionada
   *
  getSelectedMembershipPrice(): string {
    const membershipId = this.form.value.membershipId;
    const membership = this.memberships.find(membership => membership.id === Number(membershipId));

    if (membership) {
      const priceWithSymbol = `Monto a cobrar: $${membership.price}`;
      return priceWithSymbol;
    } else {
      return "ERROR AL OBTENER EL PRECIO";
    }
  }*/

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.payment.id) {
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

    const paymentData = {
      ...this.form.value,
      tenantId: this.auth.user.tenantId,
    };

    this.crud.save('payments/payments', paymentData).subscribe(() => {
      this.loading = false;
      this.fun.presentAlert('Saved');
      this.router.navigateByUrl('payments/list');
    });
  }

  update() {
    this.loading = true;

    this.crud
      .update(`payments/${this.payment.id}`, this.form.value)
      .subscribe(() => {
        this.loading = false;
        this.fun.presentAlert('Updated');
        this.router.navigateByUrl('payments/list');
      });
  }

  getPayment(id: any) {
    this.loading = true;

    this.crud
      .getListNormal(`crud/payments/${id}`)
      .subscribe((response: any) => {
        this.payment = response;

        this.form.markAsDirty();
        this.form.get('memberId').setValue(this.payment.memberId);
        this.form.get('membershipId').setValue(this.payment.membershipId);
        this.form.get('amount').setValue(this.payment.amount);
        this.form.get('startDate').setValue(this.payment.startDate);

        this.loading = false;
      });
  }
  
}
