import { Component, EventEmitter, inject, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // usersFromHomeComponent = input.required<any>();
  // @Output() cancelRegister = new EventEmitter();
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  
  model: any = {}
  register() {
    // console.log(this.model);
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
    // console.log("concelled");
  }
}
