'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, ShieldCheck, Crown } from 'lucide-react';
import { VerificationStatus, CompanyVerificationStatus } from '@prisma/client';

interface VerificationBadgeProps {
  status: VerificationStatus | CompanyVerificationStatus | null | undefined;
  entityType?: 'professional' | 'company';
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const verificationConfig = {
  BASIC: {
    label: 'Verified',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700 border-green-300',
    tooltip: 'This profile has been verified through LinkedIn',
  },
  FULL: {
    label: 'Fully Verified',
    icon: ShieldCheck,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    tooltip: 'This professional has been fully verified with references and credentials',
  },
  PREMIUM: {
    label: 'Premium Verified',
    icon: Crown,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    tooltip: 'Premium verified member with enhanced profile features',
  },
  VERIFIED: {
    label: 'Verified',
    icon: ShieldCheck,
    color: 'bg-green-100 text-green-700 border-green-300',
    tooltip: 'This company has been verified through domain matching',
  },
  UNVERIFIED: null,
  PENDING: null,
};

const sizeConfig = {
  sm: {
    badge: 'text-[10px] px-1.5 py-0.5',
    icon: 'w-2.5 h-2.5',
  },
  md: {
    badge: 'text-xs px-2 py-0.5',
    icon: 'w-3 h-3',
  },
  lg: {
    badge: 'text-sm px-2.5 py-1',
    icon: 'w-4 h-4',
  },
};

export function VerificationBadge({
  status,
  entityType = 'professional',
  showTooltip = true,
  size = 'md',
}: VerificationBadgeProps) {
  // Don't show badge for unverified or pending status
  if (!status || status === 'UNVERIFIED' || status === 'PENDING') {
    return null;
  }

  const config = verificationConfig[status];

  if (!config) {
    return null;
  }

  const Icon = config.icon;
  const sizeClasses = sizeConfig[size];

  const badge = (
    <Badge className={`${config.color} ${sizeClasses.badge} inline-flex items-center gap-1`}>
      <Icon className={sizeClasses.icon} />
      <span>{config.label}</span>
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{badge}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p>{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Standalone verification icon (without badge wrapper) for compact displays
interface VerificationIconProps {
  status: VerificationStatus | CompanyVerificationStatus | null | undefined;
  showTooltip?: boolean;
  className?: string;
}

export function VerificationIcon({
  status,
  showTooltip = true,
  className = '',
}: VerificationIconProps) {
  if (!status || status === 'UNVERIFIED' || status === 'PENDING') {
    return null;
  }

  const config = verificationConfig[status];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  const icon = <Icon className={`w-4 h-4 text-green-600 ${className}`} />;

  if (!showTooltip) {
    return icon;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help inline-flex">{icon}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p>{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
