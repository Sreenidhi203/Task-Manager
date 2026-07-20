import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, AuthResponse } from '../../api';

interface AuthState {
  token: string | null;
  userId: number | null;
  email: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token:  localStorage.getItem('token'),
  userId: Number(localStorage.getItem('userId')) || null,
  email:  localStorage.getItem('email'),
  role:   localStorage.getItem('role'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { username: string; email: string; password: string; fullName: string }, { rejectWithValue }) => {
    try {
      return await authApi.register(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed');
    }
  }
);

const persist = (res: AuthResponse) => {
  localStorage.setItem('token',  res.accessToken);
  localStorage.setItem('userId', String(res.userId));
  localStorage.setItem('email',  res.email);
  localStorage.setItem('role',   res.role);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null; state.userId = null;
      state.email = null; state.role   = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => { state.loading = true; state.error = null; };
    const handleFulfilled = (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.token   = action.payload.accessToken;
      state.userId  = action.payload.userId;
      state.email   = action.payload.email;
      state.role    = action.payload.role;
      persist(action.payload);
    };
    const handleRejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error   = action.payload as string;
    };

    builder
      .addCase(login.pending,    handlePending)
      .addCase(login.fulfilled,  handleFulfilled)
      .addCase(login.rejected,   handleRejected)
      .addCase(register.pending,   handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected,  handleRejected);
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
