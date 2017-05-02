import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Table } from 'react-bootstrap';

import { exec } from 'child_process';

import { initialize } from './scripts';


class Containers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      containers: []
    };
    this.allContainers = this.allContainers.bind(this);
  }

  allContainers() {
    var c = [],
        self = this;

    var docker = initialize();
    docker.listContainers({all: this.props.listAll}, function(err, containers) {
      containers.forEach(function(containerInfo) {
        var timeago = require('time-ago')();
        var newDate = timeago.ago(new Date(containerInfo.Created * 1000));
        console.log(containerInfo);
        c.push({
          id: containerInfo.Id.substring(0,11),
          image: containerInfo.Image,
          command: containerInfo.Command,
          created: newDate,
          status: containerInfo.Status
        });
      });

      self.setState({containers: c});
    });
  }

  componentDidMount() {
    var intervalId = setInterval(this.allContainers, 2000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    return (
      <div className="table-responsive">
        <Table responsive>
          <thead>
            <tr id="headerRowAll">
              <th>
                CONTAINER ID
              </th>
              <th>
                IMAGE
              </th>
              <th>
                COMMAND
              </th>
              <th>
                CREATED
              </th>
              <th>
                STATUS
              </th>
              {this.props.listAll ? '' : <th>PORTS</th>}
            </tr>
          </thead>
          <tbody>
            {
              this.state.containers.map((container, i) => (
                <tr>
                  <td>{container.id}</td>
                  <td>{container.image}</td>
                  <td>{container.command}</td>
                  <td>{container.created}</td>
                  <td>{container.status}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Containers;