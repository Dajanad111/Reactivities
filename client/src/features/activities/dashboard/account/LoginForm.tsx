import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import { useAccount } from "../../../../lib/hooks/useAccount.ts";
import { loginSchema, type LoginSchema } from "../../../../lib/schemas/loginSchema.ts";
import { useForm } from "react-hook-form";
import TextInput from "../../../../app/shared/components/TextInput.tsx";
import { Link, useLocation, useNavigate } from "react-router";

export default function LoginForm() {
    const { loginUser } = useAccount();  // Izvlačimo 'loginUser' iz hook-a (sadrži .mutateAsync i status)
    const navigate = useNavigate();
    const location = useLocation();

    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<LoginSchema>({ // Konfigurišemo useForm
        mode: 'onTouched',  // Validacija se pokreće tek kada korisnik "dotakne" (blur) polje
        resolver: zodResolver(loginSchema)  // Kažemo formi da koristi našu zod šemu za validaciju
    });
    // Funkcija koja se izvršava SAMO ako su podaci validni
    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                navigate(location.state?.from || '/activities')// Navigacija: idi na stranicu odakle je korisnik došao (location.state?.from) 
                // ili podrazumevano na '/activities' ako nema prethodne lokacije
            }
        });

    }

    return (
        <Paper
            component='form'
            onSubmit={handleSubmit(onSubmit)}
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
                <LockOpen fontSize='large' />
                <Typography variant="h4">Sign in</Typography>
            </Box>
            <TextInput label='Email' control={control} name='email' />
            <TextInput label='Password' control={control} name='password' type="password" />
            <Button
                type='submit'
                loading={isSubmitting}
                disabled={!isValid} // Dugme je onemogućeno dok su podaci nevalidni
                variant="contained"
                size="large">Login</Button>
            <Typography sx={{ textAlign: 'center' }}>
                Don't have an account?
                <Typography sx={{ ml: 2 }} component={Link} to='/register' color='primary'>
                    Sign up
                </Typography>
            </Typography>
        </Paper>
    );
}