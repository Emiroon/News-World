import axios from 'axios'

var content_web;
var request = axios
    .get('http://localhost:8080/news')
    .then((httpResponse) => { console.log(httpResponse.data); content_web = httpResponse.data;  console.log(content_web);

        var content = document.getElementById("content");
        content.innerHTML = ""


        for(var i = 0; i < content_web.totalResults; i++)
        {
            var image_affiche;
                if (content_web.articles[i].urlToImage !== "" && content_web.articles[i].urlToImage != null ) {
                    image_affiche = '<img class="img-responsive" src="'+content_web.articles[i].urlToImage+'">';
                }
                else
                    image_affiche = "";

            content.innerHTML = content.innerHTML +
                                '<div class="col-md-4 article" id="singleArticle'+i+'">'+
                                    '<h1 class="titreArticle">'+content_web.articles[i].title+'</h1>'+
                                    '<p class="articleDescription">'+content_web.articles[i].description+'</p>'+
                                        image_affiche+
                                    '<p class="redaction"><b>Rédigé par :</b> '+content_web.articles[i].author+'<br> <b>Le :</b> '+new Date(content_web.articles[i].publishedAt).toUTCString()+'<br> <b>Source :</b> '+content_web.articles[i].source.name+'</p><br>'+
                                    '<button type="button" class="btn btn-primary center-block">En savoir plus</button>'+
                                '</div>'

        }


    })

//var content = document.getElementById("content");
    //content.innerHTML = "<p>test</p>"