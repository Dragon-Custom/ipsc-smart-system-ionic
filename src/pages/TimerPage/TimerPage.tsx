import { Page } from "konsta/react";
import { Timer } from "../../components"

const TimerPage: React.FC = () => {
	return (
		<>
			<Page>
				<Timer />
			</Page>
		</>
	);
}

export {
	TimerPage,
};