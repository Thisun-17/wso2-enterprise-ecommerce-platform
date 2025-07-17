import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  User, 
  Mail,
  AlertCircle,
  Loader2,
  RefreshCw,
  UserCheck,
  UserX
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

const mockUsers: User[] = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    isActive: true,
    lastLogin: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'admin',
    isActive: true,
    lastLogin: new Date('2024-01-16'),
    createdAt: new Date('2024-01-02')
  },
  {
    id: 3,
    username: 'mike_wilson',
    email: 'mike@example.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'customer',
    isActive: false,
    lastLogin: new Date('2024-01-10'),
    createdAt: new Date('2024-01-03')
  },
  {
    id: 4,
    username: 'sarah_connor',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Connor',
    role: 'admin',
    isActive: true,
    lastLogin: new Date('2024-01-16'),
    createdAt: new Date('2024-01-04')
  },
  {
    id: 5,
    username: 'bob_johnson',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    role: 'customer',
    isActive: true,
    lastLogin: new Date('2024-01-14'),
    createdAt: new Date('2024-01-05')
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const roles = ['All', 'admin', 'customer'];
  const statuses = ['All', 'Active', 'Inactive'];

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would be:
      // const response = await fetch('http://localhost:3002/users');
      // const data = await response.json();
      // setUsers(data.data);
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'All') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(user => 
        selectedStatus === 'Active' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-gradient-wso2 text-white' 
      : 'bg-secondary text-secondary-foreground';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-success text-success-foreground' 
      : 'bg-destructive text-destructive-foreground';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your application users and their permissions
          </p>
        </div>
        <Button 
          onClick={fetchUsers}
          className="bg-gradient-wso2 hover:opacity-90 text-white shadow-wso2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-elegant">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <Button
                  key={role}
                  variant={selectedRole === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                  className={selectedRole === role ? 'bg-gradient-wso2 text-white' : ''}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {role}
                </Button>
              ))}
              {statuses.map(status => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? 'bg-gradient-wso2 text-white' : ''}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Users ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getRoleColor(user.role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(user.isActive)}>
                        {user.isActive ? (
                          <UserCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <UserX className="h-3 w-3 mr-1" />
                        )}
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-foreground">
                        {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={user.isActive ? 'text-destructive' : 'text-success'}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}