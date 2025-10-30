import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Password validation types and utilities
export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'Between 8-12 characters',
    test: (password: string) => password.length >= 8 && password.length <= 12,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A-Z)',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: 'number',
    label: 'At least one number (0-9)',
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$%^&*()-_=+)',
    test: (password: string) => /[!@#$%^&*()\-_=+]/.test(password),
  },
  {
    id: 'noSpaces',
    label: 'No spaces allowed',
    test: (password: string) => !/\s/.test(password),
  },
];

export function validatePassword(password: string): {
  isValid: boolean;
  failedRequirements: PasswordRequirement[];
  passedRequirements: PasswordRequirement[];
} {
  const failedRequirements = passwordRequirements.filter(req => !req.test(password));
  const passedRequirements = passwordRequirements.filter(req => req.test(password));
  
  return {
    isValid: failedRequirements.length === 0,
    failedRequirements,
    passedRequirements,
  };
}

export function getPasswordStrengthMessage(password: string): string {
  const validation = validatePassword(password);
  
  if (validation.isValid) {
    // return 'Password meets all requirements';
    return '';
  }
  
  if (validation.failedRequirements.length === passwordRequirements.length) {
    // return 'Password does not meet any requirements';
    return '';
  }
  
  return `Password missing: ${validation.failedRequirements.map(req => req.label.toLowerCase()).join(', ')}`;
}
