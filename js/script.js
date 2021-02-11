new Vue ({
  el : '#app',
  data : {
    userSearch: '',
    allSearchList : [],
    movieList : [],
    tvList : [],
    langList : ['de', 'en', 'fr', 'it', 'pt', 'us', 'zh']
  },
  methods : {
    search : function(){
      this.allSearchList = [];
      this.searchFilm();
      this.searchTv();
    },
    searchFilm : function(){     /*ricerca dinamica del titolo e ritorna films*/
      if(this.userSearch !== '') {
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
      }    
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
    starsVote : function(nVote){ /*ritorna il voto medio in intero e alla sua metà*/
      return parseInt(nVote / 2)
    },
    isFilmTvParam : function(title, name){ /*ritorna parametri diversi se la query è film o tv*/
      if(title){
        return title
      }    
      return name
    }  
    
  }
})
Vue.config.devtools = true;
