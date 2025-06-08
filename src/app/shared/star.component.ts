import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star',
  template: `
    <div
      class="crop"
      [style.width.px]="starWidth"
      [title]="rating"
      (click)="onClick()"
    >
      <div style="width: 75px">
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
      </div>
    </div>
  `,
  styles: [
    `
      .crop {
        overflow: hidden;
      }
      div {
        cursor: pointer;
      }
    `,
  ],
})
export class StarComponent {
  @Input() rating = 0;
  starWidth = 0;
  @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(): void {
    this.starWidth = (this.rating * 75) / 5;
  }

  onClick(): void {
    this.ratingClicked.emit(`The rating ${this.rating} was clicked!`);
  }
}
