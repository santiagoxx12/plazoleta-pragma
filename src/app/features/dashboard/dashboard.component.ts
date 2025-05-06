

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      await getCurrentUser()
    } catch (error) {
      console.error("Error al obtener el usuario:", error)
      this.router.navigate(["/login"])
    }
  }

  navigate(route: string) {
    this.router.navigate([route])
  }
}
