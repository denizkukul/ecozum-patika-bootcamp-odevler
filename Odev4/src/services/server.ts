import axios, { AxiosInstance } from 'axios';
import { loginData, registerData } from '../interfaces';

const serverURLs = {
  base: 'http://localhost:80',
  register: '/auth/register',
  login: '/auth/login',
  category: '/category',
  status: '/status',
  todo: '/todo'
}

type targetURL = 'category' | 'status' | 'todo';

export const getCookie = (name: string) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

export const server = new class {
  axiosInstance: AxiosInstance
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: serverURLs.base,
      timeout: 5000
    })
    let token = getCookie('token');
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }


  async login(data: loginData) {
    return this.axiosInstance.post(serverURLs.login, data)
      .then(response => this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`)
  }
  async register(data: registerData) {
    return this.axiosInstance.post(serverURLs.register, data)
      .then(response => this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`);
  }
  logout() {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  get(target: targetURL, id: number) {
    return this.axiosInstance.get(serverURLs[target] + '/' + id);
  }
  getList(target: targetURL, categoryID: number | null = null) {
    if (categoryID) return this.axiosInstance.get(serverURLs[target], { params: { categoryId: categoryID } });
    else return this.axiosInstance.get(serverURLs[target]);
  }
  delete(target: targetURL, id: number) {
    return this.axiosInstance.delete(serverURLs[target] + '/' + id);
  }
  update(target: targetURL, id: number, data: object) {
    return this.axiosInstance.put(serverURLs[target] + '/' + id, data);
  }
  create(target: targetURL, data: object, categoryID: number | null = null) {
    if (categoryID) return this.axiosInstance.post(serverURLs[target], { ...data, categoryId: categoryID });
    else return this.axiosInstance.post(serverURLs[target], data);
  }
}





