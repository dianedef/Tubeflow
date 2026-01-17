import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonGroupVariants = cva("inline-flex items-center gap-1", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "default",
  },
});

export interface ButtonGroupProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  children: React.ReactNode;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, size, children, ...props }, ref) => {
    return (
      <div
        className={cn(buttonGroupVariants({ orientation, size, className }))}
        ref={ref}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const isFirst = index === 0;
            const isLast = index === React.Children.count(children) - 1;

            let roundedClass = "";
            if (orientation === "horizontal") {
              roundedClass = isFirst
                ? "rounded-r-none"
                : isLast
                  ? "rounded-l-none"
                  : "rounded-none";
            } else {
              roundedClass = isFirst
                ? "rounded-b-none"
                : isLast
                  ? "rounded-t-none"
                  : "rounded-none";
            }

            const childProps = child.props as React.HTMLAttributes<HTMLElement>;
            const existingClassName = childProps.className || "";

            return React.cloneElement(
              child as React.ReactElement,
              {
                className: cn(
                  existingClassName,
                  roundedClass,
                  index < React.Children.count(children) - 1 &&
                    (orientation === "horizontal" ? "-mr-px" : "-mb-px"),
                ),
              } as React.HTMLAttributes<HTMLElement>,
            );
          }
          return child;
        })}
      </div>
    );
  },
);
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup, buttonGroupVariants };
