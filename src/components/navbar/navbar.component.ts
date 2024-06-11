import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  /**
   * Email of the logged-in user.
   * @type {string | null}
   */
  userEmail: string | null = null;

  /**
   * Indicates whether a user is logged in.
   * @type {boolean}
   */
  isLoggedIn: boolean = false;

  /**
   * The total number of items in the cart.
   * @type {number}
   */
  cartItemCount: number = 0;

  /**
   * Creates an instance of NavbarComponent.
   *
   * @param {AuthService} authService - Service to handle authentication.
   * @param {CartService} cartService - Service to handle cart operations.
   * @param {Router} router - Router service to navigate between routes.
   */
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  /**
   * Initializes the component.
   * Subscribes to user email and cart item count updates.
   */
  ngOnInit(): void {
    this.authService.userEmail.subscribe(email => {
      this.userEmail = email;
      this.isLoggedIn = !!email;  // isLoggedIn is true if email is not null
    });

    this.cartService.getTotalQuantity().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  /**
   * Logs out the user, resets user state, and navigates to the products page.
   * Refreshes the page after logging out.
   */
  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userEmail = null;
    this.router.navigate(['/products']).then(() => {
      window.location.reload();  // Refresh the page after logging out
    });
  }
}
