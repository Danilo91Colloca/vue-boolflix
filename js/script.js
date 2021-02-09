new Vue ({
  el : '#app',
  data : {
    userSearch: '',
    searchList : []

  },
  methods : {
    //ricerca dinamica del titolo
    isSearchFilm : function(){
      const searchkey = this.userSearch;
      let self = this;
      axios
      .get('https://api.themoviedb.org/3/search/movie?api_key=d6a99b8f732b4dd111faf2e38c0dc146&query=' + searchkey)
      .then(function(returned){
        self.searchList = returned.data.results
        console.log(self.searchList)
      })
    }
  }

})
Vue.config.devtools = true;
