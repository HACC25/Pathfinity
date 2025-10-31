'use client';

import { Check, X } from 'lucide-react';
import { passwordRequirements, validatePassword } from '@/lib/utils';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export function PasswordRequirements({ password, className = '' }: PasswordRequirementsProps) {
  const validation = validatePassword(password);

  return (
    <div className={`space-y-2 p-3 bg-muted/30 rounded-md border border-muted ${className}`}>
      <h4 className="text-sm font-medium text-foreground mb-2">Password Requirements:</h4>
      <div className="space-y-1.5">
        {passwordRequirements.map((requirement) => {
          const isPassed = requirement.test(password);
          return (
            <div
              key={requirement.id}
              className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                isPassed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
              }`}
            >
              <div className={`flex-shrink-0 ${isPassed ? 'text-green-600' : 'text-muted-foreground'}`}>
                {isPassed ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </div>
              <span className={isPassed ? 'font-medium' : ''}>{requirement.label}</span>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}