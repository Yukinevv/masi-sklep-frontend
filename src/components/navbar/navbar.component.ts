import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userEmail: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.userEmail.subscribe(email => {
      this.userEmail = email;
      this.isLoggedIn = !!email;  // isLoggedIn jest true, jeśli email nie jest null
    });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userEmail = null;
    this.router.navigate(['/products']).then(() => {
      window.location.reload();  // odświeżenie strony po zakończeniu wylogowywania
    });
  }
}
