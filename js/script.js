$(function () {
	$('.menu-opener').on('click', function (e) {
		e.preventDefault()
		$(this).toggleClass('active')
		$('.head-menu').toggleClass('active')
		$('body').toggleClass('no-scroll')
	})

	// account img on click
	$('.content-head > a').on('click', function (e) {
		e.preventDefault()
		$('.side-menu .nav-link').removeClass('active')
		$('#v-pills-messages-tab').addClass('active')

		$('.prsn-content .tab-pane').removeClass('active show')
		$('#v-pills-messages').addClass('active show')
	})

	// select all words
	var selectAllItems = '#select-all'
	var checkboxItem = '.words :checkbox'

	$(selectAllItems).click(function () {
		if ($(this).prop('checked')) {
			$(checkboxItem).prop('checked', true)
			document.querySelector('.btn-add').disabled = false
		} else {
			$(checkboxItem).prop('checked', false)
			document.querySelector('.btn-add').disabled = true
		}
	})

	// words remove input
	$('.test-list input').keyup(function () {
		// $(this).css('border', 'none', 'margin', '0');
		var value = $(this).val()
		if (value.length > 1) {
			$(this).val(value.substring(0, 1))
		}
	})

	var swiper3 = new Swiper('.word-slide', {
		slidesPerView: 1,
		spaceBetween: 10,
		loop: false,
		speed: 1000,
		pagination: {
			el: '.swiper-pagination',
			type: 'fraction',
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	})

	new Card({
		form: '#payment-modal',
		container: '.card',
		formSelectors: {
			numberInput: 'input[name=number]',
			expiryInput: 'input[name=expiry]',
			cvcInput: 'input[name=cvv]',
		},

		width: 390, // optional — default 350px
		formatting: true,

		placeholders: {
			number: '•••• •••• •••• ••••',
			expiry: '••/••',
			cvc: '•••',
		},
	})
})

$(document).ready(function () {
	$("form[name='login-form']").validate({
		// Specify the validation rules
		rules: {
			// firstname: "required", //firstname is corresponding input name
			password: {
				required: true,
				minlength: 6,
			},
			//passowrd:  is corresponding input name
			email: {
				required: true,
				email: true,
			},
		},
		// Specify the validation error messages
		messages: {
			// firstname: "Пожалуйста, укажите имя",
			password: 'Пожалуйста, укажите пароль',
			email: 'Пожалуйста, укажите email или телефон',
		},
		submitHandler: function (form) {
			checkLogin(form, url + '/auth/login')
		},
	})

	$("form[name='reg-form']").validate({
		// Specify the validation rules
		rules: {
			// firstname: "required", //firstname is corresponding input name

			password: {
				required: true,
				minlength: 6,
			},
			confirm_password: {
				required: true,
				minlength: 6,
			},
			//passowrd:  is corresponding input name
			email: {
				required: true,
				email: true,
			},
		},
		// Specify the validation error messages
		messages: {
			// firstname: "Пожалуйста, укажите имя",
			password: 'Пожалуйста, укажите пароль',
			confirm_password: 'Пожалуйста, подтвердите пароль',
			email: 'Пожалуйста, укажите email или телефон',
		},
		submitHandler: function (form) {
			if (validateForm()) {
				checkLogin(form, url + '/auth/register')
			}
		},
	})
	$("form[name='editProfileData']").validate({
		// Specify the validation rules
		rules: {
			// firstname: "required", //firstname is corresponding input name

			password: {
				required: true,
				minlength: 6,
			},
			confirm_password: {
				required: true,
				minlength: 6,
			},
			//passowrd:  is corresponding input name
			email: {
				required: true,
				email: true,
			},
		},
		// Specify the validation error messages
		messages: {
			// firstname: "Пожалуйста, укажите имя",
			password: 'Пожалуйста, укажите пароль',
			confirm_password: 'Пожалуйста, подтвердите пароль',
			email: 'Пожалуйста, укажите email или телефон',
		},
		submitHandler: function (form) {
			if (validateForm()) {
				editProfileData(form)
			}
		},
	})

	// Функция проверки формы
	function validateForm() {
		var isValid = true

		// Проверка имени
		var nameInput = $('[name="child_name"]')
		if ($.trim(nameInput.val()) === '') {
			setErrorFor(nameInput, 'Пожалуйста, введите имя ребенка.')
			isValid = false
		} else {
			setSuccessFor(nameInput)
		}

		// Проверить электронную почту
		var emailInput = $('[name="login"]')
		if ($.trim(emailInput.val()) === '') {
			setErrorFor(emailInput, 'Пожалуйста, введите вашу почту.')
			isValid = false
		} else if (!isEmail($.trim(emailInput.val()))) {
			setErrorFor(emailInput, 'Пожалуйста, укажите существующий email')
			isValid = false
		} else {
			setSuccessFor(emailInput)
		}

		// Подтверждаем пароль
		var passwordInput = $('[name="password"]')
		if ($.trim(passwordInput.val()) === '') {
			setErrorFor(passwordInput, 'Пожалуйста, введите ваш пароль.')
			isValid = false
		} else {
			setSuccessFor(passwordInput)
		}

		// Подтвердите пароль
		var confirmPasswordInput = $('[name="confirm_password"]')
		if ($.trim(confirmPasswordInput.val()) === '') {
			setErrorFor(confirmPasswordInput, 'Введите подтверждение пароля.')
			isValid = false
		} else if (
			$.trim(passwordInput.val()) !== $.trim(confirmPasswordInput.val())
		) {
			setErrorFor(confirmPasswordInput, 'Неверное подтверждение пароля')
			isValid = false
		} else {
			setSuccessFor(confirmPasswordInput)
		}

		return isValid
	}
	let addedWords = []

	if (document.querySelectorAll('.tariff-pay-btn')) {
		// FIXME:
		document.querySelectorAll('.tariff-pay-btn').forEach(btn => {
			btn.addEventListener('click', async () => {
				if (localStorage.getItem('token')) {
					let newDateOver = ''
					let newTariff = ''
					if (btn.getAttribute('id') === 'btn-tariff-trial') {
						newDateOver = createNewDateOver(7)
						newTariff = 'trial'
					} else if (btn.getAttribute('id') === 'btn-tariff-comfort') {
						newDateOver = createNewDateOver(30)
						newTariff = 'comfort'
					} else if (btn.getAttribute('id') === 'btn-tariff-prof') {
						newDateOver = createNewDateOver(365)
						newTariff = 'prof'
					}
					const requestOptions = {
						method: 'PATCH',
						headers: {
							'Content-type': 'application/json;charset=UTF-8',
							'Access-Control-Allow-Origin': '*',
							authorization: localStorage.getItem('token'),
						},
						body: JSON.stringify({
							date_over: newDateOver,
							tariff: newTariff,
						}),
					}
					console.log(url + '/auth/pay')
					const response = await fetch(url + '/auth/pay', requestOptions)
					const { success, user } = await response.json()
					console.log(success, user)
					if (success && user) {
						console.log('ты success долбаебббббб')
						localStorage.setItem('date_over', user?.date_over)
						window.location.href = '/personal-cabinet.html'
					}
					console.log(success, user)
				}
			})
		})
	}
	if (document.querySelector('.exit-btn')) {
		document.querySelector('.exit-btn').addEventListener('click', () => {
			localStorage.removeItem('token')
			window.location.href = '/index.html'
		})
	}

	// Функция для установки ошибки
	function setErrorFor(input, message) {
		var errorSpan = input.next('.error')
		errorSpan.text(message).show()
		input.addClass('error') // Xato klassini qo'shish
	}

	// Функция для установки правильного ввода
	function setSuccessFor(input) {
		var errorSpan = input.next('.error')
		errorSpan.hide()
		input.removeClass('error')
	}

	// Проверка входных данных
	$('#reg-modal input').on('input', function () {
		var input = $(this)
		if ($.trim(input.val()) !== '') {
			setSuccessFor(input)
		} else {
			setErrorFor(input, input.attr('placeholder') + 'ni kiriting')
		}
	})

	// Функция проверки электронной почты
	function isEmail(email) {
		// Oddiy regex bilan tekshiramiz
		return /\S+@\S+\.\S+/.test(email)
	}
	const checkSignIn = () => {
		console.log(window.localStorage.getItem('token'))
		if (window.localStorage.getItem('token')) {
			lkbtn = document.querySelector('.lk')
			if (lkbtn) {
				lkbtn.removeAttribute('data-bs-toggle')
				lkbtn.removeAttribute('data-bs-target')
				lkbtn.setAttribute('href', '/personal-cabinet.html')
			}
		}
	}
	checkSignIn()
	const url = 'http://localhost:5000/api'

	async function checkLogin(form, currurl) {
		let formData = new FormData(form)
		const formDataObj = Object.fromEntries(formData.entries())

		console.log(formDataObj)
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-type': 'application/json;charset=UTF-8',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify(formDataObj),
		}
		try {
			const response = await fetch(currurl, requestOptions)
			const { user, token } = await response.json()
			console.log(user, token)

			if (token && token != undefined) {
				if ((await isDate(user?.date_over)) == false) {
					localStorage.setItem('token', token)
					window.location.href = 'tariff-plan.html'
				} else if ((await token) && isDate(user?.date_over)) {
					localStorage.setItem('token', token)
					localStorage.setItem('date_over', user?.date_over)
					window.location.href = '/personal-cabinet.html'
				}
			}
			form.reset()
		} catch (err) {
			console.error(err)
		}
	}

	function createNewDateOver(addedPeriod) {
		const currentDate = new Date()
		const newDate = new Date(
			currentDate.getTime() + addedPeriod * 24 * 60 * 60 * 1000
		)
		const day = newDate.getDate()
		const month = newDate.getMonth() + 1 // Месяцы начинаются с 0
		const year = newDate.getFullYear()
		const newDateOver = `${day}.${month}.${year}`
		return newDateOver
	}
	// FIXME:
	async function isDate(dateString) {
		// Разбиваем строку даты на компоненты
		if (dateString) {
			const parts = await dateString.split('.')

			// Получаем день, месяц и год из строки даты
			const day = parseInt(parts[0])
			const month = parseInt(parts[1]) - 1 // Месяцы начинаются с 0
			const year = parseInt(parts[2])

			// Создаем объект Date на основе компонентов даты
			const targetDate = new Date(year, month, day)

			// Получаем текущую дату
			const currentDate = new Date()

			// Сравниваем целевую дату с текущей датой
			return !(targetDate < currentDate)
		} else {
			return false
		}
	}

	const mainSideBtn = document.querySelector('.nav-link-cards')
	if (mainSideBtn) {
		mainSideBtn.addEventListener('click', () => {
			if (mainSideBtn.classList.contains('activity')) {
				window.location.href = '/personal-cabinet.html'
			}
			// mainSideBtn.classList.toggle('activity')
		})
		// if (window.innerWidth < 800) {
		//   document.getElementById("v-pills-home-tab").classList.remove("active");
		//   document.getElementById("v-pills-home-tab").classList.remove("activity");
		//   document.getElementById("v-pills-home").classList.remove("active");
		//   document.getElementById("v-pills-home").classList.remove("show");
		// }
		document
			.querySelector('.nav-pills')
			.querySelectorAll('.nav-link')
			.forEach(btn => {
				btn.addEventListener('click', () => {
					document
						.querySelector('.nav-pills')
						.querySelectorAll('.nav-link')
						.forEach(btn => {
							btn.classList.remove('activity')
						})
					btn.classList.add('activity')
				})
			})
	}
	deleteProfileBtn = document.querySelector('.confirm-delete-btn')

	if (deleteProfileBtn) {
		deleteProfileBtn.addEventListener('click', () => {
			deleteProfile()
		})
	}

	const mainlk = async () => {
		if (window.localStorage.getItem('token')) {
			userInfo = await getUserInfo()
			console.log(userInfo)
			document.querySelector('.child_name').value = userInfo.child_name
			document.querySelector('.login').value = userInfo.login

			if (await isDate(userInfo?.date_over)) {
				const statContainer = document
					.querySelector('.statistcs')
					.querySelector('tbody')
				if (userInfo.statistics) {
					console.log('stat', userInfo.statistics)
					userInfo.statistics.forEach((stat, index) => {
						let statInner = document.createElement('tr')
						statInner.innerHTML = `<td>${index + 1}</td>
														<td>${stat.word}</td>
														<td>${stat.errors_count}</td>
														`
						statContainer.appendChild(statInner)
					})
				}
				if (document.querySelector('.my-cards')) {
					showAllCards()
				}
				const topTitle = document.querySelector('.top-title')
				const extendTariff = document.querySelector('.extend')
				const tariffTitle = document
					.querySelector('.top-title')
					.querySelector('span')
				topTitle.querySelector(
					'p'
				).textContent = `Действительна по ${formatDate(userInfo.date_over)}`
				if (userInfo.tariff === 'trial') {
					tariffTitle.textContent = 'ПОДПИСКА СТАРТ:'
					extendTariff.classList.add('hide')
				}
				if (userInfo.tariff === 'comfort') {
					const comfort = document.querySelector('.comfort')
					comfort.textContent = 'Действительна'
					comfort.classList.add('subs-btn')
					comfort.disabled = true
					comfort.classList.add('disabled')
					tariffTitle.textContent = 'ПОДПИСКА КОМФОРТ:'
				}
				if (userInfo.tariff === 'prof') {
					const prof = document.querySelector('.prof')
					prof.textContent = 'Действительна'
					prof.classList.add('subs-btn')
					prof.disabled = true
					prof.classList.add('disabled')
					tariffTitle.textContent = 'ПОДПИСКА ПРОФИ:'
				}
				const addinglist = document.querySelector('.adding-list')
				if (addinglist) {
					getAllWords()
					document.querySelector('.btn-add').addEventListener('click', e => {
						if (e.target.classList.contains('btn-addyet')) {
							editCard()
							window.location.href = '/card.html'
						} else {
							createNewCard().then(data => {
								if (data) {
									console.log(data)
									window.localStorage.setItem('cardId', data.id)
									console.log(window.localStorage.getItem('cardId'))
									window.location.href = '/card.html'
								}
							})
						}
					})
					async function createNewCard() {
						try {
							newCardUrl = url + '/cards'
							const response = await fetch(newCardUrl, {
								method: 'POST',
								body: JSON.stringify({ words: addedWords }),
								headers: {
									'Content-type': 'application/json; charset=UTF-8',
									'Access-Control-Allow-Origin': '*',
									authorization: localStorage.getItem('token'),
								},
							})
							const data = await response.json()
							return data
						} catch (e) {
							console.error(e)
						}
					}
					async function editCard() {
						try {
							cardId = window.localStorage.getItem('cardId')
							editCardUrl = url + '/cards/' + cardId
							const response = await fetch(editCardUrl, {
								method: 'PATCH',
								body: JSON.stringify({ words: addedWords }),
								headers: {
									'Content-type': 'application/json; charset=UTF-8',
									'Access-Control-Allow-Origin': '*',
									authorization: localStorage.getItem('token'),
								},
							})
							const data = await response.json()
							return data
						} catch (e) {
							console.error(e)
						}
					}

					const addinglist = document.querySelector('.adding-list')
					//активирую поиск
					const search = document.querySelector('.search')
					search.oninput = e => {
						checkSearch(e)
						hideUnusedLetter()
					}
					//функция поиска
					const checkSearch = e => {
						if (e.target.value) {
							let searchValue = e.target.value.trim().toLowerCase()
							addinglist.querySelectorAll('label').forEach(label => {
								label.classList.remove('hide')
								if (
									label
										.querySelector('span')
										.textContent.toLowerCase()
										.search(searchValue) === -1
								) {
									label.classList.add('hide')
								}
							})
						} else {
							addinglist.querySelectorAll('label').forEach(label => {
								label.classList.remove('hide')
							})
						}
					}

					//прячу все буквы, где нет слов

					const hideUnusedLetter = () => {
						addinglist.querySelectorAll('.adding-item').forEach(item => {
							flag = true
							item.querySelectorAll('label').forEach(label => {
								if (!label.classList.contains('hide')) {
									flag = false
								}
							})
							if (flag) {
								item.classList.add('hide')
							} else {
								item.classList.remove('hide')
							}
						})
					}
					hideUnusedLetter()
					//добавление/удаление списка слов новой карточки, отключение кнопки
				}
			} else {
				document.querySelector('.add-btn').href = '#'
				document.querySelectorAll('.nav-link').forEach(btn => {
					btn.classList.remove('active')
					btn.classList.remove('activity')
				})
				document.querySelectorAll('.tab-pane').forEach(btn => {
					btn.classList.remove('active')
					btn.classList.remove('show')
				})

				document.getElementById('v-pills-messages-tab').classList.add('active')
				document.getElementById('v-pills-settings').classList.add('active')
				document.getElementById('v-pills-settings').classList.add('show')

				alert = document.createElement('div')
				alert.classList.add('lk-alert')
				alert.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
        Необходимо продлить подписку!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`
				document.querySelector('body').appendChild(alert)
			}
			const subscribed = document.querySelector('.subscribed')
		} else {
			window.location.href = '/index.html'
		}
	}
	if (document.querySelector('.statistcs')) {
		mainlk()
	}
	function formatDate(inputDate) {
		// Разбиваем строку на компоненты
		var parts = inputDate.split('.')

		// Проверяем, что строка содержит 3 компонента (день, месяц, год)
		if (parts.length === 3) {
			var day = parts[0]
			var month = parts[1]
			var year = parts[2]

			// Добавляем нуль перед числами, если они состоят из одной цифры
			if (day.length === 1) {
				day = '0' + day
			}
			if (month.length === 1) {
				month = '0' + month
			}

			// Возвращаем преобразованную дату в формате "дд.мм.гггг"
			return day + '.' + month + '.' + year
		} else {
			// Если строка не соответствует формату "дд.м.гггг", возвращаем исходную строку
			return inputDate
		}
	}
	async function editProfileData(ev) {
		try {
			personalData = new FormData(ev)
			const personalDataObj = Object.fromEntries(personalData.entries())
			console.log(personalDataObj)
			editProfileUrl = url + '/auth/update'
			const response = await fetch(editProfileUrl, {
				method: 'PATCH',
				body: JSON.stringify(personalDataObj),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Access-Control-Allow-Origin': '*',
					authorization: localStorage.getItem('token'),
				},
			})
			const userInfo = await response.json()
			console.log(userInfo)
		} catch (e) {
			console.error(e)
		}
		ev.reset()
		DrawUserInfo()
	}
	async function deleteProfile() {
		try {
			deleteProfileUrl = url + '/auth/delete'
			const response = await fetch(deleteProfileUrl, {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Access-Control-Allow-Origin': '*',
					authorization: localStorage.getItem('token'),
				},
			})
			const data = await response.json()
			console.log(data)
		} catch (e) {
			console.error(e)
		}
	}
	const DrawUserInfo = async () => {
		userInfo = await getUserInfo()
		console.log(userInfo)
		document.querySelector('.child_name').value = userInfo.child_name
		document.querySelector('.login').value = userInfo.login

		if (!(await isDate(userInfo?.date_over))) {
			document.getElementById('v-pills-home-tab').classList.remove('active')
			document.getElementById('v-pills-home').classList.remove('active')
			document.getElementById('v-pills-home').classList.remove('show')

			document.getElementById('v-pills-messages-tab').classList.add('active')
			document.getElementById('v-pills-settings').classList.add('active')
			document.getElementById('v-pills-settings').classList.add('show')
		}
	}
	async function getCurrCard() {
		try {
			let cardId = window.localStorage.getItem('cardId')
			requestCardUrl = url + '/cards/' + cardId
			const response = await fetch(requestCardUrl, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Access-Control-Allow-Origin': '*',
					authorization: localStorage.getItem('token'),
				},
			})
			const data = await response.json()
			return data
		} catch (e) {
			console.error(e)
		}
	}

	async function showAllCards() {
		const loading = document
			.querySelector('.mycards__container')
			.querySelector('.loading')
		const userInfo = await getUserInfo()
		const cards = userInfo.cards
		const cardsContainer = document.querySelector('.mycards__container')
		if (cards) {
			cards.forEach((card, index) => {
				cardhtml = document.createElement('div')
				cardhtml.classList.add('col-lg-4')
				cardhtml.classList.add('plr-12')
				let wordsstring = ''
				let k = 0
				for (const word of card.words) {
					if (k == 7) break
					wordsstring += `<li>${word}</li>`
					k += 1
				}
				cardhtml.innerHTML = `
          <div class="card-item">
              <div class="item-title">
                  <p>КАРТОЧКА <span class='cardIndex'>${index + 1}</span></p>
              </div>
              <div class="item-list">
                  <ul>
                      ${wordsstring}
                  </ul>
              </div>
              <div class="item-btn">
                  <button class="blue-btn openCard">Посмотреть</button>
              </div>
          </div>`
				cardsContainer.appendChild(cardhtml)
			})
			loading.classList.add('hide')
			setTimeout(() => {
				cardsContainer.querySelectorAll('.card-item').forEach(card => {
					card.classList.add('show')
				})
			}, 10)
		}
		//Обработка нажатия кнопок/передача id карточки
		document.querySelectorAll('.openCard').forEach(btn => {
			btn.addEventListener('click', () => {
				index =
					parseInt(
						btn.parentElement.parentElement.querySelector('.cardIndex')
							.textContent
					) - 1
				window.localStorage.setItem('cardId', cards[index].id)
				window.location.href = '/card.html'
			})
		})
	}
	const currcard = document.querySelector('.currentcard')
	if (currcard) {
		drawCurrCard()
	}
	function replaceCharAtIndex(str, index, newChar) {
		if (index < 0 || index >= str.length) {
			return str // Если индекс находится за пределами строки, возвращаем исходную строку
		}

		const chars = str.split('') // Преобразуем строку в массив символов
		chars[index] = newChar // Заменяем символ по индексу новым символом
		return chars.join('') // Преобразуем массив обратно в строку
	}

	async function drawCurrCard() {
		const loading = document
			.querySelector('.card-words')
			.querySelector('.loading')
		const currcard = await getCurrCard()
		const wordsContainer = document.querySelector('.card-words-item')
		const imagesContainer = document
			.getElementById('word-modal')
			.querySelector('.swiper-wrapper')
		console.log(currcard)
		currcard.words.forEach(word => {
			let wordhtml = document.createElement('p')
			wordhtml.innerHTML = `${word}`
			wordsContainer.appendChild(wordhtml)

			let imageHtml = document.createElement('div')
			imageHtml.classList.add('swiper-slide')
			imageHtml.innerHTML = `<div class="swiper-slide">
			                              <div class="slide-img">
			                                  <img src="images/words/${word}.png" alt="${word}">
			                              </div>
			                          </div>`
			imagesContainer.appendChild(imageHtml)
		})
		let lastImage = document.createElement('div')
		lastImage.classList.add('swiper-slide')
		lastImage.innerHTML = `<div class="swiper-slide">
									<div class="slide-last">
										<img
											src="images/slide-last-img.png"
											alt=""
											class="last-bg"
										/>

										<div class="slide-title">
											<p>ВЫ ПРОСМОТРЕЛИ ВСЕ СЛОВА!</p>
											<span>Можете перейти к тестам</span>
										</div>
										<div class="slide-btn">
											<a href="test.html">Пройти тестирование</a>
										</div>
									</div>
								</div>`
		imagesContainer.appendChild(lastImage)
		loading.classList.add('hide')
	}
	async function sendTestResults(results) {
		try {
			TestResultsUrl = url + '/statistics'
			const response = await fetch(TestResultsUrl, {
				method: 'PUT',
				body: JSON.stringify({ words: results }),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Access-Control-Allow-Origin': '*',
					authorization: localStorage.getItem('token'),
				},
			})
			const userData = await response.json()
			return userData
		} catch (e) {
			console.error(e)
		}
	}

	async function drawCurrTest() {
		const currcard = await getCurrCard()
		const allWords = await getAllWords()
		// console.log(allWords)
		const wordsContainer = document.querySelector('.test-list')
		const input = '<input class="wordinput" type="text" maxlength="1">'
		const inputLength = input.length
		let currWords = []
		currcard.words.forEach(word => {
			let currWord = allWords.filter(alphabetword => alphabetword.name == word)
			currWords.push(currWord[0])
			letters = currWord[0].letters.split(' ')
			let addingString = word
			letters.forEach((letter, index) => {
				subIndex = parseInt(letter) + index * (inputLength - 1)
				addingString = replaceCharAtIndex(addingString, subIndex, input)
			})

			let wordhtml = document.createElement('p')
			wordhtml.innerHTML = `${addingString}`
			wordsContainer.appendChild(wordhtml)
		})
		wordInputs = document.querySelectorAll('.wordinput')
		checkbtn = document.querySelector('.check-btn')
		solvedWords = []
		console.log('currWords:', currWords)
		checkbtn.addEventListener('click', () => {
			wordsContainer.querySelectorAll('p').forEach(checkword => {
				solvedCurrWord = []
				checkword.querySelectorAll('.wordinput').forEach(input => {
					solvedCurrWord.push(input.value)
				})
				solvedWords.push(solvedCurrWord)
			})
			console.log('solvedwords', solvedWords)
			mistakesCount = 0
			mistakes = []
			for (let x = 0; x < currWords.length; x++) {
				flag = true
				for (let y = 0; y < currWords[x].letters.split(' ').length; y++) {
					correctLetter =
						currWords[x].name[currWords[x].letters.split(' ')[y]].toLowerCase()
					insertLetter = solvedWords[x][y].toLowerCase()
					console.log('введенный:', insertLetter)
					console.log('корректный:', correctLetter)
					if (correctLetter != insertLetter) {
						flag = false
						mistakes.push(currWords[x].name)
						mistakesCount += 1
						break
					}
				}
			}

			sendTestResults(mistakes)
			window.localStorage.setItem(
				'correctWords',
				currcard.words.length - mistakesCount
			)
			window.localStorage.setItem('AllWordsOfCard', currcard.words.length)
			console.log(window.localStorage.getItem('correctWords'))
			console.log(window.localStorage.getItem('AllWordsOfCard'))
			console.log(mistakes)
			if (mistakes.length !== 0) {
				window.location.href = 'fail.html'
			} else {
				window.location.href = 'no-mistakes.html'
			}
		})
	}
	if (document.querySelector('.test-list')) {
		drawCurrTest()
	}
	if (document.querySelector('.correctWords')) {
		document.querySelector('.correctWords').textContent =
			window.localStorage.getItem('correctWords')
		document.querySelector('.AllWordsOfCard').textContent =
			window.localStorage.getItem('AllWordsOfCard')
	}

	async function getUserInfo() {
		try {
			userInfoUrl = url + '/auth/me'
			const response = await fetch(userInfoUrl, {
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Access-Control-Allow-Origin': '*',
					authorization: localStorage.getItem('token'),
				},
			})
			const userData = await response.json()
			return userData
		} catch (e) {
			console.error(e)
		}
	}
	async function getAllWords() {
		try {
			allWordsUrl = url + '/words'
			const response = await fetch(allWordsUrl, {
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Access-Control-Allow-Origin': '*',
				},
			})
			const allWords = await response.json()
			console.log('func allwords:', allWords)
			const addinglist = document.querySelector('.adding-list')
			if (addinglist) {
				const addingblock = document.querySelector('.adding-block')
				const loading = document
					.querySelector('.adding-words')
					.querySelector('.loading')
				if (document.querySelector('.cardadding-list')) {
					const currcard = await getCurrCard()
					const selectedWords = await currcard.words
					console.log(addedWords)
					if (addedWords.length != 0) {
						document.querySelector('.btn-add').disabled = false
					}
					allWords.forEach(word => {
						const letter = word.name.toLowerCase().slice(0, 1)
						const wordCurrContainer = document.querySelector(`.item-${letter}`)

						let label = document.createElement('label')
						findWord = selectedWords.indexOf(word.name)

						if (findWord != -1) {
							label.innerHTML = `<input type="checkbox" checked class="word-cb" value="${word.name}"><span>${word.name}</span>`
							addedWords.push(word.name)
						} else {
							label.innerHTML = `<input type="checkbox" class="word-cb" value="${word.name}"><span>${word.name}</span>`
						}
						wordCurrContainer.querySelector('.words').appendChild(label)
						wordCurrContainer.classList.remove('hide')
					})
				} else {
					allWords.forEach(word => {
						const letter = word.name.toLowerCase().slice(0, 1)
						addinglist.querySelectorAll('.adding-item').forEach(item => {
							if (letter === item.querySelector('p').textContent.slice(1, 2)) {
								let label = document.createElement('label')
								label.innerHTML = `<input type="checkbox" class="word-cb" value="${word.name}"><span>${word.name}</span>`

								item.querySelector('.words').appendChild(label)
								item.classList.remove('hide')
							}
						})
					})
				}
				setTimeout(() => {
					loading.classList.add('hide')
					addingblock.classList.remove('hide')
				}, 10)

				addinglist.querySelectorAll('.word-cb').forEach(word => {
					word.addEventListener('click', () => {
						if (addedWords.length != 0) {
							document.querySelector('.btn-add').disabled = false
						}
						if (word.checked) {
							addedWords.push(word.value)
							console.log(addedWords)
							document.querySelector('.btn-add').disabled = false
						} else {
							addedWords.splice(addedWords.indexOf(word.value), 1)
							console.log(addedWords)
							if (addedWords.length == 0) {
								document.querySelector('.btn-add').disabled = true
							}
						}
					})
				})
			}
			return allWords
		} catch (e) {
			console.error(e)
		}
	}
})
