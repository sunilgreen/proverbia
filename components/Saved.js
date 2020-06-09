import React, { Component } from 'react'
import {View, Text, FlatList, StyleSheet } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Icon } from "react-native-elements";



export class Saved extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        data: [],
        saveMap: new Map(),
    }


    fetchData = async () => {
    
        try {
            if (this._isMounted) {
                const value = await AsyncStorage.getAllKeys();
                const result = await AsyncStorage.multiGet(value);
          
                this.setState({data: result});
                this.setState({isFetching: false});
  
                let saveMapcpy = this.state.saveMap;
                let size = Object.keys(result).length;
                for(let i = 0; i < size; i++) {
                    saveMapcpy.set(result[i][0], i);
               
                }

                this.setState({saveMap: saveMapcpy});

            }
         
        
            } catch (error) {
                // Error retrieving data
                console.log(error.message);
            }

    } /* end of fetchData */

    deleteData = async (index) => {
        try {
          await AsyncStorage.removeItem(index);
        } catch (error) {
          // Error saving data
          console.log(error.message);
        }
    } /* end of deleteData */


    deleteProverb(index) {
        this.deleteData(index);
        let localindex = this.state.saveMap.get(index);
        let datacpy = this.state.data;
        datacpy.splice(localindex, 1);
        this.setState({data: datacpy});

    } /* end of deleteProverb */ 

    
    componentDidMount() {
        this._isMounted =  true;
        this.fetchData();

        this.props.navigation.addListener('tabPress', e => {
            this.fetchData();
           
          }); 
    } /* end of componentDidMount() */

    componentWillUnmount() {
        this._isMounted  = false;

    } /* end of componentWillUnmount*/


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                <Text style={styles.title}>Saved</Text>
                </View>
                <FlatList 
                    data={this.state.data}
                    extraData={this.state.data}
                    keyExtractor={(item) => item[0]}
                    renderItem={({ item }) => (


                        <View style={styles.row}>
                            
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>{item[1]}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Icon  name="delete" onPress={()  => this.deleteProverb(item[0])}></Icon>
                            </View>
                           
                        </View>

                    )}
                    />              
            </View>
            
        )
    } /* end of render  */
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'aliceblue',
        height: '100%'

    },

    titleContainer: {
        paddingTop: 50,
        paddingBottom: 10,
        marginBottom: 0,
        textAlign: "center",
        alignItems: "center"

    },

    title: {
        fontSize: 40,
        fontFamily: "Palatino",
        color: "rgb(43, 163, 237)", 
    },

    row: {
        flex: 1,
        flexDirection: "row",
        paddingBottom: 25,
        paddingTop: 10,
        marginLeft: 15,
        marginRight: 15,
        borderTopColor: "rgb(100, 100, 100)",
        borderTopWidth: 1,
        

    },

    textContainer: {

        justifyContent: 'center',
        flexDirection: 'row',
        flexShrink: 1,
        width: "80%"
        
      
        // paddingHorizontal: 20,
    
       

    },
    
    text: {
        textAlign: "left",
        fontFamily: "Palatino",
        fontStyle: 'italic',
        flexWrap: 'wrap',

     
       

        
        
      

    },

    buttonContainer: {
        
        justifyContent: 'center',
        
        
    }

})

export default Saved


