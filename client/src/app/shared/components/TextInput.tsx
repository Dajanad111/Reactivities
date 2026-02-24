import { TextField, type TextFieldProps } from "@mui/material";
import { type FieldValues, useController, type UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = { //T može biti bilo koji tip  ali mora da nasleđuje FieldValues( polja iz forme)
} & UseControllerProps<T> & TextFieldProps 
//UseControllerProps<T>  Tip iz biblioteke react-hook-form.Ključna svojstva:
// name: Ime polja u formi (tipizirano prema T).
// control: Objekt kontrole iz forme.
// rules: Validacijska pravila.
//TextFieldPropsip iz UI biblioteke. Ključna svojstva:
// label: Natpis iznad/inputa.
// variant: Izgled (outlined, filled, standard).
// color: Boja.
// onChange, value: Iako ih UseController često preuzima, ovdje su dostupna za override ili čitanje.


export default function TextInput<T extends FieldValues>(props: Props<T>) {
    const {  field,fieldState } = useController({ ...props }); //useController je Hook iz biblioteke react-hook-form. Izvlačimo samo ono što nam treba iz rezultata
    //field: value onchange onblur name...
    //fieldstate error invalid isTouched...

    return (
        <TextField
            {...props} //props kao label, default value itfd
            {...field}  //isTouched, invalid, erroronBlur nameref itddd
            value={field.value || ''} //Uzmi vrijednost iz forme, ali ako ona ne postoji (undefined/null), stavi prazni string
            fullWidth
            variant="outlined"
            error={!!fieldState.error}  //ako ima error da pocrveni
            helperText={fieldState.error?.message} //poruka greske
        />
    );
}