import axios from 'axios';

const API_URL = 'http://localhost:8000/auth';

interface User {
    name: string;
    email: string;
    token: string;
}

interface Message {
    message: string;
}

class AuthService {
  private token: string | null;
  private user: User | null;

  constructor() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.token = this.user?.token || null;
    } else {
      this.user = null;
      this.token = null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    if (response.data.token) {
      this.user = response.data;
      this.token = response.data.token;
      localStorage.setItem('user', JSON.stringify(this.user));
    }

    return response.data;
  }

  async register(name: string, email: string, password: string): Promise<Message> {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    
    if (response.data.token) {
      this.user = response.data;
      this.token = response.data.token;
      localStorage.setItem('user', JSON.stringify(this.user));
    }

    return response.data;
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    // console.log('Current user:', userStr);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return null;
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}

export default new AuthService();
