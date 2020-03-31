import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList';
import BookingChart from '../components/Bookings/BookingChart';
import BookingsControls from '../components/Bookings/BookingsControls';



class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: [],
        outType: 'list'
    };


    componentDidMount () {
        this.fetchBookings()
    }

    componentWillUnmount() {
        this.isActive = false
    }

    static contextType = AuthContext;

    fetchBookings() {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
            query {
                bookings {
                    _id
                    createdAt
                      event {
                        title
                        _id
                        date
                        price
                      }
                    user {
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
            const bookings = res.data.bookings;
            this.setState({bookings:bookings, isLoading: false});
        })
        .catch(e => {
            this.setState({isLoading: false})
        })
    }

    deleteBookingHandler = (bookId) => {
        const requestBody = {
            query: `
            mutation CancelBooking($id: ID!) {
                cancelBooking(bookingId: $id) {                    
                        title
                        _id                                  
                }
            }
         
            `,
            variables: {
                id: bookId
            }
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
            this.setState(prevSt => {
                const upd = prevSt.bookings.filter( booking => {
                    return booking._id !==  bookId;
                });
                return {isLoading: false, bookings:upd}
            });
        })
        .catch(e => {
            this.setState({isLoading: false})
        })
    };

    changeOutputHendler = (outPutType) => {
        if(outPutType === 'list') {
            this.setState({outType: 'list'});
        } else {
            this.setState({outType: 'chart'})
        }
    };

    render () {
        let content =  <div className='spinner'><div className="lds-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div></div>;
        if (!this.state.isLoading) {
            content =
                <React.Fragment>
                <BookingsControls
                    activeOutput={this.state.outType}
                    onChange={this.changeOutputHendler}
                    />
                    <div>
                        {this.state.outType === 'list'
                            ? <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>
                            : <BookingChart bookings={this.state.bookings}/>}
                    </div>
                </React.Fragment>
        }
        return (
            content
        );
    }
}

export default BookingsPage;