import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonMenu,
	IonMenuToggle,
	IonTitle,
	IonToolbar,
} from "@ionic/react";

import { useLocation } from "react-router-dom";

import "./Menu.css";
import { appPages } from "../../appPage";

const Menu: React.FC = () => {
	const location = useLocation();

	return (
		<IonMenu contentId="main">
			<IonToolbar >
				<IonTitle>Menu</IonTitle>
			</IonToolbar>
			<IonContent>
				<IonList>
					{appPages.map((appPage, index) => {
						return (
							<IonMenuToggle key={index} autoHide={false}>
								<IonItem
									className={
										location.pathname === appPage.url
											? "selected"
											: ""
									}
									routerLink={appPage.url}
									routerDirection="none"
									lines="none"
									detail={false}
								>
									<IonIcon
										aria-hidden="true"
										slot="start"
										ios={appPage.iosIcon}
										md={appPage.mdIcon}
									/>
									<IonLabel>{appPage.title}</IonLabel>
								</IonItem>
							</IonMenuToggle>
						);
					})}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export {
	Menu,
};
