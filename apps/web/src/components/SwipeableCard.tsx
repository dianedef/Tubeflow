"use client";

import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  LeadingActions,
  TrailingActions,
  Type,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

export interface SwipeActionConfig {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick: () => void;
  destructive?: boolean;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leadingActions?: SwipeActionConfig[];
  trailingActions?: SwipeActionConfig[];
  onClick?: () => void;
  threshold?: number;
  fullSwipe?: boolean;
}

const ActionContent = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <div
    className={`flex items-center justify-center gap-3 h-full px-6 ${color}`}
  >
    <Icon className="w-6 h-6 text-primary-foreground" />
    <span className="text-primary-foreground font-medium hidden sm:block">
      {label}
    </span>
  </div>
);

export default function SwipeableCard({
  children,
  leadingActions = [],
  trailingActions = [],
  onClick,
  threshold = 0.3,
  fullSwipe = false,
}: SwipeableCardProps) {
  const renderLeadingActions = () => {
    if (leadingActions.length === 0) return undefined;
    return (
      <LeadingActions>
        {leadingActions.map((action, index) => (
          <SwipeAction
            key={index}
            onClick={action.onClick}
            destructive={action.destructive}
          >
            <ActionContent
              icon={action.icon}
              label={action.label}
              color={action.color}
            />
          </SwipeAction>
        ))}
      </LeadingActions>
    );
  };

  const renderTrailingActions = () => {
    if (trailingActions.length === 0) return undefined;
    return (
      <TrailingActions>
        {trailingActions.map((action, index) => (
          <SwipeAction
            key={index}
            onClick={action.onClick}
            destructive={action.destructive}
          >
            <ActionContent
              icon={action.icon}
              label={action.label}
              color={action.color}
            />
          </SwipeAction>
        ))}
      </TrailingActions>
    );
  };

  return (
    <SwipeableList type={Type.IOS} threshold={threshold} fullSwipe={fullSwipe}>
      <SwipeableListItem
        leadingActions={renderLeadingActions()}
        trailingActions={renderTrailingActions()}
        onClick={onClick}
      >
        {children}
      </SwipeableListItem>
    </SwipeableList>
  );
}

// Re-export the type for convenience
export type { SwipeActionConfig as SwipeAction };
