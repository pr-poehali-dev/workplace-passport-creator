import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  password?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface Workplace {
  id: string;
  userId?: string;
  computerNumber: string;
  ipAddress: string;
  sealNumber: string;
  processor: string;
  hardDrive: string;
  ramAmount: string;
  videoAdapter: string;
  operatingSystem: string;
  assemblyDate: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
}

interface WorkplaceFormData {
  computerNumber: string;
  ipAddress: string;
  sealNumber: string;
  processor: string;
  hardDrive: string;
  ramAmount: string;
  videoAdapter: string;
  operatingSystem: string;
  assemblyDate: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [loginForm, setLoginForm] = useState<LoginCredentials>({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: '1',
      fullName: 'Иванов Алексей Иванович',
      email: 'admin@company.ru',
      department: 'IT отдел',
      role: 'admin',
      status: 'active',
      lastActivity: '2 минуты назад',
      createdAt: '15.01.2024',
      password: 'admin123'
    },
    {
      id: '2',
      fullName: 'Петрова Мария Сергеевна',
      email: 'user@company.ru',
      department: 'Бухгалтерия',
      role: 'user',
      status: 'active',
      lastActivity: '1 час назад',
      createdAt: '20.01.2024',
      password: 'user123'
    },
    {
      id: '3',
      fullName: 'Сидоров Петр Петрович',
      email: 'viewer@company.ru',
      department: 'Склад',
      role: 'viewer',
      status: 'active',
      lastActivity: '3 дня назад',
      createdAt: '10.01.2024',
      password: 'viewer123'
    },
    {
      id: '4',
      fullName: 'Козлова Елена Владимировна',
      email: 'e.kozlova@company.ru',
      department: 'HR',
      role: 'user',
      status: 'active',
      lastActivity: '30 минут назад',
      createdAt: '25.01.2024',
      password: 'hr123'
    },
    {
      id: '5',
      fullName: 'Морозов Дмитрий Александрович',
      email: 'd.morozov@company.ru',
      department: 'IT отдел',
      role: 'admin',
      status: 'active',
      lastActivity: '5 минут назад',
      createdAt: '12.01.2024',
      password: 'it123'
    }
  ]);

  const [workplaces, setWorkplaces] = useState<Workplace[]>([
    {
      id: '1',
      userId: '2',
      computerNumber: 'PC-001',
      ipAddress: '192.168.1.101',
      sealNumber: 'SEAL-001',
      processor: 'Intel Core i5-12400F',
      hardDrive: 'SSD 512GB Samsung 980',
      ramAmount: '16 ГБ DDR4-3200',
      videoAdapter: 'NVIDIA GTX 1660 Super',
      operatingSystem: 'Windows 11 Pro',
      assemblyDate: '15.01.2024',
      location: 'Кабинет 205',
      status: 'active'
    },
    {
      id: '2',
      computerNumber: 'PC-002',
      ipAddress: '192.168.1.102',
      sealNumber: 'SEAL-002',
      processor: 'AMD Ryzen 5 5600X',
      hardDrive: 'SSD 256GB + HDD 1TB',
      ramAmount: '8 ГБ DDR4-3200',
      videoAdapter: 'Встроенная AMD Radeon',
      operatingSystem: 'Windows 10 Pro',
      assemblyDate: '20.01.2024',
      location: 'Кабинет 101',
      status: 'active'
    }
  ]);

  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    department: '',
    role: 'user' as 'admin' | 'user' | 'viewer',
    password: '',
    confirmPassword: ''
  });

  const [isAddWorkplaceOpen, setIsAddWorkplaceOpen] = useState(false);
  const [isEditWorkplaceOpen, setIsEditWorkplaceOpen] = useState(false);
  const [editingWorkplace, setEditingWorkplace] = useState<Workplace | null>(null);
  const [workplaceToDelete, setWorkplaceToDelete] = useState<Workplace | null>(null);
  const [newWorkplace, setNewWorkplace] = useState<WorkplaceFormData>({
    computerNumber: '',
    ipAddress: '',
    sealNumber: '',
    processor: '',
    hardDrive: '',
    ramAmount: '',
    videoAdapter: '',
    operatingSystem: '',
    assemblyDate: '',
    location: '',
    status: 'active'
  });

  const [isAssignUserOpen, setIsAssignUserOpen] = useState(false);
  const [assigningWorkplace, setAssigningWorkplace] = useState<Workplace | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  const [workplaceSearchTerm, setWorkplaceSearchTerm] = useState('');
  const [workplaceFilterStatus, setWorkplaceFilterStatus] = useState('all');
  
  const [settings, setSettings] = useState({
    theme: 'blue',
    compactMode: false,
    autoSave: true,
    notifications: true,
    language: 'ru'
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);



  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getWorkplaceUser = (userId?: string) => {
    return userId ? users.find(u => u.id === userId) : null;
  };

  const filteredWorkplaces = workplaces.filter(workplace => {
    const assignedUser = getWorkplaceUser(workplace.userId);
    const matchesSearch = workplace.computerNumber.toLowerCase().includes(workplaceSearchTerm.toLowerCase()) ||
                         workplace.ipAddress.toLowerCase().includes(workplaceSearchTerm.toLowerCase()) ||
                         workplace.location.toLowerCase().includes(workplaceSearchTerm.toLowerCase()) ||
                         (assignedUser && assignedUser.fullName.toLowerCase().includes(workplaceSearchTerm.toLowerCase()));
    const matchesStatus = workplaceFilterStatus === 'all' || workplace.status === workplaceFilterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    
    const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
    const newSystemUser: SystemUser = {
      id: newId,
      fullName: newUser.fullName,
      email: newUser.email,
      department: newUser.department,
      role: newUser.role,
      status: 'active',
      lastActivity: 'Только что создан',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      password: newUser.password
    };
    
    setUsers(prev => [...prev, newSystemUser]);
    setIsAddUserOpen(false);
    setNewUser({
      fullName: '',
      email: '',
      department: '',
      role: 'user',
      password: '',
      confirmPassword: ''
    });
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    setUsers(prev => prev.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setIsEditUserOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (user: SystemUser) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setUserToDelete(null);
  };

  const handleAddWorkplace = () => {
    const workplace: Workplace = {
      id: Date.now().toString(),
      ...newWorkplace
    };
    
    setWorkplaces(prev => [...prev, workplace]);
    setNewWorkplace({
      computerNumber: '',
      ipAddress: '',
      sealNumber: '',
      processor: '',
      hardDrive: '',
      ramAmount: '',
      videoAdapter: '',
      operatingSystem: '',
      assemblyDate: '',
      location: '',
      status: 'active'
    });
    setIsAddWorkplaceOpen(false);
  };

  const handleEditWorkplace = (workplace: Workplace) => {
    setEditingWorkplace(workplace);
    setIsEditWorkplaceOpen(true);
  };

  const handleUpdateWorkplace = () => {
    if (!editingWorkplace) return;
    
    setWorkplaces(prev => prev.map(wp => 
      wp.id === editingWorkplace.id ? editingWorkplace : wp
    ));
    setIsEditWorkplaceOpen(false);
    setEditingWorkplace(null);
  };

  const handleDeleteWorkplace = (workplace: Workplace) => {
    setWorkplaces(prev => prev.filter(wp => wp.id !== workplace.id));
    setWorkplaceToDelete(null);
  };

  const handleOpenAssignUser = (workplace: Workplace) => {
    setAssigningWorkplace(workplace);
    setSelectedUserId(workplace.userId || '');
    setIsAssignUserOpen(true);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (settings.notifications) {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleConfirmAssignWorkplace = () => {
    if (!assigningWorkplace) return;
    
    const selectedUser = users.find(u => u.id === selectedUserId);
    
    setWorkplaces(prev => prev.map(wp => 
      wp.id === assigningWorkplace.id ? { ...wp, userId: selectedUserId || undefined } : wp
    ));
    
    if (selectedUser) {
      showNotification(`ПК ${assigningWorkplace.computerNumber} назначен пользователю ${selectedUser.fullName}`, 'success');
    } else {
      showNotification(`Назначение ПК ${assigningWorkplace.computerNumber} снято`, 'info');
    }
    
    setIsAssignUserOpen(false);
    setAssigningWorkplace(null);
    setSelectedUserId('');
  };

  const handleExportData = () => {
    const exportData = {
      users: users.map(({ password, ...user }) => user),
      workplaces,
      settings,
      exportDate: new Date().toISOString(),
      version: '2.1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passport-system-backup-${new Date().toLocaleDateString('ru-RU')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Данные экспортированы успешно', 'success');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (importData.users) setUsers(importData.users);
        if (importData.workplaces) setWorkplaces(importData.workplaces);
        if (importData.settings) setSettings(importData.settings);
        
        showNotification('Данные импортированы успешно', 'success');
      } catch (error) {
        showNotification('Ошибка импорта данных', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateBackup = () => {
    handleExportData();
    showNotification('Резервная копия создана', 'success');
  };

  const getThemeClasses = () => {
    const baseClasses = settings.compactMode ? 'space-y-4' : 'space-y-6';
    return baseClasses;
  };

  const handlePrintPassport = (workplace: Workplace) => {
    const user = getWorkplaceUser(workplace.userId);
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Паспорт рабочего места ${workplace.computerNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .info-row { display: flex; margin: 10px 0; }
            .label { font-weight: bold; width: 200px; }
            .value { flex: 1; border-bottom: 1px dotted #000; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ПАСПОРТ РАБОЧЕГО МЕСТА</h1>
            <h2>${workplace.computerNumber}</h2>
          </div>
          
          <h3>Информация о пользователе:</h3>
          <div class="info-row">
            <span class="label">ФИО:</span>
            <span class="value">${user?.fullName || 'Не назначен'}</span>
          </div>
          <div class="info-row">
            <span class="label">Отдел:</span>
            <span class="value">${user?.department || 'Не назначен'}</span>
          </div>
          <div class="info-row">
            <span class="label">Должность:</span>
            <span class="value">${getRoleLabel(user?.role || 'user')}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${user?.email || 'Не назначен'}</span>
          </div>
          
          <h3>Техническая информация:</h3>
          <div class="info-row">
            <span class="label">Номер компьютера:</span>
            <span class="value">${workplace.computerNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">IP адрес:</span>
            <span class="value">${workplace.ipAddress}</span>
          </div>
          <div class="info-row">
            <span class="label">Номер пломбы:</span>
            <span class="value">${workplace.sealNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Процессор:</span>
            <span class="value">${workplace.processor}</span>
          </div>
          <div class="info-row">
            <span class="label">Жесткий диск:</span>
            <span class="value">${workplace.hardDrive}</span>
          </div>
          <div class="info-row">
            <span class="label">Оперативная память:</span>
            <span class="value">${workplace.ramAmount}</span>
          </div>
          <div class="info-row">
            <span class="label">Видео адаптер:</span>
            <span class="value">${workplace.videoAdapter}</span>
          </div>
          <div class="info-row">
            <span class="label">Операционная система:</span>
            <span class="value">${workplace.operatingSystem}</span>
          </div>
          <div class="info-row">
            <span class="label">Дата сборки:</span>
            <span class="value">${workplace.assemblyDate}</span>
          </div>
          <div class="info-row">
            <span class="label">Местоположение:</span>
            <span class="value">${workplace.location}</span>
          </div>
          
          <div style="margin-top: 40px; text-align: center;">
            <p>Дата печати: ${new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
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
    { title: 'Всего пользователей', value: users.length.toString(), icon: 'Users', color: 'text-blue-600' },
    { title: 'Рабочих мест', value: workplaces.length.toString(), icon: 'Monitor', color: 'text-green-600' },
    { title: 'Назначенных мест', value: workplaces.filter(wp => wp.userId).length.toString(), icon: 'HardDrive', color: 'text-purple-600' },
    { title: 'Активных систем', value: workplaces.filter(wp => wp.status === 'active').length.toString(), icon: 'Activity', color: 'text-orange-600' },
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const user = users.find(u => 
      u.email === loginForm.email && 
      u.password === loginForm.password && 
      u.status === 'active'
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoginForm({ email: '', password: '' });
      
      // Обновляем время последней активности
      setUsers(prev => prev.map(u => 
        u.id === user.id 
          ? { ...u, lastActivity: 'Только что' }
          : u
      ));
    } else {
      setLoginError('Неверный email или пароль, либо аккаунт неактивен');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveSection('dashboard');
  };

  const toggleRole = () => {
    if (currentUser) {
      const newRole = currentUser.role === 'admin' ? 'user' : 'admin';
      const updatedUser = { ...currentUser, role: newRole as 'admin' | 'user' | 'viewer' };
      setCurrentUser(updatedUser);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary mb-2">
              Система управления паспортами
            </CardTitle>
            <p className="text-gray-600">Введите учетные данные для входа</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@company.ru"
                  required
                />
              </div>
              <div>
                <Label htmlFor="loginPassword">Пароль</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Введите пароль"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Тестовые учетные данные:</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Администратор:</strong> admin@company.ru / admin123</div>
                <div><strong>Пользователь:</strong> user@company.ru / user123</div>
                <div><strong>Только чтение:</strong> viewer@company.ru / viewer123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name={
                notification.type === 'success' ? 'CheckCircle' :
                notification.type === 'error' ? 'XCircle' :
                'Info'
              } size={20} />
              <span>{notification.message}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotification(null)}
              className="text-white hover:bg-white/20"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-primary">
              Система управления паспортами
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Добро пожаловать, <span className="font-medium">{currentUser?.fullName}</span>
            </div>
            <Badge variant="outline">
              {getRoleLabel(currentUser?.role || 'user')}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <Icon name="LogOut" size={16} />
              <span>Выйти</span>
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentUser?.fullName.split(' ').map(n => n[0]).join('') || 'U'}
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
                      <div>
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Введите пароль"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={newUser.confirmPassword}
                          onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Повторите пароль"
                        />
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
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                <Icon name="Edit" size={14} />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Удаление пользователя</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Вы уверены, что хотите удалить пользователя "{user.fullName}"? 
                                      Это действие нельзя отменить.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteUser(user)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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

          {/* Edit User Dialog */}
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Редактировать пользователя</DialogTitle>
              </DialogHeader>
              {editingUser && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editFullName">Полное имя</Label>
                    <Input
                      id="editFullName"
                      value={editingUser.fullName}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDepartment">Отдел</Label>
                    <Input
                      id="editDepartment"
                      value={editingUser.department}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, department: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editRole">Роль</Label>
                    <Select 
                      value={editingUser.role} 
                      onValueChange={(value: 'admin' | 'user' | 'viewer') => 
                        setEditingUser(prev => prev ? { ...prev, role: value } : null)
                      }
                    >
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
                  <div>
                    <Label htmlFor="editStatus">Статус</Label>
                    <Select 
                      value={editingUser.status} 
                      onValueChange={(value: 'active' | 'inactive') => 
                        setEditingUser(prev => prev ? { ...prev, status: value } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активен</SelectItem>
                        <SelectItem value="inactive">Неактивен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleUpdateUser}>
                      Сохранить
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Workplaces Section */}
          {activeSection === 'workplaces' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Рабочие места</h1>
                <div className="flex space-x-4">
                  <Button onClick={() => setIsAddWorkplaceOpen(true)}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить рабочее место
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Поиск по номеру ПК, IP, местоположению или пользователю..."
                    value={workplaceSearchTerm}
                    onChange={(e) => setWorkplaceSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={workplaceFilterStatus} onValueChange={setWorkplaceFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Фильтр по статусу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="inactive">Неактивные</SelectItem>
                    <SelectItem value="maintenance">Обслуживание</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер ПК</TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>IP адрес</TableHead>
                      <TableHead>Местоположение</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkplaces.map((workplace) => {
                      const assignedUser = getWorkplaceUser(workplace.userId);
                      return (
                        <TableRow key={workplace.id}>
                          <TableCell className="font-medium">{workplace.computerNumber}</TableCell>
                          <TableCell>
                            {assignedUser ? (
                              <div>
                                <div className="font-medium">{assignedUser.fullName}</div>
                                <div className="text-sm text-gray-500">{assignedUser.department}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Не назначен</span>
                            )}
                          </TableCell>
                          <TableCell>{workplace.ipAddress}</TableCell>
                          <TableCell>{workplace.location}</TableCell>
                          <TableCell>
                            <Badge variant={workplace.status === 'active' ? 'default' : workplace.status === 'maintenance' ? 'secondary' : 'outline'}>
                              {workplace.status === 'active' ? 'Активный' : workplace.status === 'maintenance' ? 'Обслуживание' : 'Неактивный'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditWorkplace(workplace)}>
                                <Icon name="Edit" size={14} />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handlePrintPassport(workplace)}>
                                <Icon name="Printer" size={14} />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setWorkplaceToDelete(workplace)}>
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Удалить рабочее место?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Это действие нельзя отменить. Рабочее место {workplace.computerNumber} будет удалено безвозвратно.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => workplaceToDelete && handleDeleteWorkplace(workplaceToDelete)}>
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Add Workplace Dialog */}
              <Dialog open={isAddWorkplaceOpen} onOpenChange={setIsAddWorkplaceOpen}>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Добавить рабочее место</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="computerNumber">Номер компьютера</Label>
                      <Input
                        id="computerNumber"
                        value={newWorkplace.computerNumber}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, computerNumber: e.target.value }))}
                        placeholder="PC-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ipAddress">IP адрес</Label>
                      <Input
                        id="ipAddress"
                        value={newWorkplace.ipAddress}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, ipAddress: e.target.value }))}
                        placeholder="192.168.1.101"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sealNumber">Номер пломбы</Label>
                      <Input
                        id="sealNumber"
                        value={newWorkplace.sealNumber}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, sealNumber: e.target.value }))}
                        placeholder="SEAL-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Местоположение</Label>
                      <Input
                        id="location"
                        value={newWorkplace.location}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Кабинет 205"
                      />
                    </div>
                    <div>
                      <Label htmlFor="processor">Процессор</Label>
                      <Input
                        id="processor"
                        value={newWorkplace.processor}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, processor: e.target.value }))}
                        placeholder="Intel Core i5-12400F"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hardDrive">Жесткий диск</Label>
                      <Input
                        id="hardDrive"
                        value={newWorkplace.hardDrive}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, hardDrive: e.target.value }))}
                        placeholder="SSD 512GB Samsung 980"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ramAmount">Оперативная память</Label>
                      <Input
                        id="ramAmount"
                        value={newWorkplace.ramAmount}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, ramAmount: e.target.value }))}
                        placeholder="16 ГБ DDR4-3200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="videoAdapter">Видео адаптер</Label>
                      <Input
                        id="videoAdapter"
                        value={newWorkplace.videoAdapter}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, videoAdapter: e.target.value }))}
                        placeholder="NVIDIA GTX 1660 Super"
                      />
                    </div>
                    <div>
                      <Label htmlFor="operatingSystem">Операционная система</Label>
                      <Input
                        id="operatingSystem"
                        value={newWorkplace.operatingSystem}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, operatingSystem: e.target.value }))}
                        placeholder="Windows 11 Pro"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assemblyDate">Дата сборки</Label>
                      <Input
                        id="assemblyDate"
                        value={newWorkplace.assemblyDate}
                        onChange={(e) => setNewWorkplace(prev => ({ ...prev, assemblyDate: e.target.value }))}
                        placeholder="15.01.2024"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="status">Статус</Label>
                      <Select value={newWorkplace.status} onValueChange={(value: 'active' | 'inactive' | 'maintenance') => setNewWorkplace(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Активный</SelectItem>
                          <SelectItem value="inactive">Неактивный</SelectItem>
                          <SelectItem value="maintenance">Обслуживание</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddWorkplaceOpen(false)}>Отмена</Button>
                    <Button onClick={handleAddWorkplace}>Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Workplace Dialog */}
              <Dialog open={isEditWorkplaceOpen} onOpenChange={setIsEditWorkplaceOpen}>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Редактировать рабочее место</DialogTitle>
                  </DialogHeader>
                  {editingWorkplace && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editComputerNumber">Номер компьютера</Label>
                        <Input
                          id="editComputerNumber"
                          value={editingWorkplace.computerNumber}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, computerNumber: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editIpAddress">IP адрес</Label>
                        <Input
                          id="editIpAddress"
                          value={editingWorkplace.ipAddress}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, ipAddress: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editSealNumber">Номер пломбы</Label>
                        <Input
                          id="editSealNumber"
                          value={editingWorkplace.sealNumber}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, sealNumber: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editLocation">Местоположение</Label>
                        <Input
                          id="editLocation"
                          value={editingWorkplace.location}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, location: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editProcessor">Процессор</Label>
                        <Input
                          id="editProcessor"
                          value={editingWorkplace.processor}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, processor: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editHardDrive">Жесткий диск</Label>
                        <Input
                          id="editHardDrive"
                          value={editingWorkplace.hardDrive}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, hardDrive: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editRamAmount">Оперативная память</Label>
                        <Input
                          id="editRamAmount"
                          value={editingWorkplace.ramAmount}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, ramAmount: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editVideoAdapter">Видео адаптер</Label>
                        <Input
                          id="editVideoAdapter"
                          value={editingWorkplace.videoAdapter}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, videoAdapter: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editOperatingSystem">Операционная система</Label>
                        <Input
                          id="editOperatingSystem"
                          value={editingWorkplace.operatingSystem}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, operatingSystem: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editAssemblyDate">Дата сборки</Label>
                        <Input
                          id="editAssemblyDate"
                          value={editingWorkplace.assemblyDate}
                          onChange={(e) => setEditingWorkplace(prev => prev ? { ...prev, assemblyDate: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editStatus">Статус</Label>
                        <Select value={editingWorkplace.status} onValueChange={(value: 'active' | 'inactive' | 'maintenance') => setEditingWorkplace(prev => prev ? { ...prev, status: value } : null)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Активный</SelectItem>
                            <SelectItem value="inactive">Неактивный</SelectItem>
                            <SelectItem value="maintenance">Обслуживание</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editAssignedUser">Назначить пользователя</Label>
                        <Select 
                          value={editingWorkplace.userId || ''} 
                          onValueChange={(value) => setEditingWorkplace(prev => prev ? { ...prev, userId: value || undefined } : null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите пользователя" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Не назначать</SelectItem>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.fullName} - {user.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditWorkplaceOpen(false)}>Отмена</Button>
                    <Button onClick={handleUpdateWorkplace}>Сохранить</Button>
                  </div>
                </DialogContent>
              </Dialog>


            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Настройки системы</h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Theme Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Цветовая тема</CardTitle>
                    <p className="text-sm text-gray-600">Выберите цветовую схему интерфейса</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'blue', name: 'Синяя', color: 'bg-blue-500' },
                        { value: 'green', name: 'Зеленая', color: 'bg-green-500' },
                        { value: 'purple', name: 'Фиолетовая', color: 'bg-purple-500' },
                        { value: 'orange', name: 'Оранжевая', color: 'bg-orange-500' }
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => setSettings(prev => ({ ...prev, theme: theme.value }))}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                            settings.theme === theme.value ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${theme.color}`}></div>
                          <span className="font-medium">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interface Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Интерфейс</CardTitle>
                    <p className="text-sm text-gray-600">Настройки отображения и поведения</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Компактный режим</div>
                        <div className="text-sm text-gray-600">Уменьшенные отступы и размеры</div>
                      </div>
                      <Button
                        variant={settings.compactMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
                      >
                        {settings.compactMode ? 'Вкл' : 'Выкл'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Автосохранение</div>
                        <div className="text-sm text-gray-600">Автоматическое сохранение изменений</div>
                      </div>
                      <Button
                        variant={settings.autoSave ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSettings(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                      >
                        {settings.autoSave ? 'Вкл' : 'Выкл'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Уведомления</div>
                        <div className="text-sm text-gray-600">Показывать всплывающие уведомления</div>
                      </div>
                      <Button
                        variant={settings.notifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                      >
                        {settings.notifications ? 'Вкл' : 'Выкл'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Информация о системе</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Версия системы:</span>
                      <span className="font-medium">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Последнее обновление:</span>
                      <span className="font-medium">15.01.2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Активных пользователей:</span>
                      <span className="font-medium">{users.filter(u => u.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Рабочих мест:</span>
                      <span className="font-medium">{workplaces.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Backup and Export */}
                <Card>
                  <CardHeader>
                    <CardTitle>Резервное копирование</CardTitle>
                    <p className="text-sm text-gray-600">Экспорт и импорт данных</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline" onClick={handleExportData}>
                      <Icon name="Download" size={16} className="mr-2" />
                      Экспорт всех данных
                    </Button>
                    <div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        style={{ display: 'none' }}
                        id="import-file"
                      />
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => document.getElementById('import-file')?.click()}
                      >
                        <Icon name="Upload" size={16} className="mr-2" />
                        Импорт данных
                      </Button>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm text-gray-600 mb-2">Последний бэкап:</div>
                      <div className="text-sm font-medium">{new Date().toLocaleDateString('ru-RU')}, 18:30</div>
                      <Button size="sm" variant="ghost" className="mt-2 text-blue-600" onClick={handleCreateBackup}>
                        Создать резервную копию
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Безопасность</CardTitle>
                    <p className="text-sm text-gray-600">Настройки безопасности системы</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Двухфакторная аутентификация</div>
                        <div className="text-sm text-gray-600">Дополнительная защита аккаунта</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => showNotification('2FA настроена успешно', 'success')}
                      >
                        Настроить
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Автоматический выход</div>
                        <div className="text-sm text-gray-600">Выход через 30 минут бездействия</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => showNotification('Таймаут изменен на 60 минут', 'info')}
                      >
                        Изменить
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => showNotification('Журнал безопасности открыт', 'info')}
                    >
                      <Icon name="Shield" size={16} className="mr-2" />
                      Журнал безопасности
                    </Button>
                  </CardContent>
                </Card>

                {/* Advanced Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Расширенные настройки</CardTitle>
                    <p className="text-sm text-gray-600">Настройки для опытных пользователей</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => showNotification('Функция управления БД доступна только администраторам', 'info')}
                    >
                      <Icon name="Database" size={16} className="mr-2" />
                      Управление базой данных
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => showNotification('Открыты системные параметры', 'info')}
                    >
                      <Icon name="Settings2" size={16} className="mr-2" />
                      Системные параметры
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => showNotification('Консоль администратора запущена', 'info')}
                    >
                      <Icon name="Terminal" size={16} className="mr-2" />
                      Консоль администратора
                    </Button>
                    <div className="pt-2 border-t">
                      <Button 
                        className="w-full" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
                            setSettings({
                              theme: 'blue',
                              compactMode: false,
                              autoSave: true,
                              notifications: true,
                              language: 'ru'
                            });
                            showNotification('Настройки сброшены к значениям по умолчанию', 'success');
                          }
                        }}
                      >
                        <Icon name="RotateCcw" size={16} className="mr-2" />
                        Сбросить все настройки
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {activeSection !== 'dashboard' && activeSection !== 'users' && activeSection !== 'workplaces' && activeSection !== 'settings' && (
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