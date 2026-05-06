'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

const ADMIN_CONFIG_STORAGE_KEY = 'admin-config';

export type AdminConfig = {
  whitelist: string[];
};

type AdminConfigStorageShape = {
  adminConfig: AdminConfig;
};

const EMPTY_ADMIN_CONFIG: AdminConfig = {
  whitelist: []
};

function readStoredAdminConfig(): AdminConfig {
  if (typeof window === 'undefined') {
    return EMPTY_ADMIN_CONFIG;
  }

  try {
    const storedValue = window.localStorage.getItem(ADMIN_CONFIG_STORAGE_KEY);

    if (!storedValue) {
      return EMPTY_ADMIN_CONFIG;
    }

    const parsedValue = JSON.parse(storedValue) as
      | AdminConfigStorageShape
      | AdminConfig
      | null;

    if (
      parsedValue &&
      typeof parsedValue === 'object' &&
      'adminConfig' in parsedValue
    ) {
      return sanitizeAdminConfig(parsedValue.adminConfig);
    }

    return sanitizeAdminConfig(parsedValue);
  } catch {
    return EMPTY_ADMIN_CONFIG;
  }
}

function sanitizeWhitelist(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function sanitizeAdminConfig(value: unknown): AdminConfig {
  if (!value || typeof value !== 'object') {
    return EMPTY_ADMIN_CONFIG;
  }

  const candidate = value as { whitelist?: unknown };

  return {
    whitelist: sanitizeWhitelist(candidate.whitelist)
  };
}

type AdminConfigContextValue = {
  adminConfig: AdminConfig;
  addWhitelistDomain: (domain: string) => boolean;
  removeWhitelistDomain: (domain: string) => void;
  isEmailAllowed: (email: string) => boolean;
};

const AdminConfigContext = createContext<AdminConfigContextValue | null>(null);

export function AdminConfigProvider({ children }: { children: ReactNode }) {
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(readStoredAdminConfig);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storageValue: AdminConfigStorageShape = {
      adminConfig
    };

    window.localStorage.setItem(ADMIN_CONFIG_STORAGE_KEY, JSON.stringify(storageValue));
  }, [adminConfig]);

  const addWhitelistDomain = useCallback(
    (domain: string) => {
      const normalizedDomain = domain.trim().toLowerCase();

      if (!normalizedDomain || adminConfig.whitelist.includes(normalizedDomain)) {
        return false;
      }

      setAdminConfig((currentConfig) => ({
        ...currentConfig,
        whitelist: [...currentConfig.whitelist, normalizedDomain]
      }));

      return true;
    },
    [adminConfig.whitelist]
  );

  const removeWhitelistDomain = useCallback((domain: string) => {
    const normalizedDomain = domain.trim().toLowerCase();

    setAdminConfig((currentConfig) => ({
      ...currentConfig,
      whitelist: currentConfig.whitelist.filter((item) => item !== normalizedDomain)
    }));
  }, []);

  const isEmailAllowed = useCallback(
    (email: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        return false;
      }

      return adminConfig.whitelist.some((domain) => normalizedEmail.endsWith(domain));
    },
    [adminConfig.whitelist]
  );

  const value = useMemo(
    () => ({
      adminConfig,
      addWhitelistDomain,
      removeWhitelistDomain,
      isEmailAllowed
    }),
    [adminConfig, addWhitelistDomain, removeWhitelistDomain, isEmailAllowed]
  );

  return <AdminConfigContext.Provider value={value}>{children}</AdminConfigContext.Provider>;
}

export function useAdminConfig() {
  const context = useContext(AdminConfigContext);

  if (!context) {
    throw new Error('useAdminConfig must be used within AdminConfigProvider');
  }

  return context;
}
