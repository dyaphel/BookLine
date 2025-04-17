// src/utils/csrf.js

export async function getCsrfToken() {
    const existingToken = localStorage.getItem('csrfToken');
    if (existingToken) {
      return existingToken;
    }
  
    const response = await fetch('http://localhost:8000/users/csrf/', {
      credentials: 'include',
    });
  
    const data = await response.json();
    const newToken = data.csrfToken;
    localStorage.setItem('csrfToken', newToken);
    return newToken;
  }
  