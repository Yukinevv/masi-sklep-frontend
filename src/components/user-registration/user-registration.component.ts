import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../modules/User';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  /**
   * Form group for the registration form.
   * @type {FormGroup}
   */
  registerForm: FormGroup;

  /**
   * Indicates whether the form has been submitted.
   * @type {boolean}
   */
  submitted: boolean = false;

  /**
   * Indicates whether the registration attempt has failed.
   * @type {boolean}
   */
  isRegistrationFailed: boolean = false;

  /**
   * Creates an instance of UserRegistrationComponent.
   *
   * @param {FormBuilder} formBuilder - Service to build the form group.
   * @param {AuthService} authService - Service to handle authentication.
   * @param {Router} router - Router service to navigate between routes.
   */
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  /**
   * Custom validator to check that two fields match.
   *
   * @param {string} password - The name of the password field.
   * @param {string} confirmPassword - The name of the confirm password field.
   * @returns {Function} A function to validate the form group.
   */
  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[confirmPassword];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  /**
   * Handles form submission for registration.
   * Validates the form, registers the user, and handles success or failure.
   */
  onSubmit(): void {
    this.submitted = true;
    this.isRegistrationFailed = false;
    if (this.registerForm.invalid) {
      return;
    }

    const newUser = new User(
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.name,
      this.registerForm.value.surname,
      this.registerForm.value.address
    );

    console.log("New user: ", newUser);

    // Register user using AuthService
    this.authService.register(newUser).subscribe(
      response => {
        console.log('User registered', response);
        this.router.navigate(['/products']);
      },
      error => {
        console.log('Error registering user', error);
        this.isRegistrationFailed = true;
      }
    );
  }
}
