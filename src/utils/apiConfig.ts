/**
 * Configuração Centralizada da Base URL da API
 * Projeto Eletro
 * 
 * Permite que o frontend SPA na Vercel (ou qualquer outro hosting)
 * se comunique de forma transparente com o backend Express contínuo.
 * 
 * Se VITE_API_URL estiver definida (ex: no painel da Vercel):
 *   API_BASE_URL = VITE_API_URL (sem barra final)
 * Se estiver vazia (desenvolvimento local ou mesmo domínio):
 *   API_BASE_URL = '' (chamadas relativas /api/...)
 */

function sanitizeBaseUrl(rawUrl: unknown): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return '';
  return trimmed.replace(/\/+$/, '');
}

export const API_BASE_URL: string = sanitizeBaseUrl(
  typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_URL : ''
);

/**
 * Constrói a URL completa para um endpoint da API.
 * Preserva estritamente o path original, garantindo que nunca gere //api ou undefined/api.
 * 
 * Exemplos:
 * - VITE_API_URL="https://api-eletro.exemplo.com" -> getApiUrl('/api/auth/register') => "https://api-eletro.exemplo.com/api/auth/register"
 * - VITE_API_URL="" -> getApiUrl('/api/auth/register') => "/api/auth/register"
 */
export function getApiUrl(endpointPath: string): string {
  if (!endpointPath || typeof endpointPath !== 'string') {
    return API_BASE_URL || '';
  }
  const cleanPath = endpointPath.trim();
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  if (!API_BASE_URL) {
    return normalizedPath;
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

