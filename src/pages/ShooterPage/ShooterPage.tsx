import { gql, useQuery } from "@apollo/client";
import {
	BlockTitle,
	List,
	Page,
} from "konsta/react";
import { FC } from "react";
import { Query } from "../../gql/graphql";
import { ShooterCard } from "../../components/ShooterCard";

const FetchQuery = gql`
	query {
		shooters {
			id
			name
			elo
			rating
			ranking
			division
			team {
				name
			}
		}
	}
`;

const ShooterPage: FC = () => {
	const query = useQuery<Query>(FetchQuery);

	if (query.data?.shooters)
		return (
			<>
				<Page>
					<BlockTitle>Shooter list</BlockTitle>
					<List strong inset dividers>
						{query.data.shooters.map((shooter) => {
							if (shooter)
								return <ShooterCard shooter={shooter} />;
						})}
					</List>
				</Page>
			</>
		);
	else
		return (
			<>
				<Page>Loading...</Page>
			</>
		);
};

export { ShooterPage };
