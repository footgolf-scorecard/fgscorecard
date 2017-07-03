import React from 'react';
import { Alert, Image, Text, TouchableHighlight, View, FlatList } from 'react-native';
import { Link } from 'react-router-native';

import PlayerSignup from './PlayerSignup';
import GamePlayer from './GamePlayer';
import { MonarchBay } from './../courses/courses';
import { styles } from './../styles/App';

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentHole: null,
      players: [],
      totalPlayers: 0,
    }

    this._playersignup = this._playersignup.bind(this);
    this._incrementscore = this._incrementscore.bind(this);
  }

  _playersignup(type, player) {
    let players;
    switch(type) {
      case 'add':
        this.setState({
          players: this.state.players.concat(player),
          totalPlayers: this.state.totalPlayers + 1,
        });
        break;
      case 'remove':
        players = this.state.players.slice(0, player.key)
                                    .concat(this.state.players
                                    .slice(player.key + 1));
        this.setState({
          players,
        });
        break;
      case 'finish':
        players = this.state.players.map((player) => {
          return Object.assign({}, player, {
            scores: player.scores.concat([0])
          });
        });
        this.setState({
          currentHole: 1,
          players,
        });
        break;
      default:
        return this.state;
    }
  }

  _incrementscore(playerkey, sign) {
    let players = this.state.players.map((player) => {
      if (player.key !== playerkey) {
        return player;
      } else {
        const oldscore = player.scores[this.state.currentHole - 1];
        const newscore = (sign === '+') ?
          oldscore + 1 : oldscore - 1;
        return Object.assign({}, player, {
          scores: player.scores.slice(0, this.state.currentHole - 1).concat([newscore])
        });
      }
    });

    this.setState({
      players,
    });
  }

  render() {
    if (this.state.currentHole === null) {
      return <PlayerSignup players={this.state.players}
                           playersignup={this._playersignup}
                           totalPlayers={this.state.totalPlayers} />
    }
    const currentHole = this.state.currentHole;
    const coursehalf = (currentHole > 9) ?
      MonarchBay.back : MonarchBay.front;

    return (
      <View style={styles.container}>
        <Text>MonarchBay</Text>
        <Text>Course Totals</Text>
        <Text>Total Yardage: {MonarchBay.total.totalYardage}</Text>
        <Text>Par: {MonarchBay.total.par}</Text>
        <Text>{(currentHole > 9) ? 'Back' : 'Front'} 9: Totals</Text>
        <Text>Total Yardage: {coursehalf.totalYardage}</Text>
        <Text>Par: {coursehalf.par}</Text>
        <Text>Hole {this.state.currentHole} </Text>
        <Text>Yardage: {MonarchBay.holes[this.state.currentHole - 1].yardage}</Text>
        <Text>Par: {MonarchBay.holes[this.state.currentHole - 1].par}</Text>
        <TouchableHighlight onPress={this.addPlayer}>
          <Text style={styles.resumebutton}>Finish Hole</Text>
        </TouchableHighlight>
        <FlatList data={this.state.players}
                  renderItem={(player) => <GamePlayer player={player}
                                                      currentHole={this.state.currentHole}
                                                      incrementscore={this._incrementscore} />} />

      </View>
    );
  }
};
