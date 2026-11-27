import { useMemo, useCallback } from 'react';
import { useKeyboardEvent } from './../hooks';

export const useShiftSelectable = ({ list, selectedList, callback, key = 'id' }) => {

	const { pressShift } = useKeyboardEvent();

	const startIndex = useMemo(() => {
		if (!pressShift || !selectedList.length) return null;

		const last = selectedList[selectedList.length - 1];
		return list.findIndex(v => v[key] === last);
	}, [key, list, pressShift, selectedList]);

	const onSelect = useCallback((ids) => {
		if (!callback) {
			return;
		}
		if (startIndex === null) {
			callback([...ids]);
			return;
		}
        const id = ids[0];
		const targetIndex = list.findIndex(v => v[key] === id);
		const start = (startIndex < targetIndex ? startIndex : targetIndex) + 1;
		const end = startIndex < targetIndex ? targetIndex : startIndex;
		const betweenIds = list
			.slice(start, end)
			.map(v => v[key])
			.filter(v => !selectedList.some(s => s === v));

		callback([...betweenIds, ...ids]);
	}, [startIndex, list, callback, selectedList, key]);

	return { onSelect };
}