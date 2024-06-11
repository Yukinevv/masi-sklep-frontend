import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  /**
   * Form group for the login form.
   * @type {FormGroup}
   */
  loginForm!: FormGroup;

  /**
   * Indicates whether the form has been submitted.
   * @type {boolean}
   */
  submitted: boolean = false;

  /**
   * Indicates whether the login attempt has failed.
   * @type {boolean}
   */
  isLoginFailed: boolean = false;

  /**
   * Creates an instance of UserLoginComponent.
   *
   * @param {FormBuilder} formBuilder - Service to build the form group.
   * @param {AuthService} authService - Service to handle authentication.
   * @param {Router} router - Router service to navigate between routes.
   */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Initializes the component.
   * Builds the login form and checks for existing JWT token to navigate to products page.
   */
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    if (localStorage.getItem('jwt_token')) {
      this.router.navigate(['/products']);
    }
  }

  /**
   * Handles form submission for login.
   * Validates the form, performs login, and handles success or failure.
   */
  onSubmit(): void {
    this.submitted = true;
    this.isLoginFailed = false;
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.isLoginFailed = true;
      }
    });
  }
}
