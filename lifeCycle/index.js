const useHandle = async (useModule, args) => {
	const result = await useModule
	if (typeof result.default === 'function') {
		await result.default(...args)
	}
}

export default {
	beforeInit: (...args) => useHandle(import('./beforeInit/index.js'), args),
	inited: (...args) => useHandle(import('./inited/index.js'), args),
	beforeMount: (...args) => useHandle(import('./beforeMount/index.js'), args),
	mounted: (...args) => useHandle(import('./mounted/index.js'), args)
}
