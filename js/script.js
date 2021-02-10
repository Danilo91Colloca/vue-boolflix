new Vue ({
  el : '#app',
  data : {
    userSearch: '',
    searchList : [],
    langList : ['de', 'en', 'fr', 'it', 'pt', 'us', 'zh']
  },
  methods : {
    isSearchFilm : function(){                    /*ricerca dinamica del titolo*/
      let self = this;
      axios
      .get('https://api.themoviedb.org/3/search/movie', {
          params: {
          api_key : 'd6a99b8f732b4dd111faf2e38c0dc146',
          query : this.userSearch 
        }
      })
      .then((returned)=>{
        this.searchList = returned.data.results      
      })
    },      
    starsVote : function(nVote){
      return parseInt(nVote / 2)
    }  
    
  }
})
Vue.config.devtools = true;

/*
indirizzo telefilm

https://api.themoviedb.org/3/search/tv?api_key=d6a99b8f732b4dd111faf2e38c0dc146&language=it_IT&query=
*/