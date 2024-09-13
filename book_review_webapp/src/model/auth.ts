export type LoginRequest = {
    username: string
    password: string
}

export type RegisterRequest = {
    username: string
    password: string
    email: string
}

export type RefreshTokenRequest = {
    refreshToken: string
}