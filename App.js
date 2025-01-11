import React, { Component, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      header: ['B', 'I', 'N', 'G', 'O'],
      numbers: [],
      clickedCells: [],
      isCellSelected: false,
      loaded: false
    }

    this.generateUniqueRandomNumbers = this.generateUniqueRandomNumbers.bind(this);
    this.generateRandomBingoCard = this.generateRandomBingoCard.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.clearAllCells = this.clearAllCells.bind(this);
    this.regenerateBingoCard = this.regenerateBingoCard.bind(this);
    this.newCardNumberValues = this.newCardNumberValues.bind(this);
    this.clearCardNumberValuesSelected = this.clearCardNumberValuesSelected.bind(this);
    this.toggleCell = this.toggleCell.bind(this);

  }

  componentDidMount () {
    this.setState({
      numbers:this.generateRandomBingoCard(),
      loaded: true
    }); // this is how you check state after it has been set
  }
  
  generateUniqueRandomNumbers(min, max, count) {
    const range = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    for (let i = range.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [range[i], range[j]] = [range[j], range[i]];
    }
    return range.slice(0, count);
  }

  generateRandomBingoCard() {
    const card = [
      ...this.generateUniqueRandomNumbers(1, 15, 5),
      ...this.generateUniqueRandomNumbers(16, 30, 5),
      ...this.generateUniqueRandomNumbers(31, 45, 5),
      ...this.generateUniqueRandomNumbers(46, 60, 5),
      ...this.generateUniqueRandomNumbers(61, 75, 5),
    ];

    card[12] = 'FREE';

    return card;
  }
  r
  handleCellClick(index) {
    if (this.state.numbers[index] === 'FREE') {
      return;
    }

    this.setState({ isCellSelected: true })
    this.toggleCell(index)
  }
  r
  toggleCell(index) {
    this.setState((prevState) => {
      return {
        clickedCells: prevState.clickedCells.includes(index)
          ? prevState.clickedCells.filter((i) => i !== index)
          : [...prevState.clickedCells, index],
      };
    });
  };


  clearAllCells() {
    if(this.state.clickedCells.length === 0) {
      this.setState({ clickedCells: [], isCellSelected: false  })
    } else if (this.state.isCellSelected) {
      Alert.alert('Aviso', 'A cartela possui números selecionados. Deseja limpá-los?', [
        {
          text: 'SIM',
          onPress: () => this.setState({ clickedCells: [], isCellSelected: false  })
        },
        {
          text: 'CANCELAR'
        }
      ]);
    }
  }

  regenerateBingoCard() {
    if (this.state.isCellSelected) {
      Alert.alert('Aviso', 'A cartela possui números selecionados. Deseja gerar uma nova cartela?', [
        {
          text: 'SIM',
          onPress: () => this.newCardNumberValues()
        },
        {
          text: 'CANCELAR'
        }
      ]);
      return;
    } else {
      this.newCardNumberValues();
    }
  }

  newCardNumberValues() {
    this.setState({
      numbers: this.generateRandomBingoCard(),
      clickedCells: [],
      isCellSelected: false
    })
  }

  clearCardNumberValuesSelected() {
    this.setState({
      clickedCells: [],
      isCellSelected: false
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bingoCard}>
          <View style={styles.bingoHeader}>
            {this.state.header.map((letter, index) => (
              <View key={index} style={styles.headerCell}>
                <Text style={styles.headerText}>{letter}</Text>
              </View>
            ))}
          </View>
          <FlatList
            data={this.state.numbers}
            numColumns={5}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => this.handleCellClick(index)}
                style={[
                  styles.cell,
                  this.state.clickedCells.includes(index) && styles.clickedCell,
                  item === 'FREE' && styles.freeCell,
                ]}
              >
                <Text style={styles.cellText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.bingoGrid}
          />

          <TouchableOpacity onPress={this.regenerateBingoCard} style={styles.generateButton}>
            <Text style={styles.generateButtonText}>Gerar Novos Números</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.clearAllCells} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpar Seleções</Text>
          </TouchableOpacity>

        </View>
      </View>

    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bingoCard: {   
    padding: 16,
    shadowColor: '#000',
  },
  bingoHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0056b3',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  bingoGrid: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  cell: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  clickedCell: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  freeCell: {
    backgroundColor: '#ffeb3b',
  },
  cellText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#ff5252',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
