import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "../../../../lib/hooks/useProfile";
import { editProfileSchema, type EditProfileSchema } from "../../../../lib/schemas/editProfileSchema";
import TextInput from "../../../../app/shared/components/TextInput";

type Props = { // Props definiše šta ova komponenta prima od roditelja
    setEditMode: (editMode: boolean) => void; // setEditMode je funkcija da zatvorimo formu kada završimo
}

export default function ProfileEdit({ setEditMode }: Props) {

    const { id } = useParams();  // Uzimamo ID korisnika iz URL adrese (npr. /profile/123)
    const { updateProfile, profile } = useProfile(id); // Koristimo naš hook da dobijemo funkciju za ažuriranje i trenutne podatke profila
    const { control, handleSubmit, reset, formState: { isDirty, isValid } }    // Pokrećemo formu i Povezujemo je sa našom Zod šemom za validaciju
	    = useForm<EditProfileSchema>({
	        resolver: zodResolver(editProfileSchema), // Koristi Zod pravila
	        mode: 'onTouched' // Proveravaj greške tek kada korisnik klikne iza polja
    });

    const onSubmit = (data: EditProfileSchema) => { // Funkcija koja se pali kada klikneš "Update profile"
        updateProfile.mutate(data, {  // Pozivamo mutaciju (slanje na server) sa podacima iz forme
            onSuccess:// Ako je sve prošlo uspešno na serveru... 
             () => setEditMode(false) // zatvori formu (vrati na običan prikaz)  
        });
    }

    useEffect(() => {  //popunjava sa trenutnim vrijednostima polja u formi //profile dolazi iz  hook-a koji useProfile.
        reset({  //funkcija reset (koja dolazi iz useForm) daje pocetne vrijednosti
            displayName: profile?.displayName, // pismeo ? jer je potrebno mrvicu vremena da podaci stignu sa servera pa ce u jednom momentu biti null
             bio: profile?.bio || '' //uzmi bio samo ako profile postoji, ako je bio null ili undefined, stavi prazan string, da ne piše 'null' u polju
        });
    }, [profile, reset]); //Pokreni ovaj kod unutra SAMO kada se promeni profile ILI kada se promeni reset.

    return (
        <Box component='form'
            onSubmit={handleSubmit(onSubmit)}  // Kada se forma pošalje, pokreni onSubmit
            display='flex'
            flexDirection='column'
            alignContent='center'
            gap={3}
            mt={3}
        >
            <TextInput label='Display Name' name='displayName' control={control} />  {/* Polje za ime, povezano sa formom preko 'control'*/}
            <TextInput
                label='Add your bio'
                name='bio'
                control={control}
                multiline
                rows={4}
            />
            <Button
                type='submit'
                variant='contained'
                disabled={!isValid || !isDirty || updateProfile.isPending}   // Dugme je onemogućeno (sivo) ako:
                // 1. Forma nije validna (isValid) ovo se provjerava po pravilima iz scheme
                // 2. Ništa nije promenjeno (isDirty) funkcija iz react form 
                // 3. Server još uvek obrađuje zahtev (isPending) 
            >
                Update profile
            </Button>
        </Box>
    );
}