import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericValidator } from './generic-validator';

describe('GenericValidator', () => {
  const validationMessages = {
    firstName: {
      required: 'First name is required.',
      minlength: 'First name must be at least 3 characters.',
    },
    email: {
      required: 'Email is required.',
      email: 'Email must be a valid email address.',
    },
  };

  let validator: GenericValidator;

  beforeEach(() => {
    validator = new GenericValidator(validationMessages);
  });

  it('should return validation messages for invalid dirty controls', () => {
    const form = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    // Simulate user interaction
    form.get('firstName')?.markAsTouched();
    form.get('firstName')?.markAsDirty();
    form.get('email')?.markAsTouched();
    form.get('email')?.markAsDirty();

    const messages = validator.processMessages(form);

    expect(messages['firstName']).toContain('First name is required.');
    expect(messages['email']).toContain('Email is required.');
  });

  it('should not return messages for pristine or valid controls', () => {
    const form = new FormGroup({
      firstName: new FormControl('John', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    form.get('email')?.markAsTouched();
    form.get('email')?.markAsDirty();

    const messages = validator.processMessages(form);

    expect(messages['firstName']).toBeUndefined();
    expect(messages['email']).toContain('Email is required.');
  });

  it('should ignore controls that do not have configured messages', () => {
    const form = new FormGroup({
      username: new FormControl('', Validators.required),
    });

    form.get('username')?.markAsTouched();
    form.get('username')?.markAsDirty();

    const messages = validator.processMessages(form);

    expect(messages['username']).toBeUndefined();
  });

  it('should process nested FormGroups', () => {
    const form = new FormGroup({
      account: new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
      }),
    });

    const emailControl = form.get(['account', 'email']);
    emailControl?.markAsTouched();
    emailControl?.markAsDirty();

    const messages = validator.processMessages(form);

    expect(messages['email']).toContain('Email is required.');
  });
});
