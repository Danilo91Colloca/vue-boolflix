new Vue ({
  el : '#app',
  data : {
    userSearch: '',
    searchList : [],
    star: 'far',

  },
  methods : {
    isSearchFilm : function(){                    /*ricerca dinamica del titolo*/
      const searchkey = this.userSearch;
      let self = this;
      axios
      .get('https://api.themoviedb.org/3/search/movie?api_key=d6a99b8f732b4dd111faf2e38c0dc146&query=' + searchkey)
      .then(function(returned){
        self.searchList = returned.data.results
        console.log(self.searchList);
        self.searchList.map(element => {          /*estraggo solo il voto e lancio funzione isIntVote*/
          element.vote_average = self.isIntVote(element.vote_average)
        });
        self.searchList.forEach((element, index) => {  
          console.log(element.vote_average, index) 
        });


      })
    },
    isIntVote : function(vote){            /*trasformo il voto in intero compreso tra 0 e 5*/ 
      let intNum; 
      if(vote === 1){
        intNum = 1
      } else {
        intNum = parseInt(vote / 2)
      }
      return intNum
      // console.log(intNum)      
    },
    voteInList : function(nVote){

    }
    
   
    
    
  }
})
Vue.config.devtools = true;

/*
indirizzo telefilm

https://api.themoviedb.org/3/search/tv?api_key=d6a99b8f732b4dd111faf2e38c0dc146&language=it_IT&query=
*/