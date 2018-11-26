import React, { Component } from 'react'
import { Container, Row, Col, Card, Table, Jumbotron } from 'react-bootstrap'
import CountUp from 'react-countup';
import moment from 'moment'
import 'moment-timezone';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as suppressedActions from '../actions/suppressedActions'
import Loc from '../locations.json'

class Home extends Component {

  componentWillMount() {
    // API Calls
    this.props.actions.getLastSuppressed()
    for (let location of Loc.locations) {
      this.props.actions.getLastSuppressedByLocation(location.key)
      this.props.actions.getLastWeeksSuppressedByLocation(location.key)
    }
  }

  returnDateFormated(date) {
    let lastSupression
    let lastSupressionValue = 0
    let lastSupressionExpression
    let lastSupressionLabel
    lastSupression = moment.unix(date).fromNow()
    lastSupressionValue = parseInt(lastSupression)
    lastSupressionExpression = lastSupression.match(/[^\d]*/g)
    lastSupressionLabel = lastSupressionExpression.filter(word => word !== '')

    return [lastSupressionValue, lastSupressionLabel];
  }

  handleLines() {
    let allLines = []
    for (let location of Loc.locations) {
      if (this.props.allSuppressedContent[`fetchedLastSuppressedIn${location.key}`]) {
        allLines = [...allLines, this.renderLine(location, this.props.allSuppressedContent[`fetchedLastSuppressedIn${location.key}`])]
      }
    }
    return allLines
  }

  renderLine(location, content) {
    return (
      <tr key={location.key}>
        <td>{location.value}</td>
        <td>{moment.unix(content.timestamp).fromNow()}</td>
        <td>{content.type}</td>
        <td>{content.vendor}</td>
      </tr>
    )
  }

  handleLinesWeeks() {
    let allLines = []
    for (let location of Loc.locations) {
      if (this.props.allSuppressedContent[`fetchedLastWeeksSuppressedIn${location.key}`]) {
        allLines = [...allLines, this.renderLineWeeks(location, this.props.allSuppressedContent[`fetchedLastWeeksSuppressedIn${location.key}`])]
      }
    }
    return allLines
  }

  renderLineWeeks(location, content) {
    return (
      <tr key={location.key}>
        <td>{location.value}</td>
        {content.map((item, index) => (
            <td key={index}>{this.renderCount(item.count)}</td>
        ))}
      </tr>
    )
  }

  renderCount(count) {
    if(count){
      let randomStart = Math.floor(Math.random() * (20 - 1 + 1)) + 1;

      return  <CountUp
          start={randomStart}
          end={parseInt(count,10)}
          duration={4}
          delay={1}
        />
    } else {
        return <i className="fas fa-check-circle"></i>
    }
  }

  render() {

    let lastSupression
    let lastSupressionValue = 0
    let lastSupressionExpression
    let lastSupressionLabel
    if (this.props.allSuppressedContent.fetchedLastSuppressed) {
      lastSupression = moment.unix(this.props.allSuppressedContent.fetchedLastSuppressed.timestamp).fromNow()
      lastSupressionValue = parseInt(lastSupression)
      lastSupressionExpression = lastSupression.match(/[^\d]*/g)
      lastSupressionLabel = lastSupressionExpression.filter(word => word !== '')
    }

    return (
      <div className="Home">
        <Jumbotron fluid>
          <Container>
            <h1 className="text-center">O último comboio suprimido foi há &nbsp;
              <CountUp
                start={0}
                end={lastSupressionValue}
                duration={3}
                delay={0.5}
              />
              {lastSupressionLabel}
            </h1>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body className="text-center">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Linha</th>
                        <th>Último</th>
                        <th>Tipo</th>
                        <th>Operador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.handleLines()}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col xs={12}>
              <Card>
                <Card.Body className="text-center">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Linha / Dia</th>
                        <th>{moment().subtract(14, 'day').format('D')}</th>
                        <th>{moment().subtract(13, 'day').format('D')}</th>
                        <th>{moment().subtract(12, 'day').format('D')}</th>
                        <th>{moment().subtract(11, 'day').format('D')}</th>
                        <th>{moment().subtract(10, 'day').format('D')}</th>
                        <th>{moment().subtract(9, 'day').format('D')}</th>
                        <th>{moment().subtract(8, 'day').format('D')}</th>
                        <th>{moment().subtract(7, 'day').format('D')}</th>
                        <th>{moment().subtract(6, 'day').format('D')}</th>
                        <th>{moment().subtract(5, 'day').format('D')}</th>
                        <th>{moment().subtract(4, 'day').format('D')}</th>
                        <th>{moment().subtract(3, 'day').format('D')}</th>
                        <th>{moment().subtract(2, 'day').format('D')}</th>
                        <th>{moment().subtract(1, 'day').format('D')}</th>
                        <th>{moment().format('D')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.handleLinesWeeks()}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...suppressedActions }, dispatch)
  }
}

function mapStateToProps(state) {
  return {
    allSuppressedContent: state.suppressedReducer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
