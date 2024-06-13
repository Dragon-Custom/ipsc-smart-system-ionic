import { Button } from "konsta/react";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

const Timer: React.FC = () => {
	return (
		<>
			<IonGrid>
				<IonRow>
					<IonCol size="12">
						<IonText>
							<h1
								style={{
									textAlign: "center",
									width: "100%",
									fontSize: "15vw",
								}}
							>
								00.00
							</h1>
						</IonText>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonGrid>
						<IonRow>
							<IonCol size="6">
								<Button>Review</Button>
							</IonCol>
							<IonCol size="6">
								<Button>Start</Button>
							</IonCol>
						</IonRow>
						<IonRow>
							<IonCol size="6">
								<Button>Clear</Button>
							</IonCol>
							<IonCol size="6">
								<Button>Setting</Button>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonRow>
			</IonGrid>
		</>
	);
};

export { Timer };
