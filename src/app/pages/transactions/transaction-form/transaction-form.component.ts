import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ITransaction } from 'src/app/entities/transaction';
import { RepositoryService } from 'src/app/services/Repositories/repository.service';

@Component({
  selector: 'app-transaction-entry',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit {
  @Input() transaction: ITransaction = {};

  public today = () => {
    let t = new Date();
    t.setHours(23, 59, 59, 999);
    return t.toISOString();
  };

  partyControl!: FormControl<string | null>;
  amountControl!: FormControl<number | null>;
  dateControl!: FormControl<Date | null>;
  modeControl!: FormControl<string | null>;
  transactionTypeControl!: FormControl<string | null>;

  transactionForm!: FormGroup<{
    party: FormControl<string | null>;
    amount: FormControl<number | null>;
    date: FormControl<Date | null>;
    mode: FormControl<string | null>;
    transactionType: FormControl<string | null>;
  }>;

  constructor(
    private modalCtrl: ModalController,
    private repoSrv: RepositoryService
  ) {}

  ngOnInit() {
    this.partyControl = new FormControl(
      this.transaction.party!.givenName! || this.transaction.party!.id!,
      [Validators.required]
    );
    this.amountControl = new FormControl(this.transaction.amount!, [
      Validators.min(1),
      Validators.required,
    ]);
    this.dateControl = new FormControl(this.transaction.date!);
    this.modeControl = new FormControl(this.transaction.mode!);
    this.transactionTypeControl = new FormControl(
      this.transaction.transactionType!
    );

    this.transactionForm = new FormGroup({
      party: this.partyControl,
      amount: this.amountControl,
      date: this.dateControl,
      mode: this.modeControl,
      transactionType: this.transactionTypeControl,
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    if (!this.transactionForm.valid) {
      this.transactionForm.markAllAsTouched();
      return;
    }
    if (this.transaction.party!.id) {
      this.transaction.party!.givenName = this.partyControl.value!;
    } else {
      this.transaction.party!.id = this.partyControl.value!;
    }

    this.transaction.amount = this.amountControl.value!;
    this.transaction.date = this.dateControl.value!;
    this.transaction.mode = this.modeControl.value!;
    this.transaction.transactionType = this.transactionTypeControl.value!;

    await this.repoSrv.transactionsRepo.save(this.transaction);

    await this.repoSrv.save();

    this.modalCtrl.dismiss(this.transaction);
  }
}
