import bcrypt from "bcrypt";

export function saltAndHashPassword(password: string) {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}
