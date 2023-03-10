navigator.serviceWorker?.register('service-worker.js').then(reg => {
	reg.addEventListener('updatefound', () => {
		let newWorker = reg.installing
		newWorker?.addEventListener('statechange', () => {
			console.log('Update Installed. Restarting...')
			if (newWorker.state == 'activated') location.reload(true)
		})
	})
})

function listenersEMascaras() {
	document.querySelectorAll('input').forEach(el => {
		if (['cepRem', 'cepDest'].includes(el.id)) {
			IMask(el, {
				mask: '00000-000'
			})
		} else if (['cpfRem', 'cpfDest'].includes(el.id)) {
			IMask(el, {
				mask: '00000000000000' //(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/
			})
		} else if (el.getAttribute('type') == 'tel') {
			if (el.getAttributeNames()?.includes('data-valor')) {
				IMask(el, {
					mask: 'num',
					blocks: {
						num: {
							mask: Number,
							thousandsSeparator: '.',
							padFractionalZeros: true,
							radix: ',',
							mapToRadix: ['.']
						}
					}
				})
				if (el.id != 'totalValor') el.onchange = () => sumValor()
			} else {
				IMask(el, {
					mask: Number
				})
			}
			if (el.getAttributeNames()?.includes('data-quant')) {
				el.onchange = () => sumQuant()
			}
		}
		if (el.getAttributeNames()?.includes('data-save')) {
			el.onchange = e => localStorage.setItem(e.target.id, e.target.value.trim())
		}
		if (params[el.id]) el.value = params[el.id]
	})
}

function sumQuant() {
	let total = 0
	document.querySelectorAll('input[data-quant]').forEach(el => {
		if (el.value) total += parseInt(el.value)
	})
	document.querySelector('#totalQuant').value = total
}

function sumValor() {
	let valores = Array.from(document.querySelectorAll('input[data-valor]:not(#totalValor)'))
	let total = valores.reduce((pre, cur) => {
		let valor = parseFloat(cur.value.replace(/\./g, '').replace(/,/g, '.') || '0')
		pre = parseFloat(valor + (pre ?? 0))
		return pre
	}, 0)
	document.querySelector('#totalValor').value = total.toFixed(2).replace(/\./g, ',')
}

function init() {
	document.querySelector('#dataDia').value = hoje.getDate()
	document.querySelector('#dataMes').value = meses[hoje.getMonth()]
	document.querySelector('#dataAno').value = hoje.getFullYear()
	document.querySelector('#print').onclick = () => print()
	for (let i in localStorage) {
		let campo = document.querySelector(`#${i}`)
		if (campo && localStorage[i]) campo.value = localStorage[i]
	}
	listenersEMascaras()
}

document.onreadystatechange = () => {
	if (document.readyState == 'complete') init()
}

const hoje = new Date()
const meses = ['Janeiro', 'Fevereiro', 'Mar??o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const params = {}
const queryParams = location.search.substr(1)
if (queryParams.length) {
	queryParams?.split('&')?.forEach(el => {
		let data = el.split('=')
		params[data[0]] = decodeURI(data[1])
	})
}