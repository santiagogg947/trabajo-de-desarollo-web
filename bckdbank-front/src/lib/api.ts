export interface AuthResponse { token: string; email: string; role: string }
export interface Account { id: number; accountNumber: string; balance: number; accountType: string }
export interface Transaction { id: number; sourceAccountNumber: string; destinationAccount: string; amount: number; transactionType: string; description: string; timestamp: string }
export interface Quote { c: number; d: number; dp: number; h: number; l: number; o: number; pc: number; t: number }
export interface CompanyProfile { country?: string; currency?: string; exchange?: string; finnhubIndustry?: string; logo?: string; marketCapitalization?: number; name?: string; ticker?: string; weburl?: string }
export interface TransferValues { sourceAccountNumber: string; destinationAccountNumber: string; amount: number; description: string }

// URLs base tomadas del archivo .env (Vite solo expone variables que empiezan con VITE_)
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080').replace(/\/+$/, '')
const FINANCIAL_SERVICE_URL = (import.meta.env.VITE_FINANCIAL_SERVICE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

export class ApiError extends Error {
    readonly status: number
    constructor(message: string, status: number) { super(message); this.name = 'ApiError'; this.status = status }
}

interface ErrorBody {
    message?: string | string[]
    error?: string
    // El backend devuelve los errores de validación (@Valid) en "details": { campo: mensaje }
    details?: Record<string, string>
}

async function request<T>(url: string, options: RequestInit = {}, token?: string): Promise<T> {
    const headers = new Headers(options.headers)
    if (options.body) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    let response: Response
    try { response = await fetch(url, { ...options, headers }) } catch { throw new Error('No se pudo conectar con el servicio. Verifica que esté iniciado.') }
    const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null)
    if (!response.ok) {
        const body = payload as ErrorBody | null
        const details = body?.details ? Object.values(body.details).map((text) => text.trim()).join('. ') : ''
        const message = details
            || (Array.isArray(body?.message) ? body.message.join('. ') : body?.message)
            || body?.error
            || `La solicitud falló (${response.status}).`
        throw new ApiError(message, response.status)
    }
    return payload as T
}

const backend = (path: string) => `${BACKEND_URL}${path}`
const financial = (path: string) => `${FINANCIAL_SERVICE_URL}${path}`

export const bankApi = {
    login: (email: string, password: string) => request<AuthResponse>(backend('/api/v1/auth/login'), { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (firstName: string, lastName: string, email: string, password: string) => request<AuthResponse>(backend('/api/v1/auth/register'), { method: 'POST', body: JSON.stringify({ firstName, lastName, email, password }) }),
    getAccounts: (token: string) => request<Account[]>(backend('/api/v1/accounts'), {}, token),
    getTransactions: (accountNumber: string, token: string) => request<Transaction[]>(backend(`/api/v1/transactions/account/${encodeURIComponent(accountNumber)}`), {}, token),
    transfer: (values: TransferValues, token: string) => request<Transaction>(backend('/api/v1/transactions/transfer'), { method: 'POST', body: JSON.stringify(values) }, token),
}

export const marketApi = {
    getQuote: (symbol: string) => request<Quote>(financial(`/finnhub/quote?symbol=${encodeURIComponent(symbol)}`)),
    getProfile: (symbol: string) => request<CompanyProfile>(financial(`/finnhub/profile?symbol=${encodeURIComponent(symbol)}`)),
}