import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 1000 },   // 1분에 1000명으로 증가
    { duration: '3m', target: 3000 },   // 3분에 3000명 유지
    { duration: '1m', target: 0 },      // 1분에 0명으로 감소
  ],
};

export default function () {
  http.get('https://api.colonydrop0079.com/actuator/health');
  sleep(1);
}