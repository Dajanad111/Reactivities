import {z} from 'zod'; // Uvozimo zod biblioteku za validaciju podataka

//Ovaj fajl definiše pravila koja email i password moraju da zadovolje pre nego što se podaci uopšte pošalju serveru

export const loginSchema = z.object({ // Definišemo šemu (pravila) za login formu
    email: z.string().email(),     // Polje 'email' mora biti string I mora biti validan email format (npr. user@example.com)
    password: z.string().min(6)   // Polje 'password' mora biti string I mora imati minimalno 6 karaktera
});

export type LoginSchema = z.input<typeof loginSchema>; // Kreiramo TypeScript tip koji automatski prati pravila iz loginSchema