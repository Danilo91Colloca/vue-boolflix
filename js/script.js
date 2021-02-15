new Vue ({
  el : '#app',
  data : {
    apiKey : 'd6a99b8f732b4dd111faf2e38c0dc146',
    pageNotFound: false,
    userSearch: '', //input model
    movieList : [], //only movie
    tvList : [], //only tv
    movieGenres : [], 
    tvGenres : [],
    allSearchList : [], //mov + tv
    idCodeMov:'', 
    idCodeTv: '',
    langList : ['de', 'en', 'fr', 'it', 'pt', 'us', 'zh'], //flag in local img
    active: { //per far comparire e nascondere oggetti del DOM
      index: false,
      show: false
    },
    actors: [],
    genreNameCards: []
  }, 
  mounted() {
    this.apiKeyNotValid()
    this.defaultCall(); 
    this.getMovieGenre(); //richiesta generi dei movies
    this.getTvGenre(); //richiesta generi tv 
  },
  methods : {
    resetSearch: function(){ //resetta la ricerca e ritorna al default
      this.userSearch = '';
      this.defaultCall();
    },
    defaultCall: function(){  //chiamata di default all API
      axios /* chiamata xhr per la sezione FILM */
      .get('https://api.themoviedb.org/3/movie/popular', {
          params: {
          api_key : this.apiKey
        }
      })
      .then((returned)=>{
        this.movieList = returned.data.results;
        this.allSearchList = [...this.allSearchList, ...this.movieList]  
      });        
      axios /*chiamata xhr per la sezione TV*/ 
      .get('https://api.themoviedb.org/3/tv/popular', {
        params: {
          api_key : this.apiKey,
          query : this.randomLetter() //query random 
        }
      })
      .then((returned)=>{
        this.tvList = returned.data.results;      
        this.allSearchList = [...this.allSearchList, ...this.tvList]
      }); 
    },
    search : function(){ //avvia tutte le funzioni di ricerca
      this.allSearchList = []; //azzera lista ricerca
      this.searchGenMovId();
      this.movieByGenre();
      this.searchGenTvId();
      this.tvByGenre();
      if(this.userSearch !== ''){ //per non generare error 422
        this.searchFilm(this.userSearch); //richiesta movie
        this.searchTv(this.userSearch); //richiesta tv
        this.searchPerson(this.userSearch); //richiesta persone
      }  
      if(this.userSearch ===''){
        this.defaultCall();
      }
    },
    searchFilm : function(userType){    /*ricerca dinamica del titolo e ritorna films*/
      axios /* chiamata xhr per la sezione FILM */
      .get('https://api.themoviedb.org/3/search/movie', {
          params: {
          api_key : this.apiKey,
          query : userType,
          language : 'it_IT' 
        }
      })
      .then((returned)=>{
        this.movieList = returned.data.results;
        this.allSearchList = [...this.allSearchList, ...this.movieList]  
      });        
    },
    searchTv: function(userType) {
      axios /*chiamata xhr per la sezione TV*/ 
      .get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key : this.apiKey,
          query : userType
        }
      })
      .then((returned)=>{
        this.tvList = returned.data.results;      
        this.allSearchList = [...this.allSearchList, ...this.tvList]
      }); 
    },
    searchPerson: function(userType){ /*ricerca tramite nome di attore/regista*/ 
      axios /* chiamata xhr per person */
      .get('https://api.themoviedb.org/3/search/person', {
          params: {
          api_key : this.apiKey,
          query : userType,
          language : 'it_IT' 
        }
      })
      .then((returned)=>{
        let person = returned.data.results;
        this.filterByPerson(person) 
      });        
    }, 
    filterByPerson : function(arrayObj){ /*filtra la ricerca persona e implementa con dati movie*/
      arrayObj.forEach(element => {
        this.allSearchList = [...this.allSearchList, ...element.known_for]
      });
    }, 
    getMovieGenre: function(){ /* crea lista di tutti i generi movie disponibili */
        axios
        .get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key : this.apiKey,
            language : 'it_IT' 
          }
        })
        .then((returned)=>{
          this.movieGenres = returned.data.genres;
        });
    },
    getTvGenre: function(){  /* crea lista di tutti i generi tv disponibili */
        axios
        .get('https://api.themoviedb.org/3/genre/tv/list', {
          params: {
            api_key : this.apiKey,
            language : 'it_IT' 
          }
        })
        .then((returned)=>{
          this.tvGenres = returned.data.genres;
        });
    },  
    searchGenMovId: function() { //trasforma il nome genere inserito dall'utente in cod id
      let genName= this.capitalize(this.userSearch);
      let id;
      this.movieGenres.forEach((element) =>{
        if(element.name.includes(genName)){
          id = "";
          id = element.id
        }
        // console.log(id)
        return this.idCodeMov = id
      })
    }, 
    movieByGenre: function(){ //filtra movieList inserendo film che includono idCodeMov
      axios /* chiamata xhr per la sezione FILM */
      .get('https://api.themoviedb.org/3/search/movie', {
          params: {
          api_key : this.apiKey,
          query : this.randomLetter(), //query random
          language : 'it_IT' 
        }
      })
      .then((returned)=>{ //ritorna solo i film che contengono idCodeMov
        this.movieList = returned.data.results;
        this.movieList = this.movieList.filter((element)=>{ 
          return element.genre_ids.includes(this.idCodeMov)
        })
        this.allSearchList = [...this.allSearchList, ...this.movieList]  
      }); 
    }, 
    movieBySelectGenre: function(){ //filtra movieList inserendo film che includono idCodeMov
      // this.searchGenMovId();
      this.movieByGenre();
    }, 
    searchGenTvId: function() { //trasforma il nome genere inserito dall'utente in cod id
      let genName= this.capitalize(this.userSearch);
      let id;
      this.tvGenres.forEach((element) =>{
        if(element.name.includes(genName)){
          id = "";
          id = element.id
        }
        return this.idCodeTv = id
      })
    }, 
    tvByGenre: function(){ //filtra tvList inserendo film che includono idCodeTv
      axios /*chiamata xhr per la sezione TV*/ 
      .get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key : this.apiKey,
          query : this.randomLetter() //query random 
        }
      })
      .then((returned)=>{
        this.tvList = returned.data.results; 
        this.tvList = this.tvList.filter((element)=>{
          return element.genre_ids.includes(this.idCodeTv)               
        })     
        this.allSearchList = [...this.allSearchList, ...this.tvList]
      });     
    },
    imgSrc: function(endSrc){ //return SRC img from API
      return `http://image.tmdb.org/t/p/w342/${endSrc}`
    },  
    starsVote : function(nVote){ /*ritorna il voto medio in intero e alla sua metà*/
      return parseInt(nVote / 2)
    },
    isFilmTvParam : function(title, name){ /*ritorna parametri diversi se la query è film o tv*/
      if(title){
        return title
      }    
      return name
    },
    selectByGenre : function (gen, nMenu) { //mostra a schermo solo i generi scelti in movie o tv 
      if(nMenu === 'movie'){ //avvia la chiamata se parte dal menu MOVIE
        let genName = this.capitalize(gen);
        console.log(genName)
        this.searchFilm(this.randomLetter())
        let id;
        this.movieGenres.forEach((element) =>{
        if(element.name.includes(genName)){
          id = "";
          id = element.id
        }
          console.log(id)
          return this.idCodeMov = id
        })
        this.userSearch=gen
        axios /* chiamata xhr per la sezione FILM */
        .get('https://api.themoviedb.org/3/search/movie', {
            params: {
            api_key : this.apiKey,
            query : this.randomLetter(), //query random
            language : 'it_IT' 
          }
        })
        .then((returned)=>{ //ritorna solo i film che contengono idCodeMov
          this.movieList = returned.data.results;
          console.log(this.movieList)
          this.movieList = this.movieList.filter((element)=>{ 
            return element.genre_ids.includes(id)
          })       
          this.allSearchList = this.movieList 
        });
      }
      if(nMenu === 'tv'){ //avvia la chiamata se parte dal menu TV
        let genName = this.capitalize(gen);
        console.log(genName)
        this.searchFilm(this.randomLetter())
        let id;
        this.tvGenres.forEach((element) =>{
        if(element.name.includes(genName)){
          id = "";
          id = element.id
        }
          console.log(id)
          return this.idCodeMov = id
        })
        this.userSearch=gen
        axios /*chiamata xhr per la sezione TV*/ 
        .get('https://api.themoviedb.org/3/search/tv', {
          params: {
            api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
            query : this.randomLetter(), //query random
          }
        })
        .then((returned)=>{
          this.tvList = returned.data.results;
          console.log(this.tvList)
          this.tvList = this.tvList.filter((element)=>{ 
            return element.genre_ids.includes(id)
          })       
          this.allSearchList = this.tvList
        });      
      }     
    },
    menuVisible : function(idx){ //cambia i data nell'oggetto active
      this.active.index = idx;
      this.active.show = !this.active.show;
    }, 
    isCast: function(filmID){ //richiede oggetti contenente attori
      axios
      .get('https://api.themoviedb.org/3/movie/' + filmID + '/credits?api_key=' + this.apiKey)
      .then((response)=>{
        this.actors = response.data.cast
        this.isActor()
      })     
    },
    isActor: function(){      
      let fiveOfActors = this.actors
      this.actors = fiveOfActors.slice(0, 4)      
    },   
    genreInCards: function(id){ //restituisce i generi dei film nelle cards
      let allGenre = [...this.movieGenres, ...this.tvGenres];
      let genName=[];
      allGenre.forEach((element)=>{
        if(id.includes(element.id)){
          genName.push(element.name) 
        }
      })
      genName=genName.filter((element, index)=>{
        return genName.indexOf(element) === index 
      })
      console.log(genName)
      this.genreNameCards=genName
    },
    areOtherInformation: function(id, index, ids) {
      this.isCast(id, index);
      this.menuVisible(index);  
      this.genreInCards(ids);
    },
    //UTILITY FUNCTION
    isMenuVisible : function(idx){ //funzione di verifica condizioni v-if per i menu
      return this.active.index === idx && this.active.show;
    },
    capitalize: function(phrase){ //funzione capitalize
      return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    randomLetter: function(){ //prende 1 lettera random dall'alfabeto
      let result = ''; 
      let alfabeto = 'abcdefghijklmnopqrstuvwxyz';
      for(let i=0; i<=1; i++){
        result = alfabeto.charAt(Math.floor(Math.random() * alfabeto.length))
      }
      return result
    },
    //ERROR ALERT
    apiKeyNotValid: function(){
      let self=this;
      if(this.apiKey.length < 32){ //if apikey.length change
        setTimeout(function(){
          self.pageNotFound = true
          console.log('ALERT! API_KEY IS WRONG IN LENGTH')
        }, 900)        
      }else if(this.apiKey !== 'd6a99b8f732b4dd111faf2e38c0dc146'){
        setTimeout(function(){
          self.pageNotFound = true
          console.log('ALERT! API_KEY IS NOT VALID')
        }, 900)
      }    
    }   
  }
})
Vue.config.devtools = true;

/*
randomLetter: non essendoci una query che permettesse di eseguire una ricerca in tutto il catalogo film o tv ho creato una funzione che prenda una lettera a caso del alfabeto in modo che ad ogni ricerca per genere, ci sia un risultato diverso ad ogni click della stessa voce. Cliccando per esempio più volte su "action" avremo sempre un risultato divero;

capitalize: l'ho pensata per la ricerca per generi in quanto nel JOSN della API sono compilati con la lettera iniziale maiuscola. 
*/
