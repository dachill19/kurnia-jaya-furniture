import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingCart,
  ChartBar,
  Bell,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import AdminHeader from './Header';

const AdminLayout = () => {
  const { collapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const getNavClass = (path: string) =>
    isActive(path)
      ? 'bg-kj-red/10 text-kj-red font-medium'
      : 'hover:bg-muted/50';

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: ChartBar },
    { title: 'Pengguna', path: '/admin/users', icon: Users },
    { title: 'Produk', path: '/admin/products', icon: Package },
    { title: 'Pesanan', path: '/admin/orders', icon: ShoppingCart },
    { title: 'Notifikasi', path: '/admin/notifications', icon: Bell },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        className={collapsed ? 'w-14 border-r' : 'w-64 border-r'}
        collapsible
      >
        <SidebarTrigger className="m-2 self-end" />
        <div
          className={`px-3 py-2 ${collapsed ? 'flex justify-center' : ''}`}
        >
          {collapsed ? (
            <span className="text-kj-red font-bold">KJ</span>
          ) : (
            <h2 className="text-lg font-serif font-bold text-kj-red">
              Admin Panel
            </h2>
          )}
        </div>

        <SidebarContent>
          {!collapsed && (
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={getNavClass(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarContent>
      </Sidebar>

      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
