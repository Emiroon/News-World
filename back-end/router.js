const express = require('express')
const router = express.Router()
const axios = require('axios')

router.route('/').get(function(request, response) {
    response.send('<a href="/news">Acceder aux news !</a>')
})

router.route('comments').get((request, response) => {
    //No use for now ?
})

router.route('/comments').get((request, response) => {
	
    //No use for now ?

})

router.route('/news').get((request, response) => {
    var request = axios
        .get('https://newsapi.org/v2/top-headlines?country=fr&apiKey=52fc969cb14946979ebfe1abafb0c88a')
        .then((httpResponse) => response.send(httpResponse.data))
})

router.route('/news/:id').get((request, response) => {
	
	// a voir source de l'article ?
	var request = axios
        .get('https://newsapi.org/v2/top-headlines?country=fr&articles='+request.params.id+'&apiKey=52fc969cb14946979ebfe1abafb0c88a')
        .then((httpResponse) => response.send(httpResponse.data))
})

module.exports = router
