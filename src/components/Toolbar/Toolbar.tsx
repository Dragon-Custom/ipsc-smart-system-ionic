import { IonButtons, IonMenuButton, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useLocation } from "react-router";
import { appPages } from "../../appPage";

const Toolbar: React.FC = () => {
	const location = useLocation();

	const currentPageTitle = React.useMemo(() => {
		return appPages.find((page) => page.url === location.pathname)?.title;
	}, [location]);

	return (
		<IonToolbar>
			<IonButtons slot="start">
				<IonMenuButton></IonMenuButton>
			</IonButtons>
			<IonTitle>IPSC Smart System | {currentPageTitle}</IonTitle>
		</IonToolbar>
	);
};

export default Toolbar;
