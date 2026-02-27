import { format, type DateArg } from "date-fns";
import z from "zod";

export function formatDate(date: DateArg<Date>) {
    return format(date, 'dd MMM yyyy h:mm a')
}
export const requiredString = (fieldName: string) => //Ovo je pomoćna (helper) funkcija koja prima jednu vrednost koja mora biti tipa string
 z.string({error: `${fieldName} is required`}) //polje mora biti string
 .min(1, {error: `${fieldName} is required`}) //tring mora imati bar 1 karakter