import { Injectable } from '@angular/core';
import { Login } from 'src/utils/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor() { }

  public login(username: string, password: string) {
    return Login.signIn(username, password);
  }

  public signUp(username: string, password: string) {
    return Login.signUp(username, password);
  }
}
