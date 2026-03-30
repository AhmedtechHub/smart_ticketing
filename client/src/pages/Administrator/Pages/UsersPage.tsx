import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "../Components/PageShell";
import { adminApi } from "@/api/adminApi";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  Eye, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Mail,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateUserModal from "../Components/CreateUserModal";
import type { AdminAnalytics } from "@/api/adminApi";

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await adminApi.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      fetchAnalytics(); // Refresh stats
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: "overview", label: "User Overview", icon: Users },
    { id: "permissions", label: "Roles & Permissions", icon: Shield },
    { id: "logs", label: "Audit Logs", icon: Clock },
    { id: "invite", label: "Invite Team", icon: Mail },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-primary/10 text-primary border-none font-medium px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>;
      case "INACTIVE":
        return <Badge variant="outline" className="text-muted-foreground border-border font-medium px-2 py-0.5">Inactive</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-destructive/10 text-destructive border-none font-medium px-2 py-0.5"><XCircle className="w-3 h-3 mr-1" /> Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-500/10 text-purple-600 border-none font-semibold px-2">ADMIN</Badge>;
      case "PLANNER":
        return <Badge className="bg-blue-500/10 text-blue-600 border-none font-semibold px-2">PLANNER</Badge>;
      case "ATTENDEE":
        return <Badge className="bg-slate-500/10 text-slate-600 border-none font-semibold px-2">ATTENDEE</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <PageShell
      title="User Profile Management"
      description="Manage platform users, planners, and administrative staff."
      icon={Users}
      action={{ label: "Add New User", onClick: () => setIsModalOpen(true) }}
    >
      {/* ── Stats Overview ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Total Users", 
            value: analytics?.totalUsers?.toLocaleString() || "0", 
            sub: "+12% from last month", 
            icon: Users, 
            color: "primary" 
          },
          { 
            label: "Active Planners", 
            value: analytics?.activePlanners?.toLocaleString() || "0", 
            sub: "Total planners", 
            icon: Shield, 
            color: "blue" 
          },
          { 
            label: "Total Tickets", 
            value: analytics?.totalTickets?.toLocaleString() || "0", 
            sub: "Across all events", 
            icon: CheckCircle2, 
            color: "emerald" 
          },
          { 
            label: "Revenue", 
            value: `KES ${analytics?.totalRevenue?.toLocaleString() || "0"}`, 
            sub: "Platform total", 
            icon: Download, 
            color: "purple" 
          },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10`}>
                <stat.icon className={`w-5 h-5 text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'}`} />
              </span>
              <span className="text-xs font-semibold text-primary">{stat.sub}</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Tabs (Matching design's tab selector) ────────────────────────── */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit border border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main Content Area ────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 10 }}
           transition={{ duration: 0.2 }}
           className="space-y-4"
        >
          {activeTab === 'overview' ? (
            <>
              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, email, or role..." 
                    className="pl-10 h-10 rounded-xl bg-muted/30 border-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                   <Button variant="outline" className="h-10 rounded-xl border-border hover:bg-muted gap-2">
                     <Filter className="w-4 h-4" /> Filters
                   </Button>
                   <Button variant="outline" className="h-10 rounded-xl border-border hover:bg-muted gap-2">
                     <Download className="w-4 h-4" /> Export
                   </Button>
                   {selectedUsers.length > 0 && (
                     <Button variant="destructive" className="h-10 rounded-xl gap-2 font-semibold">
                       Delete Selected ({selectedUsers.length})
                     </Button>
                   )}
                </div>
              </div>

              {/* User List Table (Matching design's structural layout) */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="px-5 py-4 w-10">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-4 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            User <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Tickets</th>
                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Revenue</th>
                        <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined At</th>
                        <th className="px-4 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-muted/20 transition-colors cursor-pointer">
                          <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                               checked={selectedUsers.includes(user.id)}
                               onChange={() => toggleSelectUser(user.id)}
                             />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                          <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm font-mono font-semibold text-foreground">{user.tickets}</span>
                            <div className="w-16 h-1 w-full bg-muted rounded-full mt-1.5 overflow-hidden">
                               <div className="h-full bg-primary" style={{ width: `${Math.min(user.tickets * 8, 100)}%` }} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                             <p className="text-sm font-bold text-foreground">{user.spent}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Details</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit User</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">Delete User</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer - Pagination (Matching design) */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted/10">
                   <p className="text-sm text-muted-foreground font-medium">
                     Showing 1 to {filteredUsers.length} of {filteredUsers.length} users
                   </p>
                   <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-border disabled:opacity-50" disabled>
                        <ChevronsLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-border disabled:opacity-50" disabled>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="px-3 text-xs font-bold text-foreground">1 / 1</div>
                      <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-border disabled:opacity-50" disabled>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-border disabled:opacity-50" disabled>
                        <ChevronsRight className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border border-dashed p-24 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground">{activeTab.toUpperCase()} Module Placeholder</h3>
              <p className="text-sm text-muted-foreground mt-2">Comprehensive management for {activeTab} will be available in the next release.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUserCreated={() => {
          fetchUsers();
          fetchAnalytics();
        }} 
      />
    </PageShell>
  );
};

export default UsersPage;
