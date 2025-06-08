import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarComponent } from './star.component';
import { By } from '@angular/platform-browser';

describe('StarComponent', () => {
  let component: StarComponent;
  let fixture: ComponentFixture<StarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly calculate starWidth based on rating in ngOnInit', () => {
    component.rating = 3.5;

    component.ngOnChanges();

    expect(component.starWidth).toBe((3.5 * 75) / 5);
  });

  it('should emit ratingClicked event with correct message when onClick is called', () => {
    spyOn(component.ratingClicked, 'emit');
    component.rating = 4;

    component.onClick();

    expect(component.ratingClicked.emit).toHaveBeenCalledWith(
      `The rating 4 was clicked!`
    );
  });

  it('should emit ratingClicked event when button is clicked', () => {
    spyOn(component.ratingClicked, 'emit');
    component.rating = 4;

    const button = fixture.debugElement.query(By.css('.crop')); // Get the button element
    expect(button).toBeTruthy(); // Ensure the button is found
    
    if (button) {
      button.triggerEventHandler('click', null); // Simulate a click event
    }

    expect(component.ratingClicked.emit).toHaveBeenCalledWith(
      `The rating 4 was clicked!`
    );
  });
});
