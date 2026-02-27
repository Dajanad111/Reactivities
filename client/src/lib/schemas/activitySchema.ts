import { z } from 'zod'; //Zod je TypeScript-first biblioteka za validaciju podataka.
import { requiredString } from '../util/util';




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