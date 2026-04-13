import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // ========== AUTH ==========
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/auth/register`, userData);
  }

  // ========== USERS ==========
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/users`, { headers: this.getHeaders() });
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/users/${id}`, data, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/users/${id}`, { headers: this.getHeaders() });
  }

  // ========== GROUPS ==========
  getGroups(): Observable<any> {
    return this.http.get(`${this.apiUrl}/groups/groups`, { headers: this.getHeaders() });
  }

  createGroup(group: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/groups/groups`, group, { headers: this.getHeaders() });
  }

  updateGroup(id: number, group: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/groups/groups/${id}`, group, { headers: this.getHeaders() });
  }

  deleteGroup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/groups/groups/${id}`, { headers: this.getHeaders() });
  }

  getGroupMembers(groupId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/groups/groups/${groupId}/members`, { headers: this.getHeaders() });
  }

  addMember(groupId: number, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/groups/groups/${groupId}/members`, { email }, { headers: this.getHeaders() });
  }

  removeMember(groupId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/groups/groups/${groupId}/members/${userId}`, { headers: this.getHeaders() });
  }

  // ========== TICKETS ==========
  getTickets(grupoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tickets/tickets?grupoId=${grupoId}`, { headers: this.getHeaders() });
  }

  getTicket(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tickets/tickets/${id}`, { headers: this.getHeaders() });
  }

  createTicket(ticket: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tickets/tickets`, ticket, { headers: this.getHeaders() });
  }

  updateTicket(id: number, ticket: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tickets/tickets/${id}`, ticket, { headers: this.getHeaders() });
  }

  updateTicketStatus(id: number, estado_nombre: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/tickets/tickets/${id}/status`, 
    { estado_nombre }, 
    { headers: this.getHeaders() }
  );
}

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/tickets/${id}`, { headers: this.getHeaders() });
  }

  getTicketComments(ticketId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tickets/tickets/${ticketId}/comments`, { headers: this.getHeaders() });
  }

  addComment(ticketId: number, contenido: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tickets/tickets/${ticketId}/comments`, { contenido }, { headers: this.getHeaders() });
  }

  getTicketHistory(ticketId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tickets/tickets/${ticketId}/history`, { headers: this.getHeaders() });
  }
  
}