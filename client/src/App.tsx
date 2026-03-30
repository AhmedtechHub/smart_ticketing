import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Landing from './pages/LandingPage/Landing';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AuthCallback from './pages/Auth/AuthCallback';
import EventDetailPage from './pages/Attendee/EventDetailPage';
import CheckoutPage from './pages/Attendee/CheckoutPage';
import SuccessPage from './pages/Attendee/SuccessPage';
import ExplorePage from './pages/Attendee/ExplorePage';
import PricingPage from './pages/PricingPage';
import AdminLayout from './pages/Administrator/Components/AdminLayout';
import AdminDashboard from './pages/Administrator/AdminDashboard';
import AnalyticsPage from './pages/Administrator/Pages/AnalyticsPage';
import EventsPage from './pages/Administrator/Pages/EventsPage';
import ApprovalsPage from './pages/Administrator/Pages/ApprovalsPage';
import ArchivedEventsPage from './pages/Administrator/Pages/ArchivedEventsPage';
import SchedulePage from './pages/Administrator/Pages/SchedulePage';
import UsersPage from './pages/Administrator/Pages/UsersPage';
import PaymentsPage from './pages/Administrator/Pages/PaymentsPage';
import TicketsPage from './pages/Administrator/Pages/TicketsPage';
import TicketGeneratorPage from './pages/Administrator/Pages/TicketGeneratorPage';
import TicketGalleryPage from './pages/Administrator/Pages/TicketGalleryPage';
import NotificationsPage from './pages/Administrator/Pages/NotificationsPage';
import SettingsPage from './pages/Administrator/Pages/SettingsPage';
import PlaceholderPage from './pages/Administrator/Pages/PlaceholderPage';
import {
  UserPlus,
  Shield,
  CreditCard,
  Mail,
  MessageSquare,
  Star,
  PlusCircle,
  CalendarCheck,
  Archive,
  Ticket,
  Users,
  Bell,
  Settings
} from 'lucide-react';
import { authClient } from './api/apiConfig';
import PlannerDashboard from './pages/Planner/PlannerDashboard';
import PlannerLayout from './pages/Planner/Components/PlannerLayout';
import PlannerEventsPage from './pages/Planner/Pages/PlannerEventsPage';
import PlannerArchivePage from './pages/Planner/Pages/PlannerArchivePage';
import AttendeesPage from './pages/Planner/Pages/AttendeesPage';
import TicketTiersPage from './pages/Planner/Pages/TicketTiersPage';
import EventInsightsPage from './pages/Planner/Pages/EventInsightsPage';
import PayoutsPage from './pages/Planner/Pages/PayoutsPage';
import CreateEventPage from './pages/Planner/Pages/CreateEventPage';

const RoleRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { data: session, isPending } = authClient.useSession();
  
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!session?.user) return <Navigate to="/login" replace />;
  
  const userRole = (session.user as any).role;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/auth/callback" replace />;
  
  return <>{children}</>;
};

export function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events" element={<ExplorePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout/:eventId" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<SuccessPage />} />

        {/* System Admin Routes */}
        <Route path="/admin" element={<RoleRoute allowedRoles={['ADMIN']}><AdminLayout /></RoleRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          
          {/* Event Management */}
          <Route path="events" element={<EventsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="events/archived" element={<ArchivedEventsPage />} />
          <Route path="schedule" element={<SchedulePage />} />

          {/* Ticket Management */}
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/generate" element={<TicketGeneratorPage />} />
          <Route path="tickets/gallery" element={<TicketGalleryPage />} />

          {/* User Management */}
          <Route path="users" element={<UsersPage />} />
          <Route path="users/create" element={<PlaceholderPage title="Create User" icon={UserPlus} />} />
          <Route path="users/planners" element={<PlaceholderPage title="Event Planners" icon={Shield} />} />

          {/* Payments */}
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="payments/disbursements" element={<PlaceholderPage title="Disbursements" icon={CreditCard} />} />

          {/* Communications */}
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="broadcast" element={<PlaceholderPage title="Broadcast Center" icon={Mail} />} />
          <Route path="messages" element={<PlaceholderPage title="Messages" icon={MessageSquare} />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Event Planners Dashboard */}
        <Route path="/planner" element={<RoleRoute allowedRoles={['PLANNER', 'ADMIN']}><PlannerLayout /></RoleRoute>}>
          <Route index element={<PlannerDashboard />} />
          <Route path="insights" element={<EventInsightsPage />} />
          <Route path="create" element={<CreateEventPage />} />
          <Route path="events" element={<PlannerEventsPage />} />
          <Route path="archived" element={<PlannerArchivePage />} />
          <Route path="tickets" element={<TicketTiersPage />} />
          <Route path="attendees" element={<AttendeesPage />} />
          <Route path="payouts" element={<PayoutsPage />} />
          <Route path="notifications" element={<PlaceholderPage title="Notifications" icon={Bell} />} />
          <Route path="support" element={<PlaceholderPage title="Support Hub" icon={MessageSquare} />} />
          <Route path="settings" element={<PlaceholderPage title="Planner Settings" icon={Settings} />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
