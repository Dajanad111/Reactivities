
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Paper, Typography} from "@mui/material";
import {LockOpen} from "@mui/icons-material";
import { Link } from "react-router";
import TextInput from "../../../../app/shared/components/TextInput.tsx";
import { registerSchema, type RegisterSchema } from "../../../../lib/schemas/registerSchema.ts";
import { useAccount } from "../../../../lib/hooks/useAccount.ts";

export default function RegisterForm() {
    const {registerUser} = useAccount();
    const {control, handleSubmit, setError, formState: {isValid, isSubmitting}} = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterSchema) => {
        await registerUser.mutateAsync(data, {  //hook iz useAccount sa podacima iz forme
            onError: (error) => {   // onError se izvršava AKO server vrati grešku (npr. 400 Bad Request)
                if (Array.isArray(error)) {  
                    error.forEach((err) => { // Prolazimo kroz svaku poruku o grešci
                        if (err.includes('Email')) setError('email', {message: err});     // Ako greška pominje 'Email', postavljamo je na email polje u formi (npr email vec postoji)
                        else if (err.includes('Password')) setError('password', {message: err});// Ako greška pominje 'Password', postavljamo je na password polje
                    });
                }
            }
        });
    }

    return (
        <Paper component='form' onSubmit={handleSubmit(onSubmit)}
               sx={{
                   display: 'flex',
                   flexDirection: 'column',
                   p: 3,
                   gap: 3,
                   maxWidth: 'md',
                   mx: 'auto',
                   borderRadius: 3
               }}>
            <Box display='flex' alignItems='center' justifyContent='center' gap={3} color='secondary.main'>
                <LockOpen fontSize='large'/>
                <Typography variant="h4">Register</Typography>
            </Box>
            <TextInput label='Email' control={control} name='email'/>
            <TextInput label='Display name' control={control} name='displayName'/>
            <TextInput label='Password' control={control} name='password' type='password'/>
            <Button
                type='submit'
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                variant="contained"
                size="large">Register</Button>
            <Typography sx={{ textAlign: 'center' }}>
                Already have an account?
                <Typography sx={{ ml: 2 }} component={Link} to='/login' color='primary'>
                    Sign in
                </Typography>
            </Typography>
        </Paper>
    );
}