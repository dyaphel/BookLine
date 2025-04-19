export async function getCsrfToken() {
  try {
      const response = await fetch('http://localhost:8000/users/csrf/', {
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      
      if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
      }
      
      const data = await response.json();
      return data.csrfToken;
  } catch (error) {
      console.error('CSRF token fetch error:', error);
      throw error;
  }
}