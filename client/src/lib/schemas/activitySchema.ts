import { z } from 'zod'; //Zod je TypeScript-first biblioteka za validaciju podataka.


const requiredString = (fieldName: string) => //Ovo je pomoćna (helper) funkcija koja prima jednu vrednost koja mora biti tipa string
 z.string({error: `${fieldName} is required`}) //polje mora biti string
 .min(1, {error: `${fieldName} is required`}) //tring mora imati bar 1 karakter

export const activitySchema = z.object({ //definisemo zod objekat
    title: requiredString('Title'),
    description: requiredString('Description'),
    category: requiredString('Category'),
    date: z.coerce.date( {message: 'Date is required'}),
   location: z.object({
    venue: requiredString ('Venue'),
    city: z.string().optional(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number()
   })
})

export type ActivitySchema = z.input<typeof activitySchema>; //z.input Automatski generiše TypeScript tip iz Zod šeme.