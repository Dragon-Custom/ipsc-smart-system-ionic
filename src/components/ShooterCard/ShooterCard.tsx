import { Grid, Typography } from "@mui/material";
import { Button, ListItem } from "konsta/react";
import { FC } from "react";
import { Shooter } from "../../gql/graphql";

interface ShooterCardProps {
	shooter: Shooter;
}

const ShooterCard: FC<ShooterCardProps> = (props: ShooterCardProps) => {
	return (
		<ListItem
			dividers
			className="w-full"
			strongTitle
			title={props.shooter?.team && `Team: ${props.shooter?.team?.name}`}
			text={
				<Grid container sx={{ p: 0, width: "100%" }}>
					<Grid item xs={12} md={4}>
						<Typography variant="h4">
							{props.shooter?.name}
						</Typography>
					</Grid>
					<Grid
						container
						item
						xs={12}
						md={5}
						sx={{
							alignItems: "center",
						}}
					>
						<Grid item xs={12 / 3}>
							<Typography variant="caption">
								Elo: {props.shooter?.elo.toFixed(2)}
							</Typography>
						</Grid>
						<Grid item xs={12 / 3}>
							<Typography variant="caption">
								Rating: {props.shooter?.rating.toFixed(2)}
							</Typography>
						</Grid>
						<Grid item xs={12 / 3}>
							<Typography variant="caption">
								Ranking: #{props.shooter?.ranking}
							</Typography>
						</Grid>
					</Grid>
					<Grid item container xs={12} md={3} sx={{ height: "100%" }}>
						<Grid item xs={6}>
							<Button outline raised>
								Edit
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Button className="k-color-brand-red">
								Delete
							</Button>
						</Grid>
					</Grid>
				</Grid>
			}
		/>
	);
};

export { type ShooterCardProps, ShooterCard };
