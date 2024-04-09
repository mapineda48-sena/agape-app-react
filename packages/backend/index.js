const cookieString = 'auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEyNjkwOTE4LCJleHAiOjE3MTI2OTQ1MTh9.nUcNP8EX6YHh7HeavDNRxcZs9RHndM7w3X5Rue6mLbU; ai_user=LdMNP|2023-12-15T20:30:03.865Z;';

const [,authToken] = cookieString.match(/auth_token=([^;]+)/) ?? [];
//const authToken = match ? match[1] : null;

console.log(authToken);
