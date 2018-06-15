const express = require('express')
const router = express.Router()
const axios = require('axios')

router.route('/').get(function(request, response) {
    response.send('Hello World')
})

router.route('comments').get((request, response) => {
    const news = [{'title' : 1}]
    response.send(news)
})

router.route('/comments').get((request, response) => {
    var request = axios
        .get('https://newsapi.org/v2/top-headlines?country=fr&apiKey=52fc969cb14946979ebfe1abafb0c88a')
        .then((httpResponse) => response.send(httpResponse.data))

})

router.route('/news').get((request, response) => {
    var request = axios
        .get('https://newsapi.org/v2/top-headlines?country=fr&apiKey=52fc969cb14946979ebfe1abafb0c88a')
        .then((httpResponse) => response.send(httpResponse.data))
})

router.route('/news/:id').get((request, response) => {

})

module.exports = router
