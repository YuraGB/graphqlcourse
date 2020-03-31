import React, { Component } from 'react';
import './Events.css';
import Backdrop from '../components/Backdrop/Backdrop';
import  Modal from '../components/Modal/Modal';
import AuthContext from '../context/auth-context';
import EventList from "../components/events/eventList/Event-list";

class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,

    };
    isActive = true;

    componentDidMount () {
        this.fetchEvents();
    }

    showDetailHandler = (id) => {
        this.setState(prev => {
                const selectedEv = prev.events.find( e =>  e._id === id);
                return {selectedEv: selectedEv};
        })

    };
    componentWillUnmount() {
        this.isActive = false;
    }

    bookEventHandler = () => {
        if(!this.context.token) {
            this.setState({selectedEv: null});
            return;
        }

        const requestBody = {
            query:
                `mutation{
                    bookEvent(eventId: "${this.state.selectedEv._id}") {                   
                        _id
                        createdAt
                        updatedAt                    
                        
                    }
                }
             
            `
        };

        fetch('http://localhost:4000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).then((res) => {
            if( res.status !== 200 && res.status !== 201) {
                throw  new Error('Failed');
            }

            return res.json();
        })
        .then((res) => {
            this.setState({selectedEv: null});
        })
        .catch(e => {
            this.setState({isLoading: false})
        })
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleRef = React.createRef();
        this.priceRef = React.createRef();
        this.dateRef = React.createRef();
        this.descriptionRef = React.createRef();
    }

    createEventHandler = () => {
      this.setState({creating: true})
    };

    modalConfirmHandler = () => {
        this.setState({creating: true});
        const title = this.titleRef.current.value;
        const price = +this.priceRef.current.value;
        const date = this.dateRef.current.value;
        const descr = this.descriptionRef.current.value;

        if(
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            descr.trim().length === 0
        ) {
            return;
        }
        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {
                        title: "${title}",
                        description: "${descr}",
                        price: ${+price},
                        date: "${date}"
                    }) {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
             
            `
        };

        const token = this.context.token;

        fetch('http://localhost:4000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            if( res.status !== 200 && res.status !== 201) {
                throw  new Error('Failed');
            }

            return res.json();
        })
        .then((res) => {
          this.setState(prevState => {
              const upd = [...prevState.events];
              console.log(res)
              upd.push({
                  _id: res.data.createEvent._id,
                  title: res.data.createEvent.title,
                  description: res.data.createEvent.description,
                  date: res.data.createEvent.date,
                  price: res.data.createEvent.price,
                  creator:{
                  _id: this.context.userId
              }
              })
              return {events: upd}
          })
        })
        .catch(console.log)

    };

    modalCancelHandler = () => {
        this.setState({creating: false, selectedEv: null});
    };

    fetchEvents = () => {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                query {
                    events {
                      _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }                       
                    }
                }
             
            `
        };

        fetch('http://localhost:4000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": 'application/json'
            }
        }).then((res) => {
            if( res.status !== 200 && res.status !== 201) {
                throw  new Error('Failed');
            }

            return res.json();
        })
        .then((res) => {
            if(this.isActive){
                const events = res.data.events;
                this.setState({events:events, isLoading: false});
            }
        })
        .catch(e => {
            if(this.isActive) {
                this.setState({isLoading: false})
            }
        })
    };

    render () {

        return (
        <React.Fragment>
            {(this.state.creating || this.state.selectedEv) && <Backdrop/>}
            {this.state.creating &&
                <Modal
                    title='Add Events'
                    canCancel
                    canConfirm
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.modalConfirmHandler}
                    confirmText='Confirm'
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" rows="4" ref={this.descriptionRef}/>
                        </div>
                    </form>
                </Modal>
            }
            {this.state.selectedEv &&
            (<Modal
                title={this.state.selectedEv.title}
                canCancel
                canConfirm
                onCancel={this.modalCancelHandler}
                onConfirm={this.bookEventHandler}
                confirmText={this.context.token ? "Book" : "Confirm"}
            >
                <h1>{this.state.selectedEv.title}</h1>
                <h2>${this.state.selectedEv.price} - {new Date(this.state.selectedEv.date).toLocaleDateString()}</h2>
                <p>{this.state.selectedEv.description}</p>
            </Modal>)}
            {this.context.token &&
                <div className='events-control'>
                    <p>Share your own events</p>
                    <button onClick={this.createEventHandler}>Create Event</button>
                </div>
            }
            {this.state.isLoading
                ? (
                    <div className='spinner'><div className="lds-grid">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div></div>)
                :<EventList events={this.state.events} authUserId={this.context.userId} onViewDetails={this.showDetailHandler}/>
            }

        </React.Fragment>
        );
    }
}

export default EventsPage;