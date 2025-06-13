export class APP_CONSTANTS {
  static readonly LOGIN_ERR = {
    username: {
      required: 'Username is required.',
      minlength: 'Username must be at least 3 characters long.',
      maxlength: 'Username cannot be longer than 20 characters.',
    },
    password: {
      required: 'Password is required.',
      minlength: 'Password must be at least 6 characters long.',
      maxlength: 'Password cannot be longer than 20 characters.',
    },
  };
  static readonly PRODUCT_EDIT_ERR = {
        productName: {
          required: 'Product name is required.',
          minlength: 'Product name must be at least three characters.',
          maxlength: 'Product name cannot exceed 50 characters.',
        },
        productCode: {
          required: 'Product code is required.',
        },
        starRating: {
          range: 'Rate the product between 1 (lowest) and 5 (highest).',
        },
      };
}
