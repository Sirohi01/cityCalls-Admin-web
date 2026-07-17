import React from 'react';
import { usePermission } from '@/lib/hooks/useAuth';

interface PermissionGateProps {
  module: string;
  action?: 'read' | 'write' | 'create' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ module, action = 'read', children, fallback = null }: PermissionGateProps) {
  const hasPermission = usePermission(module, action);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
