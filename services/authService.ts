const BASE_URL = 'https://e8239c65-60c9-4f94-ae85-8b2a101125da.mock.pstmn.io';
const LOGIN_URL = 'https://5589541a-021c-47f7-a814-cd4ae5b9b7bb.mock.pstmn.io/login';

export type LoginPayload = {
  cellNumber: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  fullName: string;
  email: string;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  cellNumber: string;
};

// In a real app, these would call your backend.
// For now they just simulate a network request + basic validation.

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const { cellNumber, password, fullName, email } = payload;

  if (!fullName.trim() || !cellNumber.trim() || !password.trim() || !email.trim()) {
    throw new Error('All fields are required.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  // Call mock server register endpoint
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName,
      email,
      cellNumber,
      password,
    }),
  });

  if (!response.ok) {
    // Try to extract error message from mock server, otherwise throw generic
    try {
      const errorBody = await response.json();
      const message =
        (errorBody && (errorBody.message || errorBody.error || errorBody.errorMessage)) ||
        'Registration failed. Please try again.';
      const err: any = new Error(message);
      if (errorBody && typeof errorBody.errorCode === 'string') {
        err.code = errorBody.errorCode;
      }
      throw err;
    } catch {
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Try to map the mock server response into our AuthUser type.
  // Falls back to using the payload if the shape is different.
  let parsed: any = null;
  try {
    parsed = await response.json();
  } catch {
    parsed = null;
  }

  const userFromResponse =
    parsed?.user || parsed?.data || parsed?.result || parsed;

  return {
    id: userFromResponse?.id ?? 'mock-user-id',
    fullName: userFromResponse?.fullName ?? fullName,
    email: userFromResponse?.email ?? email,
    cellNumber: userFromResponse?.cellNumber ?? cellNumber,
  };
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { cellNumber, password } = payload;

  if (!cellNumber.trim() || !password.trim()) {
    throw new Error('Cell number and password are required.');
  }

  // Call mock server login endpoint
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cellNumber,
      password,
    }),
  });

  if (!response.ok) {
    // Try to extract error message from mock server, otherwise throw generic
    try {
      const errorBody = await response.json();
      const message =
        (errorBody && (errorBody.message || errorBody.error || errorBody.errorMessage)) ||
        'Login failed. Please check your credentials and try again.';
      const err: any = new Error(message);
      if (errorBody && typeof errorBody.errorCode === 'string') {
        err.code = errorBody.errorCode;
      }
      throw err;
    } catch {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }

  // Try to map the mock server response into our AuthUser type.
  // Falls back to using the supplied cellNumber if the shape is different.
  let parsed: any = null;
  try {
    parsed = await response.json();
  } catch {
    parsed = null;
  }

  const userFromResponse =
    parsed?.user || parsed?.data || parsed?.result || parsed;

  return {
    id: userFromResponse?.id ?? 'mock-user-id',
    fullName: userFromResponse?.fullName ?? 'Ukho User',
    email: userFromResponse?.email ?? 'demo@ukho.app',
    cellNumber: userFromResponse?.cellNumber ?? cellNumber,
  };
}

