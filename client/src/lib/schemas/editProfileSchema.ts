import {z} from "zod";
import {requiredString} from "../util/util.ts";

export const editProfileSchema = z.object({// Definišemo šemu (pravila) za editovanje profila
    displayName: requiredString('Display Name'), // Polje displayName mora biti tekst i ne sme biti prazno
    bio: z.string().optional()  // Polje bio je tekst, ali je opcionalno (može biti prazno)
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;//Ovo automatski pravi TypeScript tip na osnovu šeme iznad
// Koristimo ga da znamo koju strukturu podataka očekujemo