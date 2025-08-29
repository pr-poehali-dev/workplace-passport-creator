import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  role: 'admin' | 'user';
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User>({ id: '1', role: 'admin' });
  const [activeSection, setActiveSection] = useState('dashboard');

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

          {/* Other sections placeholder */}
          {activeSection !== 'dashboard' && (
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