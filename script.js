navigator.serviceWorker?.register('service-worker.js').then(reg => {
	reg.addEventListener('updatefound', () => {
		let newWorker = reg.installing
		newWorker?.addEventListener('statechange', () => {
			console.log('Update Installed. Restarting...')
			if (newWorker.state == 'activated') location.reload(true)
		})
	})
})

function init() {
	const hoje = new Date()
	const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
	document.querySelector('#dataDia').value = hoje.getDay().toString().padStart(2, '0')
	document.querySelector('#dataMes').value = meses[hoje.getMonth()]
	document.querySelector('#dataAno').value = hoje.getFullYear()
	document.querySelector('#print').onclick = () => print()
	for (let i in localStorage) {
		let campo = document.querySelector(`#${i}`)
		if (campo && localStorage[i]) campo.value = localStorage[i]
	}
	document.querySelectorAll('input').forEach(el => {
		if (!el.getAttributeNames()?.includes('data-save')) return
		el.onchange = e => {
			localStorage.setItem(el.id, el.value.trim())
		}
	})
}

document.onreadystatechange = () => {
	if (document.readyState != 'complete') return
	init()
}