// Returns a mock session object for local development
export function getDevSession() {
  if (process.env.NODE_ENV === 'development') {
    return {
      user: {
        id: 'dev-user-id',
        name: 'Dev User',
        email: 'dev@local.dev',
        image: null,
      },
      expires: '2099-12-31T23:59:59.999Z',
    };
  }
  return null;
} 