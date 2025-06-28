---
title: "ساخت اپلیکیشن‌های React مقیاس‌پذیر با TypeScript"
description: "الگوها و تصمیمات معماری پیشرفته برای ساخت اپلیکیشن‌های React بزرگ مقیاس که در برابر زمان مقاوم باشند را یاد بگیرید."
pubDate: 2024-06-28
heroImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
tags: ["react", "typescript", "معماری", "مقیاس-پذیری", "فرانت-اند"]
author: "الکس تامپسون"
featured: false
lang: "fa"
postSlug: "example-new-article"
---

# ساخت اپلیکیشن‌های React مقیاس‌پذیر با TypeScript

ساخت اپلیکیشن‌های React که بتوانند با رشد تیم و پیچیدگی کسب‌وکار گسترش یابند، چالش بزرگی است. TypeScript ابزار قدرتمندی برای مدیریت این پیچیدگی ارائه می‌دهد، اما استفاده صحیح از آن نیاز به درک عمیق الگوها و بهترین practices دارد.

## مبانی معماری مقیاس‌پذیر

### 1. ساختار پروژه
```
src/
├── components/          # کامپوننت‌های قابل استفاده مجدد
│   ├── ui/             # کامپوننت‌های پایه UI
│   ├── forms/          # کامپوننت‌های فرم
│   └── layout/         # کامپوننت‌های layout
├── features/           # ویژگی‌های اپلیکیشن
│   ├── auth/
│   ├── dashboard/
│   └── profile/
├── hooks/              # Custom hooks
├── services/           # API calls و business logic
├── store/              # State management
├── types/              # Type definitions
└── utils/              # Helper functions
```

### 2. Type-First Development
```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  profile: UserProfile;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
}

export type Permission = 'read' | 'write' | 'admin';

// Utility types برای flexibility
export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserRequest = Partial<Pick<User, 'email' | 'profile'>>;
```

## الگوهای کامپوننت پیشرفته

### 1. Generic Components
```typescript
// components/ui/DataTable.tsx
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  error?: string;
}

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  loading,
  error
}: DataTableProps<T>) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(column => (
            <th key={String(column.key)}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr 
            key={item.id} 
            onClick={() => onRowClick?.(item)}
            className="cursor-pointer hover:bg-gray-50"
          >
            {columns.map(column => (
              <td key={String(column.key)}>
                {column.render 
                  ? column.render(item[column.key], item)
                  : String(item[column.key])
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// استفاده
const userColumns: Column<User>[] = [
  { key: 'email', title: 'Email' },
  { 
    key: 'profile', 
    title: 'Name',
    render: (profile) => `${profile.firstName} ${profile.lastName}`
  },
  {
    key: 'permissions',
    title: 'Role',
    render: (permissions) => permissions.includes('admin') ? 'Admin' : 'User'
  }
];

<DataTable data={users} columns={userColumns} onRowClick={handleUserClick} />
```

### 2. Compound Components
```typescript
// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`card ${className || ''}`}>
    {children}
  </div>
);

Card.Header = ({ children, actions }: CardHeaderProps) => (
  <div className="card-header">
    <div className="card-title">{children}</div>
    {actions && <div className="card-actions">{actions}</div>}
  </div>
);

Card.Content = ({ children }: CardContentProps) => (
  <div className="card-content">{children}</div>
);

Card.Footer = ({ children }: CardFooterProps) => (
  <div className="card-footer">{children}</div>
);

// استفاده
<Card>
  <Card.Header actions={<Button>Edit</Button>}>
    User Profile
  </Card.Header>
  <Card.Content>
    <UserDetails user={user} />
  </Card.Content>
  <Card.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </Card.Footer>
</Card>
```

## State Management با TypeScript

### 1. Zustand Store
```typescript
// store/userStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

interface UserActions {
  setCurrentUser: (user: User | null) => void;
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      // State
      currentUser: null,
      users: [],
      loading: false,
      error: null,

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),

      fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
          const users = await userService.getUsers();
          set({ users, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      createUser: async (userData) => {
        set({ loading: true, error: null });
        try {
          const newUser = await userService.createUser(userData);
          set(state => ({ 
            users: [...state.users, newUser],
            loading: false 
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      updateUser: async (id, userData) => {
        set({ loading: true, error: null });
        try {
          const updatedUser = await userService.updateUser(id, userData);
          set(state => ({
            users: state.users.map(user => 
              user.id === id ? updatedUser : user
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      deleteUser: async (id) => {
        set({ loading: true, error: null });
        try {
          await userService.deleteUser(id);
          set(state => ({
            users: state.users.filter(user => user.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      }
    }),
    { name: 'user-store' }
  )
);
```

### 2. Custom Hooks برای Business Logic
```typescript
// hooks/useUsers.ts
export const useUsers = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useUserStore();

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoized computed values
  const activeUsers = useMemo(
    () => users.filter(user => user.permissions.length > 0),
    [users]
  );

  const adminUsers = useMemo(
    () => users.filter(user => user.permissions.includes('admin')),
    [users]
  );

  return {
    users,
    activeUsers,
    adminUsers,
    loading,
    error,
    actions: {
      createUser,
      updateUser,
      deleteUser,
      refreshUsers: fetchUsers
    }
  };
};

// hooks/useUserForm.ts
interface UseUserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
}

export const useUserForm = ({ initialData, onSubmit }: UseUserFormProps) => {
  const [formData, setFormData] = useState<Partial<User>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback((data: Partial<User>): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (!data.profile?.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!data.profile?.lastName) {
      errors.lastName = 'Last name is required';
    }

    return errors;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as CreateUserRequest);
      setFormData(initialData || {});
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit, initialData]);

  const updateField = useCallback(<K extends keyof User>(
    field: K,
    value: User[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  return {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    updateField
  };
};
```

## API Layer و Error Handling

### 1. Type-Safe API Client
```typescript
// services/api.ts
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          await response.text()
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network Error', error.message);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient(process.env.REACT_APP_API_URL!);
```

### 2. Service Layer
```typescript
// services/userService.ts
class UserService {
  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  }

  async getUser(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return apiClient.post<User>('/users', userData);
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    return apiClient.put<User>(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  }
}

export const userService = new UserService();
```

## Testing Strategy

### 1. Component Testing
```typescript
// __tests__/components/DataTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../components/ui/DataTable';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    profile: { firstName: 'John', lastName: 'Doe' },
    permissions: ['read'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockColumns: Column<User>[] = [
  { key: 'email', title: 'Email' },
  { 
    key: 'profile', 
    title: 'Name',
    render: (profile) => `${profile.firstName} ${profile.lastName}`
  }
];

describe('DataTable', () => {
  it('renders data correctly', () => {
    render(
      <DataTable 
        data={mockUsers} 
        columns={mockColumns} 
      />
    );

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', () => {
    const mockOnRowClick = jest.fn();
    
    render(
      <DataTable 
        data={mockUsers} 
        columns={mockColumns}
        onRowClick={mockOnRowClick}
      />
    );

    fireEvent.click(screen.getByText('john@example.com'));
    expect(mockOnRowClick).toHaveBeenCalledWith(mockUsers[0]);
  });
});
```

## نتیجه‌گیری

ساخت اپلیکیشن‌های React مقیاس‌پذیر با TypeScript نیاز به:

### اصول کلیدی:
1. **Type-First Development**: تعریف types قبل از implementation
2. **Separation of Concerns**: جداسازی UI، business logic، و data
3. **Reusable Components**: کامپوننت‌های قابل استفاده مجدد و generic
4. **Consistent Patterns**: الگوهای ثابت در سراسر اپلیکیشن
5. **Comprehensive Testing**: تست‌های جامع برای اطمینان از کیفیت

### بهترین Practices:
- استفاده از strict TypeScript config
- پیاده‌سازی proper error boundaries
- بهینه‌سازی performance با React.memo و useMemo
- مستندسازی کامل API و components
- Code review منظم برای حفظ کیفیت

با پیروی از این اصول، می‌توانید اپلیکیشن‌هایی بسازید که نه تنها امروز کار می‌کنند، بلکه سال‌ها قابل نگهداری و توسعه باشند.
