import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { User } from '../../modules/User';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

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

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    // this.authService.register(this.registerForm.value).subscribe(
    //   response => {
    //     console.log('User registered', response);
    //     this.router.navigate(['/products']);
    //   },
    //   error => {
    //     console.log('Error registering user', error);
    //   }
    // );

    // Hashowanie hasła przed wysłaniem
    const hashedPassword = CryptoJS.SHA256(this.registerForm.value.password).toString();

    const newUser = new User(
      this.registerForm.value.username,
      this.registerForm.value.email,
      hashedPassword
    );

    console.log('New User Object:', newUser);

    this.router.navigate(['/products']);
  }
}
