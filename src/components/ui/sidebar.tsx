import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type SidebarContextValue = {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    collapsedWidth?: number;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}

interface SidebarProviderProps {
    children: React.ReactNode;
    collapsed?: boolean;
    collapsedWidth?: number;
}

export function SidebarProvider({
    children,
    collapsed = false,
    collapsedWidth = 56,
}: SidebarProviderProps) {
    const [_collapsed, setCollapsed] = React.useState(collapsed);

    return (
        <SidebarContext.Provider
            value={{
                collapsed: _collapsed,
                setCollapsed,
                collapsedWidth,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    collapsible?: boolean;
}

export function Sidebar({
    children,
    className,
    collapsible = false,
    ...props
}: SidebarProps) {
    return (
        <aside
            className={cn(
                "flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all bg-sidebar",
                className
            )}
            {...props}
        >
            {children}
        </aside>
    );
}

interface SidebarTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({
    className,
    children,
    ...props
}: SidebarTriggerProps) {
    const { collapsed, setCollapsed } = useSidebar();

    return (
        <button
            type="button"
            className={cn(
                "flex h-6 w-6 items-center justify-center rounded-md hover:bg-sidebar-accent",
                className
            )}
            onClick={() => setCollapsed(!collapsed)}
            {...props}
        >
            {children || (
                <ChevronRight
                    className={cn(
                        "h-4 w-4 transition-transform",
                        collapsed ? "rotate-0" : "rotate-180"
                    )}
                />
            )}
            <span className="sr-only">Toggle Sidebar</span>
        </button>
    );
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({
    className,
    children,
    ...props
}: SidebarContentProps) {
    return (
        <div className={cn("flex-1 overflow-hidden", className)} {...props}>
            {children}
        </div>
    );
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function SidebarGroup({
    children,
    className,
    open,
    defaultOpen = false,
    onOpenChange,
    ...props
}: SidebarGroupProps) {
    const [_open, setOpen] = React.useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : _open;

    const handleToggle = () => {
        if (!isControlled) {
            setOpen(!isOpen);
        }
        onOpenChange?.(!isOpen);
    };

    return (
        <div
            className={cn("py-1", className)}
            data-state={isOpen ? "open" : "closed"}
            {...props}
        >
            {React.Children.map(children, (child) => {
                if (
                    React.isValidElement(child) &&
                    child.type === SidebarGroupLabel
                ) {
                    return React.cloneElement(
                        child as React.ReactElement<any>,
                        {
                            onClick: handleToggle,
                            "data-state": isOpen ? "open" : "closed",
                        }
                    );
                }
                if (
                    React.isValidElement(child) &&
                    child.type === SidebarGroupContent
                ) {
                    return isOpen ? child : null;
                }
                return child;
            })}
        </div>
    );
}

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupLabel({
    className,
    children,
    ...props
}: SidebarGroupLabelProps) {
    const { collapsed } = useSidebar();

    if (collapsed) {
        return null;
    }

    return (
        <div
            className={cn(
                "flex cursor-pointer items-center justify-between px-3 py-1 text-xs font-medium uppercase text-sidebar-foreground/50",
                className
            )}
            {...props}
        >
            {children}
            <ChevronRight
                className={cn(
                    "h-4 w-4 transition-transform",
                    props["data-state"] === "open" && "rotate-90"
                )}
            />
        </div>
    );
}

interface SidebarGroupContentProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({
    className,
    children,
    ...props
}: SidebarGroupContentProps) {
    return (
        <div className={cn("space-y-1", className)} {...props}>
            {children}
        </div>
    );
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({
    className,
    children,
    ...props
}: SidebarMenuProps) {
    return (
        <div className={cn("space-y-0.5", className)} {...props}>
            {children}
        </div>
    );
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenuItem({
    className,
    children,
    ...props
}: SidebarMenuItemProps) {
    return (
        <div className={cn("flex", className)} {...props}>
            {children}
        </div>
    );
}

interface SidebarMenuButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

export function SidebarMenuButton({
    className,
    children,
    asChild = false,
    ...props
}: SidebarMenuButtonProps) {
    if (asChild) {
        return React.Children.only(children);
    }

    return (
        <button
            type="button"
            className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
