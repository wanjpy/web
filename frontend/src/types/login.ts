interface UserBase {
    username: string,
    email: string,
    phone: string
}
export interface SignUpDataType extends UserBase {
    password: string,
    passwordConfirm: string,

}

export interface UserType extends UserBase {
    role: number
}