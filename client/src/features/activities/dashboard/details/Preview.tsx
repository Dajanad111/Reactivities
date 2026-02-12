import { Card, CardActions, CardMedia, Button, Typography } from '@mui/material'
type Props = {
  activity: Activity
  onCancel: () => void
}


export default function Preview({ activity, onCancel }: Props) {


        return (
            <div>
                <Card sx={{ borderRadius: 3 }}>
                    <CardMedia
                        component='img'
                        src={`images/categoryImages/${activity.category}.jpg`}
                    />
                    <Typography variant="h5">{activity.title}</Typography>
                    <CardActions>
                        <Button onClick={onCancel} color="inherit">Cancel
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )
}
