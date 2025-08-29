import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  role: 'admin' | 'user';
}

interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive';
  lastActivity: string;
  createdAt: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User>({ id: '1', role: 'admin' });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    department: '',
    role: 'user' as 'admin' | 'user' | 'viewer'
  });

  const users: SystemUser[] = [
    {
      id: '1',
      fullName: 'Иванов Алексей Иванович',
      email: 'a.ivanov@company.ru',
      department: 'IT отдел',
      role: 'admin',
      status: 'active',
      lastActivity: '2 минуты назад',
      createdAt: '15.01.2024'
    },
    {
      id: '2',
      fullName: 'Петрова Мария Сергеевна',
      email: 'm.petrova@company.ru',
      department: 'Бухгалтерия',
      role: 'user',
      status: 'active',
      lastActivity: '1 час назад',
      createdAt: '20.01.2024'
    },
    {
      id: '3',
      fullName: 'Сидоров Петр Петрович',
      email: 'p.sidorov@company.ru',
      department: 'Склад',
      role: 'viewer',
      status: 'inactive',
      lastActivity: '3 дня назад',
      createdAt: '10.01.2024'
    },
    {
      id: '4',
      fullName: 'Козлова Елена Владимировна',
      email: 'e.kozlova@company.ru',
      department: 'HR',
      role: 'user',
      status: 'active',
      lastActivity: '30 минут назад',
      createdAt: '25.01.2024'
    },
    {
      id: '5',
      fullName: 'Морозов Дмитрий Александрович',
      email: 'd.morozov@company.ru',
      department: 'IT отдел',
      role: 'admin',
      status: 'active',
      lastActivity: '5 минут назад',
      createdAt: '12.01.2024'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    console.log('Добавление пользователя:', newUser);
    setIsAddUserOpen(false);
    setNewUser({
      fullName: '',
      email: '',
      department: '',
      role: 'user'
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'user': return 'Пользователь';
      case 'viewer': return 'Только чтение';
      default: return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'user': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'secondary';
    }
  };

  const stats = [
    { title: 'Всего пользователей', value: '148', icon: 'Users', color: 'text-blue-600' },
    { title: 'Рабочих мест', value: '89', icon: 'Monitor', color: 'text-green-600' },
    { title: 'Комплектующих', value: '324', icon: 'HardDrive', color: 'text-purple-600' },
    { title: 'Активных сессий', value: '23', icon: 'Activity', color: 'text-orange-600' },
  ];

  const recentActivity = [
    { action: 'Добавлено новое рабочее место', user: 'Иванов А.И.', time: '10:30', type: 'create' },
    { action: 'Обновлен статус комплектующих', user: 'Петрова М.С.', time: '09:15', type: 'update' },
    { action: 'Создан отчет по оборудованию', user: 'Сидоров П.П.', time: '08:45', type: 'report' },
  ];

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'users', label: 'Пользователи', icon: 'Users' },
    { id: 'workplaces', label: 'Рабочие места', icon: 'Monitor' },
    { id: 'components', label: 'Комплектующие', icon: 'HardDrive' },
    { id: 'reports', label: 'Отчеты', icon: 'FileText' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
    { id: 'print', label: 'Печать', icon: 'Printer' },
  ];

  const toggleRole = () => {
    setCurrentUser(prev => ({ 
      ...prev, 
      role: prev.role === 'admin' ? 'user' : 'admin' 
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-primary">
              Система управления паспортами
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRole}
              className="flex items-center space-x-2"
            >
              <Icon name="UserCog" size={16} />
              <span>{currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentUser.role === 'admin' ? 'А' : 'П'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <Badge variant="secondary" className="text-sm">
                  Автоматическое отслеживание изменений активно
                </Badge>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <Icon name={stat.icon} className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon name="Clock" size={20} />
                      <span>Последняя активность</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'create' ? 'bg-green-500' :
                            activity.type === 'update' ? 'bg-blue-500' : 'bg-orange-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon name="Shield" size={20} />
                      <span>Статус системы</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">Система работает</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Активно
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">Резервное копирование</span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Запланировано
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-medium">Обновления</span>
                        </div>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Доступны
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Access Level Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Lock" size={20} />
                    <span>Уровень доступа</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="Crown" size={18} className="text-primary" />
                        <span className="font-medium">Администратор</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Полный доступ ко всем функциям системы
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="User" size={18} className="text-gray-600" />
                        <span className="font-medium">Пользователь</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Ограниченный доступ к просмотру и базовым операциям
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="Eye" size={18} className="text-gray-600" />
                        <span className="font-medium">Только чтение</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Доступ только для просмотра информации
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Управление пользователями</h1>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Icon name="UserPlus" size={16} />
                      <span>Добавить пользователя</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Добавить нового пользователя</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Полное имя</Label>
                        <Input
                          id="fullName"
                          value={newUser.fullName}
                          onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Иванов Иван Иванович"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="user@company.ru"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Отдел</Label>
                        <Input
                          id="department"
                          value={newUser.department}
                          onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="IT отдел"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Роль</Label>
                        <Select value={newUser.role} onValueChange={(value: 'admin' | 'user' | 'viewer') => setNewUser(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Администратор</SelectItem>
                            <SelectItem value="user">Пользователь</SelectItem>
                            <SelectItem value="viewer">Только чтение</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Отмена
                        </Button>
                        <Button onClick={handleAddUser}>
                          Добавить
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Поиск по имени, email или отделу..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Фильтр по роли" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все роли</SelectItem>
                        <SelectItem value="admin">Администратор</SelectItem>
                        <SelectItem value="user">Пользователь</SelectItem>
                        <SelectItem value="viewer">Только чтение</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Фильтр по статусу" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        <SelectItem value="active">Активные</SelectItem>
                        <SelectItem value="inactive">Неактивные</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Список пользователей ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Пользователь</TableHead>
                        <TableHead>Отдел</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Последняя активность</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {user.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.fullName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : 'bg-gray-100 text-gray-800'
                            }>
                              {user.status === 'active' ? 'Активен' : 'Неактивен'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{user.lastActivity}</TableCell>
                          <TableCell className="text-sm text-gray-600">{user.createdAt}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Icon name="Edit" size={14} />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* User Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Распределение по ролям</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Администраторы</span>
                        <span className="font-medium">{users.filter(u => u.role === 'admin').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Пользователи</span>
                        <span className="font-medium">{users.filter(u => u.role === 'user').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Только чтение</span>
                        <span className="font-medium">{users.filter(u => u.role === 'viewer').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Активность</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Активные</span>
                        <span className="font-medium text-green-600">{users.filter(u => u.status === 'active').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Неактивные</span>
                        <span className="font-medium text-gray-600">{users.filter(u => u.status === 'inactive').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">По отделам</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[...new Set(users.map(u => u.department))].map(dept => (
                        <div key={dept} className="flex items-center justify-between">
                          <span className="text-sm">{dept}</span>
                          <span className="font-medium">{users.filter(u => u.department === dept).length}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {activeSection !== 'dashboard' && activeSection !== 'users' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Icon name="Construction" size={48} className="mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {navigation.find(nav => nav.id === activeSection)?.label}
                </h2>
                <p className="text-gray-600">
                  Раздел находится в разработке
                </p>
                {currentUser.role === 'user' && (
                  <Badge variant="outline" className="mt-2">
                    Требуются права администратора
                  </Badge>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;