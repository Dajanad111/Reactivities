import { z} from "zod";
import { requiredString } from "../util/util";

export const registerSchema = z.object({
    email: z.email(),  // Polje 'email' mora biti validan email format (z.email() je skraćenica za z.string().email())
    displayName: requiredString('displayName'),
    password: requiredString('password')
});

export type RegisterSchema = z.input<typeof registerSchema>;