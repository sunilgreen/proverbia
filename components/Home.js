import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Animated } from 'react-native'
import firebase from 'firebase';
import { Icon } from "react-native-elements";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AsyncStorage } from 'react-native';


export default class Home extends Component {
 
    constructor(props) {
        super(props);
        this.animatedvalue = new Animated.Value(0);
        this._isMounted = false;
        //this.handleOnPressBookmark =  this.handleOnPressBookmark.bind(this);
    
      }
      state = {
        proverbs: {'0': 'Hello', '1': "this is gonna be a great app"},
        selectedProverb: "Loading...",
        selectedIndex: '0',
        isBookmarked: false,
        savedList: [],
        history: [],
        historyIndex: 0,
        started: false,
        isLoading: true,
        fadeAnim: new Animated.Value(0),
        first: true
      }

      fadeIn = () => {
        Animated.timing(this.animatedvalue, {
          toValue: 1,
          duration: 2000
        }).start();
        
      }

      fadeOut = () => {
        Animated.timing(this.state.fadeAnim, {
          toValue: 0,
          duration: 2000
        }).start();
      }




     
      fetchData = async () => {
        try {
          if (this._isMounted) {
            const value = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(value).then((results) => {

            let savedListlocal = [];

            let size = Object.keys(results).length;
            for (let i = 0; i < size; i++) {
              savedListlocal[i] = parseInt(results[i][0]);
            }
            
            this.setState({savedList: savedListlocal}); 
            this.setState({isLoading: false});
         
          });
          }
          
        } catch (error) {
          // Error retrieving data
          console.log(error.message);
        }

      
        
       
      }  /* end of fetchData() */

      componentDidMount() {
        // Your web app's Firebase configuration

        this._isMounted = true;
        var firebaseConfig = {
          apiKey: "AIzaSyBh_-KHGWR5dVTBDkhY3qLf72SumK_Bc0g",
          authDomain: "proverbia-1eb8c.firebaseapp.com",
          databaseURL: "https://proverbia-1eb8c.firebaseio.com",
          projectId: "proverbia-1eb8c",
          storageBucket: "proverbia-1eb8c.appspot.com",
          messagingSenderId: "835239206714",
          appId: "1:835239206714:web:4a120d9b406757adc7ba03",
          measurementId: "G-SQSP7MV21M"
        };
        // Initialize Firebase
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
       
        //firebase.analytics();
      
        firebase.database().ref('standard').once('value', (data) => {
          let proverbdata = data.toJSON();
          //console.log(proverbdata);

          if (this._isMounted) {
            this.setState({ proverbs: proverbdata});

          }
          

        })

        this.props.navigation.addListener('tabPress', e => {
          if (this._isMounted) {
            this.setState({isLoading: true});
            
            this.fetchData().then(() => {
            
              if (!this.state.savedList.includes(this.state.selectedIndex)) {
                this.setState({isBookmarked: false});
              }

            });

          }
          
          
          
         
        });


        this.fetchData();


      
      
      
      } /*  end of Component did Mount */

      componentWillUnmount()  {
        this._isMounted = false;

      }

      storeData = async () => {

        let value = this.state.selectedProverb;
        let index = this.state.selectedIndex.toString();
        try {
          await AsyncStorage.setItem(index, value);
        } catch (error) {
          // Error saving data
          console.log(error.message);
        }
      }

      deleteData = async () => {
        let index = this.state.selectedIndex.toString();
        try {
          await AsyncStorage.removeItem(index);
        } catch (error) {
          // Error saving data
          console.log(error.message);
        }

      }

    
        handleOnPressBookmark = () =>  {

          let temp = this.state.isBookmarked;
          this.setState({isBookmarked: !temp})


          /* if it wasn't bookmared before and not saved in async*/
          /* potential for future optimization */

          let savedListcpy;
          if (!temp && !this.state.savedList.includes(this.state.selectedIndex)) {
            //console.log("it's not saved because", this.state.savedList);
            
            this.storeData();
            savedListcpy = this.state.savedList;
            savedListcpy.push(this.state.selectedIndex);
            this.setState({ savedList: savedListcpy})


          } else if (temp && this.state.savedList.includes(this.state.selectedIndex)) {

            /* removes item from async storage */
            this.deleteData();

            /* removes from Saved List for bookmarking */
            savedListcpy = this.state.savedList;
            let index = savedListcpy.indexOf(this.state.selectedIndex);
            savedListcpy.splice(index, 1);
            this.setState({ savedList: savedListcpy});
            
          } 

        } /* end of handleOnPressBookmark */
    
    
      getProverb = () => {

        //if (this._isMounted) {
          if (!this.state.started) {
            this.setState({started: true});
          }
  
          this.animatedvalue.setValue(0);
          let cpyProverbs =  this.state.proverbs;
          let length = Object.keys(cpyProverbs).length;
          let index = Math.floor(Math.random() * length);
          this.setState({ selectedProverb: cpyProverbs[index][0]});
          this.setState({selectedIndex: index});
  
  
          /* adding to history */
          let localhistory = this.state.history;
          localhistory.push(this.state.selectedIndex);
          this.setState({history: localhistory});
          this.setState({historyIndex: localhistory.length - 1});
  
          /* if it's already been bookmarked */
          if (this.state.savedList.includes(index)) {
            this.setState({ isBookmarked: true});
          } else {
            this.setState({ isBookmarked: false});
          }
  
          this.fadeIn();



       // }
        
       
      
       
      }

      goback  = () => {
       

        let previous = this.state.history;
        let proverbs = this.state.proverbs;

        

        /*  history Index indicates where in the history array we are at */
        let index =  this.state.historyIndex;


        console.log(previous);
        console.log(index);

       
        if (index - 1 >= 0) {
          this.setState({selectedProverb: proverbs[previous[index - 1]][0]});
          index--;
          this.setState({historyIndex: index})
         
        }

      }

      goForward = () => {

        /* an array of indicies in the order we visited them */
        let previous = this.state.history;

        /* the list of proverbs */
        let proverbs = this.state.proverbs;

        /* where in the history array we are at */
        let index =  this.state.historyIndex;

       
        /* if we are not at the end */
        if (index + 1 < previous.length) {

          /* make the selectedProverb */
          this.setState({selectedProverb: proverbs[previous[index + 1]][0]});
          index++;
          this.setState({historyIndex: index})
         
        }

      }

      render() {
        return (
            <View style={{flex: 1, backgroundColor: 'aliceblue'}}>
         
            <View style={styles.titlespace}>
                <Text style={styles.title}>Proverbia</Text>
            </View>


            <View style={styles.container}>
                  
              {this.state.isLoading ?
              <Text>Loading...</Text>
              : 
              
              
              <Animated.Text style={[styles.quote, {
                opacity: this.animatedvalue

              }]}>{this.state.selectedProverb}</Animated.Text>
              
              }
          
      
            </View>

          <View  style={styles.buttonregion}>

              {this.state.started ? 
              
                <View style={styles.arrows}>
                <MaterialCommunityIcons name="arrow-left-bold-outline" size={35} color="black" style={styles.arrowL} onPress={() =>  this.goback()}/>
                <MaterialCommunityIcons name="arrow-right-bold-outline" size={35} color="black"style={styles.arrowR} onPress={() => this.goForward()}/>
                </View>
                : <View style={styles.nothing}></View>
              }

              {this.state.isBookmarked && this.state.started ?  
                <Icon name="bookmark" onPress={this.handleOnPressBookmark} style={styles.bookmark}/> :
                <Icon name="bookmark-border" onPress={this.handleOnPressBookmark} style={styles.bookmark}/>
              }

              
            
          </View>
           
            <View style={styles.button}>
                <Button title="Get a Proverb" onPress={this.getProverb}></Button>
            </View>

           
           
            </View>
          )

      }
}


const styles = StyleSheet.create({
  titlespace: {
    justifyContent: 'center',
    alignItems: 'center',
    height: "35%"
  },
  title: {
    fontSize: 45,
    fontStyle: "italic",
    fontFamily: "Palatino",
    color: "rgb(43, 163, 237)",
  },
    container: {
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'center',
  
    },
    quote: {
      paddingHorizontal: 10,
      textAlign: "center",
      fontFamily: "Palatino",
      fontStyle: 'italic',
      fontSize: 20,
      height: 140,
      flexGrow: 1,
      flex: 3,
      flexWrap: 'wrap'
    },

    bookmark: {
      justifyContent: 'flex-start',
      height: 50,
      width: 50,
     

    },

    buttonregion: {
      display: 'flex',
      flexDirection: 'row'

    },

    arrows: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20

    },

    nothing: {
      width:  0,
      height: 0
    },

    arrowL: {
      marginRight: 5

    },

    arrowR: {

    },
    
    button: {
      alignItems: 'center',
      marginTop: 35,
      marginBottom: 15,
      flex: 2

    }

  
  })