new Vue ({
  el : '#app',
  data : {
    userSearch: '',
    movieList : [],
    tvList : [],
    movieGenres : [],
    tvGenres : [],
    allSearchList : [],

    idCodeMov:'',
    idCodeTv: '',

    langList : ['de', 'en', 'fr', 'it', 'pt', 'us', 'zh']
  },
  mounted () {
    this.defaultView(); 
    this.getMovieGenre(); //richiesta generi dei movies
    this.getTvGenre(); //richiesta generi tv
 
  },
  methods : {
    resetSearch: function(){
      this.userSearch = '';
      this.defaultView();
    },
    defaultView: function(){  
      axios /* chiamata xhr per la sezione FILM */
      .get('https://api.themoviedb.org/3/search/movie', {
          params: {
          api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
          query : this.randomLetter(), //query random
          language : 'it_IT' 
        }
      })
      .then((returned)=>{
        this.movieList = returned.data.results;
        this.allSearchList = [...this.allSearchList, ...this.movieList]  
      });        
      axios /*chiamata xhr per la sezione TV*/ 
      .get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
          query : this.randomLetter() //query random 
        }
      })
      .then((returned)=>{
        this.tvList = returned.data.results;      
        this.allSearchList = [...this.allSearchList, ...this.tvList]
      }); 
    },
    search : function(){
      this.allSearchList = []; //azzera lista ricerca
      this.searchGenMovId();
      this.movieByGenre();
      this.searchGenTvId();
      this.tvByGenre();
      if(this.userSearch !== ''){ //per non generare error 422
        this.searchPerson(); //richiesta persone
        this.searchFilm(); //richiesta movie
        this.searchTv(); //richiesta tv
      }  
      if(this.userSearch ===''){
        this.defaultView();
      }
    },
    searchFilm : function(){     /*ricerca dinamica del titolo e ritorna films*/
      axios /* chiamata xhr per la sezione FILM */
      .get('https://api.themoviedb.org/3/search/movie', {
          params: {
          api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
          query : this.userSearch,
          language : 'it_IT' 
        }
      })
      .then((returned)=>{
        this.movieList = returned.data.results;
        this.allSearchList = [...this.allSearchList, ...this.movieList]  
      });        
    },
    searchTv: function() {
      axios /*chiamata xhr per la sezione TV*/ 
      .get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
          query : this.userSearch 
        }
      })
      .then((returned)=>{
        this.tvList = returned.data.results;      
        this.allSearchList = [...this.allSearchList, ...this.tvList]
      }); 

    },
    searchPerson: function(){ /*ricerca tramite nome di attore/regista*/ 
      axios /* chiamata xhr per person */
      .get('https://api.themoviedb.org/3/search/person', {
          params: {
          api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
          query : this.userSearch,
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
            api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
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
            api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
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
          api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
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
          api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
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
    starsVote : function(nVote){ /*ritorna il voto medio in intero e alla sua metà*/
      return parseInt(nVote / 2)
    },
    isFilmTvParam : function(title, name){ /*ritorna parametri diversi se la query è film o tv*/
      if(title){
        return title
      }    
      return name
    },
    capitalize: function(phrase){ //funzione capitalize
      return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    randomLetter: function(){ //prende 2 lettere random dall'alfabeto
      let result = '';
      let alfabeto = 'abcdefghijklmnopqrstuvwxyz';
      for(let i=0; i<=2; i++){
        result = alfabeto.charAt(Math.floor(Math.random() * alfabeto.length))
      }
      return result
    }
        
  }
})
Vue.config.devtools = true;
