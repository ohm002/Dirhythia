import { Stage } from '@inlet/react-pixi'
import LoadBeatmapButton from './components/ui/LoadBeatmapButton'

export default function App() {
	// load map

	return (
		<>
			<div className="py-3">
				<LoadBeatmapButton />
			</div>

			<div>
				<Stage className="block"></Stage>
			</div>
		</>
	)
}
