import React, { ChangeEventHandler, useRef } from 'react'

export default function LoadBeatmapButton() {
	const fileInput = useRef(null)

	const handleSelectFile: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault()

		// if (fileInput.current !== null) alert(`Selected file - ${fileInput.current.files[0].name}`)
		console.log(fileInput.current)
	}

	return (
		<label className="block">
			<span className="sr-only">Load beatmap</span>
			<input
				ref={fileInput}
				onChange={handleSelectFile}
				type="file"
				className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
			/>
		</label>
	)
}
