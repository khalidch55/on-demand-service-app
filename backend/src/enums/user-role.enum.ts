export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export const PUBLIC_REGISTRATION_ROLES = [UserRole.CUSTOMER, UserRole.PROVIDER] as const;
