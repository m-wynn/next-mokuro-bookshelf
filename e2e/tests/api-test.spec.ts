import { test, expect } from '@playwright/test';

import { login, get_username, get_password } from '../helper';

test('API - Search endpoint requires authentication', async ({ request }) => {
  // Try to access search API without authentication
  const response = await request.get('http://localhost:3000/api/search?q=test');
  
  // Should return 401 Unauthorized
  expect(response.status()).toBe(401);
});

test('API - Login endpoint responds', async ({ request }) => {
  // Test that login endpoint is accessible
  const response = await request.post('http://localhost:3000/api/login', {
    data: {
      username: 'testuser',
      password: 'testpass'
    }
  });
  
  // Should respond (either success or error, but not timeout)
  expect(response.status()).toBeGreaterThanOrEqual(200);
});

test('API - Signup endpoint responds', async ({ request }) => {
  // Test that signup endpoint is accessible
  const response = await request.post('http://localhost:3000/api/signup', {
    data: {
      username: 'testnewuser',
      password: 'testpass',
      confirmPassword: 'testpass',
      inviteCode: '123'
    }
  });
  
  // Should respond (either success or error, but not timeout)
  expect(response.status()).toBeGreaterThanOrEqual(200);
});

test('API - ReadingProgress endpoint requires authentication', async ({ request }) => {
  // Try to access reading progress without authentication
  const response = await request.get('http://localhost:3000/api/readingProgress');
  
  // Should return 401 Unauthorized
  expect(response.status()).toBe(401);
});
