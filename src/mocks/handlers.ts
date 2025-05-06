import { http, HttpResponse } from 'msw';

// Define handlers for API endpoints
export const handlers = [
  // Handler for login endpoint
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };

    // Simple validation
    if (email && password) {
      return HttpResponse.json({
        api_token: 'mock-api-token-12345'
      }, { status: 200 });
    } else {
      return new HttpResponse(null, { status: 401 });
    }
  }),

  // Handler for user endpoint
  http.get('/api/user/:userId', ({ params }) => {
    const { userId } = params;

    if (userId === '1') {
      return HttpResponse.json({
        id: 1,
        name: 'Test User'
      }, { status: 200 });
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  })
];
