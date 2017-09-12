import React, { Component } from 'react';
import './App.css';

import Header from './Header/Header';
import List from './List/List';
import Workspace from './Workspace/Workspace';
import { getCustomerList } from '../Customers';
import { postCustomer } from '../Customers'
import { getCustomer } from '../Customers'
import { updateCustomer } from '../Customers'
import { deleteCustomer } from '../Customers'

class App extends Component {
  constructor() {
    super()
    this.state = {
      customerList: [],
      initialLoad: true,
      creating: false,
      currentCustomer: null
    }

    this.startNewCustomer = this.startNewCustomer.bind( this );
    this.createCustomer = this.createCustomer.bind( this );
    this.selectCustomer = this.selectCustomer.bind( this );
    this.saveEdit = this.saveEdit.bind( this );

  }

  componentDidMount() {
    getCustomerList().then(list => { 
      this.setState({ customerList: list })
    })
  }

  startNewCustomer() {
    this.setState({
      creating: true,
      initialLoad: false,
      currentCustomer: null
    })
  }

  createCustomer(customer) {
    postCustomer(customer).then(response => {
      getCustomerList().then(list => {
        this.setState({
          initialLoad:true,
          creating: false,
          customerList: list
        })
      })
    })
  }

  selectCustomer(id) {
    getCustomer(id).then(response => {
      this.setState({
        currentCustomer: response,
        initialLoad: false
      })
    })
  }

  saveEdit(id, obj) {
    updateCustomer(id, obj).then(updatedCustomer => {
      getCustomerList().then(list=> {
        this.setState({
          customerList: list,
          currentCustomer: updatedCustomer
        })
      })
    })
  }

  removeCustomer(id) {
    deleteCustomer(id).then(deletedCustomer => {
      getCustomerList().then(list => {
        this.setState({
          customerList: list,
          currentCustomer: null,
          initialLoad: true
        })
      })
    })
  }

  render() {
    return (
      <div>
        <Header />
        <div className="App__container">
          {
            this.state.customerList ?
            <List
              customerList={this.state.customerList || []}
              startNewCustomer={this.startNewCustomer}
              selectCustomer={this.selectCustomer}
              />
            : null
          }
          <Workspace initialLoad={this.state.initialLoad}
                    createCustomer={this.createCustomer}
                    currentCustomer={this.state.currentCustomer}
                    creating={this.state.creating}
                    saveEdit={this.saveEdit}
                    removeCustomer={this.removeCustomer}
                  />
        </div>
      </div>
    )
  }
}

export default App;
