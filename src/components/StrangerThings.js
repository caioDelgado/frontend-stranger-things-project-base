import React from 'react'
import CharactersService from '../services/charactersAPI'

const getRealityClass = (hereIsTheUpsideDownWorld) => {
  return hereIsTheUpsideDownWorld ? 'upside-down' : 'stranger-things'
}

const strangerThingsConfig = {
  url: 'localhost:3002',
  timeout: 30000
}

const upsideDownConfig = {
  url: 'localhost:3003',
  timeout: 30000
}

const charactersService = new CharactersService(strangerThingsConfig)
const charactersUpsideDownService = new CharactersService(upsideDownConfig)

class StrangerThings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hereIsTheUpsideDownWorld: false,
      characterName: '',
      characters: [],
      page: 1
    }

    this.handleInput = this.handleInput.bind(this)
    this.changeRealityClick = this.changeRealityClick.bind(this)

    this.searchClick = this.searchClick.bind(this)
    this.searchCharacter = this.searchCharacter.bind(this)

    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
  }

  changeRealityClick () {
    this.setState({
      hereIsTheUpsideDownWorld: !this.state.hereIsTheUpsideDownWorld,
      characters: []
    })
  }

  handleInput (event) {
    this.setState({
      characterName: event.target.value
    })
  }

  searchClick () {
    this.setState({
      page: 1
    }, this.searchCharacter(1))
  }

  searchCharacter (page) {
    const service = this.state.hereIsTheUpsideDownWorld ? charactersUpsideDownService : charactersService

    service.getCharacters(this.state.characterName, page || this.state.page, 10)
      .then(({ data: characters }) => {
        this.setState({
          characters
        })
      })
  }

  nextPage () {
    if (!this.state.characters.length) return

    this.setState({
      page: this.state.page + 1
    }, () => this.searchCharacter())
  }

  previousPage () {
    if (this.state.page <= 1) return

    this.setState({
      page: this.state.page - 1
    }, () => this.searchCharacter())
  }

  render () {
    return (
      <div className={`reality ${getRealityClass(this.state.hereIsTheUpsideDownWorld)}`}>
        <div className='content strangerfy'>
          <div className='change-reality'>
            <button onClick={this.changeRealityClick}> Mudar de Realidade</button>
          </div>

          <div>
            <input placeholder='Nome do Personagem' onChange={this.handleInput} value={this.state.characterName} />
            <button onClick={this.searchClick}>Pesquisar</button>
          </div>

          <div>
            <table>
              <tr>
                <th>Nome</th>
                <th>Origem</th>
                <th>Status</th>
              </tr>
              {
                this.state.characters.map((x) => {
                  return <tr>
                    <td>{ x.name }</td>
                    <td>{ x.origin }</td>
                    <td>{ x.status }</td>
                  </tr>
                })
              }
            </table>
          </div>

          <div>
            <p>Página atual: {this.state.page}</p>
          </div>
          <div>
            <button onClick={this.previousPage}>Anterior</button>
            <button onClick={this.nextPage}>Próximo</button>
          </div>
        </div>
      </div>
    )
  }
}

export default StrangerThings
