import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import AvatarCard from '../../components/AvatarCard';

class Home extends Component {

  renderRandomPledges() {
    var items = [];
    const names = ['Mike', 'Harvey', 'Rachel', 'Jessica', 'Donna', 'Loius', 'Norma'];
    for(var i=0; i<names.length; i++) {
      items.push(<AvatarCard avaName={names[i]} key={names[i]}/>);
    }

    return items;
  }


  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h2 style={{textAlign: 'center'}}>Current Pledges</h2>
          </div>
          <div>
            <Card.Group centered>
              {this.renderRandomPledges()}
            </Card.Group>
          </div>
        </div>
      </main>
    )
  }
}

module.exports = Home;
