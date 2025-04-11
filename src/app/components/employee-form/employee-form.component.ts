import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import Offcanvas from 'bootstrap/js/dist/offcanvas';

// employee.model.ts
export interface Employee {
  id: number;
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
}

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit, AfterViewInit {
  employee: Employee = { id: 0, name: '', position: '', startDate: '', endDate: '' };
  isEdit = false;
  submitted = false;
  roles = ['Product Designer', 'Flutter Developer', 'QA Tester', 'Product Owner'];
  private offcanvasInstance!: Offcanvas;
  showError: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam); // 👈 convert to number here
      this.employeeService.getEmployeeById(id).then(existing => {
        if (existing) {
          this.employee = { ...existing };
          this.isEdit = true;
        }
      });
    }
    this.showError = false;
  }

  ngAfterViewInit(): void {
    const offcanvasEl = document.getElementById('rolePicker');
    if (offcanvasEl) {
      this.offcanvasInstance = new Offcanvas(offcanvasEl);
    }
  }

  openRolePicker(): void {
    this.offcanvasInstance.show();
  }


  selectRole(role: string): void {
    this.employee.position = role;
  }

  saveEmployee(): void {
    debugger
    console.log('Submitted:', this.submitted, 'Position:', this.employee.position);

    const startDate = new Date(this.employee.startDate);
    const endDate = this.employee.endDate ? new Date(this.employee.endDate) : null;

    if (endDate && endDate <= startDate) {
     this.showError = true;
      return;
    }
    this.showError = false;
    this.submitted = true;

    if (!this.employee.name || !this.employee.position || !this.employee.startDate) {
      return;
    }

    if (this.isEdit && this.employee.id) {
      this.employeeService.updateEmployee(this.employee);
    } else {
      const newEmployee: Employee = {
        id: Date.now(),
        name: this.employee.name,
        position: this.employee.position,
        startDate: this.employee.startDate,
        endDate: this.employee.endDate
      };
      this.employeeService.addEmployee(newEmployee);
    }
    console.log('Submitted:', this.submitted, 'Position:', this.employee.position);
    this.showError = false;

    this.router.navigate(['/']);
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
