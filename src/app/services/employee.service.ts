import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { Employee } from '../components/employee-list/employee-list.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private db!: IDBDatabase;
  
  private dbPromise = openDB('employee-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('employees')) {
        db.createObjectStore('employees', { keyPath: 'id' });
      }
    }
  });

  async getAllEmployees(): Promise<Employee[]> {
    const db = await this.dbPromise;
    return await db.getAll('employees');
  }

  async addEmployee(employee: Employee): Promise<void> {
    const db = await this.dbPromise;
    await db.add('employees', employee);
  }

  async updateEmployee(employee: Employee): Promise<void> {
    const db = await this.dbPromise;
    await db.put('employees', employee);
  }

 
  getEmployeeById(id: number): Promise<Employee | undefined> {
    return this.getAllEmployees().then(employees => employees.find(emp => emp.id === id));
  }
  async deleteEmployee(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('employees', id);
  }
  
  
}
