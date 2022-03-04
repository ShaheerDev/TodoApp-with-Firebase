import React, { Component } from 'react';
import '../config/firebase.js';
import firebase from 'firebase';
import '../App.css'

class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      usertodo: "",
      todoNum: '',
    };
  }

  componentDidMount = () => {
    var userName = localStorage.getItem('user');
    if (userName == undefined || userName == '' || userName == ' ') {
      window.location.href = '/login';
    } else {
      document.getElementById('spinnera').style.display = 'block';
      document.getElementById('userheading').innerHTML = `${userName}`;
      firebase.database().ref('todos/' + userName.replace(/[^a-zA-Z0-9]/g, '')).on('child_added', (childSnapshot) => {
        var list = this.state.list;
        list.push({ id: this.state.list.length + 1, todo: childSnapshot.val().todo })
        this.setState({ list: list, usertodo: '', todoNum: '(' +this.state.list.length + ' Todos written)'})
        document.getElementById('spinnera').style.display = 'none';
        document.getElementById('usertodobox').disabled = false;
        document.getElementById('notificationc').style.display = 'block';
        setTimeout(()=>{
          document.getElementById('notificationc').style.display = 'none';
      }, 2000)
      });
      setTimeout(() => {
         document.getElementById('spinnera').style.display = 'none'; 
         document.getElementById('usertodobox').disabled = false;
    }, 2500)
    }
  }

  onAddItem = () => {
    var userName = localStorage.getItem('user');
    if (this.state.usertodo == '' || this.state.usertodo == ' ' || this.state.usertodo == null || this.state.usertodo == undefined) {
      document.getElementById('bootstrapAlert').style.display = 'inline-block';
      document.getElementById('body').style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      document.getElementById('usertodobox').disabled = true;
    } else {
      const postKey = firebase.database().ref('todos').push().key;
      firebase.database().ref('todos/' + userName.replace(/[^a-zA-Z0-9]/g, '') + '/' + postKey).set({
        username: userName,
        todo: this.state.usertodo,
        key: postKey,
      })
    }
  }

  handleKey(e) {
    if (e.key === 'Enter') {
      this.onAddItem();
    }
  }

  onRemoveItem = (id, todo) => {
    var userName = localStorage.getItem('user');
    this.setState(state => {
      const list = state.list.filter(item => item.id !== id);
      return { list };
    });
    firebase.database().ref('todos/' + userName.replace(/[^a-zA-Z0-9]/g, '')).on('child_added', (childSnapshot) => {
      if (childSnapshot.val().todo == todo) {
        var key = childSnapshot.val().key;
        firebase.database().ref('todos/' + userName.replace(/[^a-zA-Z0-9]/g, '') + '/' + key).remove();
        this.setState({todoNum: this.state.list.length + ' Todos written'})
        document.getElementById('notification').style.display = 'block';
        setTimeout(()=>{
          document.getElementById('notification').style.display = 'none';
      }, 2000)
      }
    });
  };

  onEditItem = (id, target, todo) => {
    var list = this.state.list;
    var userName = localStorage.getItem('user');
    const foundId = this.state.list.find(item => item.id === id)
    if (foundId) {
      list = list.filter(item => item.id !== id);
      list.push({ id: id, todo: target });
      list = list.reverse();
      this.setState({ list: list, });
      firebase.database().ref('todos/' + userName.replace(/[^a-zA-Z0-9]/g, '')).on('child_added', (childSnapshot) => {
        if (childSnapshot.val().todo == todo) {
          var key = childSnapshot.val().key;
          firebase.database().ref('todos/' + userName.replace(/[^a-zA-Z0-9]/g, '') + '/' + key).set({
            username: userName,
            todo: target,
            key: key
          })
          document.getElementById('notificationb').style.display = 'block';
          setTimeout(()=>{document.getElementById('notificationb').style.display = 'none';}, 2000)
        }
      });
    }
  }

  signout = () => {
    localStorage.setItem('user', '');
    window.location.href = '/login';
  }

  render() {
    return (
      <div className='text-center' id='body' style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 70, }}>
          <h1 className='display-6' style={{ position: 'absolute', left: 20, top: 5, fontWeight: 'bold' }}>Todo App</h1>
          <h4 id='userheading' className='display-6' style={{ position: 'absolute', right: 20, top: 5, marginRight: 100 }}>Invalid User</h4>
          <a className='btn btn-outline-danger' onClick={() => this.signout()} style={{ position: 'absolute', right: 20, top: 5, }}>Signout</a>
        </div>
        <div style={{ position: 'relative', top: 10, }}>
          <input type='text' placeholder=" Enter Todo..." value={this.state.usertodo} className='textbox' id='usertodobox' style={{ height: 35 }} onKeyDown={(e) => this.handleKey(e)} onChange={(e) => this.setState({ usertodo: e.target.value })} disabled={true}></input>
          <button className='btn btn-dark mx-1' onClick={this.onAddItem}>Add Todo</button>
          <div style={{ position: 'relative', top: 20, left: 10, }}>
            <div>
              <h1 style={{ fontWeight: '400' }}>Your Todos:</h1>
              <h5 style={{ fontWeight: '400' }}>{this.state.todoNum}</h5>
              <div id='spinnera' style={{ display: 'none' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <h5>Searching Data...</h5>
              </div>
              {this.state.list.map((item) => (
                <div key={item.id}>
                  <div key={'div' + item.id}>
                    <input type='text' key={'input' + item.id} value={item.todo} id='usertodobox' className='textbox' style={{ height: 35, }} onChange={(e) => this.onEditItem(item.id, e.target.value, item.todo)}></input>
                    <button className='btn btn-danger mx-1' key={'btn' + item.id} onClick={() => this.onRemoveItem(item.id, item.todo)}>Delete Todo</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id='bootstrapAlert' style={{ display: 'none', position: 'absolute', top: '40%', left: '33%' }}>
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading" style={{ color: 'red' }}>Warning</h4>
            <p>Textbox cannot be empty. Please type something to add a todo.</p>
            <hr></hr>
            <button className='btn btn-danger mx-1' onClick={() => { document.getElementById('bootstrapAlert').style.display = 'none'; document.getElementById('body').style.backgroundColor = '';document.getElementById('usertodobox').disabled = false; }}>Close Alert</button>
          </div>
        </div>
        <div id="notification" style={{position: 'absolute', bottom: '10%',width: '20%',borderRadius: '6px',fontWeight: 'bold',display: 'none', backgroundColor: 'black', color: 'white'}}>Deleted Todo <br /> from database</div>
        <div id="notificationb" style={{position: 'absolute', bottom: '10%',width: '20%',borderRadius: '6px',fontWeight: 'bold',display: 'none', backgroundColor: 'black', color: 'white'}}>Edited Todo <br /> in database</div>
        <div id="notificationc" style={{position: 'absolute', bottom: '10%',width: '20%',borderRadius: '6px',fontWeight: 'bold',display: 'none', backgroundColor: 'black', color: 'white'}}>Loaded Todos <br /> from database</div>
      </div>
    );
  }
}

export default Todo;
