// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface AuthRequest {
  email: string | null;
  password: string | null;
}

export interface AuthResponse {
  token: string | null;
}

