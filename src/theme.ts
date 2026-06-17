import { createTheme } from "@mantine/core";
import {
  createElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

type PaginationPageControlProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "data-active"?: boolean;
};

type PaginationTextIconProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const PaginationPageControl = forwardRef<
  HTMLButtonElement,
  PaginationPageControlProps
>(function PaginationPageControl(
  { disabled, onMouseEnter, onMouseLeave, style, ...props },
  ref
) {
  const isActive = Boolean(props["data-active"]);

  return createElement("button", {
    ...props,
    disabled,
    ref,
    onMouseEnter: (event) => {
      onMouseEnter?.(event);

      if (!isActive && !disabled) {
        event.currentTarget.style.color = "var(--mantine-color-gray-9)";
      }
    },
    onMouseLeave: (event) => {
      onMouseLeave?.(event);

      if (!isActive && !disabled) {
        event.currentTarget.style.color = "var(--mantine-color-gray-5)";
      }
    },
    style: {
      ...style,
      ...(isActive
        ? {
            fontWeight: 700,
            background: "var(--pagination-active-bg)",
            color: "var(--pagination-active-color)",
            boxShadow: "0 1px 4px rgba(0,0,0,.12)",
          }
        : null),
    },
  });
});

function PaginationTextIcon({
  children,
  className,
  style,
}: PaginationTextIconProps) {
  return createElement(
    "span",
    {
      className,
      style: {
        ...style,
        display: "inline",
        width: "auto",
        height: "auto",
        color: "inherit",
        fontSize: "var(--pagination-control-fz)",
        fontWeight: 500,
        lineHeight: "normal",
      },
    },
    children
  );
}

function PaginationPreviousIcon(props: PaginationTextIconProps) {
  return createElement(PaginationTextIcon, props, "‹");
}

function PaginationNextIcon(props: PaginationTextIconProps) {
  return createElement(PaginationTextIcon, props, "›");
}

function PaginationDotsIcon(props: PaginationTextIconProps) {
  return createElement(PaginationTextIcon, props, "…");
}

export const theme = createTheme({
  white: "#FFFFFF",
  primaryColor: "blue",
  fontFamily: "var(--font-dm-sans), var(--font-body), 'Segoe UI', sans-serif",
  fontFamilyMonospace:
    "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  headings: {
    fontFamily:
      "var(--font-dm-sans), var(--font-display), 'Segoe UI', sans-serif",
  },
  colors: {
    blue: [
      "#F8FAFF",
      "#EEF2FF",
      "#E0E7FF",
      "#C7D2FE",
      "#6B94F5",
      "#4375EE",
      "#2F5FD4",
      "#2348B0",
      "#1D4ED8",
      "#153AAA",
    ],
    gray: [
      "#F8FAFC",
      "#F1F5F9",
      "#E2E8F0",
      "#CBD5E1",
      "#94A3B8",
      "#64748B",
      "#475569",
      "#334155",
      "#1E293B",
      "#0F172A",
    ],
    red: [
      "#FFF7F7",
      "#FEF2F2",
      "#FEE2E2",
      "#FECACA",
      "#FCA5A5",
      "#EF4444",
      "#DC2626",
      "#B91C1C",
      "#991B1B",
      "#7F1D1D",
    ],
    green: [
      "#F6FEFA",
      "#ECFDF5",
      "#D1FAE5",
      "#A7F3D0",
      "#34D399",
      "#10B981",
      "#059669",
      "#047857",
      "#065F46",
      "#064E3B",
    ],
    yellow: [
      "#FFFCF5",
      "#FFFBEB",
      "#FEF3C7",
      "#FDE68A",
      "#FCD34D",
      "#F59E0B",
      "#D97706",
      "#B45309",
      "#92400E",
      "#78350F",
    ],
    cyan: [
      "#ECFEFF",
      "#CFFAFE",
      "#A5F3FC",
      "#67E8F9",
      "#22D3EE",
      "#06B6D4",
      "#0891B2",
      "#0E7490",
      "#155E75",
      "#164E63",
    ],
    terra: [
      "#fff3eb",
      "#fbe1d1",
      "#f5c0a2",
      "#ef9d71",
      "#ea8048",
      "#e86d2d",
      "#e7611d",
      "#cd5111",
      "#b6480c",
      "#9f3c05",
    ],
    moss: [
      "#edf8f2",
      "#dcefe4",
      "#b9dec8",
      "#93cca9",
      "#74bd90",
      "#5eb47e",
      "#53af74",
      "#449963",
      "#3a8857",
      "#2c7548",
    ],
  },
  radius: {
    xl: "1.5rem",
    xxl: "2rem",
  },
  shadows: {
    xl: "0 8px 36px rgba(67,117,238,.14)",
  },
  defaultRadius: "xl",
  components: {
    Pagination: {
      defaultProps: {
        boundaries: 1,
        dotsIcon: PaginationDotsIcon,
        gap: 4,
        getControlProps: () => ({
          component: PaginationPageControl,
        }),
        getItemProps: () => ({
          component: PaginationPageControl,
        }),
        nextIcon: PaginationNextIcon,
        previousIcon: PaginationPreviousIcon,
        radius: 8,
        siblings: 1,
      },
      vars: () => ({
        root: {
          "--pagination-control-size": "31px",
          "--pagination-control-radius": "8px",
          "--pagination-control-fz": "13px",
          "--pagination-active-bg": "#FFFFFF",
          "--pagination-active-color": "var(--mantine-color-gray-9)",
        },
      }),
      styles: {
        root: {
          "--mantine-color-white": "transparent",
          "--mantine-color-gray-0": "transparent",
          "--mantine-color-text": "var(--mantine-color-gray-5)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          width: "max-content",
          margin: 0,
          padding: "4px 6px",
          borderRadius: 12,
          background: "var(--mantine-color-gray-1)",
          boxSizing: "border-box",
        },
        control: {
          minHeight: 0,
          padding: "7px 13px",
          border: "none",
          fontWeight: 500,
          lineHeight: "normal",
          opacity: 1,
          cursor: "pointer",
          boxShadow: "none",
        },
        dots: {
          minWidth: "auto",
          padding: "7px 8px",
          color: "var(--mantine-color-gray-5)",
          fontSize: "var(--pagination-control-fz)",
          lineHeight: "normal",
        },
      },
    },
  },
  other: {
    cssVariables: {
      "--blue-5": "#4375EE",
      "--blue-8": "#1D4ED8",
      "--blue-1": "#EEF2FF",
      "--blue-2": "#E0E7FF",
      "--blue-3": "#C7D2FE",
      "--gray-0": "#F8FAFC",
      "--gray-1": "#F1F5F9",
      "--gray-2": "#E2E8F0",
      "--gray-3": "#CBD5E1",
      "--gray-5": "#64748B",
      "--gray-7": "#334155",
      "--gray-9": "#0F172A",
      "--red-5": "#EF4444",
      "--red-1": "#FEF2F2",
      "--green-5": "#10B981",
      "--green-1": "#ECFDF5",
      "--yellow-1": "#FFFBEB",
      "--white": "#FFFFFF",
      "--sidebar-w": "230px",
      "--header-h": "56px",
    },
    layout: {
      sidebarWidth: "230px",
      headerHeight: "56px",
    },
  },
});
