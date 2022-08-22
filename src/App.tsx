import { Stage } from '@inlet/react-pixi'
import LoadBeatmapButton from './components/ui/LoadBeatmapButton'
import PlayField from './PlayField'

export default function App() {
	// load map
	return (
		<>
			<div className="py-3">
				<LoadBeatmapButton />
			</div>

			<div>
				<Stage className="block" width={800} height={600}>
					<PlayField />
				</Stage>
			</div>
		</>
	)
}
