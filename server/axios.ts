import axios from 'axios';
import qs from 'qs';

const request = axios.create({
  baseURL: 'http://10.162.116.205:5000/api',
});

request.interceptors.request.use(
  config => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2JTRUNsaWVudCIsImV4cCI6MTYyNjM2NDIyMiwiaXNzIjoiSm9iU0VTZXJ2ZXIiLCJhdWQiOiJKb2JTRUNsaWVudCJ9.G5ijjRQq6njuNtX76dOu2xwwZh_py9UUY4JbtDJdZLs';
    config.headers['Authorization'] = 'Bearer ' + token;
    if (config.method == 'post') {
      config.data = qs.stringify(config.data);
      config.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
)

request.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    console.error(err);
    return Promise.reject(err);
  }
)


export default request;