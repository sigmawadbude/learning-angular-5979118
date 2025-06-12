import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "./message.service";

@Component({
  template: `
  <div class="card">
  <div class="card-header">Messages
    <button class="btn btn-light btn-sm float-right"
            (click)="close()">
      X
    </button>
  </div>
  <div class="card-body">
    <div *ngFor="let message of messages; let i=index">
      <div *ngIf="i<10"
           class="message-row">
        {{ message }}
      </div>
    </div>
  </div>
</div>
  `,
  styles: [
    '.message-row { margin-bottom: 10px }'
  ]
})
export class MessageComponent {
  get messages(): string[] {
    return this.messageService.messages;
  }

  constructor(private messageService: MessageService,
              private router: Router) { }

  close(): void {
    // Close the popup.
  }
}