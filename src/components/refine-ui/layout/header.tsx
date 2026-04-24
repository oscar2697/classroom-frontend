import { UserAvatar } from "@/components/refine-ui/layout/user-avatar";
import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  useActiveAuthProvider,
  useLogout,
  useRefineOptions,
} from "@refinedev/core";
import { LogOutIcon } from "lucide-react";

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

function DesktopHeader() {
  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-16",
        "shrink-0",
        "items-center",
        "gap-4",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-between",
        "z-40"
      )}
    >
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
      <div className="flex items-center gap-4">
        <UserDropdown />
        <ProminentLogoutButton />
      </div>
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

  const { title } = useRefineOptions();

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-12",
        "shrink-0",
        "items-center",
        "gap-2",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-between",
        "z-40"
      )}
    >
      <SidebarTrigger
        className={cn("text-muted-foreground", "rotate-180", "ml-1", {
          "opacity-0": open,
          "opacity-100": !open || isMobile,
          "pointer-events-auto": !open || isMobile,
          "pointer-events-none": open && !isMobile,
        })}
      />

      <div
        className={cn(
          "whitespace-nowrap",
          "flex",
          "flex-row",
          "h-full",
          "items-center",
          "justify-start",
          "gap-2",
          "transition-discrete",
          "duration-200",
          {
            "pl-3": !open,
            "pl-5": open,
          }
        )}
      >
        <div>{title.icon}</div>
        <h2
          className={cn(
            "text-sm",
            "font-bold",
            "transition-opacity",
            "duration-200",
            {
              "opacity-0": !open,
              "opacity-100": open,
            }
          )}
        >
          {title.text}
        </h2>
      </div>

      <ThemeToggle className={cn("h-8", "w-8")} />
    </header>
  );
}

const UserDropdown = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const authProvider = useActiveAuthProvider();

  if (!authProvider?.getIdentity) {
    return null;
  }

  const handleLogout = () => {
    try {
      logout({}, {
        onSuccess: () => {
          // Redirect to login page
          window.location.href = '/auth/login';
        },
        onError: (error: any) => {
          console.error('Logout error:', error);
          // Still redirect to login page even if there's an error
          window.location.href = '/auth/login';
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth/login';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleLogout}
        >
          <LogOutIcon
            className={cn("text-destructive", "hover:text-destructive")}
          />
          <span className={cn("text-destructive", "hover:text-destructive")}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function ProminentLogoutButton() {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    try {
      logout({}, {
        onSuccess: () => {
          window.location.href = '/auth/login';
        },
        onError: (error: any) => {
          console.error('Logout error:', error);
          window.location.href = '/auth/login';
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth/login';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
    >
      <LogOutIcon className="w-4 h-4 mr-2" />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}

Header.displayName = "Header";
MobileHeader.displayName = "MobileHeader";
DesktopHeader.displayName = "DesktopHeader";
