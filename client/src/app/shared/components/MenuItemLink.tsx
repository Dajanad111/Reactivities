import { MenuItem } from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router";
//pravimo menuitem koji ima svoj still i funkciju da mijenja boju kad je kliknut
//svaki menuitem ima component i to propreties pa ih odje definisemo
export default function MenuItemLink({children, to}: {children: ReactNode, to: string}) {
    return (
        <MenuItem
            component={NavLink} //uvijek ce biti Navlink
            to={to} //definisemo u kodu
            sx={{  //stil
                fontSize: '1.2rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: 'inherit',
                '&.active': {  //novi stil ako je active class
                  color: 'yellow'
                },
              }}
        >
            {children} {/*ovdje ce biti children*/}
        </MenuItem>
    )
}