import { AfterViewChecked, Component, inject, input, ViewChild } from '@angular/core';
// import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent  implements AfterViewChecked{
  @ViewChild('messageForm') messageForm?: NgForm;
  @ViewChild('scrollMe') scrollContainer?: any;
  messageService = inject(MessageService);
  username = input.required<string>();
  // messages = input.required<Message[]>();
  messageContent = '';
  loading = false;
  // updateMessages = output<Message>();
  
  sendMessage() {
    // this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
    //   next: message => {
    //     // this.updateMessages.emit(message);
    //     this.messageForm?.reset();
    //   }
    // })
    // this.messageService.sendMessage(this.username(), this.messageContent).then(() => {
    //   this.messageForm?.reset();
    // })
    this.loading = true;
    this.messageService.sendMessage(this.username(), this.messageContent).then(() => {
      this.messageForm?.reset();
      this.scrollToBottom();
    }).finally(() => this.loading = false);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
  // loadMessages() {
  //   this.messageService.getMessageThread(this.username()).subscribe({
  //     next: messages => this.messages = messages
  //   })
  // }
}
