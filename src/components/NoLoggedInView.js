import React from 'react';
import { Image, Container } from 'react-bootstrap';
import "./noLogged.css"

import notLoggedInImage from '../images/image.jpg'

function NoLoggedInView(props) {
    return (
        <>
            <Container>

                <div className='body'>
                <h1>Welcome to the Company Organizer</h1>
                <p>You're not logged in. Please <a href="/login">login</a> first as this access is limited.</p>
                </div>

                <div className='image'>
                <Image  src={`${notLoggedInImage}`} />
                </div>
                    
            </Container>

        </>
    );
}

export default NoLoggedInView;