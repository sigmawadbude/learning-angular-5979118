import { Component, model, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-star',
  template: `
    <div
      class="crop"
      [style.width.px]="starWidth()"
      [title]="rating()"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarComponent {
  rating = model.required<number>({
    alias: 'starRating',
  });
  starWidth = computed(() => (this.rating() * 75) / 5);

  onClick(): void {
    this.rating.set(2);
  }
}
