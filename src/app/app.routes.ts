import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'resume',
    loadComponent: () => import('./pages/resume/resume').then((m) => m.ResumeComponent),
  },
  {
    path: 'prototype',
    loadComponent: () => import('./pages/prototype/prototype').then((m) => m.PrototypeComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
