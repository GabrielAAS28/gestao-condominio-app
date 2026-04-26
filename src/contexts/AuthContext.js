import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api, { tokenStorage, setOnUnauthorized } from '../services/api';
import { updatePessoa } from '../services/cadastroService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega sessão persistida no AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const [accessToken, storedUser] = await Promise.all([
          tokenStorage.getAccess(),
          tokenStorage.getUser(),
        ]);
        if (accessToken && storedUser) {
          setUser(storedUser);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Quando o refresh falha (sem refresh token, expirado, revogado), o api.js chama isto
  const handleUnauthorized = useCallback(async () => {
    await tokenStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(handleUnauthorized);
  }, [handleUnauthorized]);

  async function signIn({ email, senha }) {
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      const { accessToken, refreshToken, usuario } = data;
      await tokenStorage.setAll({ accessToken, refreshToken, usuario });
      setUser(usuario);
      return usuario;
    } catch (error) {
      const apiMsg = error.response?.data?.message;
      const msg = Array.isArray(apiMsg) ? apiMsg.join(', ') : apiMsg;
      throw new Error(msg || 'Não foi possível fazer o login.');
    }
  }

  async function signOut() {
    try {
      // Tenta revogar o refresh token no backend (best-effort, não bloqueia logout)
      const refreshToken = await tokenStorage.getRefresh();
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => {});
      }
    } finally {
      await tokenStorage.clear();
      setUser(null);
    }
  }

  async function updateUserData(updatedData) {
    try {
      const { data: newUser } = await updatePessoa(user.pesCod, updatedData);
      setUser(newUser);
      await tokenStorage.setAll({ usuario: newUser });
      return newUser;
    } catch (error) {
      const apiMsg = error.response?.data?.message;
      const msg = Array.isArray(apiMsg) ? apiMsg.join(', ') : apiMsg;
      throw new Error(msg || 'Não foi possível atualizar os dados.');
    }
  }

  // Refaz fetch de /auth/me — útil para atualizar permissões (papeis) após mudança
  async function refreshMe() {
    try {
      const { data } = await api.post('/auth/me');
      setUser(data);
      await tokenStorage.setAll({ usuario: data });
      return data;
    } catch (e) {
      return null;
    }
  }

  // Extrai os IDs de condomínio a partir dos roles do JWT (ex.: 'ROLE_SINDICO_3' => 3)
  function getCondominioIds() {
    const roles = user?.roles ?? [];
    const ids = new Set();
    roles.forEach((r) => {
      const m = r.match(/_([0-9]+)$/);
      if (m) ids.add(Number(m[1]));
    });
    return Array.from(ids);
  }

  // Retorna true se o usuário tem o papel <papel> em <conCod>, ou é global admin
  function hasPapel(papel, conCod) {
    if (user?.isGlobalAdmin) return true;
    return (user?.roles ?? []).includes(`ROLE_${papel}_${conCod}`);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signOut,
        updateUserData,
        refreshMe,
        getCondominioIds,
        hasPapel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
