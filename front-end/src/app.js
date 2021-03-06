import axios from 'axios'

//Variable pour permettre les mises à jours des nouvelles articles
let articles_page_actuelles = [];
let derniere_date_article = "";
let language_articles = "fr";

//Connexion websocket client, sur le port 8888
const wsClient = new WebSocket('ws://localhost:8888');

//Websocket client ouverture
wsClient.onopen = (event) => {
		
		//Permet de mettre un listener si changement de language
		var langchg = document.getElementById("langchg");
		langchg.onclick = changeSourceLang;
}

//Websocket client lors de reception d'un message serveur
wsClient.onmessage  = (message) => {
	
		//Parsage des donnees reçus
		var obj_recu = JSON.parse(message.data);
		
		if (obj_recu.what == "message")
		{
			//Affichage d'un message simple du serveur
			console.log('WebSocket :: message from server ==> ', obj_recu.content);
		}
		else if (obj_recu.what == "articles_update")
		{
			//actualisation de la page avec nouveau contenu
			console.log('WebSocket :: new content articles from server ==> ', obj_recu.content);
			actualisationPage(obj_recu.content);
			
        }
        else
			console.log(obj_recu);
}

//Websocket client lors de fermeture ou perte de la connexion au serveur
wsClient.onclose = (event) => {
        console.log('WebSocket :: Connexion closed.')
		alert('La connection avec le serveur a été perdu');
}

var content_web;
var request = axios
    .get('http://localhost:8080/news')
    .then((httpResponse) => { 
		
		//Actualisation de la page avec les nouveaux articles
		actualisationPage(httpResponse.data);
		
		//Renvoi de mise à jour du dernier article en date reçu
		wsClient.send(JSON.stringify({what: "articles_check", lang: language_articles, last_article_date: derniere_date_article, chlang:"false" }));
})

//Fonction permettant de charger les articles sur la page, actualisation de la page
//Actualisation automatique
function actualisationPage (httpResponse) {
	
		//info
		document.getElementById("message_info").innerHTML="chargement...";
	
		//variables
		var content_web = httpResponse;  
        var content = document.getElementById("content");
        content.innerHTML = ""
		
		//boucle parcourant les articles
        for(var i = 0; i < content_web.totalResults; i++)
        {
			//On définit les articles presents mise sur la page grâce à la date du dernier article
			if ( derniere_date_article < content_web.articles[i].publishedAt )
			{
				derniere_date_article = content_web.articles[i].publishedAt;
			}
			
			//Zone permettant d'afficher ou non des elements, si ceux-ci sont non défini ou égales à null
            var image_affiche;
            if (content_web.articles[i].urlToImage !== "" && content_web.articles[i].urlToImage != null ) {
				image_affiche = '<img class="img-responsive" src="'+content_web.articles[i].urlToImage+'">';
			}
			else
				image_affiche = "";
				
			var author_affiche;
			if (content_web.articles[i].author !== "" && content_web.articles[i].author != null) {
				author_affiche = content_web.articles[i].author;
			}
			else
			{
				author_affiche = content_web.articles[i].source.name;
				/*if (author_affiche.lastIndexOf(".") > 0)
					author_affiche = author_affiche.substring(0, author_affiche.lastIndexOf("."));*/
			}
			var description_affiche;
            if (content_web.articles[i].description !== "" && content_web.articles[i].description!= null ) {
				description_affiche = content_web.articles[i].description;
			}
			else
				description_affiche = "";



			//Mise en forme du contenu sur la page html
            content.innerHTML = content.innerHTML +
                                '<div class="col-md-3 article" id="singleArticle'+i+'">'+
									image_affiche+
                                    '<h1 class="titreArticle">'+content_web.articles[i].title+'</h1>'+
                                    '<p class="articleDescription">'+description_affiche+'</p>'+
                                    '<p class="redaction"><b>Source :</b> '+author_affiche+'<br> <b>Le :</b> '+new Date(content_web.articles[i].publishedAt).toUTCString()+'<br> <b>Website :</b> '+content_web.articles[i].source.name+'</p><br>'+
                                    '<a href="'+content_web.articles[i].url+'"><button type="button" class="btn btn-primary">En savoir plus</button></a>'+
                                '</div>'

        }
        //info
		document.getElementById("message_info").innerHTML="";
}


function changeSourceLang (lid) {
		//Permet le changement d'infos en localisation de la langue, donc du pays.
		let classtag = document.getElementById("lang").className.toString();
		classtag = classtag.substring(classtag.length-2, classtag.length);
		if (classtag !== language_articles)
		{
			language_articles = classtag;
			//Changera la langue des articles avec la variable chlang
			wsClient.send(JSON.stringify({what: "articles_check", lang: language_articles, last_article_date: derniere_date_article, chlang:"true" }));
		}
	}
