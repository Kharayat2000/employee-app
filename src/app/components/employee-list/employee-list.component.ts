import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { filter } from 'rxjs/operators';

export interface Employee {
  id: number;
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  swipedId: number | null = null;
  private touchStartX = 0;
  previousEmployees: Employee[] = [];
  currentEmployees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();

    // Refresh the list when navigating back to this component
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadEmployees();
      });
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().then(data => {
      this.currentEmployees = data.filter(e => e.startDate && !e.endDate);
      this.previousEmployees = data.filter(e => e.startDate && e.endDate);
    });
  }

  navigateToAdd(): void {
    this.router.navigate(['/add']);
  }

  startSwipe(event: TouchEvent, id: number) {
    this.touchStartX = event.touches[0].clientX;
    this.swipedId = null;
  }

  moveSwipe(event: TouchEvent) {
    const moveX = event.touches[0].clientX;
    const diffX = this.touchStartX - moveX;
    if (diffX > 80) {
      event.preventDefault();
    }
  }

  endSwipe(id: number) {
    this.swipedId = id;
    setTimeout(() => {
      this.employeeService.deleteEmployee(id);
      this.swipedId = null;
      this.loadEmployees(); // Refresh after deletion
    }, 300);
  }
  navigateToEdit(id: number): void {
    this.router.navigate(['/edit', id]);
  }
}
