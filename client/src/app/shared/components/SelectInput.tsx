import { FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectProps } from "@mui/material";
import { type FieldValues, useController, type UseControllerProps } from "react-hook-form"

type Props<T extends FieldValues> = {
    label: string
    items: {text: string, value: string}[]; //Ovo su opcije dropdown-a.  prm   { text: "Sports", value: "sports" },
} & UseControllerProps<T> & Partial<SelectProps> //Možeš proslediti bilo koji MUI Select prop

export default function SelectInput<T extends FieldValues>(props: Props<T>) {
    const {fieldState, field} = useController({...props}); //Ovo povezuje Select sa React Hook Form. //field sadrži:  value onChange onBlur ref name
//fieldState sadrži error invalid isTouched

    return (
        <FormControl fullWidth error={!!fieldState.error}> 
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={field.value || ''}
                label={props.label}
                onChange={field.onChange}
            >
                {props.items.map((item) => (
                    <MenuItem value={item.value} key={item.value}>{item.text}</MenuItem>
                ))}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    )
}