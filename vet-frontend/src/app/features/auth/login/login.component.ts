import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="max-w-md w-full bg-white rounded-brand shadow-2xl overflow-hidden">
        
        <div class="bg-brand-primary p-8 text-white text-center">
          <h2 class="text-3xl font-bold">VetSystem</h2>
          <p class="text-blue-100 mt-2">Gestión integral para tu veterinaria</p>
        </div>

        <div class="p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input 
                type="email" 
                formControlName="email"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-brand focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                placeholder="veterinaria@ejemplo.com">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Contraseña</label>
              <input 
                type="password" 
                formControlName="password"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-brand focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                placeholder="••••••••">
            </div>

            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-brand-primary text-white py-3 px-4 rounded-brand font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center">
              <span *ngIf="!isLoading">Entrar al Panel</span>
              <span *ngIf="isLoading" class="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
            </button>

          </form>

          <div class="mt-6 text-center text-sm text-gray-500">
            <p>¿Problemas para entrar? <a href="#" class="text-brand-primary font-semibold">Contacta a soporte</a></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          alert('Error en las credenciales: ' + err.error?.message);
        }
      });
    }
  }
}